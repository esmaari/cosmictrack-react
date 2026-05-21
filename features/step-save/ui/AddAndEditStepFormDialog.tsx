'use client'

import { Step } from "@/shared/types/db"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Plus, Pencil } from "lucide-react"
import AddStepForm from "./AddStepForm"
import EditStepForm from "./EditStepForm"
import { useTranslations } from "next-intl"

export default function AddAndEditStepFormDialog(props: {journeyId: string, step?: Step, mode: "add" | "edit"}) {
    const t = useTranslations("steps")
    const tActions = useTranslations("common.actions")
    const [open, setOpen] = useState(false)
    const [onPending, setOnPending] = useState(false)
    const onPendingChange = (data: boolean) => {
        setOnPending(data)
    }

    return(

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant={props.mode === "add" ? "cosmicLinkLight" : "cosmicLinkDark"} size="cosmicSm">
                    {props.mode === "add" ? <Plus className="size-4" /> : <Pencil className="size-4" />}
                    {props.mode === "add" ? t("addButton") : ""}
                </Button>
            </DialogTrigger>
            <DialogContent
                className="max-h-[90vh] w-full max-w-[min(1100px,calc(100vw-2rem))] overflow-y-auto sm:max-w-[min(1100px,calc(100vw-2rem))]"
            >
    
                <DialogHeader>
                    <DialogTitle>{props.mode === "add" ? t("addDialog.title") : t("editDialog.title")}</DialogTitle>
                <DialogDescription>
                    {props.mode === "add" ? t("addDialog.description") : t("editDialog.description")}
                </DialogDescription>
                </DialogHeader>
                    <div className="min-w-0 py-4">
                        {props.mode === "add" 
                        ? <AddStepForm journeyId={props.journeyId} onSaveButtonClicked={onPendingChange} setOpen={setOpen} /> 
                        : props.step && <EditStepForm journeyId={props.journeyId} step={props.step as Step} onSaveButtonClicked={onPendingChange} setOpen={setOpen} />}

                    </div>

                <DialogFooter>
                    <DialogClose asChild>   
                        <Button type="button" variant="cosmicTertiary" size="cosmicMd">{tActions("cancel")}</Button>
                    </DialogClose>
                    {props.mode === "edit" 
                        ? <Button type="submit" form={`edit-step-form-${props.step?.id}`} disabled={onPending} variant="cosmicPrimary" size="cosmicMd">
                            { onPending 
                            ? tActions("saving") 
                            : tActions("save") }
                        </Button>   
                        : <Button type="submit" form="add-new-step-form" disabled={onPending} variant="cosmicPrimary" size="cosmicMd">
                            { onPending 
                            ? tActions("saving") 
                            : tActions("save") }
                        </Button>}
                  
                </DialogFooter>

            </DialogContent>
    </Dialog>
    )  
    
}
