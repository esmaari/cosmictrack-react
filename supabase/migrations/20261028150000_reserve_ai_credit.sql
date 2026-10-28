-- Atomic AI credit reserve / release for Edge Function quotas.
-- Call only with service_role (granted below). Authenticated clients cannot invoke these.
--
-- Flow: reserve_ai_credit BEFORE OpenAI; release_ai_credit if OpenAI fails.
-- Safe to re-run.

create or replace function public.reserve_ai_credit(p_user_id uuid)
returns table (
  allowed boolean,
  plan text,
  limit_count integer,
  used integer,
  remaining integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.profiles%rowtype;
  v_now timestamptz := timezone('utc', now());
  v_limit integer;
  v_used integer;
  v_reset boolean;
begin
  select * into r
  from public.profiles
  where id = p_user_id
  for update;

  if not found then
    return query select false, null::text, 0, 0, 0;
    return;
  end if;

  v_limit := case when r.plan = 'premium' then 100 else 1 end;

  if r.plan = 'premium' then
    v_reset := to_char(r.ai_period_start at time zone 'utc', 'YYYY-MM')
      is distinct from to_char(v_now, 'YYYY-MM');
  else
    v_reset := to_char(r.ai_period_start at time zone 'utc', 'YYYY-MM-DD')
      is distinct from to_char(v_now, 'YYYY-MM-DD');
  end if;

  v_used := case when v_reset then 0 else r.ai_used_count end;

  if v_used >= v_limit then
    return query select false, r.plan, v_limit, v_used, 0;
    return;
  end if;

  update public.profiles
  set
    ai_used_count = v_used + 1,
    ai_period_start = case when v_reset then v_now else r.ai_period_start end
  where id = p_user_id;

  return query select true, r.plan, v_limit, v_used + 1, v_limit - (v_used + 1);
end;
$$;

comment on function public.reserve_ai_credit(uuid) is
  'Atomically reserves one AI credit if under plan limit. Service-role only.';

create or replace function public.release_ai_credit(p_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set ai_used_count = greatest(ai_used_count - 1, 0)
  where id = p_user_id;

  return found;
end;
$$;

comment on function public.release_ai_credit(uuid) is
  'Releases one reserved AI credit after upstream failure. Service-role only.';

revoke all on function public.reserve_ai_credit(uuid) from public;
revoke all on function public.release_ai_credit(uuid) from public;

grant execute on function public.reserve_ai_credit(uuid) to service_role;
grant execute on function public.release_ai_credit(uuid) to service_role;
