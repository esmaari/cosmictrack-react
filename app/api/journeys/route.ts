import { createSupabaseServerClient } from "@/core/supabase/server";
import { deleteJourneyByJourneyId } from "@/entities/journey/api/deleteJourney";
import { NextResponse } from "next/server";
import { upsertJourney } from "@/entities/journey/api/upsertJourney";

export async function DELETE(request: Request) {
    try {
        const supabase = await createSupabaseServerClient()
        const {data: {user}} = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({error: "not allowed"}, {status: 401})
        }

        const body = await request.json()
        const { journeyId } = body

        if (!journeyId || typeof journeyId !== "string") return NextResponse.json({error: "missing id"}, {status: 400})
        
        await deleteJourneyByJourneyId(journeyId, user.id)
        
        return NextResponse.json({ok: true})

    } catch(error: unknown){
        const errorMessage = error instanceof Error ? error.message : String(error) ?? "Unknown error"
        return NextResponse.json({error: errorMessage}, {status: 500})
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createSupabaseServerClient()
        const {data: {user}} = await supabase.auth.getUser()

        if(!user) {
            return NextResponse.json({error: "not allowed"}, {status: 401})
        }

        const body = await request.json()
        const { journeyId, title, description } = body
       
        const titleTrimmed = String(title ?? "").trim()
        const descriptionTrimmed = String(description ?? "").trim()

        if(!titleTrimmed || titleTrimmed.length < 3) {
            return NextResponse.json({error: "Missing title or too short"}, {status: 400})
        }
        
        const result = await upsertJourney( user.id, journeyId, titleTrimmed, descriptionTrimmed )

        if(!result) {
            return NextResponse.json({error: "Failed to upsert journey"}, {status: 500})
        }

        return NextResponse.json({ok: true, journeyId: result})

    } catch(error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error) ?? "Unknown error"
        return NextResponse.json({error: errorMessage}, {status: 500})
    }
}