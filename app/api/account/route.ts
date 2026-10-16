import { createSupabaseAdminClient } from "@/core/supabase/admin"
import { createSupabaseServerClient } from "@/core/supabase/server"
import { NextResponse } from "next/server"

export async function DELETE() {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "not allowed" }, { status: 401 })
    }

    let admin
    try {
      admin = createSupabaseAdminClient()
    } catch {
      return NextResponse.json(
        {
          error:
            "Account deletion is not configured yet (missing SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY).",
        },
        { status: 503 },
      )
    }

    const userId = user.id

    const tables = [
      "favorites",
      "journey_categories",
      "steps",
      "journeys",
      "categories",
      "profiles",
    ] as const

    for (const table of tables) {
      const column = table === "profiles" ? "id" : "user_id"
      const { error } = await admin.from(table).delete().eq(column, userId)
      if (error) {
        console.error(`Failed deleting ${table}:`, error.message)
        return NextResponse.json(
          { error: `Failed to delete ${table}: ${error.message}` },
          { status: 500 },
        )
      }
    }

    const { error: deleteAuthError } = await admin.auth.admin.deleteUser(userId)
    if (deleteAuthError) {
      return NextResponse.json({ error: deleteAuthError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
