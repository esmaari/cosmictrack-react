import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import CardOfTheDayTeaser from "@/features/tarot-public/ui/CardOfTheDayTeaser"
import TarotGuestSavePanel from "@/features/tarot-public/ui/TarotGuestSavePanel"
import TarotSuitsStrip from "@/features/tarot-public/ui/TarotSuitsStrip"
import { getTranslations } from "next-intl/server"
import { ArrowRight } from "lucide-react"

const topics = [
  {
    key: "meanings" as const,
    href: "/tarot/cards",
    image: "/cards/major_arcana/02_the_high_priestess.png",
  },
  {
    key: "symbols" as const,
    href: "/tarot/symbols",
    image: "/cards/major_arcana/17_the_star.png",
  },
  {
    key: "history" as const,
    href: "/tarot/history",
    image: "/cards/major_arcana/09_the_hermit.png",
  },
] as const

export default async function TarotHubPage() {
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

      <div className="relative mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="stack-tight max-w-2xl">
          <p className="text-sm font-semibold text-heading">{t("brand")}</p>
          <h1 className="heading-3 mb-0 font-semibold text-heading">{t("title")}</h1>
          <p className="text-base leading-7 text-on-dark/85">{t("intro")}</p>
        </header>

        <CardOfTheDayTeaser variant="hub" className="mt-10 sm:mt-12" />

        <section className="mt-10 sm:mt-12" aria-labelledby="tarot-topics-heading">
          <h2 id="tarot-topics-heading" className="heading-4 mb-6 font-semibold text-heading">
            {t("topics.title")}
          </h2>
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {topics.map((topic) => (
              <li key={topic.key}>
                <Link
                  href={topic.href}
                  className="group flex items-center gap-4 py-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-neutral sm:gap-6 sm:py-6"
                >
                  <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-md border border-heading/40 bg-app-darker shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5 sm:h-20 sm:w-14">
                    <Image src={topic.image} alt="" fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold text-heading sm:text-lg">
                      {t(`topics.items.${topic.key}.title`)}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-on-dark/80">
                      {t(`topics.items.${topic.key}.body`)}
                    </p>
                  </div>
                  <span className="hidden shrink-0 text-sm font-semibold text-heading/80 transition-colors group-hover:text-btn-link-light sm:inline-flex sm:items-center sm:gap-1">
                    {t(`topics.items.${topic.key}.cta`)}
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Suit icons as a quiet divider into the symbols guide */}
        <section
          className="mt-12 border-t border-white/10 pt-10 sm:mt-14"
          aria-label={t("symbolsHub.title")}
        >
          <TarotSuitsStrip variant="labeled" href="/tarot/symbols" />
        </section>

        <section className="mt-12 border-t border-white/10 pt-10 sm:mt-14">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="stack-tight max-w-lg">
              <h2 className="heading-4 mb-0 font-semibold text-heading">{t("practice.title")}</h2>
              <p className="text-sm leading-6 text-on-dark/80">{t("practice.body")}</p>
            </div>
            <Button asChild variant="cosmicSecondary" size="cosmicMd" className="w-fit shrink-0">
              <Link href="/tarot/ask">{t("practice.cta")}</Link>
            </Button>
          </div>
        </section>

        <TarotGuestSavePanel />
      </div>
    </main>
  )
}
