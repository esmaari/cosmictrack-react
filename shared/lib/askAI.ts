import { FunctionsHttpError } from "@supabase/supabase-js"
import { createSupabaseBrowserClient } from "@/core/supabase/browser"
import type { PickedCard } from "@/shared/types/db"

export type AskAIResult = {
  text: string
  remaining: number
}

export class AskAIError extends Error {
  code: string

  constructor(message: string, code = "UNKNOWN") {
    super(message)
    this.name = "AskAIError"
    this.code = code
  }
}

async function parseFunctionError(
  error: FunctionsHttpError,
): Promise<{ message: string; code: string }> {
  try {
    const body = (await error.context.json()) as {
      error?: string
      code?: string
      remaining?: number
    }
    const code = body.code ?? "FUNCTION_ERROR"
    if (code === "LIMIT_REACHED") {
      return {
        code,
        message: "LIMIT_REACHED",
      }
    }
    if (code === "AI_DISABLED") {
      return { code, message: body.error ?? "AI is disabled" }
    }
    if (body.error) {
      return { code, message: body.error }
    }
  } catch {
    // ignore JSON parse failure
  }
  return {
    code: "FUNCTION_ERROR",
    message: "AI request failed. Please try again later.",
  }
}

/**
 * Asks the tarot AI Edge Function for a step meaning.
 * Sends only structured fields — the server owns the prompt template.
 */
export async function askAI(
  pickedCards: PickedCard[],
  title: string,
  locale?: string | null,
): Promise<AskAIResult> {
  const supabase = createSupabaseBrowserClient()
  const trimmedTitle = title.trim()

  const { data, error } = await supabase.functions.invoke<{
    text?: string
    remaining?: number
    code?: string
    error?: string
  }>("ai", {
    body: {
      title: trimmedTitle,
      locale: locale === "en" ? "en" : "tr",
      cards: pickedCards.map((card) => ({
        id: card.id,
        isReversed: card.isReversed,
      })),
    },
  })

  if (error) {
    if (error instanceof FunctionsHttpError) {
      const parsed = await parseFunctionError(error)
      throw new AskAIError(parsed.message, parsed.code)
    }
    throw new AskAIError(error.message || "AI request failed.", "NETWORK_ERROR")
  }

  if (data?.code === "LIMIT_REACHED" || data?.error === "AI limit reached") {
    throw new AskAIError("LIMIT_REACHED", "LIMIT_REACHED")
  }

  if (data?.code === "AI_DISABLED") {
    throw new AskAIError(data.error ?? "AI is disabled", "AI_DISABLED")
  }

  if (!data?.text) {
    throw new AskAIError(data?.error ?? "AI returned an empty response.", "EMPTY_RESPONSE")
  }

  return {
    text: data.text,
    remaining: typeof data.remaining === "number" ? data.remaining : 0,
  }
}
