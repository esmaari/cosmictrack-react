import { createSupabaseServerClient } from "@/core/supabase/server";
import type { Step } from "@/shared/types";

export async function getStepsByJourneyId(journeyId: string, userId: string): Promise<Step[]> {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
        .from("steps")
        .select("*")
        .eq("journey_id", journeyId)
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

    if(error) throw error;

    return data ?? [] as Step[];
}