import { getTarotReadingCards } from "./tarotReading"
import type { TarotReadingCard } from "./tarotTypes"
import { resolveTarotLocale } from "./tarotLocale"

/** Operator timezone — same calendar day → same card for everyone. */
export const CARD_OF_THE_DAY_TIMEZONE = "Europe/Berlin"

/**
 * Calendar day in Europe/Berlin as `YYYY-MM-DD`.
 * `en-CA` locale formats ISO-like dates reliably in Intl.
 */
export function getBerlinDayKey(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: CARD_OF_THE_DAY_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

/** Stable FNV-1a style hash — not Math.random (must not change on refresh). */
export function hashDayKey(dayKey: string): number {
  let hash = 2166136261
  for (let i = 0; i < dayKey.length; i++) {
    hash ^= dayKey.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function cardIndexForDayKey(dayKey: string, deckSize: number): number {
  if (deckSize <= 0) return 0
  return hashDayKey(dayKey) % deckSize
}

export type CardOfTheDay = {
  dayKey: string
  card: TarotReadingCard
}

export function getCardOfTheDay(
  locale?: string | null,
  date: Date = new Date(),
): CardOfTheDay {
  const dayKey = getBerlinDayKey(date)
  const deck = getTarotReadingCards(locale)
  const index = cardIndexForDayKey(dayKey, deck.length)
  const card = deck[index] ?? deck[0]!
  return { dayKey, card }
}

export function formatCardOfTheDayLabel(
  dayKey: string,
  locale?: string | null,
): string {
  const resolved = resolveTarotLocale(locale)
  const [y, m, d] = dayKey.split("-").map(Number)
  const utcNoon = new Date(Date.UTC(y!, m! - 1, d!, 12, 0, 0))
  return new Intl.DateTimeFormat(resolved === "en" ? "en-GB" : "tr-TR", {
    timeZone: CARD_OF_THE_DAY_TIMEZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(utcNoon)
}
