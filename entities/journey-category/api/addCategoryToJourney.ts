import { createSupabaseServerClient } from "@/core/supabase/server";

export async function addCategoryToJourney(categoryId: string, journeyId: string, userId: string) {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
        .from("journey_categories")
        .insert({
            user_id: userId,
            journey_id: journeyId,
            category_id: categoryId
        }).select()
        
    if (error) throw error
    

    return data ?? null
}