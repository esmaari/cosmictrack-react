import TarotPageShell from "@/features/tarot-public/ui/TarotPageShell"
import CardOfTheDayTeaser from "@/features/tarot-public/ui/CardOfTheDayTeaser"
import { getTranslations } from "next-intl/server"

/** Shareable URL for today’s card — same UI as home/hub, no encyclopedia detour. */
export default async function TarotDailyPage() {
  const tShell = await getTranslations("tarot.pageShell")

  return (
    <TarotPageShell backHref="/tarot" backLabel={tShell("backToTarot")}>
      <CardOfTheDayTeaser variant="page" />
    </TarotPageShell>
  )
}
