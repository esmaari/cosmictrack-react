'use client'

import { useRouter } from "next/navigation"
import type { Category } from "@/shared/types"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CosmicInput } from "@/shared/ui/CosmicInput"
import DeleteCategoryIcon from "@/features/category-delete/DeleteCategoryIcon"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose} from "@/components/ui/dialog"
import { Pencil } from "lucide-react"
import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { CATEGORY_COLOR_OPTIONS } from "@/features/category-save/categoryColorOptions"
import { getCategoryColorLabel } from "@/shared/lib/categoryColorLabels"
import { useTranslations } from "next-intl"

export default function EditCategoryFormDialog(props: {category: Category}  ) {
    const t = useTranslations("categories")
    const tFields = useTranslations("common.fields")
    const tPlaceholders = useTranslations("common.placeholders")
    const tValidation = useTranslations("common.validation")
    const tColors = useTranslations("common.colors")
    const tActions = useTranslations("common.actions")
    const tToast = useTranslations("common.toast")

    const router = useRouter()

    const formSchema = useMemo(
        () =>
            z.object({
                title: z
                    .string()
                    .min(2, { message: tValidation("titleMin", { min: 2 }) })
                    .max(50, { message: tValidation("titleMax", { max: 50 }) }),
                color: z.string().min(1, { message: tValidation("colorRequired") }),
            }),
        [tValidation],
    )

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: props.category.title,
            color: props.category.color
        }
    })

    const mutation = useMutation({
        mutationFn: async ({title, color}: {title: string, color: string}) => {

            const categoryID = props.category.id

            const response = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({categoryId: categoryID, categoryName: title, categoryColor: color})
            })

            if (!response.ok) {
                const payload = await response.json().catch(() => null)
                throw new Error(payload?.error ?? t("editDialog.toastFailed"))
            }

            const data = await response.json()
            const categoryId = data.categoryId

            if(!categoryId) {
                throw new Error(t("editDialog.toastFailed"))
            }

            return { categoryId: data.categoryId }

        },
        onSuccess: () => {
            router.refresh()
            toast.success(t("editDialog.toastSaved"))
        },
        onError: (error) => {
            const errorMessage = error instanceof Error ? error.message : String(error) ?? tToast("unknownError")
            toast.error(errorMessage)
        }
    })
    
    const onSubmit = (data: z.infer<typeof formSchema>) => {
         mutation.mutate(data, {
            onSuccess: () => {
            form.reset(data)
            }
         })
    }

    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button type="button" variant="cosmicLinkLight" size="cosmicSm">
                    <Pencil className="size-3" />
                </Button>
            </DialogTrigger>
            <DialogContent>
    
                <DialogHeader>
                <DialogTitle>{t("editDialog.title")}</DialogTitle>
                <DialogDescription>
                    {t("editDialog.description")}
                </DialogDescription>
                </DialogHeader>
                    <div className="stack-card">

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} id={`edit-category-form${props.category.id}`} className="stack-card">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{tFields("title")}</FormLabel>
                                        <FormControl>
                                            <CosmicInput {...field}/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}    
                            />

                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{tFields("color")}</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full min-w-0">
                                                    <SelectValue placeholder={tPlaceholders("selectColor")} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="min-w-(--radix-select-trigger-width)">
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
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                    <DeleteCategoryIcon categoryId={props.category.id} />
                </div>

                <DialogFooter>
                    <DialogClose asChild>   
                        <Button type="button" variant="cosmicTertiary" size="cosmicMd">{tActions("cancel")}</Button>
                    </DialogClose>

                <Button type="submit" form={`edit-category-form${props.category.id}`} disabled={mutation.isPending} variant="cosmicPrimary" size="cosmicMd">
                        {mutation.isPending ? tActions("saving") : tActions("save")}
                    </Button>
                </DialogFooter>

            </DialogContent>
    </Dialog>
    )  
}
