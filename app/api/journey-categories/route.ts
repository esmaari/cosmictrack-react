import { createSupabaseServerClient } from "@/core/supabase/server";
import { NextResponse } from "next/server";
import { addCategoryToJourney } from "@/entities/journey-category/api/addCategoryToJourney";
import { deleteCategoryFromJourney } from "@/entities/journey-category/api/deleteCategoryFromJourney";


export async function POST(request: Request) {
    try {
        const supabase = await createSupabaseServerClient()

        const {data: {user}} = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({error: "not allowed"}, {status: 401})
        }

        const body = await request.json()
        const {journeyId, categoryId} = body

        if (!journeyId || typeof journeyId !== "string") return NextResponse.json({ error: "Missing journeyId" }, { status: 400 })
        if (!categoryId || typeof categoryId !== "string") return NextResponse.json({ error: "Missing categoryId" }, { status: 400 })

        await addCategoryToJourney( categoryId, journeyId, user.id)

        return NextResponse.json({ ok: true })
    
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error) ?? "Unknown error"
        return NextResponse.json({error: errorMessage}, {status: 500})
    }

}

export async function DELETE(request: Request) {

    try{
        const supabase = await createSupabaseServerClient()

        const {data: {user}} = await supabase.auth.getUser()

        if(!user) {
            return NextResponse.json({error: "not allowed"}, {status: 401})
        }

        const body = await request.json()
        const {journeyId, categoryId } = body

        if (!journeyId || typeof journeyId !== "string") return NextResponse.json({ error: "Missing journeyId" }, { status: 400 })
        if (!categoryId || typeof categoryId !== "string") return NextResponse.json({ error: "Missing categoryId" }, { status: 400 })

        await deleteCategoryFromJourney(categoryId, journeyId, user.id)
        return NextResponse.json({ok: true})
        
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error) ?? "Unknown error"
        return NextResponse.json({error: errorMessage}, {status: 500})
    }
    
}