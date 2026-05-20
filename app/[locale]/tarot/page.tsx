import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"

type Tile = {
  number: string
  eyebrow: string
  title: string
  body: string
  cta: string
  href: string
}

export default async function TarotHubPage() {
  const t = await getTranslations("tarot")
  const tiles = [
    t.raw("tiles.encyclopedia"),
    t.raw("tiles.suits"),
    t.raw("tiles.history"),
    t.raw("tiles.demo"),
  ] as Tile[]

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
          <h1 className="heading-display-2 text-heading">
            {t("titleLine1")}
            <br />
            {t("titleLine2")}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-on-dark/70 sm:text-base sm:leading-7">
            {t("intro")}
          </p>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          {tiles.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/10 p-5 shadow-sm transition-colors hover:border-white/20 hover:bg-black/15 sm:p-6"
            >
              <div className="absolute -left-2 -top-5 text-6xl font-black tracking-tight text-on-dark/5 sm:text-7xl">
                {tile.number}
              </div>

              <div className="relative stack-tight">
                <p className="text-[10px] font-semibold tracking-[0.24em] text-on-dark/55">{tile.eyebrow}</p>
                <h2 className="text-lg font-semibold text-heading sm:text-xl">{tile.title}</h2>
                <p className="text-sm leading-6 text-on-dark/70">{tile.body}</p>

                <div className="mt-4 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-[0.22em] text-on-dark/70 transition-colors group-hover:border-white/25 group-hover:bg-white/10">
                  {tile.cta}
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-black/10 p-6 shadow-sm md:p-8">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_280px] md:items-center">
            <div className="stack-card">
              <p className="text-[10px] font-semibold tracking-[0.24em] text-on-dark/55">{t("demoPanel.eyebrow")}</p>
              <h2 className="heading-4 font-semibold text-heading">{t("demoPanel.title")}</h2>
              <p className="text-sm leading-6 text-on-dark/70">{t("demoPanel.subtitle")}</p>
              <p className="text-xs text-on-dark/50">{t("demoPanel.hint")}</p>
              <Button asChild variant="cosmicTertiaryOnDark" size="cosmicMd" className="mt-2 w-fit">
                <Link href="/tarot/ask">{t("demoPanel.button")}</Link>
              </Button>
            </div>

            <div className="mx-auto flex items-end justify-center gap-3">
              <div className="relative h-28 w-20 overflow-hidden rounded-xl border border-white/15 bg-black/10 shadow-sm">
                <Image src="/cards/back.png" alt="" fill className="object-cover opacity-95" />
              </div>
              <div className="relative -translate-y-2 h-32 w-22 overflow-hidden rounded-xl border border-white/15 bg-black/10 shadow-sm">
                <Image src="/cards/major_arcana/18_the_moon.png" alt="" fill className="object-cover" />
              </div>
              <div className="relative h-28 w-20 overflow-hidden rounded-xl border border-white/15 bg-black/10 shadow-sm">
                <Image src="/cards/back.png" alt="" fill className="object-cover opacity-95" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-black/10 p-6 shadow-sm md:flex-row md:items-center md:p-8">
            <div className="stack-tight">
              <h2 className="heading-4 font-semibold text-heading">{t("savePanel.title")}</h2>
              <p className="text-sm leading-6 text-on-dark/70">{t("savePanel.body")}</p>
            </div>
            <Button asChild variant="cosmicTertiaryOnDark" size="cosmicMd" className="shrink-0">
              <Link href="/auth?mode=register">{t("savePanel.button")}</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  )
}
