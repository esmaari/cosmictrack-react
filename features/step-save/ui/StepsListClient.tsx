"use client"

import type { Step } from "@/shared/types"
import AddAndEditStepFormDialog from "./AddAndEditStepFormDialog"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCreatedAt } from "@/lib/formatCreatedAt"

export default function StepsListClient(props: {journeyId: string, steps: Step[]}){
    const { steps } = props as { steps: Step[] }


    if (steps.length === 0) {
        return (
            <div className="rounded-xl border border-white/10 bg-app-darker/50 px-6 py-10 text-center">
                <p className="heading-4 mb-2 font-semibold text-on-dark">No steps yet</p>
                <p className="text-sm text-light">
                    Add your first step with the <span className="font-medium text-heading">Add step</span> button
                    above.
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
                                    {step.note || "No note"}
                                </CardDescription>
                                <p className="text-xs text-muted-foreground">
                                    Created {formatCreatedAt(step.created_at)}
                                </p>
                            </CardHeader>
                        </Card>
                    </div>      
                )
            })}
        </div>
    )
}