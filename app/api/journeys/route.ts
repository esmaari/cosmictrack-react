import { createSupabaseServerClient } from "@/core/supabase/server"
import { deleteJourneyByJourneyId } from "@/entities/journey/api/deleteJourney"
import { NextResponse } from "next/server"
import { upsertJourney } from "@/entities/journey/api/upsertJourney"
import {
  deleteJourneyBodySchema,
  parseApiBody,
  postJourneyBodySchema,
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

    const parsed = parseApiBody(deleteJourneyBodySchema, await request.json())
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }

    await deleteJourneyByJourneyId(parsed.data.journeyId, user.id)

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

    const parsed = parseApiBody(postJourneyBodySchema, await request.json())
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }

    const { journeyId, title, description } = parsed.data

    const result = await upsertJourney(
      user.id,
      journeyId ?? undefined,
      title,
      description ?? "",
    )

    if (!result) {
      return NextResponse.json({ error: "Failed to upsert journey" }, { status: 500 })
    }

    return NextResponse.json({ ok: true, journeyId: result })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error) ?? "Unknown error"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
