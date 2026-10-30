"use client"

import Image from "next/image"
import type { User } from "@supabase/supabase-js"
import { createSupabaseBrowserClient } from "@/core/supabase/browser"
import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import LocaleSwitcher from "@/shared/ui/LocaleSwitcher"
import { useTranslations } from "next-intl"

function AuthNavLinks({
  isAuthed,
  navClass,
  t,
}: {
  isAuthed: boolean
  navClass: (href: string, matchPrefix?: boolean, active?: boolean) => string
  t: (key: string) => string
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const isRegister = searchParams.get("mode") === "register"
  const onAuth = pathname === "/auth"

  return (
    <nav
      aria-label={t("mainNav")}
      className="flex border-t border-white/10 px-2 py-2 sm:hidden"
    >
      <Link
        href="/"
        className={cn(navClass("/"), "min-h-10 flex-1 text-center")}
        aria-current={pathname === "/" ? "page" : undefined}
      >
        {t("home")}
      </Link>
      <Link
        href="/tarot"
        className={cn(navClass("/tarot", true), "min-h-10 flex-1 text-center")}
        aria-current={pathname.startsWith("/tarot") ? "page" : undefined}
      >
        {t("tarot")}
      </Link>
      {isAuthed ? (
        <>
          <Link
            href="/my-journeys"
            className={cn(navClass("/my-journeys"), "min-h-10 flex-1 px-1 text-center text-xs sm:text-sm")}
            aria-current={pathname === "/my-journeys" ? "page" : undefined}
          >
            {t("myJourneys")}
          </Link>
          <Link
            href="/categories"
            className={cn(
              navClass("/categories", true),
              "min-h-10 flex-1 px-1 text-center text-xs sm:text-sm",
            )}
            aria-current={pathname.startsWith("/categories") ? "page" : undefined}
          >
            {t("categories")}
          </Link>
          <Link
            href="/profile"
            className={cn(navClass("/profile"), "min-h-10 flex-1 px-1 text-center text-xs sm:text-sm")}
            aria-current={pathname === "/profile" ? "page" : undefined}
          >
            {t("profile")}
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/auth"
            className={cn(navClass("/auth", false, onAuth && !isRegister), "min-h-10 flex-1 text-center")}
            aria-current={onAuth && !isRegister ? "page" : undefined}
          >
            {t("login")}
          </Link>
          <Link
            href="/auth?mode=register"
            className={cn(navClass("/auth", false, onAuth && isRegister), "min-h-10 flex-1 text-center")}
            aria-current={onAuth && isRegister ? "page" : undefined}
          >
            {t("register")}
          </Link>
        </>
      )}
    </nav>
  )
}

export default function Header() {
  const t = useTranslations("nav")
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null | undefined>(undefined)

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

  const navClass = (href: string, matchPrefix = false, forcedActive?: boolean) => {
    const active =
      forcedActive ??
      (matchPrefix ? pathname.startsWith(href) : pathname === href)
    return cn(
      "rounded-md px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btn-link-light-focus focus-visible:ring-offset-2 focus-visible:ring-offset-footer-heading",
      active ? "text-btn-link-light" : "text-heading/85 hover:text-btn-link-light",
    )
  }

  const isAuthed = user !== undefined && user !== null

  return (
    <header className="sticky top-0 z-50 w-full shrink-0 border-b border-heading/40 bg-footer-heading shadow-sm">
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-6 sm:gap-8">
          <Link
            href="/"
            className="relative block h-14 w-14 shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-btn-link-light-focus"
          >
            <Image
              src="/logos/Logo_CT_Badge.png"
              alt="CosmicTrack"
              fill
              className="object-contain object-left"
              sizes="180px"
              priority
            />
          </Link>
          <nav aria-label={t("mainNav")} className="hidden min-w-0 items-center gap-1 sm:flex sm:py-2">
            <Link href="/" className={navClass("/")} aria-current={pathname === "/" ? "page" : undefined}>
              {t("home")}
            </Link>
            <Link
              href="/tarot"
              className={navClass("/tarot", true)}
              aria-current={pathname.startsWith("/tarot") ? "page" : undefined}
            >
              {t("tarot")}
            </Link>
            {isAuthed ? (
              <>
                <Link
                  href="/my-journeys"
                  className={navClass("/my-journeys")}
                  aria-current={pathname === "/my-journeys" ? "page" : undefined}
                >
                  {t("myJourneys")}
                </Link>
                <Link
                  href="/categories"
                  className={navClass("/categories", true)}
                  aria-current={pathname.startsWith("/categories") ? "page" : undefined}
                >
                  {t("categories")}
                </Link>
              </>
            ) : null}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Suspense fallback={<span className="h-9 w-16 shrink-0 rounded-md bg-white/5" aria-hidden />}>
            <LocaleSwitcher />
          </Suspense>
          {user === undefined ? (
            <span className="h-10 w-24 shrink-0 rounded-md bg-white/5" aria-hidden />
          ) : isAuthed ? (
            <>
              {user ? (
                <span className="hidden rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-xs font-semibold text-btn-link-light sm:inline-flex">
                  {t("planFree")}
                </span>
              ) : null}
              <Button
                asChild
                variant="cosmicTertiaryOnDark"
                size="cosmicSm"
                className="hidden min-h-10 sm:inline-flex"
              >
                <Link href="/profile">{t("profile")}</Link>
              </Button>
              <Button
                type="button"
                onClick={logOut}
                disabled={loading}
                variant="cosmicTertiaryOnDark"
                size="cosmicSm"
                className="min-h-10 min-w-10 gap-1"
                aria-label={t("logout")}
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">{loading ? t("loggingOut") : t("logout")}</span>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="cosmicTertiaryOnDark" size="cosmicSm" className="min-h-10">
                <Link href="/auth">{t("login")}</Link>
              </Button>
              <Button asChild variant="cosmicSecondary" size="cosmicSm" className="hidden min-h-10 sm:inline-flex">
                <Link href="/auth?mode=register">{t("register")}</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <Suspense fallback={null}>
        <AuthNavLinks isAuthed={isAuthed} navClass={navClass} t={t} />
      </Suspense>
    </header>
  )
}
