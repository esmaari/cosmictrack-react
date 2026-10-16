/**
 * Friend-beta / v1 switches.
 * AI stays off until NEXT_PUBLIC_AI_ENABLED=true (local + Netlify).
 */
export function isAiEnabled(): boolean {
  return process.env.NEXT_PUBLIC_AI_ENABLED === "true"
}
