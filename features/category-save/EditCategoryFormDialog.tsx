"use client"

import { useRouter } from "next/navigation"
import type { Category } from "@/shared/types"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { createCategorySchema } from "@/shared/lib/formSchemas"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CosmicInput } from "@/shared/ui/CosmicInput"
import { CosmicTextarea } from "@/shared/ui/CosmicTextarea"
import DeleteCategoryIcon from "@/features/category-delete/DeleteCategoryIcon"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Pencil } from "lucide-react"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { CATEGORY_COLOR_OPTIONS } from "@/features/category-save/categoryColorOptions"
import { getCategoryColorLabel } from "@/shared/lib/categoryColorLabels"
import { useTranslations } from "next-intl"

const cosmicSelectTriggerClass =
  "h-auto w-full min-w-0 rounded-md border border-border-neutral bg-input px-3 py-2 text-primary data-placeholder:text-light focus-visible:border-ring-neutral focus-visible:ring-1 focus-visible:ring-ring-neutral dark:bg-input"

const cosmicSelectContentClass =
  "min-w-(--radix-select-trigger-width) border border-border-neutral bg-surface text-primary"

export default function EditCategoryFormDialog(props: { category: Category }) {
  const t = useTranslations("categories")
  const tFields = useTranslations("common.fields")
  const tPlaceholders = useTranslations("common.placeholders")
  const tValidation = useTranslations("common.validation")
  const tColors = useTranslations("common.colors")
  const tActions = useTranslations("common.actions")
  const tToast = useTranslations("common.toast")

  const router = useRouter()
  const [open, setOpen] = useState(false)

  const formSchema = useMemo(
    () =>
      createCategorySchema({
        titleMin: tValidation("titleMin", { min: 2 }),
        titleMax: tValidation("titleMax", { max: 50 }),
        colorRequired: tValidation("colorRequired"),
        descriptionMax: tValidation("descriptionMax", { max: 200 }),
      }),
    [tValidation],
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: props.category.title,
      color: props.category.color,
      description: props.category.description ?? "",
    },
  })

  const mutation = useMutation({
    mutationFn: async ({
      title,
      color,
      description,
    }: {
      title: string
      color: string
      description?: string
    }) => {
      const categoryID = props.category.id

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: categoryID,
          categoryName: title,
          categoryColor: color,
          categoryDescription: description ?? "",
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error ?? t("editDialog.toastFailed"))
      }

      const data = await response.json()
      const categoryId = data.categoryId

      if (!categoryId) {
        throw new Error(t("editDialog.toastFailed"))
      }

      return { categoryId: data.categoryId }
    },
    onSuccess: () => {
      router.refresh()
      toast.success(t("editDialog.toastSaved"))
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : String(error) ?? tToast("unknownError")
      toast.error(errorMessage)
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutation.mutate(data, {
      onSuccess: () => {
        form.reset(data)
        setOpen(false)
      },
    })
  }

  const formId = `edit-category-form${props.category.id}`

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (mutation.isPending) return
        setOpen(next)
        if (!next) {
          form.reset({
            title: props.category.title,
            color: props.category.color,
            description: props.category.description ?? "",
          })
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="cosmicTertiary"
          size="icon"
          className="size-9 shrink-0"
          aria-label={t("editDialog.title")}
          title={t("editDialog.title")}
        >
          <Pencil className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{t("editDialog.title")}</DialogTitle>
          <DialogDescription>{t("editDialog.description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id={formId} className="stack-card">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tFields("title")}</FormLabel>
                  <FormControl>
                    <CosmicInput {...field} disabled={mutation.isPending} />
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
                    <CosmicTextarea
                      placeholder={t("form.descriptionPlaceholder")}
                      disabled={mutation.isPending}
                      {...field}
                    />
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={mutation.isPending}
                  >
                    <FormControl>
                      <SelectTrigger className={cosmicSelectTriggerClass}>
                        <SelectValue placeholder={tPlaceholders("selectColor")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className={cosmicSelectContentClass}>
                      {CATEGORY_COLOR_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <span className="flex items-center gap-2">
                            <span
                              className={cn("size-2.5 shrink-0 rounded-full", opt.value)}
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

        <div className="border-t border-border-neutral pt-3">
          <DeleteCategoryIcon
            categoryId={props.category.id}
            onDeleted={() => setOpen(false)}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="cosmicTertiary"
              size="cosmicMd"
              disabled={mutation.isPending}
            >
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
