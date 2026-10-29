import { describe, expect, it } from "vitest"
import {
  AI_INTERPRETATION_MAX,
  parseAiReading,
} from "./aiReadingSchema"

/** Golden fixtures: fixed model outputs we expect the parser to accept or reject. */
const fixtures = {
  validTr: {
    interpretation:
      "Kartlar birlikte net bir geçiş enerjisi gösteriyor; odak noktanızda sabır ve denge öne çıkıyor.",
  },
  validEn: {
    interpretation:
      "Together the cards point to a patient transition; stay grounded while the path clarifies.",
  },
  emptyInterpretation: { interpretation: "   " },
  missingKey: { text: "legacy plain field" },
  tooLong: { interpretation: "x".repeat(AI_INTERPRETATION_MAX + 1) },
  notJson: "This is a free-form tarot blurb without JSON.",
  fencedJson: `\`\`\`json
{"interpretation":"A short upright reading with clear focus."}
\`\`\``,
} as const

describe("parseAiReading", () => {
  it("accepts a valid Turkish reading object", () => {
    const result = parseAiReading(fixtures.validTr)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.interpretation).toContain("geçiş")
    }
  })

  it("accepts a valid English reading object", () => {
    const result = parseAiReading(fixtures.validEn)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.interpretation).toContain("patient")
    }
  })

  it("accepts a JSON string of the same shape", () => {
    const result = parseAiReading(JSON.stringify(fixtures.validEn))
    expect(result.ok).toBe(true)
  })

  it("accepts fenced JSON from a sloppy model reply", () => {
    const result = parseAiReading(fixtures.fencedJson)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.interpretation).toContain("upright")
    }
  })

  it("rejects empty interpretation (fail closed)", () => {
    const result = parseAiReading(fixtures.emptyInterpretation)
    expect(result.ok).toBe(false)
  })

  it("rejects legacy text-only payload", () => {
    const result = parseAiReading(fixtures.missingKey)
    expect(result.ok).toBe(false)
  })

  it("rejects oversized interpretation", () => {
    const result = parseAiReading(fixtures.tooLong)
    expect(result.ok).toBe(false)
  })

  it("rejects non-JSON plain text", () => {
    const result = parseAiReading(fixtures.notJson)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toMatch(/not JSON/i)
    }
  })
})
