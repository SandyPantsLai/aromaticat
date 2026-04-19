-- PostgREST requests using the service-role key run as `service_role`. That role must
-- have USAGE on `notion` and SELECT on the foreign table (same as anon for public reads).
-- Without this, server-side `schema('notion')` calls fail with:
--   permission denied for schema notion

do $$
begin
  if exists (select 1 from information_schema.schemata where schema_name = 'notion') then
    execute 'grant usage on schema notion to service_role';
    if exists (
      select 1
      from information_schema.tables
      where table_schema = 'notion'
        and table_name = 'fragrances'
    ) then
      execute 'grant select on notion.fragrances to service_role';
    end if;
  end if;
end $$;
