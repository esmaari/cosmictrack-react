import { createSupabaseServerClient } from "@/core/supabase/server";

import type { Journey } from "@/shared/types/db";

export async function getJourneysByUserId(userId: string): Promise<Journey[]> {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
        .from('journeys')
        .select('*')
        .eq("user_id", userId);

    if (error) {
        throw new Error(error.message)
    }       

    return data as Journey[]

}