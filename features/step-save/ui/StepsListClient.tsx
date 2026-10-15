"use client"

/* eslint-disable @next/next/no-img-element */

import type { Step } from "@/shared/types"
import AddAndEditStepFormDialog from "./AddAndEditStepFormDialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCreatedAt } from "@/lib/formatCreatedAt"
import { getTarotReadingCards } from "@/shared/content/tarot"
import { useLocale } from "next-intl"
import { useTranslations } from "next-intl"

export default function StepsListClient(props: { journeyId: string; steps: Step[] }) {
  const t = useTranslations("steps.list")
  const tFields = useTranslations("common.fields")
  const tPicker = useTranslations("steps.cardPicker")
  const locale = useLocale()
  const deck = getTarotReadingCards(locale)
  const { steps } = props

  if (steps.length === 0) {
    return (
      <div className="stack-card rounded-xl border border-white/10 bg-app-darker/50 px-6 py-10 text-center">
        <p className="heading-4 mb-0 font-semibold text-on-dark">{t("emptyTitle")}</p>
        <p className="text-sm text-on-dark/80">{t("emptyHint")}</p>
        <div className="flex justify-center pt-1">
          <AddAndEditStepFormDialog journeyId={props.journeyId} mode="add" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {steps.map((step) => {
        const cards = step.cards ?? []

        return (
          <Card key={step.id} className="card-light">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="min-w-0 flex-1">{step.title}</CardTitle>
                <AddAndEditStepFormDialog
                  journeyId={props.journeyId}
                  step={step}
                  mode="edit"
                />
              </div>
              <CardDescription>{step.note || tFields("noNote")}</CardDescription>
              <p className="text-xs text-primary/85">
                {tFields("createdPrefix")}
                {formatCreatedAt(step.created_at)}
              </p>
            </CardHeader>

            {(cards.length > 0 || step.meaning) && (
              <CardContent className="space-y-3 pt-0">
                {cards.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {cards.map((picked) => {
                      const card = deck.find((c) => c.id === picked.id)
                      if (!card) return null
                      return (
                        <div
                          key={`${step.id}-${picked.id}-${picked.isReversed ? "r" : "u"}`}
                          className="relative h-20 w-12 overflow-hidden rounded-md border border-border-neutral bg-app-darker"
                          title={
                            picked.isReversed
                              ? `${card.name} ${tPicker("reversedSuffix")}`
                              : card.name
                          }
                        >
                          <img
                            src={card.image}
                            alt={
                              picked.isReversed
                                ? `${card.name} ${tPicker("reversedSuffix")}`
                                : card.name
                            }
                            className={[
                              "h-full w-full object-cover",
                              picked.isReversed ? "rotate-180" : "",
                            ].join(" ")}
                          />
                        </div>
                      )
                    })}
                  </div>
                ) : null}

                {step.meaning ? (
                  <p className="whitespace-pre-line rounded-md border border-border-neutral bg-input px-3 py-2 text-sm leading-6 text-primary/85 line-clamp-4">
                    {step.meaning}
                  </p>
                ) : null}
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
