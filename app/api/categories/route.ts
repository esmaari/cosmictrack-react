import { createSupabaseServerClient } from "@/core/supabase/server";
import { NextResponse } from "next/server";
import { deleteCategory } from "@/entities/category/api/deleteCategory";
import { upsertCategory } from "@/entities/category/api/upsertCategory";

export async function DELETE(request: Request) {

    try {
        const supabase = await createSupabaseServerClient()
        const {data: {user}} = await supabase.auth.getUser()

        if(!user) {
            return NextResponse.json({error: "not allowed"}, {status: 401})
        }

        const body = await request.json()
        const { categoryId } = body

        if(!categoryId) {
            return NextResponse.json({error: "Category Id doesn't exist"}, {status: 400})
        }

        const result = await deleteCategory(categoryId, user.id)
        
        if(!result) {
            return NextResponse.json({error: "Failed to delete category"}, {status: 500})
        }

        return NextResponse.json({ok: true})
    
    } catch(error: unknown) {
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
        const { categoryId, categoryName, categoryColor } = body

        if(!categoryName) {
            return NextResponse.json({error: "Category Name doesn't exist"}, {status: 400})
        }

        if(!categoryColor) {
            return NextResponse.json({error: "Category Color doesn't exist"}, {status: 400})
        }

        const result = await upsertCategory({categoryId: categoryId, categoryName: categoryName, categoryColor: categoryColor, userId: user.id})   


        if(!result) {
            return NextResponse.json({error: "Failed to add category"}, {status: 500})
        }

        return NextResponse.json({ok: true, categoryId: result?.id ?? null})

    } catch(error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error) ?? "Unknown error"
        return NextResponse.json({error: errorMessage}, {status: 500})
    }
        

}