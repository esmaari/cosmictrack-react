import type { TarotReadingCard } from "./tarotTypes"
import type { TarotLocale } from "./tarotLocale"
import { resolveTarotLocale } from "./tarotLocale"
import cardBase from "./data/cardBase.json"
import meaningsTr from "./data/meanings.tr.json"
import meaningsEn from "./data/meanings.en.json"

export type { TarotReadingCard } from "./tarotTypes"

/** @deprecated Use `TarotReadingCard` */
export type TarotCard = TarotReadingCard

type MeaningMap = Record<string, { upright: string; reversed: string }>

const meaningsByLocale: Record<TarotLocale, MeaningMap> = {
  tr: meaningsTr as MeaningMap,
  en: meaningsEn as MeaningMap,
}

function buildCards(locale: TarotLocale): TarotReadingCard[] {
  const meanings = meaningsByLocale[locale] ?? meaningsByLocale.tr
  return (cardBase as Omit<TarotReadingCard, "upright" | "reversed">[]).map((card) => {
    const meaning =
      meanings[String(card.id)] ?? (meaningsTr as MeaningMap)[String(card.id)]
    return {
      ...card,
      upright: meaning?.upright ?? "",
      reversed: meaning?.reversed ?? "",
    }
  })
}

const cache = new Map<TarotLocale, TarotReadingCard[]>()

export function getTarotReadingCards(locale?: string | null): TarotReadingCard[] {
  const resolved = resolveTarotLocale(locale)
  const cached = cache.get(resolved)
  if (cached) return cached
  const cards = buildCards(resolved)
  cache.set(resolved, cards)
  return cards
}

/**
 * Default TR deck for legacy imports (server modules without locale).
 * Prefer `getTarotReadingCards(locale)` in UI.
 */
export const tarotReadingCards: TarotReadingCard[] = getTarotReadingCards("tr")

/** @deprecated Use `getTarotReadingCards` / `tarotReadingCards` */
export const tarotCards = tarotReadingCards
