'use client'

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react"

export default function FavoriteToggleButton(props: {journeyId: string, isFavorite: boolean}) {
    
    const router = useRouter()
                
    const [optimisticIsFavorite, setIsOptimisticIsFavorite] = useState(props.isFavorite)

    useEffect(() => {
        // eslint-disable-next-line
        setIsOptimisticIsFavorite(props.isFavorite)
    },[props.isFavorite])

    const addFavoriteMutation = useMutation({
        mutationFn: async () => {
                const response = await fetch("/api/favorites", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({journeyId: props.journeyId})   
                })

                if(!response.ok) {
                    const payload = await response.json().catch(() => null)
                    throw new Error(payload?.error ?? "Failed to add Journey to the favorites")
                }
                return true
            },
            onMutate: async () => {

                let prevFav: boolean = false
                
                setIsOptimisticIsFavorite((prev) => {
                    prevFav = prev
                    return true
                })

                return { prevFav }
            },
            onSuccess: () => {
                router.refresh()
                toast.success("Journey added to favorites")
            },
            onError: (error, _vars, ctx) => {
                if(ctx) setIsOptimisticIsFavorite(ctx.prevFav)
                const errorMessage = error instanceof Error ? error.message : String(error) ?? "Unknown error"
                toast.error(errorMessage)
            }
    })

    const removeFavoriteMutation = useMutation({
        mutationFn: async () =>  {
            const response = await fetch("/api/favorites", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({journeyId: props.journeyId})
            })

            if(!response.ok) {
                const payload = await response.json().catch(() => null)
                throw new Error(payload?.error ?? "Failed to delete Journey from the favorites")
            }

            return true
        },
        onMutate: async () => {

                let prevFav: boolean = true
                
                setIsOptimisticIsFavorite((prev) => {
                    prevFav = prev
                    return false
                })

                return { prevFav }
        },
        onSuccess: () => {
                router.refresh()
                toast.success("Journey removed from favorites")
        },
        onError: (error, _vars, ctx) => {
            if(ctx) setIsOptimisticIsFavorite(ctx.prevFav)
            const errorMessage = error instanceof Error ? error.message : String(error) ?? "Unknown error"
            toast.error(errorMessage)
        }
    })

    const pending = addFavoriteMutation.isPending || removeFavoriteMutation.isPending

    const className = `
        flex items-center justify-center transition-all duration-300 select-none
        h-6 w-6
        ${pending 
            ? "scale-125 opacity-70 animate-pulse"
            : "cursor-pointer hover:scale-110 active:scale-90" 
        }
    `;

    return optimisticIsFavorite ? (
        <button
            type="button"
            className={className}
            onClick={() => removeFavoriteMutation.mutate()}
            aria-label="Remove from favorites"
            title="Unfavorite"
            disabled={pending}
            aria-busy={pending}

        >
         <Heart className="size-5 fill-favorite text-favorite" />
        </button>
    ) : (
        <button
            type="button"
            className={className}
            onClick={() => addFavoriteMutation.mutate()}
            aria-label="Add to favorites"
            title="Favorite"
            disabled={pending}
            aria-busy={pending}

        >
            <Heart className="size-5 text-favorite" />
        </button>
    )
}