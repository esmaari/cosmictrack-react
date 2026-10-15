"use client"

import { Link, usePathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { useLocale, useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"

export default function LocaleSwitcher() {
  const t = useTranslations("nav")
  const locale = useLocale()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const query = Object.fromEntries(searchParams.entries())
  const href = Object.keys(query).length > 0 ? { pathname, query } : pathname

  return (
    <div
      role="group"
      aria-label={t("language")}
      className="flex items-center rounded-md border border-heading/40 p-1"
    >
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={href}
          locale={l}
          aria-current={locale === l ? "true" : undefined}
          className={cn(
            "inline-flex min-h-9 min-w-9 items-center justify-center rounded px-2.5 text-xs font-bold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btn-link-light-focus",
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
