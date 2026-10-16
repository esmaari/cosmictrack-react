'use client'
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CosmicInput } from "@/shared/ui/CosmicInput"
import { CosmicTextarea } from "@/shared/ui/CosmicTextarea"
import CardPicker from "./CardPicker"
import type { PickedCard } from "@/shared/types/db"
import { buildMeaningFromPicks } from "@/shared/lib/buildMeaningFromPicks"
import { createStepSchema } from "@/shared/lib/formSchemas"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AskAIError, askAI } from "@/shared/lib/askAI"
import { useProfileContext } from "@/shared/lib/ProfileProvider"
import { isAiEnabled } from "@/shared/config/features"
import { SparklesIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"


export default function AddStepForm(props: {journeyId: string, onSaveButtonClicked?: (pending: boolean) => void, setOpen: (open: boolean) => void }) {
    const router = useRouter()
    const t = useTranslations("steps")
    const tFields = useTranslations("common.fields")
    const tValidation = useTranslations("common.validation")
    const tToast = useTranslations("common.toast")
    const locale = useLocale()

    const formSchema = useMemo(
        () =>
            createStepSchema({
                titleRequired: tValidation("titleRequired"),
                titleMax: tValidation("titleMax", { max: 80 }),
                cardsRequired: tValidation("cardsRequired"),
                noteMax: tValidation("noteMax", { max: 500 }),
            }),
        [tValidation],
    )

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            cards: [],
            meaning: "",
            note: "",
        },
    })

    const cards = form.watch("cards")
    const aiEnabled = isAiEnabled()
    const { credits, refetch: refetchProfile } = useProfileContext()
    const [aiLoading, setAiLoading] = useState(false)

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema> & { cards: PickedCard[] }) => {

            const response = await fetch("/api/steps", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    journeyId: props.journeyId,
                    title: values.title.trim(),
                    note: values.note?.trim() ?? "",
                    meaning: values.meaning ?? "",
                    cards: values.cards,
                }),
            })

            if (!response.ok) {
                const payload = await response.json().catch(() => null)
                throw new Error(payload?.error ?? t("form.toastFailed"))
            }

            return true
        },
        onSuccess: () => {
            router.refresh()
            toast.success(t("form.toastAdded"))
        },
        onError: (error) => {
            const errorMessage = error instanceof Error ? error.message : String(error) ?? tToast("unknownError")
            toast.error(errorMessage)
        },
        onMutate: () => {
            props.onSaveButtonClicked?.(true)
        },
        onSettled: () => {
            props.onSaveButtonClicked?.(false)
        }
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        mutation.mutate(
            { ...values },
            {
                onSuccess: () => {
                    form.reset()
                    props.setOpen(false)
                },
            },
        )
    }

    const getMeaningFromAI = async () => {
        if (!aiEnabled) return
        setAiLoading(true)
        try {
            const result = await askAI(form.getValues("cards"), form.getValues("title"), locale)
            form.setValue("meaning", result.text, { shouldValidate: true })
            await refetchProfile()
        } catch (error) {
            const message =
                error instanceof AskAIError && error.code === "LIMIT_REACHED"
                    ? t("form.aiLimitReached")
                    : error instanceof AskAIError
                      ? t("form.aiFailed")
                      : error instanceof Error && error.message
                        ? error.message
                        : t("form.aiFailed")
            toast.error(message)
            await refetchProfile()
        } finally {
            setAiLoading(false)
        }
    }

    const aiRemainingLabel = (() => {
        if (!aiEnabled || !credits) return null
        const period =
            credits.plan === "premium" ? t("form.aiPeriodMonth") : t("form.aiPeriodToday")
        if (credits.remaining === 0) {
            return credits.plan === "premium"
                ? t("form.aiExhaustedPremium", { limit: credits.limit, period })
                : t("form.aiExhaustedFree", { period })
        }
        return credits.plan === "premium"
            ? t("form.aiRemainingPremium", {
                  remaining: credits.remaining,
                  limit: credits.limit,
                  period,
              })
            : t("form.aiRemainingFree", { remaining: credits.remaining, period })
    })()
    const aiDisabled = !aiEnabled || aiLoading || !credits || credits.remaining === 0

    return (
        <Form {...form}>
            
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                id="add-new-step-form"
                className="stack-card"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel>{tFields("title")}</FormLabel>
                            <FormControl>
                                <CosmicInput {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="cards"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel>{tFields("cards")}</FormLabel>
                            <FormControl>
                                 <div className="flex flex-col gap-1">
                                    <CardPicker 
                                        mode="add" 
                                        onCardsConfirmed={(cards: PickedCard[]) => {
                                            field.onChange(cards)
                                            form.setValue("meaning", buildMeaningFromPicks(cards, locale), {
                                                shouldValidate: true,
                                            })
                                        }} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
            <FormField
                control={form.control}
                name="meaning"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                        <div className="flex flex-row gap-2 items-center">
                                                
                        <FormLabel>{tFields("meaning")}</FormLabel>
                        {cards.length === 3 ? (
                            <>
                                <Button
                                    type="button"
                                    size="lg"
                                    variant="cosmicLinkDark"
                                    disabled={aiDisabled}
                                    title={!aiEnabled ? t("form.aiComingSoonHint") : undefined}
                                    onClick={() => void getMeaningFromAI()}
                                >
                                    <SparklesIcon className={cn("w-4 h-4", aiLoading && "animate-pulse")} />
                                    {!aiEnabled
                                        ? t("form.aiComingSoon")
                                        : aiLoading
                                          ? t("form.generating")
                                          : t("form.askAi")}
                                </Button>
                                {!aiEnabled ? (
                                    <span className="text-xs text-primary/70">
                                        {t("form.aiComingSoonHint")}
                                    </span>
                                ) : aiRemainingLabel ? (
                                    <span className="text-xs text-primary/85">
                                        {aiRemainingLabel}
                                    </span>
                                ) : null}
                            </>
                        ) : null}
                        </div>
                        <FormControl>
                            <div className="min-h-16 whitespace-pre-line rounded-md border border-border-neutral bg-input px-3 py-2 text-sm leading-6 text-primary/85">
                                {field.value || "—"}
                            </div>
                        </FormControl>
                    </FormItem>
                )}
            />
               
            <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                        <FormLabel>{tFields("note")}</FormLabel>
                        <FormControl>
                            <CosmicTextarea {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </form>
        </Form>
    )

}
