"use client"

import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  getEncyclopediaEntriesByArcana,
  getEncyclopediaEntriesBySuit,
  getTarotEncyclopediaEntries,
} from "@/shared/content/tarot"
import type { TarotSuit } from "@/shared/content/tarot"
import { cn } from "@/lib/utils"
import { useLocale, useTranslations } from "next-intl"

type Filter = "all" | "major" | TarotSuit

const SUITS: TarotSuit[] = ["Wands", "Cups", "Swords", "Pentacles"]

function parseFilter(value: string | null): Filter {
  if (!value) return "all"
  if (value === "all") return "all"
  if (value === "major" || value === "Major") return "major"
  if (SUITS.includes(value as TarotSuit)) return value as TarotSuit
  return "all"
}

export default function TarotCardsBrowser() {
  const t = useTranslations("tarot.cardsBrowser")
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const filter = parseFilter(searchParams.get("suit"))

  const filters: {
    id: Filter
    labelKey:
      | "filterAll"
      | "filterMajor"
      | "filterWands"
      | "filterCups"
      | "filterSwords"
      | "filterPentacles"
  }[] = [
    { id: "all", labelKey: "filterAll" },
    { id: "major", labelKey: "filterMajor" },
    { id: "Wands", labelKey: "filterWands" },
    { id: "Cups", labelKey: "filterCups" },
    { id: "Swords", labelKey: "filterSwords" },
    { id: "Pentacles", labelKey: "filterPentacles" },
  ]

  const cards = useMemo(() => {
    if (filter === "all") return getTarotEncyclopediaEntries(locale)
    if (filter === "major") return getEncyclopediaEntriesByArcana("Major", locale)
    return getEncyclopediaEntriesBySuit(filter, locale)
  }, [filter, locale])

  const setFilter = (next: Filter) => {
    const params = new URLSearchParams(searchParams.toString())
    if (next === "all") params.delete("suit")
    else params.set("suit", next)
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <div className="stack-section">
      <div className="flex flex-wrap gap-2" role="group" aria-label={t("filtersLabel")}>
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={cn(
              "min-h-10 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-neutral",
              filter === item.id
                ? "border-heading bg-heading/20 text-heading"
                : "border-white/20 bg-black/20 text-on-dark/85 hover:border-white/30 hover:bg-black/30",
            )}
          >
            {t(item.labelKey)}
          </button>
        ))}
      </div>

      <p className="text-sm text-on-dark/75">{t("cardCount", { count: cards.length })}</p>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4">
        {cards.map((card) => (
          <li key={card.id}>
            <Link
              href={`/tarot/cards/${card.id}`}
              className="flex flex-col gap-2 rounded-lg border border-white/15 bg-black/20 p-2 transition-colors hover:border-heading/50 hover:bg-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-neutral sm:p-3"
            >
              <div className="relative mx-auto aspect-6/11 w-full max-w-[120px] overflow-hidden rounded-md border border-heading/40 bg-app-darker">
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 40vw, 120px"
                />
              </div>
              <span className="text-center text-xs font-medium leading-snug text-on-dark sm:text-sm">
                {card.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
