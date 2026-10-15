import Image from "next/image"
import { Link } from "@/i18n/navigation"
import type { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"

type TarotPageShellProps = {
  title: string
  intro?: string
  children: ReactNode
  backHref?: string
  backLabel?: string
  /** Cream content island for forms / dense reading on dark shell */
  contentTone?: "dark" | "surface"
}

export default function TarotPageShell({
  title,
  intro,
  children,
  backHref = "/tarot",
  backLabel = "Tarot",
  contentTone = "dark",
}: TarotPageShellProps) {
  return (
    <main className="relative flex-1 overflow-hidden bg-app text-on-dark">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/CT_bg.png"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-70"
          sizes="100vw"
        />
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="stack-section">
          <Link
            href={backHref}
            className="inline-flex min-h-10 w-fit items-center gap-2 text-sm font-semibold text-heading transition-colors hover:text-btn-link-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-neutral"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {backLabel}
          </Link>

          <header className="stack-tight max-w-3xl">
            <h1 className="heading-3 mb-0 font-semibold text-heading">{title}</h1>
            {intro ? (
              <p className="text-base leading-7 text-on-dark/85">{intro}</p>
            ) : null}
          </header>

          {contentTone === "surface" ? (
            <div className="rounded-xl border border-heading/25 bg-surface p-4 text-primary shadow-sm sm:p-6">
              {children}
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </main>
  )
}
