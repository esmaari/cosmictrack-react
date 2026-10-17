import { defineConfig, devices } from "@playwright/test"
import { loadEnvLocal } from "./e2e/helpers/loadEnvLocal"

loadEnvLocal()

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3000)
// Prefer localhost over 127.0.0.1 so Next.js dev HMR/assets are not blocked as cross-origin.
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`
const isCi = !!process.env.CI

/**
 * CI without real Supabase secrets: placeholders so `next dev` boots for public smoke.
 * Local: omit overrides so Next loads `.env.local` (needed for auth E2E).
 */
const supabaseEnv = isCi
  ? {
      NEXT_PUBLIC_SUPABASE_URL:
        process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.placeholder",
      ...(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()
        ? {
            NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
              process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.trim(),
          }
        : {}),
    }
  : {}

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    ...devices["Desktop Chrome"],
    // Local: system Chrome (no Playwright browser download). CI: bundled Chromium.
    ...(process.env.CI ? {} : { channel: "chrome" as const }),
  },
  webServer: {
    command: `npx next dev --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      ...supabaseEnv,
    },
  },
})
