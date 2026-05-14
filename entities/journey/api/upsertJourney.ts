import { createSupabaseServerClient } from "@/core/supabase/server";

export async function upsertJourney(userId: string, journeyId: undefined | string, journeyTitle: string, journeyDescription: string) {
    const supabase = await createSupabaseServerClient()

    if(journeyId) {
        const { data, error } = await supabase
            .from("journeys")
            .upsert({id: journeyId, title: journeyTitle, description: journeyDescription, user_id: userId}, {onConflict: "id"})
            .select("id")
            .single()

        
            if(error) throw error
            return data.id ?? null

    } else {
        const { data, error } = await supabase
            .from("journeys")
            .insert({title: journeyTitle, description: journeyDescription, user_id: userId})
            .select("id")
            .single()
        
            if(error) throw error
            return data.id ?? null
    }
    

}