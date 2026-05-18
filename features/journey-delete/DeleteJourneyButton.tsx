'use client'

import { useRouter } from "@/i18n/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"

export default function DeleteJourneyButton(props: {journeyId: string}) {

    const router = useRouter()
    const [pending, setPending] = useState(false)
    const handleDeleteJourney = async () => {
        try {
            setPending(true)
            const response = await fetch("/api/journeys", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({journeyId: props.journeyId})
            }) 

            if (!response.ok) {
                const payload = await response.json().catch(() => null)
                throw new Error(payload?.error ?? "Failed to delete journey")
            }

            router.push("/my-journeys")
            toast.success("Journey deleted")      
        } catch (error: unknown) { 
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("Unexpected error occurred")
            }
        } finally {
            setPending(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    type="button"
                    disabled={pending}
                    variant="cosmicError"
                >
                    <Trash2 className="w-4 h-4" />
                    {pending ? "Deleting..." : "Delete Journey"}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Journey</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this journey?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={pending} variant="cosmicTertiary">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="cosmicError"
                        size="cosmicMd"
                        disabled={pending}
                        onClick={() => void handleDeleteJourney()}
                    >
                        {pending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}