import { getTranslations } from "next-intl/server"
import TarotCardsBrowser from "@/features/tarot-public/ui/TarotCardsBrowser"
import TarotPageShell from "@/features/tarot-public/ui/TarotPageShell"
import { Suspense } from "react"

export default async function TarotCardsPage() {
  const t = await getTranslations("tarot")

  return (
    <TarotPageShell title={t("cardsPage.title")} intro={t("cardsPage.intro")}>
      <Suspense fallback={<p className="text-sm text-on-dark/75">…</p>}>
        <TarotCardsBrowser />
      </Suspense>
    </TarotPageShell>
  )
}
