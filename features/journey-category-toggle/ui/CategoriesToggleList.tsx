"use client"

import { useRouter } from "next/navigation"
import type { Category } from "@/shared/types/db"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import EditCategoryFormDialog from "@/features/category-save/EditCategoryFormDialog"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { Check } from "lucide-react"

export default function CategoriesToggleList(props: {
  journeyId: string
  categories: Category[]
  assignedCategoryIds: string[]
}) {
  const t = useTranslations("categories.toggle")
  const tToast = useTranslations("common.toast")

  const router = useRouter()

  const [optimisticIds, setOptimisticIds] = useState(props.assignedCategoryIds)

  useEffect(() => {
    // eslint-disable-next-line
    setOptimisticIds(props.assignedCategoryIds)
  }, [props.assignedCategoryIds])

  const addRemoveCategoryToJourney = useMutation({
    mutationFn: async ({
      categoryId,
      nextChecked,
    }: {
      categoryId: string
      nextChecked: boolean
    }) => {
      const response = await fetch("/api/journey-categories", {
        method: nextChecked ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          journeyId: props.journeyId,
          categoryId: categoryId,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error ?? t("toastFailed"))
      }
      return true
    },
    onMutate: async (variables) => {
      let prevIds: string[] = []

      setOptimisticIds((prev) => {
        prevIds = prev

        if (variables.nextChecked) {
          return prev.includes(variables.categoryId)
            ? prev
            : [...prev, variables.categoryId]
        }
        return prev.filter((id) => id !== variables.categoryId)
      })

      return { prevIds }
    },
    onSuccess: (_data, variables) => {
      router.refresh()
      if (variables.nextChecked) {
        toast.success(t("toastAdded"))
      } else {
        toast.success(t("toastRemoved"))
      }
    },
    onError: (error, _variables, ctx) => {
      if (ctx?.prevIds) setOptimisticIds(ctx.prevIds)
      const errorMessage =
        error instanceof Error ? error.message : String(error) ?? tToast("unknownError")
      toast.error(errorMessage)
    },
  })

  if (props.categories.length === 0) {
    return (
      <div className="mt-1 rounded-lg border border-dashed border-border-neutral bg-input/40 px-4 py-6 text-center">
        <p className="font-semibold text-primary">{t("emptyTitle")}</p>
        <p className="mt-1 text-sm text-primary/85">
          {t("emptyHintBefore")}{" "}
          <span className="font-medium text-secondary">{t("emptyHintButton")}</span>{" "}
          {t("emptyHintAfter")}
        </p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {props.categories.map((category) => {
        const checked = optimisticIds.includes(category.id)

        return (
          <li
            key={category.id}
            className="flex items-center gap-2 rounded-lg border border-border-neutral bg-input/50 p-1"
          >
            <button
              type="button"
              role="switch"
              aria-checked={checked}
              aria-label={checked ? t("removeAria") : t("addAria")}
              title={checked ? t("removeAria") : t("addAria")}
              disabled={addRemoveCategoryToJourney.isPending}
              aria-busy={addRemoveCategoryToJourney.isPending}
              onClick={() =>
                addRemoveCategoryToJourney.mutate({
                  categoryId: category.id,
                  nextChecked: !checked,
                })
              }
              className={cn(
                "badge min-h-10 flex-1 cursor-pointer justify-start gap-2 border-0 text-left transition-[filter,box-shadow]",
                category.color,
                checked
                  ? "ring-2 ring-ring-neutral ring-offset-1 ring-offset-surface"
                  : "opacity-75 hover:opacity-100",
                addRemoveCategoryToJourney.isPending && "opacity-60",
              )}
            >
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full border border-white/50 bg-black/15",
                  checked && "bg-white/25",
                )}
                aria-hidden
              >
                {checked ? <Check className="size-3.5" strokeWidth={3} /> : null}
              </span>
              <span className="min-w-0 flex-1 truncate font-medium">{category.title}</span>
              <span className="shrink-0 rounded-full bg-black/15 px-2 py-0.5 text-xs font-semibold">
                {checked ? t("assigned") : t("notAssigned")}
              </span>
            </button>

            <div className="shrink-0 pr-1">
              <EditCategoryFormDialog category={category} />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
