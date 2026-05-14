'use client'

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CosmicInput } from "@/shared/ui/CosmicInput"
import { CosmicTextarea } from "@/shared/ui/CosmicTextarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useState } from "react"

const formSchema = z.object({
    title: z
        .string()
        .min(3, { message: "Title must be at least 3 characters long" })
        .max(50, { message: "Title must be at most 50 characters long" }),
    description: z
        .string()
        .max(200, { message: "Description must be at most 200 characters long" })
        .optional(),
})

export default function AddNewJourneyDialog() {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: undefined,
        },
    })

    const mutation = useMutation({
        mutationFn: async ({ title, description }: { title: string; description?: string }) => {
            const response = await fetch("/api/journeys", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description: description ?? "" }),
            })

            if (!response.ok) {
                throw new Error("Failed to add journey")
            }

            const data = await response.json()
            const journeyId = data.journeyId

            if (!journeyId) {
                throw new Error("Failed to add journey")
            }

            return journeyId
        },
        onSuccess: () => {
            toast.success("Journey added")
            router.refresh()
        },
        onError: (error) => {
            const errorMessage = error instanceof Error ? error.message : String(error) ?? "Unknown error"
            toast.error(errorMessage)
        },
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        mutation.mutate(data, {
            onSuccess: () => {
                form.reset()
                setOpen(false)
            },
        })
    }

    const formId = "add-new-journey-form"

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="cosmicPrimary" size="cosmicMd">
                    <Plus className="size-4" />
                    New Journey
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Journey</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a new journey.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            id={formId}
                            className="stack-card"
                        >
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <CosmicInput placeholder="New journey" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <CosmicTextarea placeholder="Optional" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="cosmicTertiary" size="cosmicMd">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        form={formId}
                        disabled={mutation.isPending}
                        variant="cosmicPrimary"
                        size="cosmicMd"
                    >
                        {mutation.isPending ? "Saving..." : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
