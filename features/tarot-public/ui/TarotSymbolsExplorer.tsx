"use client"

import { cn } from "@/lib/utils"
import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"

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
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const byId = useMemo(() => new Map(symbols.map((s) => [s.id, s])), [symbols])
  const selectedFromUrl = searchParams.get("symbol") ?? undefined

  const initialId =
    (selectedFromUrl && byId.has(selectedFromUrl) ? selectedFromUrl : undefined) ??
    (defaultSymbolId && byId.has(defaultSymbolId) ? defaultSymbolId : undefined) ??
    symbols[0]?.id

  const [selectedId, setSelectedId] = useState<string | undefined>(initialId)

  useEffect(() => {
    if (!selectedFromUrl && selectedId) {
      const next = new URLSearchParams(searchParams.toString())
      next.set("symbol", selectedId)
      router.replace(`${pathname}?${next.toString()}`, { scroll: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!selectedFromUrl) return
    if (byId.has(selectedFromUrl)) setSelectedId(selectedFromUrl)
  }, [byId, selectedFromUrl])

  const selected = (selectedId && byId.get(selectedId)) || symbols[0]

  const onSelect = (id: string) => {
    setSelectedId(id)
    const next = new URLSearchParams(searchParams.toString())
    next.set("symbol", id)
    router.replace(`${pathname}?${next.toString()}`, { scroll: false })
  }

  if (!selected) return null

  return (
    <div className="grid gap-4 md:grid-cols-[260px_minmax(0,1fr)] md:gap-6">
      <aside className="rounded-2xl border border-white/10 bg-black/10 p-3 shadow-sm backdrop-blur-[1px]">
        <ul className="max-h-[420px] overflow-auto pr-1">
          {symbols.map((symbol) => {
            const active = symbol.id === selected.id
            return (
              <li key={symbol.id}>
                <button
                  type="button"
                  onClick={() => onSelect(symbol.id)}
                  className={cn(
                    "w-full rounded-xl px-3 py-2 text-left transition-colors",
                    active
                      ? "bg-heading/10 text-heading"
                      : "text-on-dark/80 hover:bg-white/5 hover:text-btn-link-light",
                  )}
                >
                  <div className="text-sm font-semibold">{symbol.title}</div>
                  <div className={cn("mt-0.5 text-xs leading-5", active ? "text-on-dark/70" : "text-on-dark/55")}>
                    {symbol.summary}
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </aside>

      <section className="rounded-2xl border border-white/10 bg-black/10 p-5 shadow-sm backdrop-blur-[1px] sm:p-6">
        <header className="stack-tight">
          <h2 className="heading-4 font-semibold text-heading">{selected.title}</h2>
          <p className="text-sm leading-6 text-on-dark/70">{selected.summary}</p>
        </header>

        <div className="mt-6 stack-card">
          <h3 className="text-sm font-semibold tracking-[0.16em] text-on-dark/60">ANLAM</h3>
          <p className="text-base leading-7 text-on-dark/80">{selected.meaning}</p>
        </div>
      </section>
    </div>
  )
}

