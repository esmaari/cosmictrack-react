import { createSupabaseServerClient } from "@/core/supabase/server";

export async function addFavorite(journeyId: string, userId: string) {

    const supabase = await createSupabaseServerClient()

    const { error } = await supabase
        .from("favorites")
        .insert({journey_id: journeyId, user_id: userId})

        if(error) throw error
        return true

}