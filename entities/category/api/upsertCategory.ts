import { createSupabaseServerClient } from "@/core/supabase/server"

export async function upsertCategory(CatPayload: {
  categoryId?: undefined | string
  categoryName: string
  categoryColor: string
  categoryDescription?: string | null
  userId: string
}) {
  const supabase = await createSupabaseServerClient()
  const description =
    CatPayload.categoryDescription?.trim() ? CatPayload.categoryDescription.trim() : null

  if (CatPayload.categoryId?.trim() !== "" && CatPayload.categoryId !== undefined) {
    const { data, error } = await supabase
      .from("categories")
      .upsert(
        {
          id: CatPayload.categoryId,
          title: CatPayload.categoryName,
          color: CatPayload.categoryColor,
          description,
          user_id: CatPayload.userId,
        },
        { onConflict: "id" },
      )
      .select()
      .single()

    if (error) throw error
    return data ?? null
  }

  const { data, error } = await supabase
    .from("categories")
    .insert({
      title: CatPayload.categoryName,
      color: CatPayload.categoryColor,
      description,
      user_id: CatPayload.userId,
    })
    .select()
    .single()

  if (error) throw error
  return data ?? null
}
