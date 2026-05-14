import { createSupabaseServerClient } from "@/core/supabase/server"

export async function getFavoriteJourneyIdsByUserId(userId: string): Promise<string[]> {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
        .from("favorites")
        .select("journey_id")
        .eq("user_id", userId)

    if(error) throw error

    return data?.map((favorite) => favorite.journey_id) ?? []
}