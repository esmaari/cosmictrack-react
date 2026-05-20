import Image from "next/image"
import { getTranslations } from "next-intl/server"
import TarotSymbolsExplorer, { type TarotSymbolEntry } from "@/features/tarot-public/ui/TarotSymbolsExplorer"
import { tarotSymbolsContent } from "@/shared/content/tarot"

export default async function TarotSymbolsPage() {
  const t = await getTranslations("tarot")

  // Temporary dataset: uses existing editorial copy (suits + major note).
  // When you create your own symbols JSON (rose, crown, chariot, cup...), replace this list.
  const symbols: TarotSymbolEntry[] = [
    ...tarotSymbolsContent.suits.map((suit) => ({
      id: suit.id,
      title: suit.name,
      summary: `${suit.element} · ${suit.themes}`,
      meaning: suit.body,
    })),
    {
      id: "major-arcana",
      title: tarotSymbolsContent.majorArcanaNote.heading,
      summary: "Arketipler · Dönüm noktaları",
      meaning: tarotSymbolsContent.majorArcanaNote.body,
    },
  ]

  return (
    <main className="relative flex-1 overflow-hidden bg-app text-on-dark">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/CT_bg.png"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-70"
          sizes="100vw"
        />
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
        <header className="stack-card max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-on-dark/70">{t("eyebrow")}</p>
          <h1 className="heading-display-2 text-heading">{t("symbolsPage.title")}</h1>
          <p className="max-w-2xl text-sm leading-6 text-on-dark/70 sm:text-base sm:leading-7">
            {t("symbolsPage.intro")}
          </p>
        </header>

        <div className="mt-10">
          <TarotSymbolsExplorer symbols={symbols} defaultSymbolId={symbols[0]?.id} />
        </div>
      </div>
    </main>
  )
}
