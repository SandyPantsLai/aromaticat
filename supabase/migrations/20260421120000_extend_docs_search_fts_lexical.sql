-- Extend docs_search_fts: substring match on title/path (prefix-style ranking) alongside FTS.
-- Fixes partial typing (e.g. "van" matching "Vanilla") where websearch_to_tsquery tokenizes whole words only.

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
    and trim(lower(query)) <> ''
    and (
      to_tsvector('english', coalesce(p.content, ''))
        @@ websearch_to_tsquery('english', query)
      or to_tsvector('english', coalesce(p.meta::text, ''))
        @@ websearch_to_tsquery('english', query)
      or strpos(lower(coalesce(p.meta->>'title', '')), trim(lower(query))) > 0
      or strpos(lower(p.path), trim(lower(query))) > 0
      or strpos(lower(coalesce(p.content, '')), trim(lower(query))) > 0
    )
  order by
    case
      when strpos(lower(coalesce(p.meta->>'title', '')), trim(lower(query))) = 1 then 3
      when strpos(lower(coalesce(p.meta->>'title', '')), trim(lower(query))) > 0 then 2
      when strpos(lower(p.path), trim(lower(query))) > 0 then 1
      else 0
    end desc,
    coalesce(
      ts_rank_cd(
        to_tsvector('english', coalesce(p.content, '')),
        websearch_to_tsquery('english', query)
      ),
      0
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
