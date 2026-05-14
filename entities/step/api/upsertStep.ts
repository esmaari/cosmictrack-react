import { createSupabaseServerClient } from "@/core/supabase/server";
import type { Step } from "@/shared/types/db";

export async function upsertStep(stepPayload: Partial<Step> & { userId: string, journeyId: string }) {
    const supabase = await createSupabaseServerClient();

    const { userId, journeyId, ...rest } = stepPayload;
    const payload = {
        ...rest,
        user_id: userId,
        journey_id: journeyId,
    }

    const { data, error } = await supabase
        .from('steps')
        .upsert(payload, { onConflict: "id" }) 
        .select() // Güncellenen veya eklenen veriyi geri almak için şart
        .single(); // Tek bir obje döneceğinden eminsek

    if (error) {
        console.error("Upsert hatası:", error.message);
        throw error;
    }

    return data ?? null;
}