"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useProfile } from "@/shared/lib/useProfile"
import type { AiCreditsState, ProfileAiFields } from "@/shared/lib/aiCredits"

type ProfileContextValue = {
  profile: ProfileAiFields | null
  credits: AiCreditsState | null
  loading: boolean
  refetch: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const value = useProfile()
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfileContext(): ProfileContextValue {
  const ctx = useContext(ProfileContext)
  if (!ctx) {
    throw new Error("useProfileContext must be used within ProfileProvider")
  }
  return ctx
}

/** Safe for Header on public pages — returns null credits when provider missing */
export function useOptionalProfileContext(): ProfileContextValue | null {
  return useContext(ProfileContext)
}
