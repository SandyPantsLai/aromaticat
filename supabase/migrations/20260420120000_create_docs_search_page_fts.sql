-- Docs-style full-text search tables + RPC for site search (FTS only; embeddings column nullable).
-- Matches shapes used by scripts/search/index-pages.ts and packages/common/hooks/useDocsSearch.ts.

create table if not exists public.page (
  id bigint generated always as identity primary key,
  path text not null,
  content text,
  checksum text,
  fts_tokens tsvector,
  last_refresh timestamptz,
  meta jsonb,
  source text,
  title_tokens tsvector,
  type text,
  version text,
  constraint page_path_key unique (path)
);

create index if not exists page_content_fts_idx on public.page using gin (to_tsvector('english', coalesce(content, '')));
create index if not exists page_meta_fts_idx on public.page using gin (to_tsvector('english', coalesce(meta::text, '')));

create table if not exists public.page_section (
  id bigint generated always as identity primary key,
  page_id bigint not null references public.page (id) on delete cascade,
  content text,
  embedding text,
  heading text,
  rag_ignore boolean default false,
  slug text,
  token_count integer
);

create index if not exists page_section_page_id_idx on public.page_section (page_id);

alter table public.page enable row level security;
alter table public.page_section enable row level security;

-- Search runs via RPC (SECURITY DEFINER); direct table access not required for anon.
create policy "Service role full access to page"
  on public.page
  for all
  to service_role
  using (true)
  with check (true);

create policy "Service role full access to page_section"
  on public.page_section
  for all
  to service_role
  using (true)
  with check (true);

-- Authenticated read optional (e.g. future admin UI); anon has no table policies.
create policy "Authenticated read page"
  on public.page
  for select
  to authenticated
  using (true);

create policy "Authenticated read page_section"
  on public.page_section
  for select
  to authenticated
  using (true);

create or replace function public.docs_search_fts (query text)
returns table (
  id bigint,
  path text,
  type text,
  title text,
  subtitle text,
  description text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.id,
    p.path,
    coalesce(p.type, 'markdown')::text,
    coalesce(p.meta->>'title', '')::text,
    coalesce(
      p.meta->>'subtitle',
      p.meta->>'family',
      ''
    )::text,
    coalesce(p.meta->>'description', '')::text
  from public.page p
  where
    query is not null
    and trim(query) <> ''
    and (
      to_tsvector('english', coalesce(p.content, ''))
        @@ websearch_to_tsquery('english', query)
      or to_tsvector('english', coalesce(p.meta::text, ''))
        @@ websearch_to_tsquery('english', query)
    )
  order by
    ts_rank_cd(
      to_tsvector('english', coalesce(p.content, '')),
      websearch_to_tsquery('english', query)
    ) desc
  limit 50;
$$;

create or replace function public.docs_search_fts_nimbus (query text)
returns table (
  id bigint,
  path text,
  type text,
  title text,
  subtitle text,
  description text
)
language sql
stable
security definer
set search_path = public
as $$
  select * from public.docs_search_fts(query);
$$;

grant execute on function public.docs_search_fts (text) to anon, authenticated, service_role;
grant execute on function public.docs_search_fts_nimbus (text) to anon, authenticated, service_role;
