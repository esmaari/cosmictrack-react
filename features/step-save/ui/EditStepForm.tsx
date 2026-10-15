'use client'
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Step } from "@/shared/types"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CosmicInput } from "@/shared/ui/CosmicInput"
import { CosmicTextarea } from "@/shared/ui/CosmicTextarea"
import DeleteStepButton from "@/features/step-delete/ui/DeleteStepButton"
import CardPicker from "./CardPicker"
import type { PickedCard } from "@/shared/types/db"
import { useTranslations } from "next-intl"
import { createEditStepSchema } from "@/shared/lib/formSchemas"

export default function EditStepForm(props: {journeyId: string, step?: Step, onSaveButtonClicked?: (pending: boolean) => void, setOpen: (open: boolean) => void }) {
    const router = useRouter()
    const t = useTranslations("steps")
    const tFields = useTranslations("common.fields")
    const tValidation = useTranslations("common.validation")
    const tToast = useTranslations("common.toast")

    const [selectedCards] = useState<PickedCard[]>(props.step?.cards ?? [])

    const formSchema = useMemo(
        () =>
            createEditStepSchema({
                titleRequired: tValidation("titleRequired"),
                titleMax: tValidation("titleMax", { max: 80 }),
                noteMax: tValidation("noteMax", { max: 500 }),
            }),
        [tValidation],
    )

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: props.step?.title,
            note: props.step?.note ?? ""
        },
    })

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema> & { cards: PickedCard[] }) => {
            const response = await fetch("/api/steps", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    journeyId: props.journeyId,
                    id: props.step?.id,
                    title: values.title.trim(),
                    note: values.note?.trim() ?? "",
                    meaning: props.step?.meaning ?? "",
                    cards: values.cards,
                }),
            })

            if (!response.ok) {
                const payload = await response.json().catch(() => null)
                throw new Error(payload?.error ?? t("form.toastSaveFailed"))
            }

            return true
        },
        onSuccess: () => {
            router.refresh()
            toast.success(t("form.toastSaved"))
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
            { ...values, cards: selectedCards },
            {
                onSuccess: () => {
                    form.reset(values)
                    props.setOpen(false)
                },
            },
        )
    }

    return(
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                id={`edit-step-form-${props.step?.id}`}
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

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-primary">{tFields("selectedCards")}</label>
                <CardPicker mode="edit" selectedCardIds={selectedCards} />
            </div>

            {props.step?.meaning ? (
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-primary">{tFields("meaning")}</p>
                    <div className="whitespace-pre-line rounded-md border border-border-neutral bg-input px-3 py-2 text-sm leading-6 text-primary/85">
                        {props.step.meaning}
                    </div>
                </div>
            ) : null}

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
                <div className="border-t border-border-neutral pt-3">
                  <DeleteStepButton
                    stepId={props.step?.id ?? ("" as string)}
                    onDeleted={() => props.setOpen(false)}
                  />
                </div>
            </form>
        </Form>
    )
}
