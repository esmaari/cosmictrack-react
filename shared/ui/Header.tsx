"use client"

import Image from "next/image"
import type { User } from "@supabase/supabase-js"
import { createSupabaseBrowserClient } from "@/core/supabase/browser"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { Suspense, useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProfileContext } from "@/shared/lib/ProfileProvider"
import LocaleSwitcher from "@/shared/ui/LocaleSwitcher"
import { useTranslations } from "next-intl"

const guestLinkClass =
  "rounded-md px-3 py-2 text-sm font-semibold text-btn-link-light hover:text-btn-link-light-hover"

export default function Header() {
  const t = useTranslations("nav")
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const { credits, loading: profileLoading } = useProfileContext()

  useEffect(() => {
    void supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u ?? null)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  const logOut = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      router.push("/")
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  const navClass = (href: string, matchPrefix = false) =>
    cn(
      "rounded-md px-3 py-2 text-xl font-semibold transition-colors",
      (matchPrefix ? pathname.startsWith(href) : pathname === href)
        ? "text-btn-link-light-pressed"
        : "text-btn-link-light hover:text-btn-link-light-hover",
    )

  const isAuthed = user !== undefined && user !== null

  return (
    <header className="sticky top-0 z-50 w-full shrink-0 bg-footer-heading shadow-sm">
      <div className="mx-auto flex h-18 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-6 sm:gap-8">
          <Link href="/" className="relative block h-14 w-14 shrink-0">
            <Image
              src="/logos/Logo_CT_Badge.png"
              alt="CosmicTrack"
              fill
              className="object-contain object-left"
              sizes="180px"
              priority
            />
          </Link>
          <nav className="hidden min-w-0 items-center gap-1 sm:flex sm:py-2">
            <Link href="/" className={navClass("/")}>
              {t("home")}
            </Link>
            <Link href="/tarot" className={navClass("/tarot", true)}>
              {t("tarot")}
            </Link>
            {isAuthed ? (
              <Link href="/my-journeys" className={navClass("/my-journeys")}>
                {t("myJourneys")}
              </Link>
            ) : null}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Suspense fallback={<span className="h-7 w-14 shrink-0 rounded-md bg-white/5" aria-hidden />}>
            <LocaleSwitcher />
          </Suspense>
          {user === undefined ? (
            <span className="h-9 w-24 shrink-0 rounded-md bg-white/5" aria-hidden />
          ) : isAuthed ? (
            <>
              {!profileLoading && credits ? (
                <span
                  className={cn(
                    "hidden rounded-full border px-2.5 py-1 text-xs font-semibold sm:inline-flex",
                    credits.plan === "premium"
                      ? "border-solar-gold/60 bg-solar-gold/15 text-solar-gold"
                      : "border-white/25 bg-white/10 text-btn-link-light",
                  )}
                >
                  {credits.planLabel}
                </span>
              ) : null}
              <Link href="/profile" className={cn(navClass("/profile"), "hidden text-base sm:inline-flex sm:text-xl")}>
                {t("profile")}
              </Link>
              <Button
                type="button"
                onClick={logOut}
                disabled={loading}
                variant="cosmicPrimary"
                size="cosmicSm"
                className="gap-1"
              >
                <LogOut className="size-4" />
                {loading ? t("loggingOut") : t("logout")}
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth" className={guestLinkClass}>
                {t("login")}
              </Link>
              <Link href="/auth?mode=register" className={guestLinkClass}>
                {t("register")}
              </Link>
            </>
          )}
        </div>
      </div>

      <nav className="flex border-t border-black/10 px-2 py-2 sm:hidden">
        <Link href="/" className={cn(navClass("/"), "flex-1 text-center text-base")}>
          {t("home")}
        </Link>
        <Link href="/tarot" className={cn(navClass("/tarot", true), "flex-1 text-center text-base")}>
          {t("tarot")}
        </Link>
        {isAuthed ? (
          <>
            <Link href="/my-journeys" className={cn(navClass("/my-journeys"), "flex-1 text-center text-base")}>
              {t("myJourneys")}
            </Link>
            <Link href="/profile" className={cn(navClass("/profile"), "flex-1 text-center text-base")}>
              {t("profile")}
            </Link>
          </>
        ) : (
          <>
            <Link href="/auth" className="flex-1 text-center text-base font-semibold text-btn-link-light hover:text-btn-link-light-hover">
              {t("login")}
            </Link>
            <Link
              href="/auth?mode=register"
              className="flex-1 text-center text-base font-semibold text-btn-link-light hover:text-btn-link-light-hover"
            >
              {t("register")}
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
