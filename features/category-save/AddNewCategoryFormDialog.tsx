'use client'

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CosmicInput } from "@/shared/ui/CosmicInput"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { CATEGORY_COLOR_OPTIONS } from "@/features/category-save/categoryColorOptions"

const formSchema = z.object({
    title: z
        .string()
        .min(2, { message: "Title must be at least 2 characters long" })
        .max(50, { message: "Title must be at most 50 characters long" }),
    color: z
        .string()
        .min(1, { message: "Please select a color" }),
})

export default function AddNewCategoryFormDialog() {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            color: "",
        },
    })

    const mutation = useMutation({
        mutationFn: async ({ title, color }: { title: string; color: string }) => {
            const response = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ categoryName: title, categoryColor: color }),
            })

            if (!response.ok) {
                const payload = await response.json().catch(() => null)
                throw new Error(payload?.error ?? "Failed to add category")
            }

            const data = await response.json()
            const categoryId = data.categoryId

            if (!categoryId) {
                throw new Error("Failed to add category")
            }
            return categoryId
        },
        onSuccess: () => {
            router.refresh()
            toast.success("Category added")
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

    const formId = "add-new-category-form"

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="cosmicLinkDark" size="cosmicSm">
                    <Plus className="size-4" />
                    Add Category
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to create a new category.
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
                                            <CosmicInput placeholder="New category" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="color"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Color</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full min-w-0">
                                                    <SelectValue placeholder="Select color…" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="min-w-(--radix-select-trigger-width)">
                                                {CATEGORY_COLOR_OPTIONS.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>
                                                        <span className="flex items-center gap-2">
                                                            <span
                                                                className={cn(
                                                                    "size-2.5 shrink-0 rounded-full",
                                                                    opt.value,
                                                                )}
                                                            />
                                                            {opt.label}
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
