import { describe, expect, it } from "vitest"
import {
  cardIndexForDayKey,
  getBerlinDayKey,
  getCardOfTheDay,
  hashDayKey,
} from "./cardOfTheDay"

describe("cardOfTheDay", () => {
  it("formats Berlin calendar day as YYYY-MM-DD", () => {
    // 2026-10-18 10:00 UTC = afternoon Berlin (CEST)
    const key = getBerlinDayKey(new Date("2026-10-18T10:00:00.000Z"))
    expect(key).toBe("2026-10-18")
  })

  it("returns a stable hash for the same day key", () => {
    expect(hashDayKey("2026-10-18")).toBe(hashDayKey("2026-10-18"))
    expect(hashDayKey("2026-10-18")).not.toBe(hashDayKey("2026-10-19"))
  })

  it("maps the same day key to the same deck index", () => {
    const a = cardIndexForDayKey("2026-10-18", 78)
    const b = cardIndexForDayKey("2026-10-18", 78)
    expect(a).toBe(b)
    expect(a).toBeGreaterThanOrEqual(0)
    expect(a).toBeLessThan(78)
  })

  it("returns the same card for the same instant (tr/en)", () => {
    const when = new Date("2026-10-18T10:00:00.000Z")
    const tr = getCardOfTheDay("tr", when)
    const en = getCardOfTheDay("en", when)
    expect(tr.dayKey).toBe(en.dayKey)
    expect(tr.card.id).toBe(en.card.id)
    expect(tr.card.upright).not.toBe(en.card.upright)
  })
})
