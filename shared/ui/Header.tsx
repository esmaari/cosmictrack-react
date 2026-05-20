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
      "rounded-md px-3 py-2 text-sm font-semibold transition-colors",
      (matchPrefix ? pathname.startsWith(href) : pathname === href)
        ? "text-btn-link-light"
        : "text-heading/85 hover:text-btn-link-light",
    )

  const isAuthed = user !== undefined && user !== null

  return (
    <header className="sticky top-0 z-50 w-full shrink-0 border-b border-heading/40 bg-footer-heading shadow-sm">
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
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

        <div className="flex shrink-0 items-center gap-2">
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
                      ? "border-white/25 bg-white/10 text-btn-link-light"
                      : "border-white/25 bg-white/10 text-btn-link-light",
                  )}
                >
                  {credits.planLabel}
                </span>
              ) : null}
              <Button asChild variant="cosmicTertiaryOnDark" size="cosmicSm">
                <Link href="/profile">{t("profile")}</Link>
              </Button>
              <Button
                type="button"
                onClick={logOut}
                disabled={loading}
                variant="cosmicTertiaryOnDark"
                size="cosmicSm"
                className="gap-1"
              >
                <LogOut className="size-4" />
                {loading ? t("loggingOut") : t("logout")}
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="cosmicTertiaryOnDark" size="cosmicSm">
                <Link href="/auth">{t("login")}</Link>
              </Button>
              <Button asChild variant="cosmicTertiaryOnDark" size="cosmicSm">
                <Link href="/auth?mode=register">{t("register")}</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <nav className="flex border-t border-white/10 px-2 py-2 sm:hidden">
        <Link href="/" className={cn(navClass("/"), "flex-1 text-center")}>
          {t("home")}
        </Link>
        <Link href="/tarot" className={cn(navClass("/tarot", true), "flex-1 text-center")}>
          {t("tarot")}
        </Link>
        {isAuthed ? (
          <>
            <Link href="/my-journeys" className={cn(navClass("/my-journeys"), "flex-1 text-center")}>
              {t("myJourneys")}
            </Link>
            <Link href="/profile" className={cn(navClass("/profile"), "flex-1 text-center")}>
              {t("profile")}
            </Link>
          </>
        ) : (
          <>
            <Link href="/auth" className={cn(navClass("/auth"), "flex-1 text-center")}>
              {t("login")}
            </Link>
            <Link href="/auth?mode=register" className={cn(navClass("/auth", true), "flex-1 text-center")}>
              {t("register")}
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
