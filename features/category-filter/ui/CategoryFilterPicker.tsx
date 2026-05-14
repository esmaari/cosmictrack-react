'use client'
import type { Category } from "@/shared/types/db"
import { useRouter, useSearchParams } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Check, ListFilter, ChevronDown } from "lucide-react"

export default function CategoryFilterPicker(props: {
    categories: Pick<Category, "id" | "title" | "color">[]
}) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const selectedIds = new Set(searchParams.getAll("cat"))

    const basePath = '/my-journeys'

    const handleChange = (id: string) => {
        const params = new URLSearchParams(searchParams.toString())
        const selected = params.getAll("cat")

        const nextSelected = selected.includes(id)
            ? selected.filter((x) => x !== id)
            : [...selected, id]

        params.delete("cat")

        for (const catId of nextSelected) {
            params.append("cat", catId)
        }

        const qs = params.toString()
        router.push(qs ? `${basePath}?${qs}` : basePath)
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="h-9 gap-2 border-zinc-200 bg-white px-3 text-sm font-normal dark:border-zinc-700 dark:bg-zinc-950"
                >
                    <ListFilter className="size-4 text-zinc-500" />
                    <span className={selectedIds.size > 0 ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400 dark:text-zinc-500"}>
                        {selectedIds.size > 0
                            ? `${selectedIds.size} categories selected`
                            : "Filter categories..."}
                    </span>
                    <ChevronDown className="size-3.5 text-zinc-400" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[220px] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search categories..." />
                    <CommandList>
                        <CommandEmpty>No categories found.</CommandEmpty>
                        <CommandGroup>
                            {props.categories.map((cat) => (
                                <CommandItem
                                    key={cat.id}
                                    value={cat.title}
                                    onSelect={() => handleChange(cat.id)}
                                >
                                    <Check className={`size-4 ${selectedIds.has(cat.id) ? "opacity-100" : "opacity-0"}`} />
                                    <span className={`size-2.5 rounded-full ${cat.color}`} />
                                    {cat.title}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
