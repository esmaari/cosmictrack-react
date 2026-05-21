"use client"

import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { useMemo, useState } from "react"
import {
  getEncyclopediaEntriesByArcana,
  getEncyclopediaEntriesBySuit,
  tarotEncyclopediaEntries,
} from "@/shared/content/tarot"
import type { TarotSuit } from "@/shared/content/tarot"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

type Filter = "all" | "major" | TarotSuit

export default function TarotCardsBrowser() {
  const t = useTranslations("tarot.cardsBrowser")
  const [filter, setFilter] = useState<Filter>("all")

  const filters: { id: Filter; labelKey: "filterAll" | "filterMajor" | "filterWands" | "filterCups" | "filterSwords" | "filterPentacles" }[] = [
    { id: "all", labelKey: "filterAll" },
    { id: "major", labelKey: "filterMajor" },
    { id: "Wands", labelKey: "filterWands" },
    { id: "Cups", labelKey: "filterCups" },
    { id: "Swords", labelKey: "filterSwords" },
    { id: "Pentacles", labelKey: "filterPentacles" },
  ]

  const cards = useMemo(() => {
    if (filter === "all") return tarotEncyclopediaEntries
    if (filter === "major") return getEncyclopediaEntriesByArcana("Major")
    return getEncyclopediaEntriesBySuit(filter)
  }, [filter])

  return (
    <div className="stack-section">
      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              filter === item.id
                ? "border-secondary bg-secondary text-btn-primary-text"
                : "border-cosmic-indigo/25 bg-input text-primary hover:border-secondary/40",
            )}
          >
            {t(item.labelKey)}
          </button>
        ))}
      </div>

      <p className="text-sm text-primary/70">{t("cardCount", { count: cards.length })}</p>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4">
        {cards.map((card) => (
          <li key={card.id}>
            <Link
              href={`/tarot/cards/${card.id}`}
              className="flex flex-col gap-2 rounded-lg border border-cosmic-indigo/15 bg-input p-2 transition-colors hover:border-secondary/35 sm:p-3"
            >
              <div className="relative mx-auto aspect-6/11 w-full max-w-[120px] overflow-hidden rounded-md border border-solar-gold/40 bg-shadow-veil">
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 40vw, 120px"
                />
              </div>
              <span className="text-center text-xs font-medium leading-snug text-primary sm:text-sm">
                {card.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
