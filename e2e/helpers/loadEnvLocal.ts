import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

/**
 * Load `.env.local` into `process.env` for keys that are not already set.
 * Playwright does not load Next env files by itself; auth E2E needs
 * `E2E_USER_*` (and optionally Supabase URL/keys) from the same file.
 */
export function loadEnvLocal(cwd = process.cwd()): void {
  const path = resolve(cwd, ".env.local")
  if (!existsSync(path)) return

  for (const rawLine of readFileSync(path, "utf8").split("\n")) {
    const line = rawLine.trim()
    if (!line || line.startsWith("#")) continue
    const eq = line.indexOf("=")
    if (eq <= 0) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

export function getE2ECredentials(): { email: string; password: string } | null {
  const email = process.env.E2E_USER_EMAIL?.trim() ?? ""
  const password = process.env.E2E_USER_PASSWORD?.trim() ?? ""
  if (!email || !password) return null
  return { email, password }
}
