import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser-only singleton Supabase client.
// All auth and data operations run client-side — no SSR package required.
let _client: ReturnType<typeof createSupabaseClient<Database>> | null = null;

export function createClient() {
  if (typeof window === "undefined") {
    // Return a temporary client during SSR — pages are force-dynamic so this path is never used for data.
    return createSupabaseClient<Database>(
      supabaseUrl || "https://placeholder.supabase.co",
      supabaseAnonKey || "placeholder"
    );
  }
  if (!_client) {
    _client = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return _client;
}
