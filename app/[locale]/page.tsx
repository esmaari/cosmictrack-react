import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"
import { ArrowRight } from "lucide-react"
import { HomeAuthRoot, HomeGuestCtaPanel, HomeHeroCtas } from "@/features/home/ui/HomeAuthCtas"
import CardOfTheDayTeaser from "@/features/tarot-public/ui/CardOfTheDayTeaser"
import TarotSuitsStrip from "@/features/tarot-public/ui/TarotSuitsStrip"

const paths = [
  {
    key: "journeys" as const,
    href: "/my-journeys",
    image: "/images/tarotJournal.png",
  },
  {
    key: "organize" as const,
    href: "/categories",
    image: "/images/tarotCats.png",
  },
  {
    key: "learn" as const,
    href: "/tarot",
    image: "/images/tarotHub.png",
  },
] as const

export default async function Home() {
  const t = await getTranslations("home")

  return (
    <main className="relative flex-1 overflow-hidden bg-app text-on-dark">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/CT_bg.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <HomeAuthRoot>
        {/* Wider than page max-w-5xl, but inset from viewport edges. */}
        <section className="relative w-full px-6 py-16 sm:px-10 sm:py-18 lg:px-16">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-10 lg:gap-12">
            <div className="stack-card min-w-0 text-left">
              <p className="text-sm font-semibold text-heading">{t("brand")}</p>

              <h1 className="heading-display-2 mb-0 text-heading">
                {t("heroTitleLine1")}
                <br />
                {t("heroTitleLine2")}
              </h1>
              <p className="heading-3 mb-0 font-semibold text-heading">{t("heroTitleLine3")}</p>

              <p className="max-w-2xl font-body text-base leading-7 text-on-dark/80">
                {t("heroSubtitle")}
              </p>

              <HomeHeroCtas />
            </div>

            <div className="relative mx-auto w-full max-w-[220px] min-w-0 sm:max-w-[280px] md:max-w-xl">
              <Image
                src="/images/witchFoolWithPlanets.png"
                alt=""
                width={1024}
                height={843}
                className="h-auto w-full object-contain"
                sizes="(max-width: 640px) 220px, (max-width: 768px) 280px, 520px"
                priority
              />
            </div>
          </div>
        </section>

        <div className="relative mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6 sm:pb-18">
          <CardOfTheDayTeaser variant="home" className="mt-2 sm:mt-4" />

          <div className="mt-10 sm:mt-12" role="presentation">
            <TarotSuitsStrip variant="decorative" />
          </div>

          <section className="mt-10 sm:mt-12" aria-labelledby="home-paths-heading">
            <header className="stack-tight mx-auto mb-6 max-w-2xl text-center sm:mb-8">
              <h2 id="home-paths-heading" className="heading-3 mb-0 font-semibold text-heading">
                {t("paths.title")}
              </h2>
              <p className="font-body text-base leading-7 text-on-dark/80">{t("paths.intro")}</p>
            </header>

            <ul className="grid gap-4 sm:grid-cols-3 sm:gap-5">
              {paths.map((path) => (
                <li key={path.key}>
                  <Link
                    href={path.href}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-heading/35 bg-app-darker/60 transition-colors hover:border-heading/55 hover:bg-app-darker/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-neutral"
                  >
                    <div className="relative aspect-[3/4] w-full overflow-hidden border-b border-heading/25">
                      <Image
                        src={path.image}
                        alt=""
                        fill
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    </div>
                    <div className="stack-tight flex flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5">
                      <p className="heading-4 mb-0 font-semibold text-heading">
                        {t(`paths.${path.key}.title`)}
                      </p>
                      <p className="font-body text-base leading-7 text-on-dark/85">
                        {t(`paths.${path.key}.body`)}
                      </p>
                      <span className="mt-auto inline-flex min-h-10 items-center gap-1 pt-3 text-sm font-semibold text-heading transition-colors group-hover:text-btn-link-light">
                        {t(`paths.${path.key}.cta`)}
                        <ArrowRight
                          className="size-4 transition-transform group-hover:translate-x-0.5"
                          aria-hidden
                        />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <HomeGuestCtaPanel />
        </div>
      </HomeAuthRoot>
    </main>
  )
}
