"use client"

import { useRouter } from "@/i18n/navigation"
import { toast } from "sonner"
import { useMemo, useState } from "react"
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
import { CosmicInput } from "@/shared/ui/CosmicInput"
import { createSupabaseBrowserClient } from "@/core/supabase/browser"
import { useTranslations } from "next-intl"

export default function DeleteAccountButton(props: { email: string }) {
  const t = useTranslations("profile.deleteAccount")
  const tActions = useTranslations("common.actions")
  const tToast = useTranslations("common.toast")
  const router = useRouter()
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])

  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [confirmText, setConfirmText] = useState("")

  const canConfirm = confirmText.trim().toLowerCase() === props.email.trim().toLowerCase()

  const handleDelete = async () => {
    if (!canConfirm) return
    try {
      setPending(true)
      const response = await fetch("/api/account", { method: "DELETE" })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error ?? t("toastFailed"))
      }

      await supabase.auth.signOut()
      setOpen(false)
      toast.success(t("toastDeleted"))
      router.push("/")
      router.refresh()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : tToast("unexpectedError"))
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
        if (!next) setConfirmText("")
      }}
    >
      <AlertDialogTrigger asChild>
        <Button type="button" variant="cosmicError" size="cosmicMd">
          {t("button")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2 px-1">
          <p className="text-sm text-primary/80">{t("confirmHint", { email: props.email })}</p>
          <CosmicInput
            type="email"
            autoComplete="off"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={props.email}
            disabled={pending}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending} variant="cosmicTertiary" size="cosmicMd">
            {tActions("cancel")}
          </AlertDialogCancel>
          <Button
            type="button"
            variant="cosmicError"
            size="cosmicMd"
            disabled={pending || !canConfirm}
            onClick={() => void handleDelete()}
          >
            {pending ? tActions("deleting") : t("confirm")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
