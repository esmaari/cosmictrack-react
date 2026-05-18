import { tarotReadingCards } from "./tarotReading"
import type { TarotEncyclopediaEntry, TarotReadingCard, TarotSuit } from "./tarotTypes"

const SUIT_SYMBOLISM: Record<TarotSuit, string> = {
  Wands:
    "Asalar ateş elementiyle ilişkilidir: ilham, tutku, yaratıcı enerji ve hareket. Bu serideki kartlar genellikle niyet, girişim ve kişisel gücün nasıl yönlendirildiğini anlatır.",
  Cups:
    "Kupalar su elementini temsil eder: duygular, ilişkiler, sezgi ve bağ kurma. Bu kartlar kalbin diliyle konuşur; sevgi, empati ve içsel uyum temalarını taşır.",
  Swords:
    "Kılıçlar hava elementine bağlıdır: düşünce, karar, iletişim ve çatışma. Zihinsel netlik, gerçeklerle yüzleşme ve seçimlerin sonuçları bu serinin odağındadır.",
  Pentacles:
    "Tılsımlar toprak elementini yansıtır: maddi dünya, iş, sağlık ve somut sonuçlar. Güvenlik, emek, kaynaklar ve uzun vadeli istikrar bu kartlarda öne çıkar.",
}

const MAJOR_SYMBOLISM: Record<number, string> = {
  0: "Çıplak figür ve beyaz gül masumiyeti; köpeği sadakati; uçurum kenarı bilinmeyene atılan adımı simgeler.",
  1: "Masadaki dört sembol (asa, kupa, kılıç, tılsım) dört elementi; yukarı kalkan el irade ve niyeti gösterir.",
  2: "Ay ve perde bilinçaltını; iki sütun görünür ile gizli dünyayı ayırır.",
  13: "İskelet dönüşümü; beyaz gül yenilenmeyi; süvari değişimin kaçınılmazlığını temsil eder.",
  21: "Halka tamamlanmayı; dört figür dört elementi; dans eden figür bütünlüğü simgeler.",
}

function inferSuit(name: string): TarotSuit | undefined {
  if (name.includes("Wands")) return "Wands"
  if (name.includes("Cups")) return "Cups"
  if (name.includes("Swords")) return "Swords"
  if (name.includes("Pentacles")) return "Pentacles"
  return undefined
}

function buildKeywords(card: TarotReadingCard): string[] {
  if (card.arcana === "Major") {
    return [card.name, "Major Arcana", "Ruhsal yol"]
  }
  const suit = inferSuit(card.name)
  const base = card.name.split(" of ")
  return suit ? [base[0] ?? card.name, suit, "Minor Arcana"] : [card.name, "Minor Arcana"]
}

function buildSummary(card: TarotReadingCard): string {
  if (card.arcana === "Major") {
    return `${card.name}, 22 Major Arcana kartından biridir. Büyük dönüm noktaları, arketipsel temalar ve yaşam yolundaki derin derslerle ilişkilendirilir. Bu metin ansiklopedik özet olarak güncellenebilir.`
  }
  const suit = inferSuit(card.name)
  return `${card.name}, ${suit ?? "Minor"} serisinin bir kartıdır. Günlük deneyimlerde duygusal, zihinsel veya pratik bir temayı yansıtır. Özet metni burada genişletilebilir.`
}

function buildSymbolism(card: TarotReadingCard): string {
  if (card.arcana === "Major") {
    return (
      MAJOR_SYMBOLISM[card.number] ??
      `${card.name} klasik Rider–Waite geleneğinde güçlü arketipsel imgeler taşır. Sembolizm metni CosmicTrack ansiklopedisinde kart kart zenginleştirilecektir.`
    )
  }
  const suit = inferSuit(card.name)
  return suit ? SUIT_SYMBOLISM[suit] : "Bu kartın sembolizmi yakında eklenecek."
}

function toEncyclopediaEntry(card: TarotReadingCard): TarotEncyclopediaEntry {
  const suit = card.arcana === "Minor" ? inferSuit(card.name) : undefined
  return {
    id: card.id,
    name: card.name,
    arcana: card.arcana,
    number: card.number,
    image: card.image,
    suit,
    keywords: buildKeywords(card),
    summary: buildSummary(card),
    symbolism: buildSymbolism(card),
  }
}

export const tarotEncyclopediaEntries: TarotEncyclopediaEntry[] =
  tarotReadingCards.map(toEncyclopediaEntry)

export function getEncyclopediaEntryById(id: number): TarotEncyclopediaEntry | undefined {
  return tarotEncyclopediaEntries.find((entry) => entry.id === id)
}

export function getEncyclopediaEntriesByArcana(
  arcana: TarotEncyclopediaEntry["arcana"],
): TarotEncyclopediaEntry[] {
  return tarotEncyclopediaEntries.filter((entry) => entry.arcana === arcana)
}

export function getEncyclopediaEntriesBySuit(suit: TarotSuit): TarotEncyclopediaEntry[] {
  return tarotEncyclopediaEntries.filter((entry) => entry.suit === suit)
}
