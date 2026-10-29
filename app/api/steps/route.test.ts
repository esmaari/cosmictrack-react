import { beforeEach, describe, expect, it, vi } from "vitest"

const getUser = vi.fn()

vi.mock("@/core/supabase/server", () => ({
  createSupabaseServerClient: vi.fn(async () => ({
    auth: { getUser },
  })),
}))

vi.mock("@/entities/step/api/deleteStep", () => ({
  deleteStep: vi.fn(),
}))

vi.mock("@/entities/step/api/upsertStep", () => ({
  upsertStep: vi.fn(),
}))

import { DELETE, POST } from "./route"

describe("POST /api/steps", () => {
  beforeEach(() => {
    getUser.mockReset()
  })

  it("returns 401 when there is no session user", async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: null })

    const response = await POST(
      new Request("http://localhost/api/steps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Reading", journeyId: "j1" }),
      }),
    )

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ error: "not allowed" })
  })
})

describe("DELETE /api/steps", () => {
  beforeEach(() => {
    getUser.mockReset()
  })

  it("returns 401 when there is no session user", async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: null })

    const response = await DELETE(
      new Request("http://localhost/api/steps", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepId: "s1" }),
      }),
    )

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ error: "not allowed" })
  })
})
