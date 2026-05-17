"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { createSupabaseBrowserClient } from "@/core/supabase/browser"
import {
  type AiCreditsState,
  getAiCreditsFromProfile,
  type ProfileAiFields,
} from "@/shared/lib/aiCredits"

export function useProfile() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), [])
  const [profile, setProfile] = useState<ProfileAiFields | null>(null)
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setProfile(null)
        return
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("plan, ai_used_count, ai_period_start")
        .eq("id", user.id)
        .single()

      if (error || !data) {
        setProfile(null)
        return
      }

      setProfile(data as ProfileAiFields)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    void refetch()
  }, [refetch])

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void refetch()
    })
    return () => subscription.unsubscribe()
  }, [supabase, refetch])

  const credits: AiCreditsState | null = profile ? getAiCreditsFromProfile(profile) : null

  return { profile, credits, loading, refetch }
}
