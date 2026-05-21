'use client'
import { useRouter } from "next/navigation" 
import { toast } from "sonner"
import { useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"

export default function DeleteCategoryIcon(props: {categoryId: string}) {

    const t = useTranslations("categories.delete")
    const tActions = useTranslations("common.actions")
    const tToast = useTranslations("common.toast")

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
                throw new Error(t("toastFailed"))
            }

            router.refresh()
            toast.success(t("toastDeleted"))
        } catch(error: unknown) {
            if(error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error(tToast("unexpectedError"));
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
                    {pending ? tActions("deleting") : t("triggerTitle")}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="space-y-2">
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("title")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("description")}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={pending} variant="cosmicTertiary" size="cosmicMd">
                        {tActions("cancel")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="cosmicError"
                        size="cosmicMd"
                        disabled={pending}
                        onClick={() => void handleClick()}
                    >
                        {pending ? tActions("deleting") : tActions("delete")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
