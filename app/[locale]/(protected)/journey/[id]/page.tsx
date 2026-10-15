import { createSupabaseServerClient } from "@/core/supabase/server"
import { getJourneyById } from "@/entities/journey/api/journey"
import { Link, redirect } from "@/i18n/navigation"
import { getLocale, getTranslations } from "next-intl/server"
import { getStepsByJourneyId } from "@/entities/step/api/steps"
import StepsListClient from "@/features/step-save/ui/StepsListClient"
import { getCategoryIdsByJourneyId } from "@/entities/journey-category/api/getCategoryIdsByJourneyId"
import { getCategoriesByUserId } from "@/entities/category/api/getCategoriesByUserId"
import CategoriesToggleList from "@/features/journey-category-toggle/ui/CategoriesToggleList"
import AddNewCategoryFormDialog from "@/features/category-save/AddNewCategoryFormDialog"
import JourneyDetailsEditable from "@/features/journey-edit/JourneyDetailsEditable"
import AddAndEditStepFormDialog from "@/features/step-save/ui/AddAndEditStepFormDialog"
import { getFavoriteJourneyIdsByUserId } from "@/entities/favorites/api/getFavoriteJourneyIdsByUserId"
import FavoriteToggleButton from "@/features/favorites-toggle/ui/FavoriteToggleButton"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default async function JourneyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const t = await getTranslations("journeys")

  const supabase = await createSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const userId = user?.id
  if (!userId) {
    return redirect({ href: "/auth", locale: await getLocale() })
  }

  const journey = await getJourneyById(id, userId)
  const steps = await getStepsByJourneyId(id, userId)

  if (!journey) {
    return redirect({ href: "/my-journeys", locale: await getLocale() })
  }

  const assignedCategoryIds = await getCategoryIdsByJourneyId(id, userId)
  const allCategories = await getCategoriesByUserId(userId)
  const favoriteJourneyIds = await getFavoriteJourneyIdsByUserId(userId)
  const isFavorite = favoriteJourneyIds.includes(id)

  return (
    <div className="stack-section">
      <Link
        href="/my-journeys"
        className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-heading transition-colors hover:text-btn-link-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-neutral"
      >
        <ArrowLeft className="size-4" aria-hidden />
        {t("detail.backToList")}
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          <Card className="card-light">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <JourneyDetailsEditable journey={journey} />
                </div>
                <FavoriteToggleButton journeyId={journey.id} isFavorite={isFavorite} />
              </div>
            </CardContent>
          </Card>

          <section className="space-y-4" aria-labelledby="journey-steps-heading">
            <header className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <h2
                  id="journey-steps-heading"
                  className="heading-4 mb-0 text-on-dark"
                >
                  {t("detail.stepsHeading")}
                </h2>
                <div className="shrink-0">
                  <AddAndEditStepFormDialog journeyId={id} mode="add" />
                </div>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-on-dark/75">
                {t("detail.stepsHint")}
              </p>
            </header>
            <StepsListClient journeyId={id} steps={steps} />
          </section>
        </div>

        <aside aria-labelledby="journey-categories-heading">
          <Card className="card-light">
            <CardContent className="space-y-4 pt-6">
              <header className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <h2
                    id="journey-categories-heading"
                    className="heading-4 mb-0 text-primary"
                  >
                    {t("detail.categoriesHeading")}
                  </h2>
                  <div className="shrink-0">
                    <AddNewCategoryFormDialog />
                  </div>
                </div>
                <p className="text-sm leading-6 text-primary/70">
                  {t("detail.categoriesHint")}
                </p>
              </header>
              <CategoriesToggleList
                journeyId={id}
                categories={allCategories}
                assignedCategoryIds={assignedCategoryIds}
              />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
