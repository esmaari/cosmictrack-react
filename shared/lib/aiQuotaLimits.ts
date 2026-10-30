/**
 * Canonical AI plan limits for the Next app (UI remaining/exhausted copy).
 *
 * Enforcement lives in SQL `public.reserve_ai_credit` — keep those numbers identical:
 * free daily = FREE_DAILY_LIMIT, premium monthly = PREMIUM_MONTHLY_LIMIT.
 */
export const FREE_DAILY_LIMIT = 1
export const PREMIUM_MONTHLY_LIMIT = 100
