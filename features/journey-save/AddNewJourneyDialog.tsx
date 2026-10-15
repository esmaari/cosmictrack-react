'use client'

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CosmicInput } from "@/shared/ui/CosmicInput"
import { CosmicTextarea } from "@/shared/ui/CosmicTextarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import { createJourneySchema } from "@/shared/lib/formSchemas"

export default function AddNewJourneyDialog() {
    const t = useTranslations("journeys")
    const tFields = useTranslations("common.fields")
    const tPlaceholders = useTranslations("common.placeholders")
    const tValidation = useTranslations("common.validation")
    const tActions = useTranslations("common.actions")
    const tToast = useTranslations("common.toast")

    const formSchema = useMemo(
        () =>
            createJourneySchema({
                titleMin: tValidation("titleMin", { min: 3 }),
                titleMax: tValidation("titleMax", { max: 50 }),
                descriptionMax: tValidation("descriptionMax", { max: 200 }),
            }),
        [tValidation],
    )

    const router = useRouter()
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: undefined,
        },
    })

    const mutation = useMutation({
        mutationFn: async ({ title, description }: { title: string; description?: string }) => {
            const response = await fetch("/api/journeys", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description: description ?? "" }),
            })

            if (!response.ok) {
                throw new Error(t("addDialog.toastFailed"))
            }

            const data = await response.json()
            const journeyId = data.journeyId

            if (!journeyId) {
                throw new Error(t("addDialog.toastFailed"))
            }

            return journeyId
        },
        onSuccess: () => {
            toast.success(t("addDialog.toastAdded"))
            router.refresh()
        },
        onError: (error) => {
            const errorMessage = error instanceof Error ? error.message : String(error) ?? tToast("unknownError")
            toast.error(errorMessage)
        },
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        mutation.mutate(data, {
            onSuccess: () => {
                form.reset()
                setOpen(false)
            },
        })
    }

    const formId = "add-new-journey-form"

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (mutation.isPending) return
                setOpen(next)
                if (!next) form.reset()
            }}
        >
            <DialogTrigger asChild>
                <Button type="button" variant="cosmicPrimary" size="cosmicMd">
                    <Plus className="size-4" />
                    {t("newJourneyButton")}
                </Button>
            </DialogTrigger>
            <DialogContent size="md">
                <DialogHeader>
                    <DialogTitle>{t("addDialog.title")}</DialogTitle>
                    <DialogDescription>
                        {t("addDialog.description")}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            id={formId}
                            className="stack-card"
                        >
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{tFields("title")}</FormLabel>
                                        <FormControl>
                                            <CosmicInput placeholder={tPlaceholders("newJourney")} disabled={mutation.isPending} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{tFields("description")}</FormLabel>
                                        <FormControl>
                                            <CosmicTextarea placeholder={tPlaceholders("optional")} disabled={mutation.isPending} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="cosmicTertiary" size="cosmicMd" disabled={mutation.isPending}>
                            {tActions("cancel")}
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        form={formId}
                        disabled={mutation.isPending}
                        variant="cosmicPrimary"
                        size="cosmicMd"
                    >
                        {mutation.isPending ? tActions("saving") : tActions("save")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
