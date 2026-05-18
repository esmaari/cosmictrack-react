export type TarotArcana = "Major" | "Minor"

export type TarotSuit = "Wands" | "Cups" | "Swords" | "Pentacles"

/** Spread / picker / step save — upright & reversed reading lines */
export type TarotReadingCard = {
  id: number
  name: string
  arcana: TarotArcana
  number: number
  upright: string
  reversed: string
  image: string
}

/** Public encyclopedia — browse & learn (no AI, separate copy) */
export type TarotEncyclopediaEntry = {
  id: number
  name: string
  arcana: TarotArcana
  number: number
  image: string
  suit?: TarotSuit
  keywords: string[]
  summary: string
  symbolism: string
}
