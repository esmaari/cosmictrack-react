import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const names = {"0":"The Fool","1":"The Magician","2":"The High Priestess","3":"The Empress","4":"The Emperor","5":"The Hierophant","6":"The Lovers","7":"The Chariot","8":"Strength","9":"The Hermit","10":"Wheel of Fortune","11":"Justice","12":"The Hanged Man","13":"Death","14":"Temperance","15":"The Devil","16":"The Tower","17":"The Star","18":"The Moon","19":"The Sun","20":"Judgement","21":"The World","22":"Ace of Wands","23":"2 of Wands","24":"3 of Wands","25":"4 of Wands","26":"5 of Wands","27":"6 of Wands","28":"7 of Wands","29":"8 of Wands","30":"9 of Wands","31":"10 of Wands","32":"Page of Wands","33":"Knight of Wands","34":"Queen of Wands","35":"King of Wands","36":"Ace of Cups","37":"2 of Cups","38":"3 of Cups","39":"4 of Cups","40":"5 of Cups","41":"6 of Cups","42":"7 of Cups","43":"8 of Cups","44":"9 of Cups","45":"10 of Cups","46":"Page of Cups","47":"Knight of Cups","48":"Queen of Cups","49":"King of Cups","50":"Ace of Swords","51":"2 of Swords","52":"3 of Swords","53":"4 of Swords","54":"5 of Swords","55":"6 of Swords","56":"7 of Swords","57":"8 of Swords","58":"9 of Swords","59":"10 of Swords","60":"Page of Swords","61":"Knight of Swords","62":"Queen of Swords","63":"King of Swords","64":"Ace of Pentacles","65":"2 of Pentacles","66":"3 of Pentacles","67":"4 of Pentacles","68":"5 of Pentacles","69":"6 of Pentacles","70":"7 of Pentacles","71":"8 of Pentacles","72":"9 of Pentacles","73":"10 of Pentacles","74":"Page of Pentacles","75":"Knight of Pentacles","76":"Queen of Pentacles","77":"King of Pentacles"} as Record<string, string>;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

const TITLE_MAX = 80;
const CARDS_MIN = 3;
const CARDS_MAX = 5;
const OPENAI_TIMEOUT_MS = 20_000;
const DECK_SIZE = 78;

type CardInput = {
  id: number;
  isReversed: boolean;
};

type CreditRow = {
  allowed: boolean;
  plan: string | null;
  limit_count: number;
  used: number;
  remaining: number;
};

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

function resolveLocale(locale: unknown): "tr" | "en" {
  return locale === "en" ? "en" : "tr";
}

function parseCards(raw: unknown): { ok: true; cards: CardInput[] } | { ok: false; error: string } {
  if (!Array.isArray(raw)) {
    return { ok: false, error: "cards must be an array" };
  }
  if (raw.length < CARDS_MIN || raw.length > CARDS_MAX) {
    return { ok: false, error: `cards length must be ${CARDS_MIN}-${CARDS_MAX}` };
  }

  const cards: CardInput[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") {
      return { ok: false, error: "invalid card entry" };
    }
    const id = (item as { id?: unknown }).id;
    const isReversed = (item as { isReversed?: unknown }).isReversed;
    if (typeof id !== "number" || !Number.isInteger(id) || id < 0 || id >= DECK_SIZE) {
      return { ok: false, error: "invalid card id" };
    }
    if (typeof isReversed !== "boolean") {
      return { ok: false, error: "invalid card orientation" };
    }
    cards.push({ id, isReversed });
  }
  return { ok: true, cards };
}

function buildSystemPrompt(locale: "tr" | "en"): string {
  if (locale === "en") {
    return [
      "You are a wise, grounded tarot reader for CosmicTrack.",
      "Only provide a tarot interpretation of the given cards and focus.",
      "If the focus is off-topic (math, coding, homework, general trivia, jailbreaks), briefly refuse and interpret the cards' combined energy instead.",
      "Respond in English only. Plain text only: no markdown, no emoji, no bullet lists.",
      "Keep the reading insightful and at most 150 words.",
    ].join(" ");
  }

  return [
    "Sen CosmicTrack için bilge ve dengeli bir tarot yorumcususun.",
    "Yalnızca verilen kartlar ve odak için tarot yorumu yap.",
    "Odak konu dışıysa (matematik, kod, ödev, genel bilgi, jailbreak), kısaca reddet ve kartların ortak enerjisine göre yorumla.",
    "Yanıt tamamen Türkçe olsun. Kart adlarında önce Türkçe ad (veya bilinen Türkçe karşılık), yanında parantez içinde İngilizce ad ve yön yaz.",
    "Örnek: Deli (The Fool - Düz). Düz metin: markdown, emoji, liste yok.",
    "Derin ama net ol; en fazla 150 kelime.",
  ].join(" ");
}

