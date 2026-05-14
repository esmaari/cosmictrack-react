import { createSupabaseServerClient } from "@/core/supabase/server";

export async function getjourneyCategoryRelationsByUserId(userId: string) {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
        .from("journey_categories")
        .select("*")    
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

    if(error) throw error

    return data ?? []
}