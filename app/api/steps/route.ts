import { createSupabaseServerClient } from "@/core/supabase/server";
import { upsertStep } from "@/entities/step/api/upsertStep";
import { deleteStep } from "@/entities/step/api/deleteStep";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({error: "not allowed"}, {status: 401})
        }

        const body = await request.json();
        const { journeyId, title, note, id, cards, meaning } = body;

        if (!journeyId || typeof journeyId !== "string") return NextResponse.json({ error: "Missing journeyId" }, { status: 400 })
        if (!title || typeof title !== "string" || title.trim().length === 0) return NextResponse.json({ error: "Invalid title" }, { status: 400 })

        const result = await upsertStep({ userId: user.id, journeyId, title: title.trim(), note, id, cards, meaning })

        return NextResponse.json({step: result})
    
    
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error) ?? "Unknown error"
        return NextResponse.json({error: errorMessage}, {status: 500})
    }
}

export async function DELETE(request: Request) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();

         if (!user) {
            return NextResponse.json({error: "not allowed"}, {status: 401})
        }

        const body = await request.json();
        const { stepId } = body;
        
        if (!stepId || typeof stepId !== "string") return NextResponse.json({ error: "Missing stepId" }, { status: 400 })

        await deleteStep(stepId, user.id)

        return NextResponse.json({ok: true})


    } catch(error: unknown){
        const errorMessage = error instanceof Error ? error.message : String(error) ?? "Unknown error"
        return NextResponse.json({error: errorMessage}, {status: 500})
    }
}