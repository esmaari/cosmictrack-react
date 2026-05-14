import { createSupabaseServerClient } from "@/core/supabase/server";

export async function deleteJourneyByJourneyId(journeyId: string, userId: string) {
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase
        .from("journeys")
        .delete()
        .eq("id", journeyId)
        .eq("id", journeyId)
        .eq("user_id", userId)

    if(error) throw error

    return true

}