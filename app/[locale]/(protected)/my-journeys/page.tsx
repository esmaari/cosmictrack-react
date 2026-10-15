import { createSupabaseServerClient } from "@/core/supabase/server";
import { getJourneysByUserId } from "@/entities/journey/api/journeys";
import { redirect } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import AddNewJourneyDialog from "@/features/journey-save/AddNewJourneyDialog";
import { getFavoriteJourneyIdsByUserId } from "@/entities/favorites/api/getFavoriteJourneyIdsByUserId";
import { getjourneyCategoryRelationsByUserId } from "@/entities/journey-category/api/getjourneyCategoryRelationsByUserId"
import { getCategoriesByUserId } from "@/entities/category/api/getCategoriesByUserId"
import type { Category } from "@/shared/types/db"
import JourneysGrid from "@/widgets/my-journeys/ui/JourneysGrid";
import MyJourneysFiltersBar from "@/features/category-filter/ui/MyJourneysFiltersBar";
import JourneySearchInput from "@/features/category-filter/ui/JourneySearchInput";


export default async function MyJourneys(props: { searchParams: Promise<{ fav?: string; cat?: string | string[]; q?: string}> }) { 

    const { fav, cat, q } = await props.searchParams
    const showFavMode = fav === "1" 
    const catParam = cat ?? ""
    const searchQuery = q ?? ""   
    const filteredCategoryIds = Array.isArray(catParam)
        ? catParam
        : catParam
        ? [catParam]
        : [];

    const t = await getTranslations("journeys")

    const supabase = await createSupabaseServerClient()

    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id
    if (!userId) {
        return redirect({ href: "/auth", locale: await getLocale() })
    }

    const journeys = await getJourneysByUserId(userId)

    const favoriteJourneyIds = await getFavoriteJourneyIdsByUserId(userId)

    const visibleJourneys = showFavMode 
        ? journeys.filter(j => favoriteJourneyIds.includes(j.id)) 
        : journeys;
    
    const journeyCategoryRelations = await getjourneyCategoryRelationsByUserId(userId)

    const allCategories = await getCategoriesByUserId(userId)

    const categoryMapById = new Map<string, Category>(allCategories.map(c => [c.id, c]))

    const journeyCategoryRelationsMap = new Map<string, string[]>()

    for (const row of journeyCategoryRelations) {
        const journeyId = row.journey_id as string
        const categoryId = row.category_id as string

        const existingCategoryIds = journeyCategoryRelationsMap.get(journeyId)
        
        if (existingCategoryIds) {
            existingCategoryIds.push(categoryId)
        } else {
            journeyCategoryRelationsMap.set(journeyId, [categoryId])
        }
    }

    const categoryFilteredJourneys = filteredCategoryIds.length > 0
        ? visibleJourneys.filter((journey) => {
            const journeyCatIds = journeyCategoryRelationsMap.get(journey.id) ?? [];
            return filteredCategoryIds.every((id) => journeyCatIds.includes(id));
        })
        : visibleJourneys

    const searchFilteredJourneys = searchQuery
        ? categoryFilteredJourneys.filter(journey => 
            journey.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : categoryFilteredJourneys;

    const emptyMyJourneysCopy = (() => {
        if (journeys.length === 0) {
            return { title: t("empty.none.title"), hint: t("empty.none.hint") }
        }
        if (showFavMode && favoriteJourneyIds.length === 0) {
            return { title: t("empty.noFavorites.title"), hint: t("empty.noFavorites.hint") }
        }
        if (showFavMode) {
            return { title: t("empty.favoritesNoMatch.title"), hint: t("empty.favoritesNoMatch.hint") }
        }
        if (searchQuery.trim()) {
            return { title: t("empty.searchNoMatch.title"), hint: t("empty.searchNoMatch.hint") }
        }
        if (filteredCategoryIds.length > 0) {
            return { title: t("empty.categoriesNoMatch.title"), hint: t("empty.categoriesNoMatch.hint") }
        }
        return { title: t("empty.default.title"), hint: t("empty.default.hint") }
    })()

    return (
        <div className="stack-section">
            <header className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                    <h1 className="heading-3 mb-0 font-semibold text-on-dark">{t("pageTitle")}</h1>
                    <div className="shrink-0">
                        <AddNewJourneyDialog />
                    </div>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-on-dark/80">{t("pageSubtitle")}</p>
            </header>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <JourneySearchInput />
                <MyJourneysFiltersBar
                    filteredCategoryIds={filteredCategoryIds}
                    showFavMode={showFavMode}
                    allCategories={allCategories}
                />
            </div>

            {searchFilteredJourneys.length === 0 ? (
                <div className="stack-card rounded-xl border border-white/10 bg-app-darker/50 px-6 py-12 text-center">
                    <p className="heading-4 mb-0 font-semibold text-on-dark">{emptyMyJourneysCopy.title}</p>
                    <p className="text-sm text-on-dark/80">{emptyMyJourneysCopy.hint}</p>
                    {journeys.length === 0 ? (
                        <div className="flex justify-center pt-2">
                            <AddNewJourneyDialog />
                        </div>
                    ) : null}
                </div>
            ) : (
                <JourneysGrid
                    journeys={searchFilteredJourneys}
                    favoriteJourneyIds={favoriteJourneyIds}
                    journeyCategoryRelationsMap={journeyCategoryRelationsMap}
                    categoryMapById={categoryMapById}
                />
            )}
        </div>
    )
}
