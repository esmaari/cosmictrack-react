import { createSupabaseServerClient } from "@/core/supabase/server"
import { upsertStep } from "@/entities/step/api/upsertStep"
import { deleteStep } from "@/entities/step/api/deleteStep"
import { NextResponse } from "next/server"
import {
  deleteStepBodySchema,
  parseApiBody,
  postStepBodySchema,
} from "@/shared/lib/apiSchemas"

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "not allowed" }, { status: 401 })
    }

    const parsed = parseApiBody(postStepBodySchema, await request.json())
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }

    const { journeyId, title, note, id, cards, meaning } = parsed.data

    const result = await upsertStep({
      userId: user.id,
      journeyId,
      title,
      note: note ?? undefined,
      id: id ?? undefined,
      cards: cards ?? undefined,
      meaning: meaning ?? undefined,
    })

    return NextResponse.json({ step: result })
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

    const parsed = parseApiBody(deleteStepBodySchema, await request.json())
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }

    await deleteStep(parsed.data.stepId, user.id)

    return NextResponse.json({ ok: true })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error) ?? "Unknown error"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
