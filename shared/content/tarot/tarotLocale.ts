import type { Locale } from "next-intl"
import { routing } from "@/i18n/routing"

export type TarotLocale = (typeof routing.locales)[number]

export function resolveTarotLocale(locale?: string | null): TarotLocale {
  if (locale && (routing.locales as readonly string[]).includes(locale)) {
    return locale as TarotLocale
  }
  return routing.defaultLocale
}

/** Narrow next-intl Locale to app tarot locales */
export function asTarotLocale(locale: Locale): TarotLocale {
  return resolveTarotLocale(locale)
}
