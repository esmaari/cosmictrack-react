import { Link } from "@/i18n/navigation"
import type { ReactNode } from "react"

type TarotPageShellProps = {
  title: string
  intro?: string
  children: ReactNode
  backHref?: string
  backLabel?: string
}

export default function TarotPageShell({
  title,
  intro,
  children,
  backHref = "/tarot",
  backLabel = "Tarot",
}: TarotPageShellProps) {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 bg-surface px-4 py-8 text-primary sm:px-6 sm:py-10">
      <div className="stack-section">
        <Link
          href={backHref}
          className="inline-flex text-sm font-medium text-secondary underline-offset-2 hover:underline"
        >
          ← {backLabel}
        </Link>
        <header className="stack-card max-w-3xl">
          <h1 className="heading-3 font-semibold text-primary">{title}</h1>
          {intro ? <p className="text-base leading-7 text-primary/85">{intro}</p> : null}
        </header>
        {children}
      </div>
    </main>
  )
}
