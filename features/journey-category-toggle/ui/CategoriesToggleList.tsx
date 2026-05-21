"use client";

import { useRouter } from "next/navigation";
import type { Category } from "@/shared/types/db"
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import EditCategoryFormDialog from "@/features/category-save/EditCategoryFormDialog";
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

export default function CategoriesToggleList(props: { journeyId: string; categories: Category[]; assignedCategoryIds: string[] }) {

    const t = useTranslations("categories.toggle")
    const tToast = useTranslations("common.toast")

    const router = useRouter();
      
    const [optimisticIds, setOptimisticIds] = useState(props.assignedCategoryIds)

     useEffect(() => {
        // eslint-disable-next-line
        setOptimisticIds(props.assignedCategoryIds)

    },[props.assignedCategoryIds])

    const addRemoveCategoryToJourney = useMutation({
        mutationFn: async ({ categoryId, nextChecked }: { categoryId: string; nextChecked: boolean }) => {

            const response = await fetch("/api/journey-categories", {
                method: nextChecked ? "POST" : "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    journeyId: props.journeyId,
                    categoryId: categoryId
                })
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

                if(variables.nextChecked) {
                    return prev.includes(variables.categoryId)
                        ? prev
                        : [...prev, variables.categoryId]
                } else {
                    return prev.filter((id) => id !== variables.categoryId)
                }
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
            if(ctx?.prevIds) setOptimisticIds(ctx.prevIds)
            const errorMessage = error instanceof Error ? error.message : String(error) ?? tToast("unknownError")
            toast.error(errorMessage)
        }

    })



    if (props.categories.length === 0) {
        return (
            <div className="mt-3 rounded-lg border border-border-neutral bg-input/50 px-4 py-6 text-center">
                <p className="font-semibold text-primary">{t("emptyTitle")}</p>
                <p className="mt-1 text-sm text-primary/70">
                    {t("emptyHintBefore")}{" "}
                    <span className="font-medium text-secondary">{t("emptyHintButton")}</span>{" "}
                    {t("emptyHintAfter")}
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-wrap gap-2">
            {props.categories.map((category) => {
                const checked = optimisticIds.includes(category.id);

                return (
                    <label
                        key={category.id}
                        className={cn("badge cursor-pointer", category.color)}
                    >
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => addRemoveCategoryToJourney.mutate({ 
                                categoryId: category.id, 
                                nextChecked: !checked 
                            })}
                            disabled={addRemoveCategoryToJourney.isPending}
                            aria-busy={addRemoveCategoryToJourney.isPending}
                            aria-label={checked ? t("removeAria") : t("addAria")}
                            title={checked ? t("removeAria") : t("addAria")}
                            className="h-4 w-4 rounded border-zinc-300 bg-transparent
                            accent-zinc-900 dark:border-zinc-600 dark:accent-zinc-100"
                        />

                        <span className="font-medium">{category.title}</span>

                        <span className="ml-1 inline-flex items-center gap-1">
                            <EditCategoryFormDialog category={category} />
                        </span>
                    </label>
                );
            })}
        </div>
    );
}
