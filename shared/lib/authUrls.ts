import { routing } from "@/i18n/routing"

/** App path without locale prefix, e.g. `/auth/reset`. */
export function localePath(locale: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  if (locale === routing.defaultLocale) return normalized
  if (normalized === "/") return `/${locale}`
  return `/${locale}${normalized}`
}

/** Strip `/en` prefix so next-intl router can push a locale-agnostic path. */
export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/en") return "/"
  if (pathname.startsWith("/en/")) return pathname.slice(3)
  return pathname
}

/**
 * Safe in-app redirect target after login (open-redirect guard).
 * Expects a path without locale prefix, optionally with `?query`.
 */
export function safeAuthNextPath(
  candidate: string | null | undefined,
  fallback = "/my-journeys",
): string {
  if (!candidate) return fallback
  const trimmed = candidate.trim()
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.includes("://")) {
    return fallback
  }
  const pathOnly = trimmed.split("?")[0] ?? trimmed
  const stripped = stripLocalePrefix(pathOnly)
  if (stripped === "/auth" || stripped.startsWith("/auth/")) {
    return fallback
  }
  return trimmed.startsWith("/en/") || trimmed === "/en"
    ? `${stripped}${trimmed.includes("?") ? `?${trimmed.split("?")[1]}` : ""}`
    : trimmed
}

/**
 * Absolute callback URL for Supabase email links.
 * `next` is an app path without locale (e.g. `/auth/reset`).
 * Pass `origin` in tests; in the browser it defaults to `window.location.origin`.
 */
export function getAuthCallbackUrl(
  locale: string,
  next?: string,
  origin: string = typeof window !== "undefined" ? window.location.origin : "",
): string {
  const callbackPath = localePath(locale, "/auth/callback")
  const url = new URL(`${origin}${callbackPath}`)
  if (next) {
    url.searchParams.set("next", localePath(locale, next))
  }
  return url.toString()
}