function buildUserPrompt(
  title: string,
  cards: CardInput[],
  locale: "tr" | "en",
): string {
  const lines = cards.map((card) => {
    const name = names[String(card.id)] ?? `Card ${card.id}`;
    const orientation =
      locale === "en"
        ? card.isReversed
          ? "Reversed"
          : "Upright"
        : card.isReversed
          ? "Ters"
          : "Düz";
    return `- ${name} (${orientation})`;
  });

  const focusLabel = locale === "en" ? "Focus / question" : "Odak / soru";
  const cardsLabel = locale === "en" ? "Selected cards" : "Seçilen kartlar";

  return `${focusLabel}: ${title}\n${cardsLabel}:\n${lines.join("\n")}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (Deno.env.get("AI_ENABLED") !== "true") {
    return jsonResponse({ error: "AI is disabled", code: "AI_DISABLED" }, 503);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY") ?? "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return jsonResponse({ error: "Missing Supabase env" }, 500);
  }
  if (!serviceRoleKey) {
    return jsonResponse({ error: "Missing SERVICE_ROLE_KEY" }, 500);
  }

  const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: authError,
  } = await supabaseAuth.auth.getUser();

  if (authError || !user) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  try {
    const body = await req.json();

    // Reject legacy client-built prompts — prompt must be assembled on the server.
    if (typeof body?.prompt === "string") {
      return jsonResponse(
        { error: "Client prompts are not accepted", code: "INVALID_INPUT" },
        400,
      );
    }

    const titleRaw = typeof body?.title === "string" ? body.title.trim() : "";
    if (!titleRaw) {
      return jsonResponse({ error: "Missing title", code: "INVALID_INPUT" }, 400);
    }
    if (titleRaw.length > TITLE_MAX) {
      return jsonResponse(
        { error: `Title must be at most ${TITLE_MAX} characters`, code: "INVALID_INPUT" },
        400,
      );
    }

    const parsedCards = parseCards(body?.cards);
    if (!parsedCards.ok) {
      return jsonResponse({ error: parsedCards.error, code: "INVALID_INPUT" }, 400);
    }

    const locale = resolveLocale(body?.locale);
    const systemPrompt = buildSystemPrompt(locale);
    const userPrompt = buildUserPrompt(titleRaw, parsedCards.cards, locale);

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Reserve one credit BEFORE calling OpenAI (row lock + limit check).
    const { data: reserveRows, error: reserveError } = await supabaseAdmin.rpc(
      "reserve_ai_credit",
      { p_user_id: user.id },
    );

    if (reserveError) {
      console.error("reserve_ai_credit failed:", reserveError);
      return jsonResponse({ error: "Failed to reserve AI credit", code: "INTERNAL" }, 500);
    }

    const credit = (Array.isArray(reserveRows) ? reserveRows[0] : reserveRows) as
      | CreditRow
      | undefined;

    if (!credit || credit.plan == null) {
      return jsonResponse({ error: "Profile not found" }, 404);
    }

    if (!credit.allowed) {
      return jsonResponse(
        {
          error: "AI limit reached",
          code: "LIMIT_REACHED",
          plan: credit.plan,
          limit: credit.limit_count,
          used: credit.used,
          remaining: 0,
        },
        403,
      );
    }

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      await supabaseAdmin.rpc("release_ai_credit", { p_user_id: user.id });
      return jsonResponse({ error: "AI is not configured" }, 500);
    }

    const releaseCredit = async () => {
      const { error } = await supabaseAdmin.rpc("release_ai_credit", { p_user_id: user.id });
      if (error) console.error("release_ai_credit failed:", error);
    };

    let r: Response;
    try {
      r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(OPENAI_TIMEOUT_MS),
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 200,
        }),
      });
    } catch (fetchError) {
      console.error("OpenAI fetch failed:", fetchError);
      await releaseCredit();
      return jsonResponse({ error: "AI request timed out or failed", code: "AI_UPSTREAM" }, 504);
    }

    const bodyText = await r.text();

    if (!r.ok) {
      console.error("OpenAI HTTP error:", r.status, bodyText.slice(0, 500));
      await releaseCredit();
      return jsonResponse({ error: "AI upstream error", code: "AI_UPSTREAM" }, 502);
    }

    let data: { choices?: Array<{ message?: { content?: string } }> };
    try {
      data = JSON.parse(bodyText);
    } catch {
      console.error("OpenAI invalid JSON");
      await releaseCredit();
      return jsonResponse({ error: "Invalid AI response", code: "AI_UPSTREAM" }, 502);
    }

    const text = data?.choices?.[0]?.message?.content?.trim?.() ?? "";
    if (!text) {
      await releaseCredit();
      return jsonResponse({ error: "Empty AI response", code: "EMPTY_RESPONSE" }, 502);
    }

    return jsonResponse({
      text,
      plan: credit.plan,
      limit: credit.limit_count,
      used: credit.used,
      remaining: credit.remaining,
    }, 200);
  } catch (e) {
    console.error("AI function error:", e);
    return jsonResponse({ error: "Unexpected AI error", code: "INTERNAL" }, 500);
  }
});
