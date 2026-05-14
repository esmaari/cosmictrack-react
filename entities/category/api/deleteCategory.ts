import { createSupabaseServerClient } from "@/core/supabase/server";

export async function deleteCategory(categoryId: string, userId: string) {
    const supabase = await createSupabaseServerClient()

    const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId)
        .eq("user_id", userId)

    if(error) {
        throw error
    } else {
        return true
    }
}