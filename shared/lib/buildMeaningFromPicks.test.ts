import { describe, expect, it } from "vitest"
import { getTarotReadingCards } from "@/shared/content/tarot"
import { buildMeaningFromPicks } from "./buildMeaningFromPicks"

describe("buildMeaningFromPicks", () => {
  it("joins upright meanings for upright picks", () => {
    const deck = getTarotReadingCards("tr")
    const fool = deck.find((c) => c.id === 0)!
    const magician = deck.find((c) => c.id === 1)!

    const meaning = buildMeaningFromPicks(
      [
        { id: 0, isReversed: false },
        { id: 1, isReversed: false },
      ],
      "tr",
    )

    expect(meaning).toBe(`${fool.upright}\n\n${magician.upright}`)
  })

  it("uses reversed text when isReversed is true", () => {
    const fool = getTarotReadingCards("tr").find((c) => c.id === 0)!

    const meaning = buildMeaningFromPicks([{ id: 0, isReversed: true }], "tr")

    expect(meaning).toBe(fool.reversed)
  })

  it("uses English meanings when locale is en", () => {
    const fool = getTarotReadingCards("en").find((c) => c.id === 0)!

    const meaning = buildMeaningFromPicks([{ id: 0, isReversed: false }], "en")

    expect(meaning).toBe(fool.upright)
    expect(meaning.toLowerCase()).toContain("fresh start")
  })

  it("skips unknown card ids", () => {
    const fool = getTarotReadingCards("tr").find((c) => c.id === 0)!

    const meaning = buildMeaningFromPicks(
      [
        { id: 99999, isReversed: false },
        { id: 0, isReversed: false },
      ],
      "tr",
    )

    expect(meaning).toBe(fool.upright)
  })

  it("returns empty string for empty picks", () => {
    expect(buildMeaningFromPicks([])).toBe("")
  })
})
