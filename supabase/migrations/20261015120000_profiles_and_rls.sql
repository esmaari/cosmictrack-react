-- CosmicTrack: profiles bootstrap + RLS
-- Safe to re-run (IF NOT EXISTS / DROP POLICY IF EXISTS).
-- Assumes journeys, steps, categories, favorites, journey_categories already exist.
--
-- SKIP if CHECK_EXISTING.sql already shows RLS + on_auth_user_created + handle_new_user
-- (production project already had these as of 2026-10-15).

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  plan text not null default 'free',
  ai_used_count integer not null default 0,
  ai_period_start timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- New auth user → profile row
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, plan, ai_used_count, ai_period_start)
  values (new.id, 'free', 0, now())
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Existing users missing a profile
insert into public.profiles (id, plan, ai_used_count, ai_period_start)
select u.id, 'free', 0, now()
from auth.users u
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- journeys
-- ---------------------------------------------------------------------------
alter table public.journeys enable row level security;

drop policy if exists "journeys_own_all" on public.journeys;
create policy "journeys_own_all"
  on public.journeys for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- steps
-- ---------------------------------------------------------------------------
alter table public.steps enable row level security;

drop policy if exists "steps_own_all" on public.steps;
create policy "steps_own_all"
  on public.steps for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- categories
-- ---------------------------------------------------------------------------
alter table public.categories enable row level security;

drop policy if exists "categories_own_all" on public.categories;
create policy "categories_own_all"
  on public.categories for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- favorites
-- ---------------------------------------------------------------------------
alter table public.favorites enable row level security;

drop policy if exists "favorites_own_all" on public.favorites;
create policy "favorites_own_all"
  on public.favorites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- journey_categories
-- ---------------------------------------------------------------------------
alter table public.journey_categories enable row level security;

drop policy if exists "journey_categories_own_all" on public.journey_categories;
create policy "journey_categories_own_all"
  on public.journey_categories for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
