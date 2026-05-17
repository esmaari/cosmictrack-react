import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

const FREE_DAILY_LIMIT = 1;
const PREMIUM_MONTHLY_LIMIT = 100;

type ProfileRow = {
  id: string;
  plan: string;
  ai_used_count: number;
  ai_period_start: string;
};

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

function utcDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function utcMonthKey(date: Date): string {
  return date.toISOString().slice(0, 7);
}

function isPremiumPlan(plan: string): boolean {
  return plan === "premium";
}

function getLimitForPlan(plan: string): number {
  return isPremiumPlan(plan) ? PREMIUM_MONTHLY_LIMIT : FREE_DAILY_LIMIT;
}

function periodExpired(plan: string, periodStart: string, now: Date): boolean {
  const start = new Date(periodStart);
  if (Number.isNaN(start.getTime())) return true;

  if (isPremiumPlan(plan)) {
    return utcMonthKey(start) !== utcMonthKey(now);
  }
  return utcDayKey(start) !== utcDayKey(now);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
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
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return jsonResponse({ error: "Missing prompt" }, 400);
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, plan, ai_used_count, ai_period_start")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return jsonResponse({ error: "Profile not found" }, 404);
    }

    const row = profile as ProfileRow;
    const now = new Date();
    const limit = getLimitForPlan(row.plan);
    const resetPeriod = periodExpired(row.plan, row.ai_period_start, now);
    let usedCount = resetPeriod ? 0 : row.ai_used_count;

    if (usedCount >= limit) {
      return jsonResponse(
        {
          error: "AI limit reached",
          code: "LIMIT_REACHED",
          plan: row.plan,
          limit,
          used: usedCount,
          remaining: 0,
        },
        403,
      );
    }

    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiKey) {
      return jsonResponse({ error: "No OPENAI_API_KEY" }, 500);
    }

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    const bodyText = await r.text();

    if (!r.ok) {
      return jsonResponse({ error: bodyText }, r.status);
    }

    let data: { choices?: Array<{ message?: { content?: string } }> };
    try {
      data = JSON.parse(bodyText);
    } catch {
      return jsonResponse({ error: "Invalid JSON from OpenAI", raw: bodyText }, 500);
    }

    const text = data?.choices?.[0]?.message?.content?.trim?.() ?? "";
    const newCount = usedCount + 1;

    const profileUpdate: { ai_used_count: number; ai_period_start?: string } = {
      ai_used_count: newCount,
    };
    if (resetPeriod) {
      profileUpdate.ai_period_start = now.toISOString();
    }

    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update(profileUpdate)
      .eq("id", user.id);

    if (updateError) {
      console.error("Failed to update AI usage:", updateError);
      return jsonResponse({ error: "Failed to record AI usage" }, 500);
    }

    return jsonResponse({
      text,
      plan: row.plan,
      limit,
      used: newCount,
      remaining: Math.max(0, limit - newCount),
    }, 200);
  } catch (e) {
    console.error("AI function error:", e);
    return jsonResponse({ error: String(e) }, 500);
  }
});
