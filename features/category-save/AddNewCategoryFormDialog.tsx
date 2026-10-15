'use client'

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CosmicInput } from "@/shared/ui/CosmicInput"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { CATEGORY_COLOR_OPTIONS } from "@/features/category-save/categoryColorOptions"
import { getCategoryColorLabel } from "@/shared/lib/categoryColorLabels"
import { useTranslations } from "next-intl"
import { createCategorySchema } from "@/shared/lib/formSchemas"

export default function AddNewCategoryFormDialog() {
    const t = useTranslations("categories")
    const tFields = useTranslations("common.fields")
    const tPlaceholders = useTranslations("common.placeholders")
    const tValidation = useTranslations("common.validation")
    const tColors = useTranslations("common.colors")
    const tActions = useTranslations("common.actions")
    const tToast = useTranslations("common.toast")

    const formSchema = useMemo(
        () =>
            createCategorySchema({
                titleMin: tValidation("titleMin", { min: 2 }),
                titleMax: tValidation("titleMax", { max: 50 }),
                colorRequired: tValidation("colorRequired"),
            }),
        [tValidation],
    )

    const router = useRouter()
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            color: "",
        },
    })

    const mutation = useMutation({
        mutationFn: async ({ title, color }: { title: string; color: string }) => {
            const response = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ categoryName: title, categoryColor: color }),
            })

            if (!response.ok) {
                const payload = await response.json().catch(() => null)
                throw new Error(payload?.error ?? t("addDialog.toastFailed"))
            }

            const data = await response.json()
            const categoryId = data.categoryId

            if (!categoryId) {
                throw new Error(t("addDialog.toastFailed"))
            }
            return categoryId
        },
        onSuccess: () => {
            router.refresh()
            toast.success(t("addDialog.toastAdded"))
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

    const formId = "add-new-category-form"

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
                <Button type="button" variant="cosmicSecondary" size="cosmicSm" className="shrink-0">
                    <Plus className="size-4" />
                    {t("addButton")}
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
                                            <CosmicInput placeholder={tPlaceholders("newCategory")} disabled={mutation.isPending} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{tFields("color")}</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} disabled={mutation.isPending}>
                                            <FormControl>
                                                <SelectTrigger className="h-auto w-full min-w-0 rounded-md border border-border-neutral bg-input px-3 py-2 text-primary data-placeholder:text-light focus-visible:border-ring-neutral focus-visible:ring-1 focus-visible:ring-ring-neutral dark:bg-input">
                                                    <SelectValue placeholder={tPlaceholders("selectColor")} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="min-w-(--radix-select-trigger-width) border border-border-neutral bg-surface text-primary">
                                                {CATEGORY_COLOR_OPTIONS.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        <span className="flex items-center gap-2">
                                                            <span
                                                                className={cn(
                                                                    "size-2.5 shrink-0 rounded-full",
                                                                    opt.value,
                                                                )}
                                                            />
                                                            {getCategoryColorLabel(opt.value, tColors)}
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
