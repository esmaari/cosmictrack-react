"use client"

import type { Journey, Category } from "@/shared/types/db"
import { Link } from "@/i18n/navigation"
import FavoriteToggleButton from "@/features/favorites-toggle/ui/FavoriteToggleButton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCreatedAt } from "@/lib/formatCreatedAt"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

export default function JourneysGrid(props: {
  journeys: Journey[]
  favoriteJourneyIds: string[]
  journeyCategoryRelationsMap: Map<string, string[]>
  categoryMapById: Map<string, Category>
}) {
  const tFields = useTranslations("common.fields")

  const isCategory = (c: Category | undefined): c is Category => c != null

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {props.journeys.map((journey) => {
        const categories = Array.from(
          new Set(props.journeyCategoryRelationsMap.get(journey.id) ?? []),
        )
          .map((categoryId) => props.categoryMapById.get(categoryId))
          .filter(isCategory)

        return (
          <li key={journey.id} className="relative">
            <div className="absolute right-2 top-2 z-10">
              <FavoriteToggleButton
                journeyId={journey.id}
                isFavorite={props.favoriteJourneyIds.includes(journey.id)}
              />
            </div>

            <Link
              href={`/journey/${journey.id}`}
              className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-neutral focus-visible:ring-offset-2 focus-visible:ring-offset-app"
            >
              <Card className="card-dark">
                <CardHeader className="pr-10">
                  <CardTitle>{journey.title}</CardTitle>
                  <CardDescription>
                    {journey.description || tFields("noDescription")}
                  </CardDescription>
                  <p className="text-xs text-on-dark/70">
                    {tFields("createdPrefix")}
                    {formatCreatedAt(journey.created_at)}
                  </p>
                </CardHeader>
                {categories.length > 0 && (
                  <CardContent>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <span
                          key={category.id}
                          className={cn("badge", category.color)}
                        >
                          <span className="font-medium">{category.title}</span>
                        </span>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
