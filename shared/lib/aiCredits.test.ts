import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  FREE_DAILY_LIMIT,
  PREMIUM_MONTHLY_LIMIT,
  formatAiRemaining,
  getAiCreditsFromProfile,
  getLimitForPlan,
  isPremiumPlan,
  planExhaustedMessage,
  type AiCreditsState,
} from "./aiCredits"

describe("isPremiumPlan", () => {
  it("returns true only for premium", () => {
    expect(isPremiumPlan("premium")).toBe(true)
    expect(isPremiumPlan("free")).toBe(false)
    expect(isPremiumPlan("Premium")).toBe(false)
  })
})

describe("getLimitForPlan", () => {
  it("uses free daily and premium monthly limits", () => {
    expect(getLimitForPlan("free")).toBe(FREE_DAILY_LIMIT)
    expect(getLimitForPlan("premium")).toBe(PREMIUM_MONTHLY_LIMIT)
  })
})

describe("getAiCreditsFromProfile", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-06-15T12:00:00.000Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("counts free plan usage within the same UTC day", () => {
    const credits = getAiCreditsFromProfile({
      plan: "free",
      ai_used_count: 1,
      ai_period_start: "2026-06-15T01:00:00.000Z",
    })

    expect(credits.plan).toBe("free")
    expect(credits.limit).toBe(FREE_DAILY_LIMIT)
    expect(credits.used).toBe(1)
    expect(credits.remaining).toBe(0)
    expect(credits.periodLabel).toBe("today")
  })

  it("resets free plan usage when the UTC day changed", () => {
    const credits = getAiCreditsFromProfile({
      plan: "free",
      ai_used_count: 1,
      ai_period_start: "2026-06-14T23:00:00.000Z",
    })

    expect(credits.used).toBe(0)
    expect(credits.remaining).toBe(FREE_DAILY_LIMIT)
  })

  it("counts premium usage within the same UTC month", () => {
    const credits = getAiCreditsFromProfile({
      plan: "premium",
      ai_used_count: 12,
      ai_period_start: "2026-06-01T00:00:00.000Z",
    })

    expect(credits.plan).toBe("premium")
    expect(credits.limit).toBe(PREMIUM_MONTHLY_LIMIT)
    expect(credits.used).toBe(12)
    expect(credits.remaining).toBe(PREMIUM_MONTHLY_LIMIT - 12)
    expect(credits.periodLabel).toBe("this month")
  })

  it("resets premium usage when the UTC month changed", () => {
    const credits = getAiCreditsFromProfile({
      plan: "premium",
      ai_used_count: 40,
      ai_period_start: "2026-05-20T00:00:00.000Z",
    })

    expect(credits.used).toBe(0)
    expect(credits.remaining).toBe(PREMIUM_MONTHLY_LIMIT)
  })

  it("treats invalid period start as expired", () => {
    const credits = getAiCreditsFromProfile({
      plan: "free",
      ai_used_count: 1,
      ai_period_start: "not-a-date",
    })

    expect(credits.used).toBe(0)
    expect(credits.remaining).toBe(FREE_DAILY_LIMIT)
  })
})

describe("formatAiRemaining / planExhaustedMessage", () => {
  const freeExhausted: AiCreditsState = {
    plan: "free",
    planLabel: "Free plan",
    limit: FREE_DAILY_LIMIT,
    used: 1,
    remaining: 0,
    periodLabel: "today",
  }

  const premiumLeft: AiCreditsState = {
    plan: "premium",
    planLabel: "Premium plan",
    limit: PREMIUM_MONTHLY_LIMIT,
    used: 10,
    remaining: 90,
    periodLabel: "this month",
  }

  it("formats remaining and exhausted messages", () => {
    expect(formatAiRemaining(premiumLeft)).toBe("90/100 AI left this month")
    expect(formatAiRemaining(freeExhausted)).toBe(planExhaustedMessage(freeExhausted))
    expect(planExhaustedMessage(freeExhausted)).toContain("Daily AI limit reached")
    expect(
      planExhaustedMessage({
        ...premiumLeft,
        remaining: 0,
        used: PREMIUM_MONTHLY_LIMIT,
      }),
    ).toContain("Monthly AI limit reached")
  })

  it("accepts localized copy templates", () => {
    expect(
      formatAiRemaining(premiumLeft, {
        periodMonth: "bu ay",
        remainingPremium: "{period} {remaining}/{limit} AI kaldı",
      }),
    ).toBe("bu ay 90/100 AI kaldı")
  })
})
