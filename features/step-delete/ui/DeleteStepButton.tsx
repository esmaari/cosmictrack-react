"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"

export default function DeleteStep(props: {
  stepId: string
  onDeleted?: () => void
}) {
  const t = useTranslations("steps.delete")
  const tActions = useTranslations("common.actions")
  const tToast = useTranslations("common.toast")

  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  const handleDeleteStep = async () => {
    try {
      setPending(true)
      const result = await fetch("/api/steps", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepId: props.stepId }),
      })

      if (!result.ok) {
        throw new Error(t("toastFailed"))
      }

      setOpen(false)
      props.onDeleted?.()
      router.refresh()
      toast.success(t("toastDeleted"))
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error) ?? tToast("unknownError")
      toast.error(errorMessage)
    } finally {
      setPending(false)
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (pending) return
        setOpen(next)
      }}
    >
      <AlertDialogTrigger asChild>
        <Button type="button" disabled={pending} variant="cosmicError" size="cosmicSm">
          <Trash2 className="size-4" />
          {pending ? tActions("deleting") : t("triggerTitle")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("button")}</AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending} variant="cosmicTertiary" size="cosmicMd">
            {tActions("cancel")}
          </AlertDialogCancel>
          <Button
            type="button"
            variant="cosmicError"
            size="cosmicMd"
            disabled={pending}
            onClick={() => void handleDeleteStep()}
          >
            {pending ? tActions("deleting") : tActions("delete")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
