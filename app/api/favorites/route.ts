import { createSupabaseServerClient } from "@/core/supabase/server";
import { NextResponse } from "next/server";

import { addFavorite } from "@/entities/favorites/api/addFavorite";
import { deleteFavorite } from "@/entities/favorites/api/deleteFavorite";

export async function POST(request: Request) {
     try {
        const supabase = await createSupabaseServerClient()
        const {data: {user}} = await supabase.auth.getUser()

        if(!user) {
            return NextResponse.json({error: "not allowed"}, {status: 401})
        }

        const body = await request.json()
        const { journeyId } = body

        if(!journeyId) {
            return NextResponse.json({error: "missing journey id"}, {status: 400})
        }

        await addFavorite(journeyId, user.id)

        return NextResponse.json({ok: true})


    } catch(error: unknown) {
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
        const { journeyId } = body

        if(!journeyId) {
            return NextResponse.json({error: "missing journey id"}, {status: 400})
        }

        await deleteFavorite(journeyId, user.id)

        return NextResponse.json({ok: true})

    } catch(error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error) ?? "Unknown error"
        return NextResponse.json({error: errorMessage}, {status: 500})
    }
}


