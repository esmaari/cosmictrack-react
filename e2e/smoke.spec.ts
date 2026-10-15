import { expect, test } from "@playwright/test"

test.describe("public smoke", () => {
  test("home loads with brand", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("CosmicTrack").first()).toBeVisible()
    await expect(page.locator("h1")).toBeVisible()
  })

  test("tarot hub library page", async ({ page }) => {
    await page.goto("/tarot")
    await expect(page.getByRole("heading", { name: /Tarot kütüphanesi|Tarot library/i })).toBeVisible()
  })

  test("tarot cards encyclopedia", async ({ page }) => {
    await page.goto("/tarot/cards")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page.getByRole("link", { name: /The Fool|The Magician/i }).first()).toBeVisible({
      timeout: 15_000,
    })
  })

  test("auth page shows sign-in", async ({ page }) => {
    await page.goto("/auth")
    await expect(page.getByText(/Giriş yap|Sign in/i).first()).toBeVisible()
    await expect(page.getByRole("textbox", { name: /E-posta|Email/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /Giriş yap|Login/i })).toBeVisible()
  })

  test("forgot password mode", async ({ page }) => {
    await page.goto("/auth?mode=forgot")
    await expect(page.getByText(/Şifremi unuttum|Forgot password/i).first()).toBeVisible()
    await expect(page.getByRole("button", { name: /Sıfırlama linki gönder|Send reset link/i })).toBeVisible()
  })

  test("English locale prefix works", async ({ page }) => {
    await page.goto("/en/tarot")
    await expect(page.getByRole("heading", { name: /Tarot library/i })).toBeVisible()
  })
})
