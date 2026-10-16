/**
 * Resolve Supabase keys with preference for the new publishable/secret format,
 * falling back to legacy anon / service_role env names during migration.
 *
 * New:  sb_publishable_...  /  sb_secret_...
 * Legacy JWT: anon / service_role (deprecated end of 2026)
 */

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? ""
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL")
  }
  if (!/^https?:\/\//i.test(url)) {
    throw new Error(
      "Invalid NEXT_PUBLIC_SUPABASE_URL (expected an http(s) URL). Common mistake: swapping URL and key in .env.local.",
    )
  }
  return url
}

/** Browser / SSR user client — publishable (or legacy anon). */
export function getSupabasePublishableKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    ""
  if (!key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or legacy NEXT_PUBLIC_SUPABASE_ANON_KEY)",
    )
  }
  return key
}

/** Server-only admin — secret (or legacy service_role). Never expose to the browser. */
export function getSupabaseSecretKey(): string {
  const key =
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    ""
  if (!key) {
    throw new Error(
      "Missing SUPABASE_SECRET_KEY (or legacy SUPABASE_SERVICE_ROLE_KEY) for admin operations",
    )
  }
  return key
}

export function tryGetSupabaseUrl(): string | null {
  try {
    return getSupabaseUrl()
  } catch {
    return null
  }
}

export function tryGetSupabasePublishableKey(): string | null {
  try {
    return getSupabasePublishableKey()
  } catch {
    return null
  }
}
