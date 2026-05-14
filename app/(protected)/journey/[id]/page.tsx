import { createSupabaseServerClient } from "@/core/supabase/server";
import { getJourneyById } from "@/entities/journey/api/journey";
import { redirect } from "next/navigation";
import { getStepsByJourneyId } from "@/entities/step/api/steps";
import StepsListClient from "@/features/step-save/ui/StepsListClient";
import { getCategoryIdsByJourneyId } from "@/entities/journey-category/api/getCategoryIdsByJourneyId";
import { getCategoriesByUserId } from "@/entities/category/api/getCategoriesByUserId";
import CategoriesToggleList from "@/features/journey-category-toggle/ui/CategoriesToggleList";
import DeleteJourneyButton from "@/features/journey-delete/DeleteJourneyButton";
import AddNewCategoryFormDialog from "@/features/category-save/AddNewCategoryFormDialog";
import JourneyDetailsEditable from "@/features/journey-edit/JourneyDetailsEditable";
import AddAndEditStepFormDialog from "@/features/step-save/ui/AddAndEditStepFormDialog";
import { getFavoriteJourneyIdsByUserId } from "@/entities/favorites/api/getFavoriteJourneyIdsByUserId";
import FavoriteToggleButton from "@/features/favorites-toggle/ui/FavoriteToggleButton";
import { Card, CardContent } from "@/components/ui/card";


export default async function JourneyDetailPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params

    const supabase = await createSupabaseServerClient()

    const {data: {user} } = await supabase.auth.getUser() 

    if (!user) {
        redirect("/auth")
    }

    const journey = await getJourneyById(id, user.id)
    const steps = await getStepsByJourneyId(id, user.id)


    if (!journey) {
        redirect("/my-journeys")
    }

    const assignedCategoryIds = await getCategoryIdsByJourneyId(id, user.id)
    const allCategories = await getCategoriesByUserId(user.id)
    const favoriteJourneyIds = await getFavoriteJourneyIdsByUserId(user.id)
    const isFavorite = favoriteJourneyIds.includes(id)

    return (
        <div className="space-y-6">
            <header className="stack-card">
                <h1 className="heading-3 mb-0 font-semibold text-on-dark">Journey Details</h1>               
            </header>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            {/* Sol kolon: Journey detay + stepler */}
            <div className="space-y-6">
                <Card>
                    <CardContent>
                        <div className="flex items-center justify-end">
                            <FavoriteToggleButton journeyId={journey.id} isFavorite={isFavorite} />
                        </div>
                        <JourneyDetailsEditable journey={journey} />
                    </CardContent>
                </Card>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="heading-4 mb-0 text-on-dark">Steps</h2>
                        <AddAndEditStepFormDialog journeyId={id} mode="add" />
                    </div>
                    <StepsListClient journeyId={id} steps={steps} />
                </div>
            </div>

            {/* Sag kolon: Kategoriler + yeni kategori ekleme */}
            <div className="space-y-4">
               
                <Card>
                    <CardContent>
                         <div className="flex items-center justify-between">
                            <h2 className="heading-4 text-primary">Categories</h2>
                            <AddNewCategoryFormDialog />
                        </div>
                        <CategoriesToggleList journeyId={id} categories={allCategories} assignedCategoryIds={assignedCategoryIds} />
                    </CardContent>
                </Card>                
               
            </div>
            </div>
        </div>
    )
}