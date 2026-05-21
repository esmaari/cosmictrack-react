"use client"

import { createSupabaseBrowserClient } from "@/core/supabase/browser"
import type { User } from "@supabase/supabase-js"
import { useEffect, useMemo, useState } from "react"

export function useAuthUser() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
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

  return user
}
