import { expect, test } from "@playwright/test"
import { getE2ECredentials, loadEnvLocal } from "./helpers/loadEnvLocal"

loadEnvLocal()

test.describe("guest redirect", () => {
  test("protected my-journeys sends guest to auth with next", async ({ page }) => {
    await page.goto("/my-journeys")
    await expect(page).toHaveURL(/\/auth/)
    expect(new URL(page.url()).searchParams.get("next")).toBe("/my-journeys")
    await expect(page.getByText(/Giriş yap|Sign in/i).first()).toBeVisible()
  })

  test("protected profile sends guest to auth with next", async ({ page }) => {
    await page.goto("/profile")
    await expect(page).toHaveURL(/\/auth/)
    expect(new URL(page.url()).searchParams.get("next")).toBe("/profile")
  })
})

test.describe("authenticated session", () => {
  const credentials = getE2ECredentials()

  test.beforeEach(() => {
    test.skip(
      !credentials,
      "Set E2E_USER_EMAIL and E2E_USER_PASSWORD in .env.local (dedicated test account)",
    )
  })

  test("login reaches my-journeys and profile (free beta)", async ({ page }) => {
    const { email, password } = credentials!

    // Explicit EN path — Playwright Chrome often prefers en via Accept-Language.
    await page.goto("/en/auth")
    await expect(page.locator('form[data-auth-ready="true"]')).toBeVisible({
      timeout: 15_000,
    })

    await page.getByRole("textbox", { name: /Email/i }).fill(email)
    await page.getByRole("textbox", { name: /Password/i }).fill(password)
    await page.getByRole("button", { name: /Login/i }).click()

    await expect(page).toHaveURL(/\/my-journeys/, { timeout: 20_000 })
    await expect(page.getByRole("heading", { name: /My Journeys/i })).toBeVisible()

    await page.goto("/en/profile")
    await expect(page.getByRole("heading", { name: /Profile/i })).toBeVisible()
    await expect(page.getByText(/free|AI|coming/i).first()).toBeVisible()
  })
})
