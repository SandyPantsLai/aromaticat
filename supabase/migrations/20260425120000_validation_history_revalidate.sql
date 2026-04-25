-- Revalidate API: rate-limit history + RPC used by Basic keys (app/api/revalidate/route.utils.ts).
-- Fixes PostgREST PGRST202 when get_last_revalidation_for_tags is missing.

create table if not exists public.validation_history (
  id bigint generated always as identity primary key,
  tag text not null,
  created_at timestamptz not null default now()
);

create index if not exists validation_history_tag_created_at_idx
  on public.validation_history (tag, created_at desc);

alter table public.validation_history enable row level security;

create policy "Service role full access to validation_history"
  on public.validation_history
  for all
  to service_role
  using (true)
  with check (true);

-- Latest row per tag among the requested tags (empty array → no rows).
create or replace function public.get_last_revalidation_for_tags(tags text[])
returns table (tag text, created_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select distinct on (vh.tag)
    vh.tag,
    vh.created_at
  from public.validation_history vh
  where vh.tag = any(tags)
  order by vh.tag, vh.created_at desc;
$$;

grant execute on function public.get_last_revalidation_for_tags (text[]) to service_role;