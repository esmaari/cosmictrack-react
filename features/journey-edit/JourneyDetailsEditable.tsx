'use client'

import type { Journey } from "@/shared/types"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { Pencil } from "lucide-react"
import { useMemo, useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CosmicInput } from "@/shared/ui/CosmicInput"
import { CosmicTextarea } from "@/shared/ui/CosmicTextarea"
import DeleteJourneyButton from "@/features/journey-delete/DeleteJourneyButton"
import { useTranslations } from "next-intl"

export default function JourneyDetailsEditable(props: {journey: Journey}) {

    const t = useTranslations("journeys")
    const tFields = useTranslations("common.fields")
    const tValidation = useTranslations("common.validation")
    const tActions = useTranslations("common.actions")
    const tToast = useTranslations("common.toast")

    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)

    const formSchema = useMemo(
        () =>
            z.object({
                title: z
                    .string()
                    .min(3, { message: tValidation("titleMin", { min: 3 }) })
                    .max(50, { message: tValidation("titleMax", { max: 50 }) }),
                description: z
                    .string()
                    .max(200, { message: tValidation("descriptionMax", { max: 200 }) })
                    .optional(),
            }),
        [tValidation],
    )

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: props.journey.title,
            description: props.journey.description ?? undefined
        }
    })

    const mutation = useMutation({
        mutationFn: async ({title, description}: {title: string, description?: string}) => {
            
            const response = await fetch("/api/journeys", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({journeyId: props.journey.id, title: title, description: description})
            })

            if(!response.ok) {
                const payload = await response.json().catch(() => null)
                throw new Error(payload?.error ?? t("edit.toastFailed"))
            }

            return true
        },
        onSuccess: () => {
            toast.success(t("edit.toastSaved"))
            setIsEditing(false)
            router.refresh()
        },
        onError: (error) => {
            const errorMessage = error instanceof Error ? error.message : String(error) ?? tToast("unknownError")
            toast.error(errorMessage)
        }
    })
    
    const onSubmit = (data: z.infer<typeof formSchema>) => {
    
        mutation.mutate(data, {
            onSuccess: () => {
                form.reset()
            }
        })

    }
    return(
        <>
        {!isEditing ?
        <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
                <h2 className="heading-3 min-w-0 truncate font-semibold text-primary">
                    {props.journey.title}
                </h2>
                <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    disabled={mutation.isPending}
                    variant="cosmicPrimary"
                    size="icon"
                    className="shrink-0 mb-3"
                    aria-label={t("edit.editAria")}
                    title={t("edit.editAria")}
                >
                    <Pencil className="size-4" />
                </Button>
            </div>

            <p className="mt-2 text-sm text-primary/70">
                {props.journey.description || tFields("noDescription")}
            </p>

        </div>
          
        :
        <Form {...form}>  
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3 stack-card">
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                        <FormLabel className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{tFields("title")}</FormLabel>
                        <FormControl>
                            <CosmicInput {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                        <FormLabel className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{tFields("description")}</FormLabel>
                        <FormControl>
                            <CosmicTextarea {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="flex items-center justify-start">
                <DeleteJourneyButton journeyId={props.journey.id} />
            </div>

            <div className="flex items-center justify-end gap-2">
                <Button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={mutation.isPending}
                    variant="cosmicTertiary"
                    size="cosmicMd"
                >
                    {mutation.isPending ? tActions("cancelling") : tActions("cancel")}
                </Button>
                <Button type="submit" disabled={mutation.isPending} variant="cosmicPrimary" size="cosmicMd">
                    {mutation.isPending ? tActions("saving") : tActions("save")}
                </Button>
            </div>
          </form>
        </Form>
    
        }

        </>
      )   
}
