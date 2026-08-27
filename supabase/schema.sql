-- FlipTronics database schema
-- Run this in Supabase: Project -> SQL Editor -> New query -> paste -> Run

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('laptop', 'console', 'ram', 'ssd', 'other')),
  brand text,
  price numeric not null,
  currency text not null default 'PKR',
  price_firm boolean not null default false,
  condition text not null default 'Excellent',
  location text default 'Islamabad/Rawalpindi',
  status text not null default 'available' check (status in ('available', 'limited', 'sold')),
  specs jsonb not null default '[]'::jsonb,   -- array of short spec strings, e.g. ["Ryzen 9 5900HS","RTX 3070 8GB"]
  description text,
  photos text[] not null default '{}',        -- array of Supabase Storage URLs
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references listings(id) on delete set null,
  source text default 'whatsapp_click',
  created_at timestamptz not null default now()
);

-- Row Level Security: anyone can read listings, only logged-in admins can write
alter table listings enable row level security;

create policy "Public can view listings"
  on listings for select
  using (true);

create policy "Authenticated users can manage listings"
  on listings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

alter table leads enable row level security;

create policy "Anyone can log a lead"
  on leads for insert
  with check (true);

create policy "Authenticated users can view leads"
  on leads for select
  using (auth.role() = 'authenticated');

-- Keep updated_at fresh
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger listings_set_updated_at
before update on listings
for each row execute function set_updated_at();
