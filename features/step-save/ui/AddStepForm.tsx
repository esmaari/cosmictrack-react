'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CosmicInput } from "@/shared/ui/CosmicInput"
import { CosmicTextarea } from "@/shared/ui/CosmicTextarea"
import CardPicker from "./CardPicker"

export default function AddStepForm(props: {journeyId: string, onSaveButtonClicked?: (pending: boolean) => void }) {
    const [selectedCards, setSelectedCards] = useState<number[]>([])
    const router = useRouter()

    const formSchema = z.object({
        title: z.string().min(1, { message: "Title is required" }).max(80, { message: "Title must be at most 80 characters long" }),
        note: z.string().max(500, { message: "Note must be at most 500 characters long" }).optional(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            note: "",
        },
    })

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema> & { cards: number[] }) => {
            const response = await fetch("/api/steps", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    journeyId: props.journeyId,
                    title: values.title.trim(),
                    note: values.note?.trim() ?? "",
                    meaning: "",
                    cards: values.cards,
                }),
            })

            if (!response.ok) {
                const payload = await response.json().catch(() => null)
                throw new Error(payload?.error ?? "Failed to add step")
            }

            return true
        },
        onSuccess: () => {
            router.refresh()
            toast.success("Step added")
        },
        onError: (error) => {
            const errorMessage = error instanceof Error ? error.message : String(error) ?? "Unknown error"
            toast.error(errorMessage)
        },
        onMutate: () => {
            props.onSaveButtonClicked?.(true)
        },
        onSettled: () => {
            props.onSaveButtonClicked?.(false)
        }
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        mutation.mutate(
            { ...values, cards: selectedCards },
            {
                onSuccess: () => {
                    form.reset()
                    setSelectedCards([])
                },
            },
        )
    }

    const handleCardToggle = (cardIds: number[]) => {
        setSelectedCards(cardIds)
    }

    return (
        <Form {...form}>
            
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                id="add-new-step-form"
                className="stack-card"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Title</FormLabel>
                            <FormControl>
                                <CosmicInput {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

            <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Selected cards</label>
                <CardPicker mode="add" selectedCardIds={selectedCards} onCardsConfirmed={handleCardToggle} />
                
            </div>

            <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                        <FormLabel className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Note</FormLabel>
                        <FormControl>
                            <CosmicTextarea {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </form>
        </Form>
    )

}

