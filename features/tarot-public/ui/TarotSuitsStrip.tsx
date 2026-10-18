import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"
import { cn } from "@/lib/utils"

const SUITS = [
  { key: "cups" as const, src: "/icons/cup.svg" },
  { key: "swords" as const, src: "/icons/sword.svg" },
  { key: "wands" as const, src: "/icons/wand.svg" },
  { key: "pentacles" as const, src: "/icons/pentacle.svg" },
] as const

type TarotSuitsStripProps = {
  className?: string
  /**
   * `decorative` — line + icons + line (homepage rhythm divider).
   * `labeled` — icons + names + optional tagline (symbols hub / guide).
   */
  variant?: "decorative" | "labeled"
  href?: string
  showTagline?: boolean
}

/**
 * Four suit icons — atmosphere divider or labeled strip for the symbols area.
 */
export default async function TarotSuitsStrip({
  className,
  variant = "labeled",
  href,
  showTagline = true,
}: TarotSuitsStripProps) {
  const t = await getTranslations("tarot")
  const decorative = variant === "decorative"

  if (decorative) {
    return (
      <div
        className={cn("mx-auto flex w-full max-w-2xl items-center gap-3 sm:gap-5", className)}
        role="presentation"
        aria-hidden
      >
        <div className="h-px min-w-0 flex-1 bg-heading/35" />
        <div className="flex shrink-0 items-center gap-4 px-1 sm:gap-6">
          {SUITS.map((item) => (
            <Image
              key={item.key}
              src={item.src}
              alt=""
              width={22}
              height={22}
              className="opacity-75 sm:h-6 sm:w-6"
            />
          ))}
        </div>
        <div className="h-px min-w-0 flex-1 bg-heading/35" />
      </div>
    )
  }

  const inner = (
    <>
      <div className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4">
        {SUITS.map((item) => (
          <div key={item.key} className="flex flex-col items-center gap-2 text-center">
            <Image src={item.src} alt="" width={36} height={36} className="opacity-90" />
            <div className="text-xs font-semibold text-on-dark/85">
              {t(`suits.items.${item.key}.name`)}
            </div>
          </div>
        ))}
      </div>
      {showTagline ? (
        <p className="mt-6 text-center text-sm font-semibold text-heading">{t("suits.tagline")}</p>
      ) : null}
    </>
  )

  return (
    <div className={cn("mx-auto w-full max-w-4xl", className)}>
      {href ? (
        <Link
          href={href}
          className="block rounded-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-neutral"
          aria-label={t("symbolsHub.cta")}
        >
          {inner}
        </Link>
      ) : (
        inner
      )}
    </div>
  )
}
