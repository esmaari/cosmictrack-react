export const FREE_DAILY_LIMIT = 1
export const PREMIUM_MONTHLY_LIMIT = 100

export type UserPlan = "free" | "premium"

export type ProfileAiFields = {
  plan: string
  ai_used_count: number
  ai_period_start: string
}

export type AiCreditsState = {
  plan: UserPlan
  planLabel: string
  limit: number
  used: number
  remaining: number
  periodLabel: string
}

export function isPremiumPlan(plan: string): boolean {
  return plan === "premium"
}

export function getLimitForPlan(plan: string): number {
  return isPremiumPlan(plan) ? PREMIUM_MONTHLY_LIMIT : FREE_DAILY_LIMIT
}

function utcDayKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function utcMonthKey(date: Date): string {
  return date.toISOString().slice(0, 7)
}

function periodExpired(plan: string, periodStart: string, now: Date): boolean {
  const start = new Date(periodStart)
  if (Number.isNaN(start.getTime())) return true

  if (isPremiumPlan(plan)) {
    return utcMonthKey(start) !== utcMonthKey(now)
  }
  return utcDayKey(start) !== utcDayKey(now)
}

export function getAiCreditsFromProfile(profile: ProfileAiFields): AiCreditsState {
  const now = new Date()
  const plan = isPremiumPlan(profile.plan) ? "premium" : "free"
  const limit = getLimitForPlan(profile.plan)
  const resetPeriod = periodExpired(profile.plan, profile.ai_period_start, now)
  const used = resetPeriod ? 0 : profile.ai_used_count
  const remaining = Math.max(0, limit - used)

  return {
    plan,
    planLabel: plan === "premium" ? "Premium plan" : "Free plan",
    limit,
    used,
    remaining,
    periodLabel: plan === "premium" ? "this month" : "today",
  }
}

export function formatAiRemaining(credits: AiCreditsState): string {
  if (credits.remaining === 0) {
    return planExhaustedMessage(credits)
  }
  if (credits.plan === "premium") {
    return `${credits.remaining}/${credits.limit} AI left ${credits.periodLabel}`
  }
  return `${credits.remaining} AI left ${credits.periodLabel}`
}

export function planExhaustedMessage(credits: AiCreditsState): string {
  if (credits.plan === "premium") {
    return `Monthly AI limit reached (${credits.limit}/${credits.periodLabel})`
  }
  return `Daily AI limit reached (resets ${credits.periodLabel})`
}
