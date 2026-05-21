"use client"

import type { Step } from "@/shared/types"
import AddAndEditStepFormDialog from "./AddAndEditStepFormDialog"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCreatedAt } from "@/lib/formatCreatedAt"
import { useTranslations } from "next-intl"

export default function StepsListClient(props: {journeyId: string, steps: Step[]}){
    const t = useTranslations("steps.list")
    const tFields = useTranslations("common.fields")
    const { steps } = props as { steps: Step[] }


    if (steps.length === 0) {
        return (
            <div className="rounded-xl border border-white/10 bg-app-darker/50 px-6 py-10 text-center">
                <p className="heading-4 mb-2 font-semibold text-on-dark">{t("emptyTitle")}</p>
                <p className="text-sm text-light">
                    {t("emptyHintBefore")}{" "}
                    <span className="font-medium text-heading">{t("emptyHintButton")}</span>{" "}
                    {t("emptyHintAfter")}
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {steps.map((step) => {

                return (
                    <div key={step.id}>
                        <Card key={step.id}>
                            <CardHeader>
                                <CardTitle>{step.title}<AddAndEditStepFormDialog journeyId={props.journeyId} step={step} mode="edit" /></CardTitle>
                                <CardDescription>
                                    {step.note || tFields("noNote")}
                                </CardDescription>
                                <p className="text-xs text-muted-foreground">
                                    {tFields("createdPrefix")}{formatCreatedAt(step.created_at)}
                                </p>
                            </CardHeader>
                        </Card>
                    </div>      
                )
            })}
        </div>
    )
}
