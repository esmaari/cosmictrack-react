"use client"

import { Step } from "@/shared/types/db"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Plus, Pencil } from "lucide-react"
import AddStepForm from "./AddStepForm"
import EditStepForm from "./EditStepForm"
import { useTranslations } from "next-intl"

export default function AddAndEditStepFormDialog(props: {
  journeyId: string
  step?: Step
  mode: "add" | "edit"
}) {
  const t = useTranslations("steps")
  const tActions = useTranslations("common.actions")
  const [open, setOpen] = useState(false)
  const [onPending, setOnPending] = useState(false)

  const onPendingChange = (data: boolean) => {
    setOnPending(data)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (onPending) return
        setOpen(next)
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={props.mode === "add" ? "cosmicPrimary" : "cosmicLinkDark"}
          size={props.mode === "add" ? "cosmicMd" : "cosmicSm"}
          aria-label={props.mode === "edit" ? t("editDialog.title") : undefined}
        >
          {props.mode === "add" ? <Plus className="size-4" /> : <Pencil className="size-4" />}
          {props.mode === "add" ? t("addButton") : null}
        </Button>
      </DialogTrigger>
      <DialogContent
        size="xl"
        className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0"
      >
        <DialogHeader className="shrink-0 border-b border-border-neutral px-6 py-4">
          <DialogTitle>
            {props.mode === "add" ? t("addDialog.title") : t("editDialog.title")}
          </DialogTitle>
          <DialogDescription>
            {props.mode === "add" ? t("addDialog.description") : t("editDialog.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          {props.mode === "add" ? (
            <AddStepForm
              journeyId={props.journeyId}
              onSaveButtonClicked={onPendingChange}
              setOpen={setOpen}
            />
          ) : (
            props.step && (
              <EditStepForm
                journeyId={props.journeyId}
                step={props.step as Step}
                onSaveButtonClicked={onPendingChange}
                setOpen={setOpen}
              />
            )
          )}
        </div>

        <DialogFooter className="shrink-0 px-6 pb-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="cosmicTertiary"
              size="cosmicMd"
              disabled={onPending}
            >
              {tActions("cancel")}
            </Button>
          </DialogClose>
          {props.mode === "edit" ? (
            <Button
              type="submit"
              form={`edit-step-form-${props.step?.id}`}
              disabled={onPending}
              variant="cosmicPrimary"
              size="cosmicMd"
            >
              {onPending ? tActions("saving") : tActions("save")}
            </Button>
          ) : (
            <Button
              type="submit"
              form="add-new-step-form"
              disabled={onPending}
              variant="cosmicPrimary"
              size="cosmicMd"
            >
              {onPending ? tActions("saving") : tActions("save")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
