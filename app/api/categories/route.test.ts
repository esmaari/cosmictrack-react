import { beforeEach, describe, expect, it, vi } from "vitest"

const getUser = vi.fn()

vi.mock("@/core/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(async () => ({
    auth: { getUser },
  })),
}))

vi.mock("@/entities/category/api/deleteCategory", () => ({
  deleteCategory: vi.fn(),
}))

vi.mock("@/entities/category/api/upsertCategory", () => ({
  upsertCategory: vi.fn(),
}))

import { DELETE, POST } from "./route"

describe("POST /api/categories", () => {
  beforeEach(() => {
    getUser.mockReset()
  })

  it("returns 401 when there is no session user", async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: null })

    const response = await POST(
      new Request("http://localhost/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryName: "Work",
          categoryColor: "bg-red-500",
        }),
      }),
    )

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ error: "not allowed" })
  })
})

describe("DELETE /api/categories", () => {
  beforeEach(() => {
    getUser.mockReset()
  })

  it("returns 401 when there is no session user", async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: null })

    const response = await DELETE(
      new Request("http://localhost/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId: "cat-1" }),
      }),
    )

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ error: "not allowed" })
  })
})
