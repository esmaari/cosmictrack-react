"use client"

import { Link, usePathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { useLocale } from "next-intl"
import { useSearchParams } from "next/navigation"

export default function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const query = Object.fromEntries(searchParams.entries())
  const href = Object.keys(query).length > 0 ? { pathname, query } : pathname

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center rounded-md border border-heading/40 p-0.5"
    >
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={href}
          locale={l}
          className={cn(
            "rounded px-2 py-1 text-xs font-bold uppercase tracking-wide transition-colors",
            locale === l
              ? "bg-heading/15 text-heading"
              : "text-heading/85 hover:bg-heading/10 hover:text-heading",
          )}
        >
          {l}
        </Link>
      ))}
    </div>
  )
}
