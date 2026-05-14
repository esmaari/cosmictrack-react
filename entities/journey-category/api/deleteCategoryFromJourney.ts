import { createSupabaseServerClient } from "@/core/supabase/server";

export async function deleteCategoryFromJourney(categoryId: string, journeyId: string, userId: string) {

   const supabase = await createSupabaseServerClient()

   const { error } = await supabase
    .from("journey_categories")
    .delete()
    .eq("category_id", categoryId)
    .eq("journey_id", journeyId)
    .eq("user_id", userId)

    if(error) throw error

    return true

}
