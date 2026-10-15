import { getTranslations } from "next-intl/server"
import TarotAskDemo from "@/features/tarot-public/ui/TarotAskDemo"
import TarotPageShell from "@/features/tarot-public/ui/TarotPageShell"

export default async function TarotAskPage() {
  const t = await getTranslations("tarot.askPage")
  const tShell = await getTranslations("tarot.pageShell")

  return (
    <TarotPageShell
      title={t("title")}
      intro={t("intro")}
      backLabel={tShell("backToTarot")}
      contentTone="surface"
    >
      <TarotAskDemo />
    </TarotPageShell>
  )
}
