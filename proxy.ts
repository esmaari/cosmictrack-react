import createIntlMiddleware from "next-intl/middleware"
import { type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { routing } from "./i18n/routing"

const handleI18n = createIntlMiddleware(routing)

export async function proxy(request: NextRequest) {
  const response = handleI18n(request)

  // Locale redirect (e.g. detect browser language) — skip Supabase pass-through
  if (response.headers.get("location")) {
    return response
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!supabaseUrl || !supabaseAnonKey) {
    return response
  }

  if (!/^https?:\/\//i.test(supabaseUrl)) {
    return response
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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

  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
}
