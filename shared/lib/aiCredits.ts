export { FREE_DAILY_LIMIT, PREMIUM_MONTHLY_LIMIT } from "@/shared/lib/aiQuotaLimits"
import { FREE_DAILY_LIMIT, PREMIUM_MONTHLY_LIMIT } from "@/shared/lib/aiQuotaLimits"

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

export type AiCreditsCopy = {
  periodToday: string
  periodMonth: string
  remainingPremium: string
  remainingFree: string
  exhaustedPremium: string
  exhaustedFree: string
}

const DEFAULT_COPY: AiCreditsCopy = {
  periodToday: "today",
  periodMonth: "this month",
  remainingPremium: "{remaining}/{limit} AI left {period}",
  remainingFree: "{remaining} AI left {period}",
  exhaustedPremium: "Monthly AI limit reached ({limit}/{period})",
  exhaustedFree: "Daily AI limit reached (resets {period})",
}

function fillTemplate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""))
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

export function formatAiRemaining(
  credits: AiCreditsState,
  copy: Partial<AiCreditsCopy> = {},
): string {
  if (credits.remaining === 0) {
    return planExhaustedMessage(credits, copy)
  }

  const labels = { ...DEFAULT_COPY, ...copy }
  const period = credits.plan === "premium" ? labels.periodMonth : labels.periodToday

  if (credits.plan === "premium") {
    return fillTemplate(labels.remainingPremium, {
      remaining: credits.remaining,
      limit: credits.limit,
      period,
    })
  }
  return fillTemplate(labels.remainingFree, {
    remaining: credits.remaining,
    period,
  })
}

export function planExhaustedMessage(
  credits: AiCreditsState,
  copy: Partial<AiCreditsCopy> = {},
): string {
  const labels = { ...DEFAULT_COPY, ...copy }
  const period = credits.plan === "premium" ? labels.periodMonth : labels.periodToday

  if (credits.plan === "premium") {
    return fillTemplate(labels.exhaustedPremium, {
      limit: credits.limit,
      period,
    })
  }
  return fillTemplate(labels.exhaustedFree, { period })
}
