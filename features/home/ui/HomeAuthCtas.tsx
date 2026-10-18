"use client"

import Image from "next/image"
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
    return <div className="h-12 w-full max-w-sm rounded-md bg-white/5 sm:w-72" aria-hidden />
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {isAuthed ? (
        <Button asChild variant="cosmicPrimary" size="cosmicLg">
          <Link href="/my-journeys">{t("ctaNewJourney")}</Link>
        </Button>
      ) : (
        <>
          <Button asChild variant="cosmicPrimary" size="cosmicLg">
            <Link href="/auth">
              {t("ctaStart")} <span aria-hidden>→</span>
            </Link>
          </Button>
          <Button asChild variant="cosmicTertiaryOnDark" size="cosmicLg">
            <Link href="/tarot">{t("ctaExploreCards")}</Link>
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
    <section className="mt-12 rounded-2xl border border-heading/35 bg-app-darker/55 px-5 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-col items-stretch gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
          <Image
            src="/images/Moon_and_stars.svg"
            alt=""
            width={40}
            height={40}
            className="mt-0.5 shrink-0 opacity-90 sm:mt-0"
          />
          <div className="stack-tight min-w-0">
            <h2 className="heading-4 mb-0 font-semibold text-heading">{t("ctaPanel.title")}</h2>
            <p className="font-body text-base leading-7 text-on-dark/80">{t("ctaPanel.body")}</p>
          </div>
        </div>
        <Button asChild variant="cosmicSecondary" size="cosmicLg" className="w-full shrink-0 sm:w-auto">
          <Link href="/auth?mode=register">
            {t("ctaPanel.button")} <span aria-hidden>→</span>
          </Link>
        </Button>
      </div>
    </section>
  )
}
