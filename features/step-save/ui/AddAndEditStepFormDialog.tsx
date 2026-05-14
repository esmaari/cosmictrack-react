'use client'

import { Step } from "@/shared/types/db"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Plus, Pencil } from "lucide-react"
import AddStepForm from "./AddStepForm"
import EditStepForm from "./EditStepForm"

export default function AddAndEditStepFormDialog(props: {journeyId: string, step?: Step, mode: "add" | "edit"}) {

    const [onPending, setOnPending] = useState(false)
    const onPendingChange = (data: boolean) => {
        setOnPending(data)
    }

    return(

        <Dialog>
            <DialogTrigger asChild>
                <Button type="button" variant={props.mode === "add" ? "cosmicLinkLight" : "cosmicLinkDark"} size="cosmicSm">
                    {props.mode === "add" ? <Plus className="size-4" /> : <Pencil className="size-4" />}
                    {props.mode === "add" ? "Add Step" : ""}
                </Button>
            </DialogTrigger>
            <DialogContent
                className={
                    props.mode === "add"
                        ? "max-h-[90vh] w-full max-w-[min(1100px,calc(100vw-2rem))] overflow-y-auto sm:max-w-[min(1100px,calc(100vw-2rem))]"
                        : undefined
                }
            >
    
                <DialogHeader>
                    <DialogTitle>{props.mode === "add" ? "Add New Step" : "Edit Step"}</DialogTitle>
                <DialogDescription>
                    Fill in the details below to {props.mode === "add" ? "create a new step" : "edit the step"}.
                </DialogDescription>
                </DialogHeader>
                    <div className="min-w-0 py-4">
                        {props.mode === "add" 
                        ? <AddStepForm journeyId={props.journeyId} onSaveButtonClicked={onPendingChange} /> 
                        : props.step && <EditStepForm journeyId={props.journeyId} step={props.step as Step} onSaveButtonClicked={onPendingChange}/>}

                    </div>

                <DialogFooter>
                    <DialogClose asChild>   
                        <Button type="button" variant="cosmicTertiary" size="cosmicMd">Cancel</Button>
                    </DialogClose>
                    {props.mode === "edit" 
                        ? <Button type="submit" form={`edit-step-form-${props.step?.id}`} disabled={onPending} variant="cosmicPrimary" size="cosmicMd">
                            { onPending 
                            ? "Saving..." 
                            : "Save" }
                        </Button>   
                        : <Button type="submit" form="add-new-step-form" disabled={onPending} variant="cosmicPrimary" size="cosmicMd">
                            { onPending 
                            ? "Saving..." 
                            : "Save" }
                        </Button>}
                  
                </DialogFooter>

            </DialogContent>
    </Dialog>
    )  
    
}