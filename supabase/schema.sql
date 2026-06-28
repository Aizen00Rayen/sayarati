-- ============================================================
--  SAYARATI — Database schema (run this FIRST in Supabase SQL Editor)
--  Tables, Row Level Security, helper functions & triggers.
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- PROFILES ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  role        text not null default 'customer' check (role in ('customer','agency','admin')),
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- ---------- AGENCIES ----------
create table if not exists public.agencies (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid references public.profiles(id) on delete cascade,
  name           text not null,
  name_fr        text,
  description    text,
  description_fr text,
  city           text,
  phone          text,
  logo_url       text,
  status         text not null default 'pending' check (status in ('pending','approved','suspended')),
  created_at     timestamptz not null default now()
);

-- ---------- CARS ----------
create table if not exists public.cars (
  id            uuid primary key default gen_random_uuid(),
  agency_id     uuid not null references public.agencies(id) on delete cascade,
  brand         text not null,
  model         text not null,
  year          int  not null default 2022,
  category      text not null default 'economy'
                check (category in ('economy','compact','sedan','suv','luxury','van')),
  transmission  text not null default 'manual' check (transmission in ('manual','automatic')),
  fuel          text not null default 'gasoline'
                check (fuel in ('gasoline','diesel','electric','hybrid')),
  seats         int  not null default 5,
  price_per_day numeric(10,2) not null default 0,
  image_url     text,
  city          text,
  available     boolean not null default true,
  description   text,
  created_at    timestamptz not null default now()
);

-- ---------- BOOKINGS ----------
create table if not exists public.bookings (
  id          uuid primary key default gen_random_uuid(),
  car_id      uuid not null references public.cars(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  agency_id   uuid not null references public.agencies(id) on delete cascade,
  start_date  date not null,
  end_date    date not null,
  total_price numeric(10,2) not null default 0,
  status      text not null default 'pending'
              check (status in ('pending','confirmed','active','completed','cancelled')),
  created_at  timestamptz not null default now()
);

-- ---------- REVIEWS ----------
create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  agency_id   uuid not null references public.agencies(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  rating      int not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_cars_agency   on public.cars(agency_id);
create index if not exists idx_cars_city     on public.cars(city);
create index if not exists idx_bookings_cust on public.bookings(customer_id);
create index if not exists idx_bookings_ag   on public.bookings(agency_id);
create index if not exists idx_reviews_ag    on public.reviews(agency_id);

-- ============================================================
--  HELPER FUNCTIONS (security definer -> bypass RLS, no recursion)
-- ============================================================
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.owns_agency(aid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.agencies where id = aid and owner_id = auth.uid());
$$;

-- Auto-create a profile whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Recalculate an agency rating helper (used by the app via select avg).
create or replace function public.agency_rating(aid uuid)
returns numeric language sql stable as $$
  select coalesce(round(avg(rating)::numeric, 1), 0) from public.reviews where agency_id = aid;
$$;

-- ============================================================
--  ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.agencies enable row level security;
alter table public.cars     enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews  enable row level security;

-- profiles
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select using (true);
drop policy if exists profiles_insert on public.profiles;
create policy profiles_insert on public.profiles for insert with check (id = auth.uid());
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());
drop policy if exists profiles_delete on public.profiles;
create policy profiles_delete on public.profiles for delete using (public.is_admin());

-- agencies
drop policy if exists agencies_select on public.agencies;
create policy agencies_select on public.agencies for select
  using (status = 'approved' or owner_id = auth.uid() or public.is_admin());
drop policy if exists agencies_insert on public.agencies;
create policy agencies_insert on public.agencies for insert with check (owner_id = auth.uid());
drop policy if exists agencies_update on public.agencies;
create policy agencies_update on public.agencies for update
  using (owner_id = auth.uid() or public.is_admin())
  with check (owner_id = auth.uid() or public.is_admin());
drop policy if exists agencies_delete on public.agencies;
create policy agencies_delete on public.agencies for delete
  using (owner_id = auth.uid() or public.is_admin());

-- cars
drop policy if exists cars_select on public.cars;
create policy cars_select on public.cars for select using (true);
drop policy if exists cars_insert on public.cars;
create policy cars_insert on public.cars for insert
  with check (public.owns_agency(agency_id) or public.is_admin());
drop policy if exists cars_update on public.cars;
create policy cars_update on public.cars for update
  using (public.owns_agency(agency_id) or public.is_admin())
  with check (public.owns_agency(agency_id) or public.is_admin());
drop policy if exists cars_delete on public.cars;
create policy cars_delete on public.cars for delete
  using (public.owns_agency(agency_id) or public.is_admin());

-- bookings
drop policy if exists bookings_select on public.bookings;
create policy bookings_select on public.bookings for select
  using (customer_id = auth.uid() or public.owns_agency(agency_id) or public.is_admin());
drop policy if exists bookings_insert on public.bookings;
create policy bookings_insert on public.bookings for insert with check (customer_id = auth.uid());
drop policy if exists bookings_update on public.bookings;
create policy bookings_update on public.bookings for update
  using (customer_id = auth.uid() or public.owns_agency(agency_id) or public.is_admin())
  with check (customer_id = auth.uid() or public.owns_agency(agency_id) or public.is_admin());
drop policy if exists bookings_delete on public.bookings;
create policy bookings_delete on public.bookings for delete using (public.is_admin());

-- reviews
drop policy if exists reviews_select on public.reviews;
create policy reviews_select on public.reviews for select using (true);
drop policy if exists reviews_insert on public.reviews;
create policy reviews_insert on public.reviews for insert with check (customer_id = auth.uid());
drop policy if exists reviews_update on public.reviews;
create policy reviews_update on public.reviews for update
  using (customer_id = auth.uid() or public.is_admin());
drop policy if exists reviews_delete on public.reviews;
create policy reviews_delete on public.reviews for delete
  using (customer_id = auth.uid() or public.is_admin());

-- Allow the anon/auth roles to call helpers
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.owns_agency(uuid) to anon, authenticated;
grant execute on function public.agency_rating(uuid) to anon, authenticated;
