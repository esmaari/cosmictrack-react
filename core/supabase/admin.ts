import { createClient } from "@supabase/supabase-js"
import { getSupabaseSecretKey, getSupabaseUrl } from "@/core/supabase/env"

/** Server-only admin client (secret / service_role). Never import in client components. */
export function createSupabaseAdminClient() {
  return createClient(getSupabaseUrl(), getSupabaseSecretKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
