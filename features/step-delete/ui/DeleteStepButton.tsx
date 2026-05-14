'use client'

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"

export default function DeleteStep(props: {stepId: string}) {
    const router = useRouter()
    const [pending, setPending] = useState(false)
    const handleDeleteStep = async () => {
          try{
            setPending(true)
            const result = await fetch("/api/steps", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({stepId: props.stepId})
            })
            
            if (!result.ok) {
                throw new Error("Failed to delete step")
            }

            router.refresh()
            toast.success("Step deleted")
        } catch(error: unknown){
            const errorMessage = error instanceof Error ? error.message : String(error) ?? "Unknown error"
            toast.error(errorMessage)
        } finally {
            setPending(false)
        }
    }
    return(
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    type="button"
                    disabled={pending}
                    variant="cosmicError"
                    size="cosmicSm"
                >
                    <Trash2 className="size-4" />
                    {pending ? "Deleting..." : "Delete step from this journey"}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="space-y-2">
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Step</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently remove this step from the journey. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={pending} variant="cosmicTertiary" size="cosmicMd">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="cosmicError"
                        size="cosmicMd"
                        disabled={pending}
                        onClick={() => void handleDeleteStep()}
                    >
                        {pending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
