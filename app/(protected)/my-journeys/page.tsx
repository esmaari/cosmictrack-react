import { createSupabaseServerClient } from "@/core/supabase/server";
import { getJourneysByUserId } from "@/entities/journey/api/journeys";
import { redirect } from "next/navigation";
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

    const supabase = await createSupabaseServerClient()

    const {data: {user} } = await supabase.auth.getUser() 

    if (!user) {
        redirect("/auth")
    }

    // Bu liste: kullanıcının sahip olduğu tüm journey kayıtları (SSR'da DB'den okunur).
    const journeys = await getJourneysByUserId(user.id)

    // Bu liste: kullanıcının favori yaptığı journey'lerin sadece id listesi (filter + UI state için yeterli).
    const favoriteJourneyIds = await getFavoriteJourneyIdsByUserId(user.id)

    // Bu liste: ekranda gösterilecek journey'ler (URL'deki fav=1 moduna göre tümü veya sadece favoriler).
    const visibleJourneys = showFavMode 
        ? journeys.filter(j => favoriteJourneyIds.includes(j.id)) 
        : journeys;
    
    // Bu liste: kullanıcıya ait tüm journey↔category ilişki satırları (N+1 olmaması için tek sorgu).
    const journeyCategoryRelations = await getjourneyCategoryRelationsByUserId(user.id)

    // Bu liste: kullanıcının oluşturduğu tüm category kayıtları (chip render etmek için title/color lazım).
    const allCategories = await getCategoriesByUserId(user.id)

    // Bu map: categoryId -> Category lookup (chip basarken hızlı erişim).
    const categoryMapById = new Map<string, Category>(allCategories.map(c => [c.id, c]))

    // Bu map: journeyId -> categoryId[] lookup (her journey kartına bağlı kategorileri hızlı bulmak için).
    const journeyCategoryRelationsMap = new Map<string, string[]>()

    for (const row of journeyCategoryRelations) {
        const journeyId = row.journey_id as string
        const categoryId = row.category_id as string

        // Bu liste: ilgili journey için biriken categoryId'ler (aynı journey'e yeni id eklemek için).
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
            return {
                title: "No journeys yet",
                hint: "Add your first journey with the New journey button (top right).",
            }
        }
        if (showFavMode && favoriteJourneyIds.length === 0) {
            return {
                title: "No favorites yet",
                hint: "Open a journey and tap the star to save it here.",
            }
        }
        if (showFavMode) {
            return {
                title: "No favorite journeys match",
                hint: "Try turning off favorites-only or pick another filter.",
            }
        }
        if (searchQuery.trim()) {
            return {
                title: "No journeys match your search",
                hint: "Try a different title keyword or clear the search.",
            }
        }
        if (filteredCategoryIds.length > 0) {
            return {
                title: "No journeys match these categories",
                hint: "Remove a category chip or add those categories to a journey.",
            }
        }
        return {
            title: "Nothing to show",
            hint: "Adjust filters or add a new journey.",
        }
    })()

    return (
        <div className="stack-section">
            <header className="stack-card">
                <h1 className="heading-3 mb-0 font-semibold text-on-dark">My Journeys</h1>
                <div className="stack-row justify-between">
                    <p className="sm text-light">Your saved journeys.</p>
                    <AddNewJourneyDialog />
                </div>
            </header>

            {/* Toolbar: arama + filtreler */}
            <div className="stack-row justify-between">
                <JourneySearchInput />
                <MyJourneysFiltersBar
                    filteredCategoryIds={filteredCategoryIds}
                    showFavMode={showFavMode}
                    allCategories={allCategories}
                />
            </div>

            {/* Journey listesi veya bos durum */}
            {searchFilteredJourneys.length === 0 ? (
                <div className="stack-card rounded-xl border border-white/10 bg-app-darker/50 px-6 py-12 text-center">
                    <p className="heading-4 mb-0 font-semibold text-on-dark">{emptyMyJourneysCopy.title}</p>
                    <p className="text-sm text-light">{emptyMyJourneysCopy.hint}</p>
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