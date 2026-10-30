import { createSupabaseServerClient } from "@/core/supabase/server"
import { NextResponse } from "next/server"
import { deleteCategory } from "@/entities/category/api/deleteCategory"
import { upsertCategory } from "@/entities/category/api/upsertCategory"
import {
  deleteCategoryBodySchema,
  parseApiBody,
  postCategoryBodySchema,
} from "@/shared/lib/apiSchemas"

export async function DELETE(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "not allowed" }, { status: 401 })
    }

    const parsed = parseApiBody(deleteCategoryBodySchema, await request.json())
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }

    const result = await deleteCategory(parsed.data.categoryId, user.id)

    if (!result) {
      return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error) ?? "Unknown error"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "not allowed" }, { status: 401 })
    }

    const parsed = parseApiBody(postCategoryBodySchema, await request.json())
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }

    const { categoryId, categoryName, categoryColor, categoryDescription } = parsed.data

    const result = await upsertCategory({
      categoryId: categoryId ?? undefined,
      categoryName,
      categoryColor,
      categoryDescription:
        typeof categoryDescription === "string" ? categoryDescription : null,
      userId: user.id,
    })

    if (!result) {
      return NextResponse.json({ error: "Failed to add category" }, { status: 500 })
    }

    return NextResponse.json({ ok: true, categoryId: result?.id ?? null })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error) ?? "Unknown error"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
