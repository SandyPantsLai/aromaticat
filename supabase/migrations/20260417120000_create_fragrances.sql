-- Personal fragrance catalogue (imported from CSV). Public read for docs UI; writes via service role only.

create table if not exists public.fragrances (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  brand_line text,
  name text not null,
  my_rating numeric,
  perfumer text,
  bottle_type text,
  retail_price_per_ml numeric,
  paid_per_ml numeric,
  remaining_ml numeric,
  size_ml numeric,
  received_ml numeric,
  bottle_qty integer,
  paid_total numeric,
  family text,
  top_notes text,
  mid_notes text,
  base_notes text,
  presentation text,
  source text,
  season text,
  setting text,
  gender text,
  age text,
  projection numeric,
  sillage_min numeric,
  longevity_hrs numeric,
  review text,
  comments text,
  parfumo_url text,
  fragantica_url text,
  image_url text,
  fragram_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint fragrances_slug_key unique (slug)
);

create index if not exists fragrances_brand_line_name_idx on public.fragrances (brand_line, name);

comment on table public.fragrances is 'Fragrance inventory rows; slug is stable key for MDX (github-slugger style).';

alter table public.fragrances enable row level security;

create policy "fragrances_select_anon_authenticated"
  on public.fragrances
  for select
  to anon, authenticated
  using (true);
