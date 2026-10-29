import { z } from "zod"

/** Max chars for a reading (~150 words with headroom). */
export const AI_INTERPRETATION_MAX = 1200

/**
 * Structured AI reading payload.
 * Keep Edge Function validation in sync with `parseAiReading`.
 */
export const aiReadingSchema = z.object({
  interpretation: z
    .string()
    .trim()
    .min(1, "interpretation is required")
    .max(AI_INTERPRETATION_MAX, "interpretation is too long"),
})

export type AiReading = z.infer<typeof aiReadingSchema>

export type ParseAiReadingResult =
  | { ok: true; data: AiReading }
  | { ok: false; error: string }

/**
 * Parse model / Edge JSON into a validated reading.
 * Accepts an object or a JSON string. Fails closed on invalid shape.
 */
export function parseAiReading(input: unknown): ParseAiReadingResult {
  let value: unknown = input

  if (typeof input === "string") {
    const trimmed = stripCodeFence(input.trim())
    if (!trimmed) {
      return { ok: false, error: "empty AI content" }
    }
    try {
      value = JSON.parse(trimmed)
    } catch {
      return { ok: false, error: "AI content is not JSON" }
    }
  }

  const parsed = aiReadingSchema.safeParse(value)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { ok: false, error: first?.message ?? "invalid AI reading" }
  }

  return { ok: true, data: parsed.data }
}

/** Strip optional ```json ... ``` wrappers some models still emit. */
function stripCodeFence(raw: string): string {
  const fence = raw.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  return fence?.[1]?.trim() ?? raw
}
