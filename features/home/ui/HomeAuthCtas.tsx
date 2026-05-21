"use client"

import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { useAuthUser } from "@/shared/lib/useAuthUser"
import { useTranslations } from "next-intl"
import { createContext, useContext, type ReactNode } from "react"

const AuthUserContext = createContext<ReturnType<typeof useAuthUser>>(undefined)

export function HomeAuthRoot({ children }: { children: ReactNode }) {
  const user = useAuthUser()
  return <AuthUserContext.Provider value={user}>{children}</AuthUserContext.Provider>
}

function useHomeAuthUser() {
  return useContext(AuthUserContext)
}

export function HomeHeroCtas() {
  const t = useTranslations("home")
  const user = useHomeAuthUser()
  const isAuthed = user !== undefined && user !== null

  if (user === undefined) {
    return <div className="mt-6 h-12 w-full max-w-sm rounded-md bg-white/5 sm:w-72" aria-hidden />
  }

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {isAuthed ? (
        <Button asChild variant="cosmicPrimary" size="cosmicLg">
          <Link href="/my-journeys">{t("ctaNewJourney")}</Link>
        </Button>
      ) : (
        <>
          <Button asChild variant="cosmicPrimary" size="cosmicLg">
            <Link href="/auth">{t("ctaAuth")}</Link>
          </Button>
          <Button asChild variant="cosmicTertiaryOnDark" size="cosmicLg">
            <Link href="/tarot/ask">{t("ctaAskCards")} →</Link>
          </Button>
        </>
      )}
    </div>
  )
}

export function HomeGuestCtaPanel() {
  const t = useTranslations("home")
  const user = useHomeAuthUser()

  if (user === undefined || user !== null) {
    return null
  }

  return (
    <section className="mt-10">
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-black/10 p-6 shadow-sm md:flex-row md:items-center md:p-8">
        <div className="stack-tight">
          <h2 className="heading-4 font-semibold text-heading">{t("ctaPanel.title")}</h2>
          <p className="text-sm leading-6 text-on-dark/70">{t("ctaPanel.body")}</p>
        </div>
        <Button asChild variant="cosmicTertiaryOnDark" size="cosmicLg" className="shrink-0">
          <Link href="/auth?mode=register">{t("ctaPanel.button")}</Link>
        </Button>
      </div>
    </section>
  )
}
