/* eslint-disable @next/next/no-img-element */
"use client"

import { useMemo, useState } from "react"
import { getTarotReadingCards, type TarotReadingCard } from "@/shared/content/tarot"
import { buildMeaningFromPicks } from "@/shared/lib/buildMeaningFromPicks"
import type { PickedCard } from "@/shared/types/db"
import { Button } from "@/components/ui/button"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

function shuffleDeck(deckSource: TarotReadingCard[]): TarotReadingCard[] {
  const deck = [...deckSource]
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

function PickedCardsDisplay({
  pickedCards,
  deck,
}: {
  pickedCards: PickedCard[]
  deck: TarotReadingCard[]
}) {
  const t = useTranslations("steps.cardPicker")

  return (
    <div className="mx-auto mt-4 flex max-w-[min(1100px,100%)] flex-wrap justify-center gap-3">
      {pickedCards.map((picked) => {
        const card = deck.find((c) => c.id === picked.id)
        if (!card) return null

        return (
          <div
            key={`${picked.id}-${picked.isReversed ? "reversed" : "upright"}`}
            className="relative aspect-6/11 w-[min(120px,28vw)] max-w-[120px] shrink-0 overflow-hidden rounded-md border-2 border-heading bg-app-darker"
          >
            <img
              src={card.image}
              alt={
                picked.isReversed
                  ? `${card.name} ${t("reversedSuffix")}`
                  : card.name
              }
              className={cn(
                "h-full w-full object-cover",
                picked.isReversed && "rotate-180",
              )}
            />
          </div>
        )
      })}
    </div>
  )
}

export default function CardPicker(props: {
  mode: "add" | "edit" | "demo"
  selectedCardIds?: PickedCard[]
  question?: string
  onCardsConfirmed?: (cards: PickedCard[]) => void
}) {
  const t = useTranslations("steps.cardPicker")
  const locale = useLocale()
  const deck = useMemo(() => getTarotReadingCards(locale), [locale])
  const [shuffledCards] = useState<TarotReadingCard[]>(() => shuffleDeck(deck))
  const [pickedCards, setPickedCards] = useState<PickedCard[]>(
    props.selectedCardIds ?? [],
  )
  const [confirmed, setConfirmed] = useState(false)

  const toggleCard = (cardId: number): void => {
    if (confirmed) return
    setPickedCards((prev) => {
      if (prev.some((p) => p.id === cardId)) {
        return prev.filter((p) => p.id !== cardId)
      }
      if (prev.length >= 3) return prev
      return [...prev, { id: cardId, isReversed: Math.random() < 0.5 }]
    })
  }

  const confirmCards = (): void => {
    setConfirmed(true)
    props?.onCardsConfirmed?.(pickedCards)
  }

  if (props.mode === "demo" && confirmed) {
    const meaning = buildMeaningFromPicks(pickedCards, locale)
    return (
      <div className="text-center">
        {props.question?.trim() ? (
          <p className="mb-4 text-sm text-primary/80">
            <span className="font-medium text-primary">{t("intentionLabel")}</span>{" "}
            {props.question.trim()}
          </p>
        ) : null}
        <PickedCardsDisplay pickedCards={pickedCards} deck={deck} />
        <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-border-neutral bg-input p-4 text-left sm:p-5">
          <h3 className="mb-2 text-sm font-semibold text-primary">{t("meaningsTitle")}</h3>
          <p className="whitespace-pre-line text-sm leading-6 text-primary/85 sm:text-base">
            {meaning}
          </p>
        </div>
      </div>
    )
  }

  if (props.mode === "edit" || confirmed) {
    const cardsForDisplay = confirmed ? pickedCards : (props.selectedCardIds ?? [])
    return <PickedCardsDisplay pickedCards={cardsForDisplay} deck={deck} />
  }

  return (
    <div className="text-center">
      <p className="mb-3 text-sm text-primary/85" aria-live="polite" aria-atomic="true">
        {t("choose", { count: pickedCards.length })}
      </p>
      <div className="mx-auto flex w-full max-w-[min(1100px,100%)] justify-center overflow-x-auto overflow-y-visible px-1 py-2 [-webkit-overflow-scrolling:touch]">
        <div
          className="grid w-max grid-cols-26 gap-2 px-2 py-3 sm:px-3"
          role="group"
          aria-label={t("choose", { count: pickedCards.length })}
        >
          {shuffledCards.map((card: TarotReadingCard) => {
            const isSelected = pickedCards.some((p) => p.id === card.id)

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => toggleCard(card.id)}
                aria-pressed={isSelected}
                aria-label={card.name}
                disabled={confirmed}
                className={cn(
                  "h-30 w-14 shrink-0 overflow-hidden rounded-md bg-app-darker motion-safe:transition-transform motion-safe:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-neutral",
                  isSelected
                    ? "z-20 border-2 border-heading motion-safe:scale-105"
                    : "z-10 border border-border-dark motion-safe:hover:-translate-y-1",
                )}
              >
                <img
                  src="/cards/back.png"
                  alt=""
                  className="pointer-events-none h-full w-full object-cover"
                />
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 text-center">
        <Button
          type="button"
          variant="cosmicSecondary"
          size="cosmicMd"
          onClick={confirmCards}
          disabled={pickedCards.length !== 3}
        >
          {t("confirm")}
        </Button>
      </div>
    </div>
  )
}
