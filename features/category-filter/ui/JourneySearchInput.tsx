"use client"

import { useRouter } from "@/i18n/navigation"
import { useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

export default function JourneySearchInput() {
  const tPlaceholders = useTranslations("common.placeholders")
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlQuery = searchParams.get("q") ?? ""
  const [value, setValue] = useState(urlQuery)

  // Keep input in sync when URL changes externally (back/forward, clear filters).
  useEffect(() => {
    const id = window.setTimeout(() => setValue(urlQuery), 0)
    return () => window.clearTimeout(id)
  }, [urlQuery])

  useEffect(() => {
    if (value === urlQuery) return

    const timeoutId = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      const trimmed = value.trim()

      if (trimmed) {
        params.set("q", trimmed)
      } else {
        params.delete("q")
      }

      const qs = params.toString()
      router.push(qs ? `/my-journeys?${qs}` : "/my-journeys")
      router.refresh()
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [value, urlQuery, router, searchParams])

  return (
    <div className="relative w-full min-w-0 sm:max-w-xs">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-dark/65"
        aria-hidden
      />
      <input
        type="search"
        id="searchTerm"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={tPlaceholders("searchJourneys")}
        aria-label={tPlaceholders("searchJourneys")}
        className="h-10 w-full rounded-lg border border-border-dark bg-app-darker pl-9 pr-3 text-sm text-on-dark placeholder:text-on-dark/65 focus:border-heading/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring-neutral"
      />
    </div>
  )
}
