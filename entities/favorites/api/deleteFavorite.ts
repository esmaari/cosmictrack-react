import { createSupabaseServerClient } from "@/core/supabase/server";

export async function deleteFavorite(journeyId: string, userId: string) {

    const supabase = await createSupabaseServerClient()

    const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("journey_id", journeyId)
        .eq("user_id", userId)

        if(error) throw error
        return true

}