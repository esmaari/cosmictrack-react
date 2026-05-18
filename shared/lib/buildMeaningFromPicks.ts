import { tarotReadingCards } from "@/shared/content/tarot"
import type { PickedCard } from "@/shared/types/db"

export function buildMeaningFromPicks(pickedCards: PickedCard[]): string {
  return pickedCards
    .map((picked) => {
      const card = tarotReadingCards.find((c) => c.id === picked.id)
      if (!card) return ""
      return picked.isReversed ? card.reversed : card.upright
    })
    .filter((line) => line.length > 0)
    .join("\n\n")
}
