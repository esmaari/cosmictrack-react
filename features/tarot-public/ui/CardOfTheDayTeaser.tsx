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

  return (
    <section
      aria-labelledby={`cotd-${variant}-heading`}
      className={cn(
        (variant === "home" || variant === "hub") &&
          "rounded-2xl border border-heading/40 bg-app-darker/50 px-5 py-8 sm:px-8 sm:py-10",
        variant === "home" && "mx-auto max-w-lg",
        variant === "page" && "px-0 py-2",
        className,
      )}
    >
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
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

        <div className="relative mt-6 aspect-6/11 w-40 overflow-hidden rounded-md border-2 border-heading bg-app-darker shadow-md sm:w-44">
          <Image
            src={card.image}
            alt={card.name}
            fill
            className="object-cover"
            sizes="176px"
            priority={variant !== "home"}
          />
        </div>

        <p className="heading-4 mt-5 mb-0 font-semibold text-heading">{card.name}</p>

        <div className="mt-4 w-full">
          <CardOfTheDayReveal
            cardName={card.name}
            meaning={card.upright}
            dayKey={dayKey}
            dailyMessage={dailyMessage}
          />
        </div>
      </div>
    </section>
  )
}
