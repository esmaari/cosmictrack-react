import type { Category } from "@/shared/types"
import { getTranslations } from "next-intl/server"
import { cn } from "@/lib/utils"
import AddNewCategoryFormDialog from "@/features/category-save/AddNewCategoryFormDialog"
import EditCategoryFormDialog from "@/features/category-save/EditCategoryFormDialog"

type CategoriesManageListProps = {
  categories: Category[]
}

export default async function CategoriesManageList({ categories }: CategoriesManageListProps) {
  const t = await getTranslations("categories.manage")
  const tCommon = await getTranslations("common")

  return (
    <div className="stack-section">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="stack-tight min-w-0">
          <h1 className="heading-3 mb-0 font-semibold text-on-dark">{t("title")}</h1>
          <p className="max-w-2xl text-sm leading-6 text-on-dark/80">{t("subtitle")}</p>
        </div>
        <AddNewCategoryFormDialog />
      </div>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-heading/35 bg-app-darker/40 px-5 py-10 text-center">
          <p className="heading-4 mb-2 font-semibold text-heading">{t("emptyTitle")}</p>
          <p className="mx-auto mb-5 max-w-md font-body text-base leading-7 text-on-dark/80">
            {t("emptyHint")}
          </p>
          <div className="flex justify-center">
            <AddNewCategoryFormDialog />
          </div>
        </div>
      ) : (
        <ul className="stack-card">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex items-start gap-3 rounded-2xl border border-heading/30 bg-app-darker/50 px-4 py-4 sm:px-5"
            >
              <span
                className={cn("mt-1.5 size-3 shrink-0 rounded-full", category.color)}
                aria-hidden
              />
              <div className="min-w-0 flex-1 stack-tight">
                <p className="heading-4 mb-0 font-semibold text-heading">{category.title}</p>
                <p className="font-body text-base leading-7 text-on-dark/80">
                  {category.description?.trim()
                    ? category.description
                    : tCommon("fields.noDescription")}
                </p>
              </div>
              <EditCategoryFormDialog category={category} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
