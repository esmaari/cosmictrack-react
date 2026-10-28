-- Lock billing / AI quota columns on public.profiles for authenticated users.
-- Keeps profiles_update_own so future user fields (display name, avatar, …) can still
-- be updated via the anon/authenticated client. Service-role updates (Edge Function
-- AI quota) keep working because auth.uid() is null in that context.
--
-- Safe to re-run.

create or replace function public.profiles_preserve_billing_columns()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  -- Authenticated JWT present → user must not change plan / usage counters.
  if auth.uid() is not null then
    if new.plan is distinct from old.plan
      or new.ai_used_count is distinct from old.ai_used_count
      or new.ai_period_start is distinct from old.ai_period_start then
      raise exception 'Cannot modify plan or AI usage fields'
        using errcode = '42501';
    end if;
  end if;

  return new;
end;
$$;

comment on function public.profiles_preserve_billing_columns() is
  'Blocks authenticated users from updating plan, ai_used_count, ai_period_start. Service-role (auth.uid() null) may still update those columns for AI quota.';

drop trigger if exists profiles_preserve_billing_columns on public.profiles;

create trigger profiles_preserve_billing_columns
  before update on public.profiles
  for each row
  execute function public.profiles_preserve_billing_columns();
