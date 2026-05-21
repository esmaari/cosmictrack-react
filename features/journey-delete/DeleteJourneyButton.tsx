'use client'

import { useRouter } from "@/i18n/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"

export default function DeleteJourneyButton(props: {journeyId: string}) {

    const t = useTranslations("journeys.delete")
    const tActions = useTranslations("common.actions")
    const tToast = useTranslations("common.toast")

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
                throw new Error(payload?.error ?? t("toastFailed"))
            }

            router.push("/my-journeys")
            toast.success(t("toastDeleted"))      
        } catch (error: unknown) { 
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error(tToast("unexpectedError"))
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
                    {pending ? tActions("deleting") : t("button")}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("title")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("description")}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={pending} variant="cosmicTertiary">
                        {tActions("cancel")}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="cosmicError"
                        size="cosmicMd"
                        disabled={pending}
                        onClick={() => void handleDeleteJourney()}
                    >
                        {pending ? tActions("deleting") : tActions("delete")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
