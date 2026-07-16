import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getPublicEnv, getServerEnv } from "@/lib/env";

let client;
export function getSupabaseAdminClient() {
  if (!client) {
    const publicEnv = getPublicEnv();
    client = createClient(publicEnv.NEXT_PUBLIC_SUPABASE_URL, getServerEnv().SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
  }
  return client;
}
