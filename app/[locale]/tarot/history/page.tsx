import { getTranslations } from "next-intl/server"
import TarotPageShell from "@/features/tarot-public/ui/TarotPageShell"

export default async function TarotHistoryPage() {
  const t = await getTranslations("tarot.historyPage")
  const sections = ["origins", "symbolism", "cosmictrack"] as const

  return (
    <TarotPageShell title={t("title")} intro={t("intro")}>
      <div className="stack-section max-w-3xl">
        {sections.map((key) => (
          <section key={key} className="stack-card border-b border-white/10 pb-6 last:border-b-0 last:pb-0">
            <h2 className="heading-4 mb-0 font-semibold text-heading">{t(`sections.${key}.heading`)}</h2>
            <p className="text-base leading-7 text-on-dark/85">{t(`sections.${key}.body`)}</p>
          </section>
        ))}
      </div>
    </TarotPageShell>
  )
}
