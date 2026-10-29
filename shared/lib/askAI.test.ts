import { beforeEach, describe, expect, it, vi } from "vitest"
import { FunctionsHttpError } from "@supabase/supabase-js"
import type { PickedCard } from "@/shared/types/db"

const invoke = vi.fn()

vi.mock("@/core/supabase/browser", () => ({
  createSupabaseBrowserClient: () => ({
    functions: { invoke },
  }),
}))

import { AskAIError, askAI } from "./askAI"

const sampleCards: PickedCard[] = [
  { id: 0, isReversed: false },
  { id: 1, isReversed: true },
  { id: 2, isReversed: false },
]

function httpError(body: unknown, status = 403) {
  return new FunctionsHttpError(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  )
}

describe("askAI", () => {
  beforeEach(() => {
    invoke.mockReset()
  })

  it("returns interpretation and remaining on success", async () => {
    invoke.mockResolvedValue({
      data: {
        interpretation: "A clear upright reading.",
        remaining: 2,
      },
      error: null,
    })

    const result = await askAI(sampleCards, "career focus", "en")

    expect(result.interpretation).toBe("A clear upright reading.")
    expect(result.remaining).toBe(2)
    expect(invoke).toHaveBeenCalledWith(
      "ai",
      expect.objectContaining({
        body: expect.objectContaining({
          title: "career focus",
          locale: "en",
          cards: [
            { id: 0, isReversed: false },
            { id: 1, isReversed: true },
            { id: 2, isReversed: false },
          ],
        }),
      }),
    )
  })

  it("maps LIMIT_REACHED from invoke data", async () => {
    invoke.mockResolvedValue({
      data: { code: "LIMIT_REACHED", error: "AI limit reached", remaining: 0 },
      error: null,
    })

    await expect(askAI(sampleCards, "focus")).rejects.toMatchObject({
      name: "AskAIError",
      code: "LIMIT_REACHED",
      message: "LIMIT_REACHED",
    } satisfies Partial<AskAIError>)
  })

  it("maps LIMIT_REACHED from FunctionsHttpError body", async () => {
    invoke.mockResolvedValue({
      data: null,
      error: httpError({ code: "LIMIT_REACHED", error: "AI limit reached" }, 403),
    })

    await expect(askAI(sampleCards, "focus")).rejects.toMatchObject({
      code: "LIMIT_REACHED",
      message: "LIMIT_REACHED",
    })
  })

  it("maps empty / invalid reading to EMPTY_RESPONSE", async () => {
    invoke.mockResolvedValue({
      data: { remaining: 1 },
      error: null,
    })

    await expect(askAI(sampleCards, "focus")).rejects.toMatchObject({
      code: "EMPTY_RESPONSE",
    })
  })

  it("maps AI_DISABLED", async () => {
    invoke.mockResolvedValue({
      data: { code: "AI_DISABLED", error: "AI is disabled" },
      error: null,
    })

    await expect(askAI(sampleCards, "focus")).rejects.toMatchObject({
      code: "AI_DISABLED",
    })
  })

  it("maps INVALID_AI_READING", async () => {
    invoke.mockResolvedValue({
      data: {
        code: "INVALID_AI_READING",
        error: "AI returned an invalid reading",
      },
      error: null,
    })

    await expect(askAI(sampleCards, "focus")).rejects.toMatchObject({
      code: "INVALID_AI_READING",
    })
  })

  it("accepts legacy text field from older Edge deploys", async () => {
    invoke.mockResolvedValue({
      data: { text: "Legacy plain reading.", remaining: 3 },
      error: null,
    })

    const result = await askAI(sampleCards, "focus", "tr")
    expect(result.interpretation).toBe("Legacy plain reading.")
    expect(result.remaining).toBe(3)
  })
})
