import type { TarotLocale } from "./tarotLocale"
import { resolveTarotLocale } from "./tarotLocale"

/**
 * TEMPORARY placeholder for the homepage “daily reflection” line.
 * Not tarot card data — replace later with real daily messages.
 * Do not merge this into meanings.*.json or cardBase.
 */
const PLACEHOLDERS: Record<TarotLocale, string> = {
  tr: "Bugün umut, netlik ve yenilenme temalarıyla yanındayım. (Geçici örnek — gerçek günlük yansımalar yakında.)",
  en: "Today I sit with you through hope, clarity, and renewal. (Temporary sample — real daily reflections coming soon.)",
}

export function getDailyMessagePlaceholder(locale?: string | null): string {
  return PLACEHOLDERS[resolveTarotLocale(locale)]
}
