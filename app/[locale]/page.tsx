import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"
import { ArrowRight } from "lucide-react"
import { HomeAuthRoot, HomeGuestCtaPanel, HomeHeroCtas } from "@/features/home/ui/HomeAuthCtas"

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

      <div className="pointer-events-none absolute right-2 top-1 w-24 sm:right-6 sm:top-8 sm:w-30 md:top-10 md:right-12 md:w-38 lg:right-20 lg:top-12 lg:w-46">
        <Image
          src="/images/witchfool.png"
          alt=""
          width={192}
          height={192}
          className="h-auto w-full object-contain object-top"
          priority
        />
      </div>

      <HomeAuthRoot>
        <div className="relative mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 sm:py-18">
          <section className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,440px)]">
            <div className="stack-card text-left">
              <div className="text-sm font-semibold text-heading">{t("brand")}</div>

              <h1 className="heading-display-2 text-heading">
                {t("heroTitleLine1")} <br />
                {t("heroTitleLine2")}
                <br />
                {t("heroTitleLine3")} <br />
                {t("heroTitleLine4")}
              </h1>

              <p className="max-w-xl font-body text-base leading-7 text-on-dark/80">{t("heroSubtitle")}</p>

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

          <section className="mt-12 border-t border-white/10 pt-10">
            <div className="mx-auto max-w-4xl">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4">
                {[
                  { key: "cups", src: "/icons/cup.svg" },
                  { key: "swords", src: "/icons/sword.svg" },
                  { key: "wands", src: "/icons/wand.svg" },
                  { key: "pentacles", src: "/icons/pentacle.svg" },
                ].map((item) => (
                  <div key={item.key} className="flex flex-col items-center gap-2 text-center">
                    <Image src={item.src} alt="" width={36} height={36} className="opacity-90" />
                    <div className="text-xs font-semibold text-on-dark/85">{t(`suits.${item.key}`)}</div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-center text-sm font-semibold text-heading">{t("suitsTitle")}</p>
            </div>
          </section>

          <section className="mt-12 border-t border-white/10 pt-10" aria-labelledby="home-paths-heading">
            <h2 id="home-paths-heading" className="heading-4 mb-6 font-semibold text-heading">
              {t("paths.title")}
            </h2>
            <ul className="divide-y divide-white/10">
              <li className="py-5">
                <p className="text-base font-semibold text-heading">{t("paths.journeys.title")}</p>
                <p className="mt-1 text-sm leading-6 text-on-dark/80">{t("paths.journeys.body")}</p>
              </li>
              <li className="py-5">
                <p className="text-base font-semibold text-heading">{t("paths.organize.title")}</p>
                <p className="mt-1 text-sm leading-6 text-on-dark/80">{t("paths.organize.body")}</p>
              </li>
              <li className="py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-base font-semibold text-heading">{t("paths.learn.title")}</p>
                    <p className="mt-1 text-sm leading-6 text-on-dark/80">{t("paths.learn.body")}</p>
                  </div>
                  <Link
                    href="/tarot"
                    className="inline-flex min-h-10 w-fit shrink-0 items-center gap-1 text-sm font-semibold text-heading transition-colors hover:text-btn-link-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-neutral"
                  >
                    {t("paths.learn.cta")}
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </li>
            </ul>
          </section>

          <HomeGuestCtaPanel />
        </div>
      </HomeAuthRoot>
    </main>
  )
}
