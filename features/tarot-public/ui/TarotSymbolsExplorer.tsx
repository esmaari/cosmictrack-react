"use client"

import { cn } from "@/lib/utils"
import { useEffect, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

export type TarotSymbolEntry = {
  id: string
  title: string
  summary: string
  meaning: string
}

type Props = {
  symbols: TarotSymbolEntry[]
  defaultSymbolId?: string
}

export default function TarotSymbolsExplorer({ symbols, defaultSymbolId }: Props) {
  const t = useTranslations("tarot.symbolsExplorer")
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const byId = useMemo(() => new Map(symbols.map((s) => [s.id, s])), [symbols])
  const selectedFromUrl = searchParams.get("symbol")

  const selectedId = useMemo(() => {
    if (selectedFromUrl && byId.has(selectedFromUrl)) return selectedFromUrl
    if (defaultSymbolId && byId.has(defaultSymbolId)) return defaultSymbolId
    return symbols[0]?.id
  }, [selectedFromUrl, defaultSymbolId, byId, symbols])

  // Seed URL when landing without ?symbol= (router only — no setState in effect)
  useEffect(() => {
    if (selectedFromUrl || !selectedId) return
    const next = new URLSearchParams(searchParams.toString())
    next.set("symbol", selectedId)
    router.replace(`${pathname}?${next.toString()}`, { scroll: false })
  }, [selectedFromUrl, selectedId, pathname, router, searchParams])

  const selected = (selectedId && byId.get(selectedId)) || symbols[0]

  const onSelect = (id: string) => {
    const next = new URLSearchParams(searchParams.toString())
    next.set("symbol", id)
    router.replace(`${pathname}?${next.toString()}`, { scroll: false })
  }

  if (!selected) return null

  return (
    <div className="grid gap-4 md:grid-cols-[260px_minmax(0,1fr)] md:gap-6">
      <aside className="rounded-xl border border-heading/25 bg-app-darker/60 p-3">
        <ul className="max-h-[420px] overflow-auto pr-1">
          {symbols.map((symbol) => {
            const active = symbol.id === selected.id
            return (
              <li key={symbol.id}>
                <button
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => onSelect(symbol.id)}
                  className={cn(
                    "min-h-11 w-full rounded-xl px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-neutral",
                    active
                      ? "bg-heading/10 text-heading"
                      : "text-on-dark/85 hover:bg-white/5 hover:text-btn-link-light",
                  )}
                >
                  <div className="text-sm font-semibold">{symbol.title}</div>
                  <div className={cn("mt-0.5 text-xs leading-5", active ? "text-on-dark/75" : "text-on-dark/70")}>
                    {symbol.summary}
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </aside>

      <section className="rounded-xl border border-heading/25 bg-app-darker/60 p-5 sm:p-6">
        <header className="stack-tight">
          <h2 className="heading-4 mb-0 font-semibold text-heading">{selected.title}</h2>
          <p className="text-sm leading-6 text-on-dark/75">{selected.summary}</p>
        </header>

        <div className="mt-6 stack-card">
          <h3 className="text-sm font-semibold text-heading">{t("meaningHeading")}</h3>
          <p className="text-base leading-7 text-on-dark/85">{selected.meaning}</p>
        </div>
      </section>
    </div>
  )
}
