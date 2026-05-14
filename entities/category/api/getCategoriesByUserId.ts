import { createSupabaseServerClient } from "@/core/supabase/server";
import type { Category } from "@/shared/types";

export async function getCategoriesByUserId(userId: string): Promise<Category[]> {
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true })

    if (error) {
        throw new Error(error.message)
    }

    return data as Category[]
}
