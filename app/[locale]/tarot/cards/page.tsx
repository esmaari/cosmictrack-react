import Image from "next/image"
import { getTranslations } from "next-intl/server"
import TarotCardsBrowser from "@/features/tarot-public/ui/TarotCardsBrowser"

export default async function TarotCardsPage() {
  const t = await getTranslations("tarot")

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
          <h1 className="heading-display-2 text-heading">{t("cardsPage.title")}</h1>
          <p className="max-w-2xl text-sm leading-6 text-on-dark/70 sm:text-base sm:leading-7">
            {t("cardsPage.intro")}
          </p>
        </header>

        <section className="mt-10 rounded-2xl border border-white/10 bg-black/10 p-4 shadow-sm backdrop-blur-[1px] sm:p-6">
          <TarotCardsBrowser />
        </section>
      </div>
    </main>
  )
}
