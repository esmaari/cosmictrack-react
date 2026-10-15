-- SADECE OKUMA — tek sonuç tablosu döner (Supabase bazen sadece son sorguyu gösterir).
-- Run → tüm satırları kopyalayıp bana yapıştır.

select *
from (
  -- profiles kolonları
  select
    1 as sort_key,
    'profiles_column' as check_name,
    c.column_name || ' (' || c.data_type || ')' as detail
  from information_schema.columns c
  where c.table_schema = 'public' and c.table_name = 'profiles'

  union all

  -- tablolar var mı
  select
    2,
    'table_exists',
    t.table_name
  from information_schema.tables t
  where t.table_schema = 'public'
    and t.table_name in (
      'profiles', 'journeys', 'steps', 'categories', 'favorites', 'journey_categories'
    )

  union all

  -- RLS açık mı
  select
    3,
    'rls_enabled',
    c.relname || ' = ' || c.relrowsecurity::text
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public'
    and c.relname in (
      'profiles', 'journeys', 'steps', 'categories', 'favorites', 'journey_categories'
    )

  union all

  -- policy isimleri
  select
    4,
    'policy',
    p.tablename || ' / ' || p.policyname || ' / ' || p.cmd
  from pg_policies p
  where p.schemaname = 'public'
    and p.tablename in (
      'profiles', 'journeys', 'steps', 'categories', 'favorites', 'journey_categories'
    )

  union all

  -- auth.users trigger
  select
    5,
    'auth_trigger',
    tg.tgname || ' on ' || tg.tgrelid::regclass::text
  from pg_trigger tg
  where not tg.tgisinternal
    and tg.tgrelid = 'auth.users'::regclass

  union all

  -- handle_new_user fonksiyonu
  select
    6,
    'function',
    pr.proname
  from pg_proc pr
  join pg_namespace n on n.oid = pr.pronamespace
  where n.nspname = 'public' and pr.proname = 'handle_new_user'

  union all

  -- sayılar
  select
    7,
    'counts',
    'auth_users=' || (select count(*)::text from auth.users)
      || ', profiles=' || (select count(*)::text from public.profiles)
) q
order by sort_key, check_name, detail;
