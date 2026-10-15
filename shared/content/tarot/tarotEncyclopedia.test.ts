import { describe, expect, it } from "vitest"
import {
  getEncyclopediaEntriesByArcana,
  getEncyclopediaEntriesBySuit,
  getEncyclopediaEntryById,
  getTarotEncyclopediaEntries,
  tarotEncyclopediaEntries,
} from "./tarotEncyclopedia"
import { getTarotReadingCards } from "./tarotReading"

describe("tarot encyclopedia helpers", () => {
  it("exposes 78 encyclopedia entries", () => {
    expect(tarotEncyclopediaEntries).toHaveLength(78)
    expect(getTarotEncyclopediaEntries("en")).toHaveLength(78)
  })

  it("finds an entry by id", () => {
    const moon = getEncyclopediaEntryById(18)
    expect(moon?.name).toBe("The Moon")
    expect(moon?.arcana).toBe("Major")
  })

  it("localizes summary copy by locale", () => {
    const moonTr = getEncyclopediaEntryById(18, "tr")
    const moonEn = getEncyclopediaEntryById(18, "en")
    expect(moonTr?.summary).toContain("Major Arcana kartından")
    expect(moonEn?.summary).toContain("one of the 22 Major Arcana")
  })

  it("keeps reading meanings locale-aware", () => {
    const foolTr = getTarotReadingCards("tr").find((c) => c.id === 0)!
    const foolEn = getTarotReadingCards("en").find((c) => c.id === 0)!
    expect(foolTr.upright).not.toBe(foolEn.upright)
    expect(foolEn.upright.toLowerCase()).toContain("fresh start")
  })

  it("returns undefined for unknown id", () => {
    expect(getEncyclopediaEntryById(99999)).toBeUndefined()
  })

  it("filters Major Arcana", () => {
    const majors = getEncyclopediaEntriesByArcana("Major", "en")
    expect(majors.length).toBe(22)
    expect(majors.every((c) => c.arcana === "Major")).toBe(true)
  })

  it("filters by suit", () => {
    const cups = getEncyclopediaEntriesBySuit("Cups", "en")
    expect(cups.length).toBe(14)
    expect(cups.every((c) => c.suit === "Cups")).toBe(true)
  })
})
