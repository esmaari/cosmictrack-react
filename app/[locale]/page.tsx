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
    image: "/cards/major_arcana/07_the_chariot.png",
  },
  {
    key: "organize" as const,
    href: "/my-journeys",
    image: "/cards/major_arcana/11_justice.png",
  },
  {
    key: "learn" as const,
    href: "/tarot",
    image: "/cards/major_arcana/02_the_high_priestess.png",
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

      {/* Small accent — asset is ~183px wide; keep display size near native to avoid blur */}
      <div className="pointer-events-none absolute right-2 top-1 w-24 sm:right-6 sm:top-8 sm:w-30 md:top-10 md:right-12 md:w-38 lg:right-20 lg:top-12 lg:w-46">
        <Image
          src="/images/witchfool.png"
          alt=""
          width={183}
          height={274}
          className="h-auto w-full object-contain object-top"
          priority
          sizes="(max-width: 640px) 96px, (max-width: 1024px) 152px, 184px"
        />
      </div>

      <HomeAuthRoot>
        <div className="relative mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-18">
          <section className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
            <div className="stack-card text-left">
              <p className="text-sm font-semibold text-heading">{t("brand")}</p>

              <h1 className="heading-display-2 mb-0 text-heading">
                {t("heroTitleLine1")}
                <br />
                {t("heroTitleLine2")}
              </h1>
              <p className="heading-3 mb-0 font-semibold text-heading">{t("heroTitleLine3")}</p>

              <p className="max-w-xl font-body text-base leading-7 text-on-dark/80">
                {t("heroSubtitle")}
              </p>

              <HomeHeroCtas />
            </div>

            <div className="relative hidden md:block">
              <div className="relative mx-auto aspect-square w-full max-w-[420px]">
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <Image
                    src="/images/homeCosmic.png"
                    alt=""
                    fill
                    className="object-cover opacity-95"
                    sizes="420px"
                    priority
                  />
                </div>
              </div>
            </div>
          </section>

          <CardOfTheDayTeaser variant="home" className="mt-12 sm:mt-14" />

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
                    <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-heading/25">
                      <Image
                        src={path.image}
                        alt=""
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
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
