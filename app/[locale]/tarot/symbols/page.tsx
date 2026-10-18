import { getTranslations } from "next-intl/server"
import TarotSymbolsExplorer, { type TarotSymbolEntry } from "@/features/tarot-public/ui/TarotSymbolsExplorer"
import TarotPageShell from "@/features/tarot-public/ui/TarotPageShell"
import TarotSuitsStrip from "@/features/tarot-public/ui/TarotSuitsStrip"

const SUIT_IDS = ["wands", "cups", "swords", "pentacles"] as const

export default async function TarotSymbolsPage() {
  const t = await getTranslations("tarot")

  const symbols: TarotSymbolEntry[] = [
    ...SUIT_IDS.map((id) => ({
      id,
      title: t(`symbolsContent.suits.${id}.name`),
      summary: `${t(`symbolsContent.suits.${id}.element`)} · ${t(`symbolsContent.suits.${id}.themes`)}`,
      meaning: t(`symbolsContent.suits.${id}.body`),
    })),
    {
      id: "major-arcana",
      title: t("symbolsContent.major.heading"),
      summary: t("symbolsExplorer.majorArcanaSummary"),
      meaning: t("symbolsContent.major.body"),
    },
  ]

  return (
    <TarotPageShell title={t("symbolsPage.title")} intro={t("symbolsPage.intro")}>
      <TarotSuitsStrip className="mb-10 border-b border-white/10 pb-10" />
      <h2 className="sr-only">{t("symbolsHub.title")}</h2>
      <TarotSymbolsExplorer symbols={symbols} defaultSymbolId={symbols[0]?.id} />
    </TarotPageShell>
  )
}
