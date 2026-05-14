import { createSupabaseServerClient } from "@/core/supabase/server";
import type { Journey } from "@/shared/types/db";

export async function getJourneyById(id: string, userId: string): Promise<Journey | null> {

    const supabase = await createSupabaseServerClient()

    const {data, error} = await supabase
        .from("journeys")
        .select("*")
        .eq("id", id)
        .eq("user_id", userId)
        .single()

    if (error) throw error

    return data ?? null
}
