import { createSupabaseServerClient } from "@/core/supabase/server";

export async function getCategoryIdsByJourneyId(journeyId: string, userId: string): Promise<Array<string>> {
    
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
        .from('journey_categories')
        .select('category_id')
        .eq("user_id", userId)
        .eq("journey_id", journeyId)

        if(error) throw error

        return data?.map(c => c.category_id) || [];
    
}