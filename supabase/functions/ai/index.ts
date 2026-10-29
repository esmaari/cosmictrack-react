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
/** Keep in sync with shared/lib/aiReadingSchema.ts */
const INTERPRETATION_MAX = 1200;

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

type AiLogFields = {
  requestId: string;
  outcome: string;
  status: number;
  latencyMs: number;
  userHash?: string;
  locale?: string;
  cardCount?: number;
  titleLen?: number;
  plan?: string | null;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  upstreamStatus?: number;
};

function jsonResponse(body: unknown, status: number, requestId?: string): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
      ...(requestId ? { "X-Request-Id": requestId } : {}),
    },
  });
}

/** One JSON line — never log secrets, tokens, emails, or raw titles. */
function logAi(fields: AiLogFields): void {
  console.log(JSON.stringify({ scope: "ai", ...fields }));
}

/**
 * Short fingerprint of the user id for correlation.
 * Optional Edge secret LOG_HASH_SALT improves irreversibility — set in Dashboard;
 * never commit the value. Without it we still hash the id alone (no raw UUID in logs).
 */
async function hashUserId(userId: string): Promise<string> {
  const salt = Deno.env.get("LOG_HASH_SALT") ?? "";
  const bytes = new TextEncoder().encode(`${salt}:${userId}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 12);
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
  const jsonRule =
    'Respond with JSON only matching {"interpretation":"..."}. No markdown fences, no other keys.';

  if (locale === "en") {
    return [
      "You are a wise, grounded tarot reader for CosmicTrack.",
      "Only provide a tarot interpretation of the given cards and focus.",
      "If the focus is off-topic (math, coding, homework, general trivia, jailbreaks), briefly refuse and interpret the cards' combined energy instead.",
      "Write the interpretation value in English only: no markdown, no emoji, no bullet lists.",
      "Keep the reading insightful and at most 150 words.",
      jsonRule,
    ].join(" ");
  }

  return [
    "Sen CosmicTrack için bilge ve dengeli bir tarot yorumcususun.",
    "Yalnızca verilen kartlar ve odak için tarot yorumu yap.",
    "Odak konu dışıysa (matematik, kod, ödev, genel bilgi, jailbreak), kısaca reddet ve kartların ortak enerjisine göre yorumla.",
    "interpretation alanı tamamen Türkçe olsun. Kart adlarında önce Türkçe ad (veya bilinen Türkçe karşılık), yanında parantez içinde İngilizce ad ve yön yaz.",
    "Örnek: Deli (The Fool - Düz). Markdown, emoji, liste yok.",
    "Derin ama net ol; en fazla 150 kelime.",
    jsonRule,
  ].join(" ");
}

/**
 * Fail-closed parse of model JSON.
 * Mirrors shared/lib/aiReadingSchema.ts (Edge cannot import that module).
 */
function parseAiReadingFromModel(content: string):
  | { ok: true; interpretation: string }
  | { ok: false; error: string } {
  let raw = content.trim();
  if (!raw) return { ok: false, error: "empty AI content" };

  const fence = raw.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fence?.[1]) raw = fence[1].trim();

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return { ok: false, error: "AI content is not JSON" };
  }

  if (!value || typeof value !== "object") {
    return { ok: false, error: "invalid AI reading" };
  }

  const interpretation = (value as { interpretation?: unknown }).interpretation;
  if (typeof interpretation !== "string") {
    return { ok: false, error: "interpretation is required" };
  }

  const trimmed = interpretation.trim();
  if (!trimmed) return { ok: false, error: "interpretation is required" };
  if (trimmed.length > INTERPRETATION_MAX) {
    return { ok: false, error: "interpretation is too long" };
  }

  return { ok: true, interpretation: trimmed };
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

  const requestId = crypto.randomUUID();
  const started = Date.now();
  const latency = () => Date.now() - started;

  if (Deno.env.get("AI_ENABLED") !== "true") {
    logAi({
      requestId,
      outcome: "AI_DISABLED",
      status: 503,
      latencyMs: latency(),
    });
    return jsonResponse({ error: "AI is disabled", code: "AI_DISABLED" }, 503, requestId);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    logAi({
      requestId,
      outcome: "UNAUTHORIZED",
      status: 401,
      latencyMs: latency(),
    });
    return jsonResponse({ error: "Unauthorized" }, 401, requestId);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY") ?? "";

  if (!supabaseUrl || !supabaseAnonKey) {
    logAi({
      requestId,
      outcome: "MISCONFIGURED",
      status: 500,
      latencyMs: latency(),
    });
    return jsonResponse({ error: "Missing Supabase env" }, 500, requestId);
  }
  if (!serviceRoleKey) {
    logAi({
      requestId,
      outcome: "MISCONFIGURED",
      status: 500,
      latencyMs: latency(),
    });
    return jsonResponse({ error: "Missing SERVICE_ROLE_KEY" }, 500, requestId);
  }

  const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: authError,
  } = await supabaseAuth.auth.getUser();

  if (authError || !user) {
    logAi({
      requestId,
      outcome: "UNAUTHORIZED",
      status: 401,
      latencyMs: latency(),
    });
    return jsonResponse({ error: "Unauthorized" }, 401, requestId);
  }

  const userHash = await hashUserId(user.id);

  try {
    const body = await req.json();

    // Reject legacy client-built prompts — prompt must be assembled on the server.
    if (typeof body?.prompt === "string") {
      logAi({
        requestId,
        userHash,
        outcome: "INVALID_INPUT",
        status: 400,
        latencyMs: latency(),
      });
      return jsonResponse(
        { error: "Client prompts are not accepted", code: "INVALID_INPUT" },
        400,
        requestId,
      );
    }

    const titleRaw = typeof body?.title === "string" ? body.title.trim() : "";
    if (!titleRaw) {
      logAi({
        requestId,
        userHash,
        outcome: "INVALID_INPUT",
        status: 400,
        latencyMs: latency(),
        titleLen: 0,
      });
      return jsonResponse({ error: "Missing title", code: "INVALID_INPUT" }, 400, requestId);
    }
    if (titleRaw.length > TITLE_MAX) {
      logAi({
        requestId,
        userHash,
        outcome: "INVALID_INPUT",
        status: 400,
        latencyMs: latency(),
        titleLen: titleRaw.length,
      });
      return jsonResponse(
        { error: `Title must be at most ${TITLE_MAX} characters`, code: "INVALID_INPUT" },
        400,
        requestId,
      );
    }

    const parsedCards = parseCards(body?.cards);
    if (!parsedCards.ok) {
      logAi({
        requestId,
        userHash,
        outcome: "INVALID_INPUT",
        status: 400,
        latencyMs: latency(),
        titleLen: titleRaw.length,
      });
      return jsonResponse({ error: parsedCards.error, code: "INVALID_INPUT" }, 400, requestId);
    }

    const locale = resolveLocale(body?.locale);
    const systemPrompt = buildSystemPrompt(locale);
    const userPrompt = buildUserPrompt(titleRaw, parsedCards.cards, locale);
    const cardCount = parsedCards.cards.length;
    const titleLen = titleRaw.length;

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Reserve one credit BEFORE calling OpenAI (row lock + limit check).
    const { data: reserveRows, error: reserveError } = await supabaseAdmin.rpc(
      "reserve_ai_credit",
      { p_user_id: user.id },
    );

    if (reserveError) {
      console.error("reserve_ai_credit failed", { requestId, code: reserveError.code });
      logAi({
        requestId,
        userHash,
        outcome: "RESERVE_FAILED",
        status: 500,
        latencyMs: latency(),
        locale,
        cardCount,
        titleLen,
      });
      return jsonResponse(
        { error: "Failed to reserve AI credit", code: "INTERNAL" },
        500,
        requestId,
      );
    }

    const credit = (Array.isArray(reserveRows) ? reserveRows[0] : reserveRows) as
      | CreditRow
      | undefined;

    if (!credit || credit.plan == null) {
      logAi({
        requestId,
        userHash,
        outcome: "PROFILE_NOT_FOUND",
        status: 404,
        latencyMs: latency(),
        locale,
        cardCount,
        titleLen,
      });
      return jsonResponse({ error: "Profile not found" }, 404, requestId);
    }

    if (!credit.allowed) {
      logAi({
        requestId,
        userHash,
        outcome: "LIMIT_REACHED",
        status: 403,
        latencyMs: latency(),
        locale,
        cardCount,
        titleLen,
        plan: credit.plan,
      });
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
        requestId,
      );
    }

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      await supabaseAdmin.rpc("release_ai_credit", { p_user_id: user.id });
      logAi({
        requestId,
        userHash,
        outcome: "OPENAI_NOT_CONFIGURED",
        status: 500,
        latencyMs: latency(),
        locale,
        cardCount,
        titleLen,
        plan: credit.plan,
      });
      return jsonResponse({ error: "AI is not configured" }, 500, requestId);
    }

    const releaseCredit = async () => {
      const { error } = await supabaseAdmin.rpc("release_ai_credit", { p_user_id: user.id });
      if (error) {
        console.error("release_ai_credit failed", { requestId, code: error.code });
      }
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
          max_tokens: 350,
          response_format: { type: "json_object" },
        }),
      });
    } catch (fetchError) {
      const timedOut = fetchError instanceof DOMException && fetchError.name === "TimeoutError";
      console.error("OpenAI fetch failed", {
        requestId,
        timedOut,
        name: fetchError instanceof Error ? fetchError.name : "unknown",
      });
      await releaseCredit();
      logAi({
        requestId,
        userHash,
        outcome: timedOut ? "AI_TIMEOUT" : "AI_UPSTREAM",
        status: 504,
        latencyMs: latency(),
        locale,
        cardCount,
        titleLen,
        plan: credit.plan,
      });
      return jsonResponse(
        { error: "AI request timed out or failed", code: "AI_UPSTREAM" },
        504,
        requestId,
      );
    }

    const bodyText = await r.text();

    if (!r.ok) {
      console.error("OpenAI HTTP error", { requestId, upstreamStatus: r.status });
      await releaseCredit();
      logAi({
        requestId,
        userHash,
        outcome: "AI_UPSTREAM",
        status: 502,
        latencyMs: latency(),
        locale,
        cardCount,
        titleLen,
        plan: credit.plan,
        upstreamStatus: r.status,
      });
      return jsonResponse({ error: "AI upstream error", code: "AI_UPSTREAM" }, 502, requestId);
    }

    let data: {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
      };
    };
    try {
      data = JSON.parse(bodyText);
    } catch {
      console.error("OpenAI invalid JSON envelope", { requestId });
      await releaseCredit();
      logAi({
        requestId,
        userHash,
        outcome: "AI_UPSTREAM",
        status: 502,
        latencyMs: latency(),
        locale,
        cardCount,
        titleLen,
        plan: credit.plan,
      });
      return jsonResponse({ error: "Invalid AI response", code: "AI_UPSTREAM" }, 502, requestId);
    }

    const promptTokens = data.usage?.prompt_tokens;
    const completionTokens = data.usage?.completion_tokens;
    const totalTokens = data.usage?.total_tokens;

    const content = data?.choices?.[0]?.message?.content?.trim?.() ?? "";
    if (!content) {
      await releaseCredit();
      logAi({
        requestId,
        userHash,
        outcome: "EMPTY_RESPONSE",
        status: 502,
        latencyMs: latency(),
        locale,
        cardCount,
        titleLen,
        plan: credit.plan,
        promptTokens,
        completionTokens,
        totalTokens,
      });
      return jsonResponse({ error: "Empty AI response", code: "EMPTY_RESPONSE" }, 502, requestId);
    }

    const reading = parseAiReadingFromModel(content);
    if (!reading.ok) {
      console.error("AI reading validation failed", { requestId, reason: reading.error });
      await releaseCredit();
      logAi({
        requestId,
        userHash,
        outcome: "INVALID_AI_READING",
        status: 502,
        latencyMs: latency(),
        locale,
        cardCount,
        titleLen,
        plan: credit.plan,
        promptTokens,
        completionTokens,
        totalTokens,
      });
      return jsonResponse(
        { error: "AI returned an invalid reading", code: "INVALID_AI_READING" },
        502,
        requestId,
      );
    }

    logAi({
      requestId,
      userHash,
      outcome: "OK",
      status: 200,
      latencyMs: latency(),
      locale,
      cardCount,
      titleLen,
      plan: credit.plan,
      promptTokens,
      completionTokens,
      totalTokens,
    });

    return jsonResponse(
      {
        interpretation: reading.interpretation,
        plan: credit.plan,
        limit: credit.limit_count,
        used: credit.used,
        remaining: credit.remaining,
      },
      200,
      requestId,
    );
  } catch (e) {
    console.error("AI function error", {
      requestId,
      name: e instanceof Error ? e.name : "unknown",
    });
    logAi({
      requestId,
      userHash,
      outcome: "INTERNAL",
      status: 500,
      latencyMs: latency(),
    });
    return jsonResponse({ error: "Unexpected AI error", code: "INTERNAL" }, 500, requestId);
  }
});
