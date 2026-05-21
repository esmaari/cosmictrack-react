import Image from "next/image"
import { getTranslations } from "next-intl/server"
import { BookOpenText, FolderHeart, Sparkles } from "lucide-react"
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
            <div className="text-xs font-semibold tracking-[0.2em] text-heading">{t("brand")}</div>

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
            <div className="grid grid-cols-4 gap-4 text-center">
              {[
                { key: "cups", src: "/icons/cup.svg" },
                { key: "swords", src: "/icons/sword.svg" },
                { key: "wands", src: "/icons/wand.svg" },
                { key: "pentacles", src: "/icons/pentacle.svg" },
              ].map((item) => (
                <div key={item.key} className="flex flex-col items-center gap-2 opacity-85">
                  <Image src={item.src} alt="" width={38} height={38} className="opacity-90" />
                  <div className="text-[10px] font-semibold tracking-[0.22em] text-on-dark/60">
                    {t(`suits.${item.key}`)}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 text-center text-[10px] font-semibold tracking-[0.26em] text-on-dark/45">
              {t("suitsTitle")}
            </p>
          </div>
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            {
              Icon: BookOpenText,
              title: t("features.journeyTitle"),
              body: t("features.journeyBody"),
            },
            {
              Icon: FolderHeart,
              title: t("features.categoriesTitle"),
              body: t("features.categoriesBody"),
            },
            {
              Icon: Sparkles,
              title: t("features.aiTitle"),
              body: t("features.aiBody"),
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-white/10 bg-black/10 p-5 shadow-sm backdrop-blur-[1px]"
            >
              <div className="mb-4 grid size-10 place-items-center rounded-lg border border-white/10 bg-white/5">
                <card.Icon className="size-[18px] text-heading" aria-hidden />
              </div>
              <h3 className="text-base font-semibold text-heading">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-on-dark/70">{card.body}</p>
            </div>
          ))}
        </section>

        <HomeGuestCtaPanel />
      </div>
      </HomeAuthRoot>
    </main>
  )
}
