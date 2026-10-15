"use client"

import type { Category } from "@/shared/types/db"
import { useRouter } from "@/i18n/navigation"
import { useSearchParams } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Check, ListFilter, ChevronDown, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

export default function CategoryFilterPicker(props: {
  categories: Pick<Category, "id" | "title" | "color">[]
}) {
  const t = useTranslations("journeys.filters")
  const tPlaceholders = useTranslations("common.placeholders")

  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedIds = new Set(searchParams.getAll("cat"))
  const basePath = "/my-journeys"
  const hasSelection = selectedIds.size > 0

  const pushParams = (params: URLSearchParams) => {
    const qs = params.toString()
    router.push(qs ? `${basePath}?${qs}` : basePath)
  }

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

    pushParams(params)
  }

  const clearCategories = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("cat")
    pushParams(params)
  }

  return (
    <div className="flex items-center gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="cosmicTertiaryOnDark"
            size="cosmicSm"
            className="h-10 min-h-10 gap-2 px-3 font-normal"
            aria-label={tPlaceholders("filterCategories")}
          >
            <ListFilter className="size-4 shrink-0 text-on-dark/80" aria-hidden />
            <span
              className={cn(
                "max-w-[9rem] truncate sm:max-w-none",
                hasSelection ? "text-on-dark" : "text-light",
              )}
            >
              {hasSelection
                ? t("categoriesSelected", { count: selectedIds.size })
                : tPlaceholders("filterCategories")}
            </span>
            <ChevronDown className="size-3.5 shrink-0 text-light" aria-hidden />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[240px] p-0" align="start">
          {hasSelection ? (
            <div className="border-b border-border-neutral p-2">
              <Button
                type="button"
                variant="cosmicTertiary"
                size="cosmicSm"
                className="h-9 w-full gap-2 font-semibold"
                onClick={clearCategories}
              >
                <X className="size-4" aria-hidden />
                {t("clearCategories")}
              </Button>
            </div>
          ) : null}
          <Command>
            <CommandInput placeholder={tPlaceholders("searchCategories")} />
            <CommandList>
              <CommandEmpty>{t("noCategoriesFound")}</CommandEmpty>
              <CommandGroup>
                {props.categories.map((cat) => (
                  <CommandItem
                    key={cat.id}
                    value={cat.title}
                    onSelect={() => handleChange(cat.id)}
                  >
                    <Check
                      className={`size-4 ${selectedIds.has(cat.id) ? "opacity-100" : "opacity-0"}`}
                    />
                    <span className={`size-2.5 rounded-full ${cat.color}`} />
                    {cat.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {hasSelection ? (
        <Button
          type="button"
          variant="cosmicSecondary"
          size="cosmicSm"
          className="h-10 min-h-10 gap-1.5 px-3 font-semibold"
          onClick={clearCategories}
          aria-label={t("clearCategories")}
          title={t("clearCategories")}
        >
          <X className="size-4" aria-hidden />
          <span className="hidden sm:inline">{t("clearCategories")}</span>
        </Button>
      ) : null}
    </div>
  )
}
