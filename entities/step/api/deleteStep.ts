import { createSupabaseServerClient } from "@/core/supabase/server";

export async function deleteStep(stepId: string, userId: string) {
    const supabase = await createSupabaseServerClient();

    const {data, error} = await supabase
        .from('steps')
        .delete()
        .eq('id', stepId)
        .eq('user_id', userId)

      if (error) {
        console.error("Delete step hatası:", error.message);
        throw error;
    }

    return data ?? null;
}