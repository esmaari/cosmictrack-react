import { FunctionsHttpError } from "@supabase/supabase-js"
import { createSupabaseBrowserClient } from "@/core/supabase/browser"
import { tarotReadingCards } from "@/shared/content/tarot"
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
        message:
          "You've used all your AI interpretations for this period. Free plan: 1 per day. Premium: 100 per month.",
      }
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

export async function askAI(pickedCards: PickedCard[], title: string): Promise<AskAIResult> {
  const supabase = createSupabaseBrowserClient()

  const cardsInfo = pickedCards
    .map((card) => {
      const name = tarotReadingCards.find((c) => c.id === card.id)?.name
      const orientation = card.isReversed ? "Reversed" : "Upright"
      return `${name ?? card.id} (${orientation})`
    })
    .join("\n")

  const prompt = `
Rolün: Sen bilge, gizemli ve deneyimli bir Tarot yorumcususun.

Kullanıcının Sorusu / Odak Noktası: "${title}"
Seçilen Kartlar:
${cardsInfo}

Senden İstenenler ve Kesin Kurallar:
1. Eğer kullanıcının sorusu/odak noktası anlamsız, eksik veya belirsizse, soruyu mantıklı hale getirmeye çalışmak yerine doğrudan seçilen kartların kendi aralarındaki kombinasyonuna ve genel enerjisine en yakın, en anlamlı yorumu yap.
2. Dil Kuralları: Eğer soru İngilizce ise tüm yanıt kesinlikle İngilizce olmalıdır. Eğer soru Türkçe ise tüm yanıt kesinlikle Türkçe olmalıdır. Türkçe yanıtlarda kartlardan bahsederken önce Türkçe adını yaz, hemen yanına parantez içinde İngilizce adını ve yönünü ekle. Örnek: "Deli (The Fool - Düz)" veya "Ölüm (Death - Ters)". İngilizce yanıtlarda ise normal İngilizce kart adlarını ve yönlerini kullan (Örnek: "The Fool - Upright").
3. Format Kuralları: Sadece düz metin (plain text) olarak yanıt ver. Asla emoji kullanma. Metin içinde asla bold (**), italic (*), liste işaretleri veya özel markdown formatları kullanma. Tamamen düz, akıcı paragraflar şeklinde yaz.
4. Uzunluk: Yorumun derin, bilgece ama net olsun. Maksimum 150 kelimeyi geçmesin.
`.trim()

  const { data, error } = await supabase.functions.invoke<{
    text?: string
    remaining?: number
    code?: string
    error?: string
  }>("ai", {
    body: { prompt },
  })

  if (error) {
    if (error instanceof FunctionsHttpError) {
      const parsed = await parseFunctionError(error)
      throw new AskAIError(parsed.message, parsed.code)
    }
    throw new AskAIError(error.message || "AI request failed.", "NETWORK_ERROR")
  }

  if (data?.code === "LIMIT_REACHED" || data?.error === "AI limit reached") {
    throw new AskAIError(
      "You've used all your AI interpretations for this period. Free plan: 1 per day. Premium: 100 per month.",
      "LIMIT_REACHED",
    )
  }

  if (!data?.text) {
    throw new AskAIError(data?.error ?? "AI returned an empty response.", "EMPTY_RESPONSE")
  }

  return {
    text: data.text,
    remaining: typeof data.remaining === "number" ? data.remaining : 0,
  }
}
