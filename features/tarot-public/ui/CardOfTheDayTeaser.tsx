import Image from "next/image"
import { getLocale, getTranslations } from "next-intl/server"
import {
  formatCardOfTheDayLabel,
  getCardOfTheDay,
} from "@/shared/content/tarot"
import { getDailyMessagePlaceholder } from "@/shared/content/tarot/dailyMessagePlaceholder"
import { cn } from "@/lib/utils"
import CardOfTheDayReveal from "./CardOfTheDayReveal"

type CardOfTheDayTeaserProps = {
  variant?: "home" | "hub" | "page"
  className?: string
}

export default async function CardOfTheDayTeaser({
  variant = "hub",
  className,
}: CardOfTheDayTeaserProps) {
  const locale = await getLocale()
  const t = await getTranslations("tarot.daily")
  const { dayKey, card } = getCardOfTheDay(locale)
  const dateLabel = formatCardOfTheDayLabel(dayKey, locale)
  const dailyMessage = getDailyMessagePlaceholder(locale)
  const isHome = variant === "home"

  return (
    <section
      aria-labelledby={`cotd-${variant}-heading`}
      className={cn(
        (variant === "home" || variant === "hub") &&
          "rounded-2xl border border-heading/40 bg-app-darker/50 px-5 py-8 sm:px-8 sm:py-10",
        isHome && "mx-auto max-w-3xl",
        variant === "hub" && "mx-auto max-w-lg",
        variant === "page" && "px-0 py-2",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto w-full",
          isHome
            ? "grid items-center gap-8 md:grid-cols-[minmax(0,200px)_minmax(0,1fr)] md:gap-10"
            : "flex max-w-md flex-col items-center text-center",
        )}
      >
        <div
          className={cn(
            "relative aspect-6/11 overflow-hidden rounded-md border-2 border-heading bg-app-darker shadow-md",
            isHome ? "mx-auto w-40 md:mx-0 md:w-full md:max-w-[200px]" : "w-40 sm:w-44",
          )}
        >
          <Image
            src={card.image}
            alt={card.name}
            fill
            className="object-cover"
            sizes={isHome ? "(max-width: 768px) 160px, 200px" : "176px"}
            priority={variant !== "home"}
          />
        </div>

        <div
          className={cn(
            "min-w-0",
            isHome ? "flex flex-col text-center md:text-left" : "mt-5 w-full text-center",
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-heading/85">
            {t("eyebrow")}
          </p>
          <h2
            id={`cotd-${variant}-heading`}
            className="heading-3 mt-2 mb-0 font-semibold text-heading"
          >
            {t("teaserTitle")}
          </h2>
          <p className="mt-2 text-sm leading-6 text-on-dark/70">{dateLabel}</p>
          <p className="heading-4 mt-4 mb-0 font-semibold text-heading">{card.name}</p>

          <div className={cn("mt-4 w-full", isHome && "md:mt-5")}>
            <CardOfTheDayReveal
              cardName={card.name}
              meaning={card.upright}
              dayKey={dayKey}
              dailyMessage={dailyMessage}
              align={isHome ? "start" : "center"}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
