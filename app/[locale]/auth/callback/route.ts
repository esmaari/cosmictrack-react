import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { routing } from "@/i18n/routing"

function safeNextPath(next: string | null, locale: string): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return locale === routing.defaultLocale ? "/" : `/${locale}`
  }
  return next
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ locale: string }> },
) {
  const { locale: localeParam } = await context.params
  const locale = routing.locales.includes(localeParam as "tr" | "en")
    ? localeParam
    : routing.defaultLocale

  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = safeNextPath(searchParams.get("next"), locale)
  const authErrorPath =
    locale === routing.defaultLocale ? "/auth?error=link" : `/${locale}/auth?error=link`

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!code || !supabaseUrl || !supabaseAnonKey || !/^https?:\/\//i.test(supabaseUrl)) {
    return NextResponse.redirect(`${origin}${authErrorPath}`)
  }

  const forwardedHost = request.headers.get("x-forwarded-host")
  const isLocalEnv = process.env.NODE_ENV === "development"
  const redirectBase =
    !isLocalEnv && forwardedHost ? `https://${forwardedHost}` : origin

  let response = NextResponse.redirect(`${redirectBase}${next}`)

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        response = NextResponse.redirect(`${redirectBase}${next}`)
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(`${redirectBase}${authErrorPath}`)
  }

  return response
}
