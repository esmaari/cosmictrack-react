import { describe, expect, it } from "vitest"
import {
  parseApiBody,
  postCategoryBodySchema,
  postJourneyBodySchema,
  postStepBodySchema,
} from "./apiSchemas"
import { FREE_DAILY_LIMIT, PREMIUM_MONTHLY_LIMIT } from "./aiQuotaLimits"

describe("aiQuotaLimits contract with SQL", () => {
  it("matches reserve_ai_credit free=1 / premium=100", () => {
    expect(FREE_DAILY_LIMIT).toBe(1)
    expect(PREMIUM_MONTHLY_LIMIT).toBe(100)
  })
})

describe("parseApiBody", () => {
  it("accepts a valid journey create body", () => {
    const result = parseApiBody(postJourneyBodySchema, {
      title: "Moon path",
      description: "notes",
    })
    expect(result.ok).toBe(true)
  })

  it("rejects a short journey title", () => {
    const result = parseApiBody(postJourneyBodySchema, { title: "ab" })
    expect(result.ok).toBe(false)
  })

  it("accepts a valid category body", () => {
    const result = parseApiBody(postCategoryBodySchema, {
      categoryName: "Work",
      categoryColor: "bg-red-500",
    })
    expect(result.ok).toBe(true)
  })

  it("rejects step without journeyId", () => {
    const result = parseApiBody(postStepBodySchema, { title: "Reading" })
    expect(result.ok).toBe(false)
  })
})
