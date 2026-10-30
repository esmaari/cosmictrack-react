-- Document the single source of truth for AI plan limits.
-- Numbers in reserve_ai_credit (free=1 / premium=100) must match
-- shared/lib/aiQuotaLimits.ts (FREE_DAILY_LIMIT / PREMIUM_MONTHLY_LIMIT).
-- Safe to re-run.

comment on function public.reserve_ai_credit(uuid) is
  'Atomically reserves one AI credit if under plan limit (free=1/day, premium=100/month). Service-role only. KEEP IN SYNC with shared/lib/aiQuotaLimits.ts.';
