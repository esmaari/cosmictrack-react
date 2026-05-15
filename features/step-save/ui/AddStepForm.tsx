'use client'
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
import type { PickedCard } from "@/shared/types/db"
import { tarotCards } from "@/shared/data/tarotCards"

function buildMeaningFromPicks(pickedCards: PickedCard[]): string {
    return pickedCards
        .map((picked) => {
            const card = tarotCards.find((c) => c.id === picked.id)
            if (!card) return ""

            const text = picked.isReversed ? card.reversed : card.upright

            return `${text}`
        })
        .filter((line) => line.length > 0)
        .join("\n\n")
}

export default function AddStepForm(props: {journeyId: string, onSaveButtonClicked?: (pending: boolean) => void, setOpen: (open: boolean) => void }) {
    const router = useRouter()

    const formSchema = z.object({
        title: z.string().min(1, { message: "Title is required" }).max(80, { message: "Title must be at most 80 characters long" }),
        cards: z.array(z.object({ id: z.number(), isReversed: z.boolean() })).min(3, { message: "Please select 3 cards" }),
        meaning: z.string().optional(),
        note: z.string().max(500, { message: "Note must be at most 500 characters long" }).optional(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            cards: [],
            meaning: "",
            note: "",
        },
    })

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema> & { cards: PickedCard[] }) => {

            const response = await fetch("/api/steps", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    journeyId: props.journeyId,
                    title: values.title.trim(),
                    note: values.note?.trim() ?? "",
                    meaning: values.meaning ?? "",
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
            { ...values },
            {
                onSuccess: () => {
                    form.reset()
                    props.setOpen(false)
                },
            },
        )
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
                <FormField
                    control={form.control}
                    name="cards"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-1">
                            <FormLabel className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Cards</FormLabel>
                            <FormControl>
                                 <div className="flex flex-col gap-1">
                                    <CardPicker 
                                        mode="add" 
                                        onCardsConfirmed={(cards: PickedCard[]) => {
                                            field.onChange(cards)
                                            form.setValue("meaning", buildMeaningFromPicks(cards), {
                                                shouldValidate: true,
                                            })
                                        }} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
            <FormField
                control={form.control}
                name="meaning"
                render={({ field }) => (
                    <FormItem className="flex flex-col gap-1">
                        <FormLabel className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Meaning</FormLabel>
                        <FormControl>
                            <div>{field.value}</div>
                        </FormControl>
                    </FormItem>
                )}
            />
               
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

