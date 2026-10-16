import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getSupabasePublishableKey, getSupabaseUrl } from "@/core/supabase/env"

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  const supabaseUrl = getSupabaseUrl()
  const publishableKey = getSupabasePublishableKey()

  return createServerClient(supabaseUrl, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Server Components can't always set cookies (e.g. during render).
          // Middleware / Route Handlers can set cookies reliably.
        }
      },
    },
  })
}
