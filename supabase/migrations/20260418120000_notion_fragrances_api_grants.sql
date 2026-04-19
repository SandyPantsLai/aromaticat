-- Read access for anon/authenticated when `notion.fragrances` exists.
-- Server reads with the service-role key also need `service_role` grants; see
-- 20260419120000_notion_grants_service_role.sql.
--
-- Hosted Supabase: also add `notion` under Project Settings → API → Exposed schemas
-- so the REST API can target this schema (supabase-js: `.schema('notion')`).
--
-- Notion FDW shape: id, url, created_time, last_edited_time, archived, attrs (json).
-- App reads catalog fields from attrs (e.g. name, brand, family, image, cost_per_ml, fragram, parfumo, fragrantica).

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'notion'
      and table_name = 'fragrances'
  ) then
    execute 'grant usage on schema notion to anon, authenticated, service_role';
    execute 'grant select on notion.fragrances to anon, authenticated, service_role';
  end if;
end $$;
