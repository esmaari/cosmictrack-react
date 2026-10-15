import { getTarotReadingCards } from "./tarotReading"
import type { TarotLocale } from "./tarotLocale"
import { resolveTarotLocale } from "./tarotLocale"
import type { TarotEncyclopediaEntry, TarotReadingCard, TarotSuit } from "./tarotTypes"

const SUIT_SYMBOLISM: Record<TarotLocale, Record<TarotSuit, string>> = {
  tr: {
    Wands:
      "Asalar ateş elementiyle ilişkilidir: ilham, tutku, yaratıcı enerji ve hareket. Bu serideki kartlar genellikle niyet, girişim ve kişisel gücün nasıl yönlendirildiğini anlatır.",
    Cups:
      "Kupalar su elementini temsil eder: duygular, ilişkiler, sezgi ve bağ kurma. Bu kartlar kalbin diliyle konuşur; sevgi, empati ve içsel uyum temalarını taşır.",
    Swords:
      "Kılıçlar hava elementine bağlıdır: düşünce, karar, iletişim ve çatışma. Zihinsel netlik, gerçeklerle yüzleşme ve seçimlerin sonuçları bu serinin odağındadır.",
    Pentacles:
      "Tılsımlar toprak elementini yansıtır: maddi dünya, iş, sağlık ve somut sonuçlar. Güvenlik, emek, kaynaklar ve uzun vadeli istikrar bu kartlarda öne çıkar.",
  },
  en: {
    Wands:
      "Wands relate to the fire element: inspiration, passion, creative energy, and movement. Cards in this suit often speak to intention, initiative, and how personal power is directed.",
    Cups:
      "Cups represent the water element: feelings, relationships, intuition, and bonding. These cards speak the language of the heart — love, empathy, and inner harmony.",
    Swords:
      "Swords belong to the air element: thought, decision, communication, and conflict. Mental clarity, facing truths, and the consequences of choices are central here.",
    Pentacles:
      "Pentacles reflect the earth element: the material world, work, health, and concrete results. Security, craft, resources, and long-term stability stand out.",
  },
}

const MAJOR_SYMBOLISM: Record<TarotLocale, Record<number, string>> = {
  tr: {
    0: "Çıplak figür ve beyaz gül masumiyeti; köpeği sadakati; uçurum kenarı bilinmeyene atılan adımı simgeler.",
    1: "Masadaki dört sembol (asa, kupa, kılıç, tılsım) dört elementi; yukarı kalkan el irade ve niyeti gösterir.",
    2: "Ay ve perde bilinçaltını; iki sütun görünür ile gizli dünyayı ayırır.",
    13: "İskelet dönüşümü; beyaz gül yenilenmeyi; süvari değişimin kaçınılmazlığını temsil eder.",
    21: "Halka tamamlanmayı; dört figür dört elementi; dans eden figür bütünlüğü simgeler.",
  },
  en: {
    0: "The bare figure and white rose suggest innocence; the dog loyalty; the cliff edge a step into the unknown.",
    1: "The four suit symbols on the table mark the elements; the raised hand shows will and intention.",
    2: "Moon and veil point to the subconscious; the twin pillars separate seen and hidden worlds.",
    13: "The skeleton marks transformation; the white rose renewal; the rider the inevitability of change.",
    21: "The wreath suggests completion; the four figures the elements; the dancer wholeness.",
  },
}

const KEYWORD_MAJOR: Record<TarotLocale, string[]> = {
  tr: ["Major Arcana", "Ruhsal yol"],
  en: ["Major Arcana", "Soul path"],
}

const KEYWORD_MINOR: Record<TarotLocale, string> = {
  tr: "Minor Arcana",
  en: "Minor Arcana",
}

function inferSuit(name: string): TarotSuit | undefined {
  if (name.includes("Wands")) return "Wands"
  if (name.includes("Cups")) return "Cups"
  if (name.includes("Swords")) return "Swords"
  if (name.includes("Pentacles")) return "Pentacles"
  return undefined
}

