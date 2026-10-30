import { createSupabaseServerClient } from "@/core/supabase/server"
import { NextResponse } from "next/server"
import { addCategoryToJourney } from "@/entities/journey-category/api/addCategoryToJourney"
import { deleteCategoryFromJourney } from "@/entities/journey-category/api/deleteCategoryFromJourney"
import { journeyCategoryBodySchema, parseApiBody } from "@/shared/lib/apiSchemas"

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "not allowed" }, { status: 401 })
    }

    const parsed = parseApiBody(journeyCategoryBodySchema, await request.json())
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }

    const { journeyId, categoryId } = parsed.data
    await addCategoryToJourney(categoryId, journeyId, user.id)

    return NextResponse.json({ ok: true })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error) ?? "Unknown error"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "not allowed" }, { status: 401 })
    }

    const parsed = parseApiBody(journeyCategoryBodySchema, await request.json())
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }

    const { journeyId, categoryId } = parsed.data
    await deleteCategoryFromJourney(categoryId, journeyId, user.id)
    return NextResponse.json({ ok: true })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error) ?? "Unknown error"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
