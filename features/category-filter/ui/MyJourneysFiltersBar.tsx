"use client"

import { Link } from "@/i18n/navigation"
import CategoryFilterPicker from "@/features/category-filter/ui/CategoryFilterPicker"
import type { Category } from "@/shared/types/db"
import { Button } from "@/components/ui/button"
import { List, Heart } from "lucide-react"
import { useTranslations } from "next-intl"

export default function MyJourneysFiltersBar(props: {
  filteredCategoryIds: string[]
  showFavMode: boolean
  allCategories: Category[]
}) {
  const t = useTranslations("journeys.filters")

  const params = new URLSearchParams()
  for (const catId of props.filteredCategoryIds) {
    params.append("cat", catId)
  }
  const qs = params.toString()
  const allHref = qs ? `/my-journeys?${qs}` : "/my-journeys"
  const favHref = qs ? `/my-journeys?fav=1&${qs}` : "/my-journeys?fav=1"

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <Button
        asChild
        variant={props.showFavMode ? "cosmicTertiaryOnDark" : "cosmicSecondary"}
        size="cosmicSm"
        className="h-10 min-h-10"
      >
        <Link href={allHref} aria-current={!props.showFavMode ? "page" : undefined}>
          <List className="size-4 shrink-0" aria-hidden />
          <span className="sm:hidden">{t("showAllShort")}</span>
          <span className="hidden sm:inline">{t("showAll")}</span>
        </Link>
      </Button>

      <Button
        asChild
        variant={props.showFavMode ? "cosmicSecondary" : "cosmicTertiaryOnDark"}
        size="cosmicSm"
        className="h-10 min-h-10"
      >
        <Link href={favHref} aria-current={props.showFavMode ? "page" : undefined}>
          <Heart className="size-4 shrink-0" aria-hidden />
          <span className="sm:hidden">{t("showFavoritesShort")}</span>
          <span className="hidden sm:inline">{t("showFavorites")}</span>
        </Link>
      </Button>

      <CategoryFilterPicker categories={props.allCategories} />
    </div>
  )
}
