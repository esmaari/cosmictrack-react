import createIntlMiddleware from "next-intl/middleware"
import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { tryGetSupabasePublishableKey, tryGetSupabaseUrl } from "@/core/supabase/env"
import { routing } from "./i18n/routing"
import { safeAuthNextPath, stripLocalePrefix } from "./shared/lib/authUrls"

const handleI18n = createIntlMiddleware(routing)

function isProtectedPath(pathname: string): boolean {
  const p = stripLocalePrefix(pathname)
  return (
    p === "/my-journeys" ||
    p.startsWith("/my-journeys/") ||
    p === "/categories" ||
    p.startsWith("/categories/") ||
    p === "/profile" ||
    p.startsWith("/profile/") ||
    p.startsWith("/journey/")
  )
}

function isAuthEntryPath(pathname: string): boolean {
  return stripLocalePrefix(pathname) === "/auth"
}

function copyCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie)
  })
}

export async function proxy(request: NextRequest) {
  const response = handleI18n(request)

  // Locale redirect (e.g. detect browser language) — skip Supabase pass-through
  if (response.headers.get("location")) {
    return response
  }

  const supabaseUrl = tryGetSupabaseUrl()
  const publishableKey = tryGetSupabasePublishableKey()

  if (!supabaseUrl || !publishableKey) {
    return response
  }

  const supabase = createServerClient(supabaseUrl, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname, search } = request.nextUrl
  const isEn = pathname === "/en" || pathname.startsWith("/en/")

  if (!user && isProtectedPath(pathname)) {
    const authPath = isEn ? "/en/auth" : "/auth"
    const redirectUrl = new URL(authPath, request.url)
    const nextTarget = `${stripLocalePrefix(pathname)}${search}`
    redirectUrl.searchParams.set("next", nextTarget)
    const redirectResponse = NextResponse.redirect(redirectUrl)
    copyCookies(response, redirectResponse)
    return redirectResponse
  }

  if (user && isAuthEntryPath(pathname)) {
    const nextParam = request.nextUrl.searchParams.get("next")
    const destination = safeAuthNextPath(nextParam)
    const redirectPath = isEn ? (destination === "/" ? "/en" : `/en${destination}`) : destination
    const redirectResponse = NextResponse.redirect(new URL(redirectPath, request.url))
    copyCookies(response, redirectResponse)
    return redirectResponse
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
}