function buildKeywords(card: TarotReadingCard, locale: TarotLocale): string[] {
  if (card.arcana === "Major") {
    return [card.name, ...KEYWORD_MAJOR[locale]]
  }
  const suit = inferSuit(card.name)
  const base = card.name.split(" of ")
  return suit ? [base[0] ?? card.name, suit, KEYWORD_MINOR[locale]] : [card.name, KEYWORD_MINOR[locale]]
}

function buildSummary(card: TarotReadingCard, locale: TarotLocale): string {
  if (locale === "en") {
    if (card.arcana === "Major") {
      return `${card.name} is one of the 22 Major Arcana cards. It relates to turning points, archetypal themes, and deeper lessons on the life path.`
    }
    const suit = inferSuit(card.name)
    return `${card.name} belongs to the ${suit ?? "Minor"} suit. It reflects an emotional, mental, or practical theme in everyday experience.`
  }
  if (card.arcana === "Major") {
    return `${card.name}, 22 Major Arcana kartından biridir. Büyük dönüm noktaları, arketipsel temalar ve yaşam yolundaki derin derslerle ilişkilendirilir.`
  }
  const suit = inferSuit(card.name)
  return `${card.name}, ${suit ?? "Minor"} serisinin bir kartıdır. Günlük deneyimlerde duygusal, zihinsel veya pratik bir temayı yansıtır.`
}

function buildSymbolism(card: TarotReadingCard, locale: TarotLocale): string {
  if (card.arcana === "Major") {
    return (
      MAJOR_SYMBOLISM[locale][card.number] ??
      (locale === "en"
        ? `${card.name} carries strong archetypal imagery in the Rider–Waite tradition.`
        : `${card.name} klasik Rider–Waite geleneğinde güçlü arketipsel imgeler taşır.`)
    )
  }
  const suit = inferSuit(card.name)
  if (!suit) {
    return locale === "en" ? "Symbolism for this card will be expanded soon." : "Bu kartın sembolizmi yakında eklenecek."
  }
  return SUIT_SYMBOLISM[locale][suit]
}

function toEncyclopediaEntry(card: TarotReadingCard, locale: TarotLocale): TarotEncyclopediaEntry {
  const suit = card.arcana === "Minor" ? inferSuit(card.name) : undefined
  return {
    id: card.id,
    name: card.name,
    arcana: card.arcana,
    number: card.number,
    image: card.image,
    suit,
    keywords: buildKeywords(card, locale),
    summary: buildSummary(card, locale),
    symbolism: buildSymbolism(card, locale),
  }
}

const encyclopediaCache = new Map<TarotLocale, TarotEncyclopediaEntry[]>()

export function getTarotEncyclopediaEntries(locale?: string | null): TarotEncyclopediaEntry[] {
  const resolved = resolveTarotLocale(locale)
  const cached = encyclopediaCache.get(resolved)
  if (cached) return cached
  const entries = getTarotReadingCards(resolved).map((card) => toEncyclopediaEntry(card, resolved))
  encyclopediaCache.set(resolved, entries)
  return entries
}

/** Default TR encyclopedia for legacy imports */
export const tarotEncyclopediaEntries: TarotEncyclopediaEntry[] = getTarotEncyclopediaEntries("tr")

export function getEncyclopediaEntryById(
  id: number,
  locale?: string | null,
): TarotEncyclopediaEntry | undefined {
  return getTarotEncyclopediaEntries(locale).find((entry) => entry.id === id)
}

export function getEncyclopediaEntriesByArcana(
  arcana: TarotEncyclopediaEntry["arcana"],
  locale?: string | null,
): TarotEncyclopediaEntry[] {
  return getTarotEncyclopediaEntries(locale).filter((entry) => entry.arcana === arcana)
}

export function getEncyclopediaEntriesBySuit(
  suit: TarotSuit,
  locale?: string | null,
): TarotEncyclopediaEntry[] {
  return getTarotEncyclopediaEntries(locale).filter((entry) => entry.suit === suit)
}
