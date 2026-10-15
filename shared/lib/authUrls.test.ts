import { describe, expect, it } from "vitest"
import { getAuthCallbackUrl, localePath, safeAuthNextPath, stripLocalePrefix } from "./authUrls"

describe("localePath", () => {
  it("omits prefix for default locale", () => {
    expect(localePath("tr", "/auth/callback")).toBe("/auth/callback")
    expect(localePath("tr", "/")).toBe("/")
  })

  it("prefixes non-default locale", () => {
    expect(localePath("en", "/auth/callback")).toBe("/en/auth/callback")
    expect(localePath("en", "/")).toBe("/en")
  })
})

describe("getAuthCallbackUrl", () => {
  it("builds absolute callback URLs with optional next", () => {
    expect(getAuthCallbackUrl("tr", undefined, "http://localhost:3000")).toBe(
      "http://localhost:3000/auth/callback",
    )
    expect(getAuthCallbackUrl("en", "/auth/reset", "http://localhost:3000")).toBe(
      "http://localhost:3000/en/auth/callback?next=%2Fen%2Fauth%2Freset",
    )
  })
})

describe("stripLocalePrefix / safeAuthNextPath", () => {
  it("strips en prefix", () => {
    expect(stripLocalePrefix("/en/my-journeys")).toBe("/my-journeys")
    expect(stripLocalePrefix("/my-journeys")).toBe("/my-journeys")
  })

  it("allows safe internal paths and rejects open redirects", () => {
    expect(safeAuthNextPath("/profile")).toBe("/profile")
    expect(safeAuthNextPath("/journey/abc?x=1")).toBe("/journey/abc?x=1")
    expect(safeAuthNextPath("https://evil.com")).toBe("/my-journeys")
    expect(safeAuthNextPath("//evil.com")).toBe("/my-journeys")
    expect(safeAuthNextPath("/auth")).toBe("/my-journeys")
    expect(safeAuthNextPath(null)).toBe("/my-journeys")
  })
})
