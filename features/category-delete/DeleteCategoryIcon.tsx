'use client'
import { useRouter } from "next/navigation" 
import { toast } from "sonner"
import { useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export default function DeleteCategoryIcon(props: {categoryId: string}) {

    const router = useRouter()
    const [pending, setPending] = useState(false)
    const handleClick = async () => {
        try{
            setPending(true)
            const response = await fetch("/api/categories", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },            
                body: JSON.stringify({categoryId: props.categoryId})
            })

            if(!response.ok) {
                throw new Error("Failed to delete category")
            }

            router.refresh()
            toast.success("Category deleted")
        } catch(error: unknown) {
            if(error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Unexpected error occurred");
            }
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
                    {pending ? "Deleting..." : "Delete category"}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="space-y-2">
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Category</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently remove this category. This action cannot be undone.
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
                        onClick={() => void handleClick()}
                    >
                        {pending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}