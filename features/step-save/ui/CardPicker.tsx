/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import { tarotCards, TarotCard } from "@/shared/data/tarotCards"
import { Button } from "@/components/ui/button"

function shuffleDeck(): TarotCard[] {
    const deck = [...tarotCards]
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck
}

export default function CardPicker(props: {mode: "add" | "edit", selectedCardIds?: number[], onCardsConfirmed: (cardIds: number[]) => void}) {

    const [shuffledCards] = useState<TarotCard[]>(shuffleDeck)
    const [selectedIds, setSelectedIds] = useState<number[]>(props.selectedCardIds ?? [])
    const [confirmed, setConfirmed] = useState(false)

    const toggleCard = (cardId: number): void => {
        if (confirmed) return
        setSelectedIds((prev: number[]): number[] => {
            if (prev.includes(cardId)) return prev.filter((id: number) => id !== cardId)
            if (prev.length >= 3) return prev
            return [...prev, cardId]
        })
    }
 
    const confirmCards = (): void => {
        setConfirmed(true)
        props.onCardsConfirmed(selectedIds) 
    }

    if (props.mode === "edit" || confirmed) {
        const displayIds = confirmed ? selectedIds : (props.selectedCardIds ?? [])
        const selected = tarotCards.filter((c: TarotCard) => displayIds.includes(c.id))

        return (
            <div className="mx-auto mt-4 flex max-w-[min(1100px,100%)] flex-wrap justify-center gap-3">
                {selected.map((card: TarotCard) => (
                    <div
                        key={card.id}
                        className="aspect-6/11 w-[min(120px,28vw)] max-w-[120px] shrink-0 overflow-hidden rounded-md border-2 border-solar-gold bg-shadow-veil shadow-lg"
                    >
                        <img
                            src={card.image}
                            alt={card.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                Choose 3 cards ({selectedIds.length}/3)
            </p>
            <div className="mx-auto flex w-full max-w-[min(1100px,100%)] justify-center overflow-x-auto overflow-y-visible [-webkit-overflow-scrolling:touch]">
                <div className="grid w-max grid-cols-26 gap-2 px-2 py-4 sm:px-3 max-w-[min(1000px,100%)]">
                {shuffledCards.map((card: TarotCard) => {
                    const isSelected = selectedIds.includes(card.id)
                    return (
                        <div
                            key={card.id}
                            onClick={() => toggleCard(card.id)}
                            className={[
                                "h-30 w-14 shrink-0 cursor-pointer overflow-hidden rounded-md border bg-shadow-veil transition-all duration-300 transform",
                                isSelected
                                    ? "border-solar-gold border-2 scale-105 z-20 shadow-lg"
                                    : "border-cosmic-indigo z-10 hover:-translate-y-2 hover:shadow-xl hover:brightness-110",
                            ].join(" ")}
                        >
                            <img
                                src={isSelected ? card.image : "/cards/back.png"}
                                alt={card.name}
                                className="w-full h-full object-cover" 
                            />
                        </div>
                    )
                })}
                </div>
            </div>
            <div className="mt-4">
                <Button
                    type="button"
                    variant="cosmicPrimary"
                    size="cosmicLg"
                    onClick={confirmCards}
                    disabled={selectedIds.length !== 3}
                >
                    Confirm Cards
                </Button>
            </div>
        </div>
    )
}