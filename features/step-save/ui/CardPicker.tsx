/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import { tarotReadingCards, type TarotReadingCard } from "@/shared/content/tarot"
import { buildMeaningFromPicks } from "@/shared/lib/buildMeaningFromPicks"
import type { PickedCard } from "@/shared/types/db"
import { Button } from "@/components/ui/button"

function shuffleDeck(): TarotReadingCard[] {
    const deck = [...tarotReadingCards]
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck
}

function PickedCardsDisplay({ pickedCards }: { pickedCards: PickedCard[] }) {
    return (
        <div className="mx-auto mt-4 flex max-w-[min(1100px,100%)] flex-wrap justify-center gap-3">
            {pickedCards.map((picked) => {
                const card = tarotReadingCards.find((c) => c.id === picked.id)
                if (!card) return null

                return (
                    <div
                        key={`${picked.id}-${picked.isReversed ? "reversed" : "upright"}`}
                        className="relative aspect-6/11 w-[min(120px,28vw)] max-w-[120px] shrink-0 overflow-hidden rounded-md border-2 border-solar-gold bg-shadow-veil shadow-lg"
                    >
                        <img
                            src={card.image}
                            alt={picked.isReversed ? `${card.name} (reversed)` : card.name}
                            className={[
                                "h-full w-full object-cover",
                                picked.isReversed ? "rotate-180" : "",
                            ].join(" ")}
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
    const [shuffledCards] = useState<TarotReadingCard[]>(shuffleDeck)
    const [pickedCards, setPickedCards] = useState<PickedCard[]>(props.selectedCardIds ?? [])
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
        const meaning = buildMeaningFromPicks(pickedCards)
        return (
            <div className="text-center">
                {props.question?.trim() ? (
                    <p className="mb-4 text-sm text-primary/80">
                        <span className="font-medium text-primary">Niyet:</span> {props.question.trim()}
                    </p>
                ) : null}
                <PickedCardsDisplay pickedCards={pickedCards} />
                <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-cosmic-indigo/15 bg-input p-4 text-left sm:p-5">
                    <h3 className="mb-2 text-sm font-semibold text-primary">Kart anlamları</h3>
                    <p className="whitespace-pre-line text-sm leading-6 text-primary/85 sm:text-base">{meaning}</p>
                </div>
            </div>
        )
    }

    if (props.mode === "edit" || confirmed) {
        const cardsForDisplay = confirmed ? pickedCards : (props.selectedCardIds ?? [])
        return <PickedCardsDisplay pickedCards={cardsForDisplay} />
    }

return (
 
    <div className="text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
            Choose 3 cards ({pickedCards.length}/3)
        </p>
        <div className="mx-auto flex w-full max-w-[min(1100px,100%)] justify-center overflow-x-auto overflow-y-visible [-webkit-overflow-scrolling:touch]">
            <div className="grid w-max grid-cols-26 gap-2 px-2 py-4 sm:px-3 max-w-[min(1000px,100%)]">
                {shuffledCards.map((card: TarotReadingCard) => {
                    const isSelected = pickedCards.some((p) => p.id === card.id)

                    if (isSelected) {
                        return (
                            <div
                                key={card.id}
                                onClick={() => toggleCard(card.id)}
                                className="h-30 w-14 shrink-0 cursor-pointer overflow-hidden rounded-md border-2 border-solar-gold bg-shadow-veil scale-115 z-20 shadow-lg transition-all duration-300"
                            >
                                <img
                                    src="/cards/back.png"
                                    alt="Card back"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )
                    }

                    return (
                        <div
                            key={card.id}
                            onClick={() => toggleCard(card.id)}
                            className="h-30 w-14 shrink-0 cursor-pointer overflow-hidden rounded-md border border-cosmic-indigo bg-shadow-veil z-10 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:brightness-110"
                        >
                            <img
                                src="/cards/back.png"
                                alt="Card back"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    )
                })}
            <div>
        </div>

        <div className="mt-4">
            <Button
                type="button"
                variant="cosmicPrimary"
                size="cosmicLg"
                onClick={confirmCards}
                disabled={pickedCards.length !== 3}
            >
                Confirm Cards
            </Button>
        </div>
    </div>
    </div>
    </div>
      
)}
