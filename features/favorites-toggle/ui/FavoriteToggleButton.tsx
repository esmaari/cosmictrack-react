'use client'

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react"
import { useTranslations } from "next-intl"

export default function FavoriteToggleButton(props: {journeyId: string, isFavorite: boolean}) {
    
    const t = useTranslations("favorites")
    const tToast = useTranslations("common.toast")

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
                    throw new Error(payload?.error ?? t("toastAddFailed"))
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
                toast.success(t("toastAdded"))
            },
            onError: (error, _vars, ctx) => {
                if(ctx) setIsOptimisticIsFavorite(ctx.prevFav)
                const errorMessage = error instanceof Error ? error.message : String(error) ?? tToast("unknownError")
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
                throw new Error(payload?.error ?? t("toastRemoveFailed"))
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
                toast.success(t("toastRemoved"))
        },
        onError: (error, _vars, ctx) => {
            if(ctx) setIsOptimisticIsFavorite(ctx.prevFav)
            const errorMessage = error instanceof Error ? error.message : String(error) ?? tToast("unknownError")
            toast.error(errorMessage)
        }
    })

    const pending = addFavoriteMutation.isPending || removeFavoriteMutation.isPending

    const className = `
        flex items-center justify-center rounded-md transition-all duration-300 select-none
        min-h-10 min-w-10
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-neutral
        ${pending 
            ? "scale-110 opacity-70 animate-pulse"
            : "cursor-pointer hover:scale-105 active:scale-95" 
        }
    `;

    return optimisticIsFavorite ? (
        <button
            type="button"
            className={className}
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                removeFavoriteMutation.mutate()
            }}
            aria-label={t("removeAria")}
            title={t("removeTitle")}
            disabled={pending}
            aria-busy={pending}
        >
         <Heart className="size-5 fill-favorite text-favorite" />
        </button>
    ) : (
        <button
            type="button"
            className={className}
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                addFavoriteMutation.mutate()
            }}
            aria-label={t("addAria")}
            title={t("addTitle")}
            disabled={pending}
            aria-busy={pending}
        >
            <Heart className="size-5 text-favorite" />
        </button>
    )
}
