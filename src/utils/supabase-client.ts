import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Replace these with your Supabase project URL and anon key
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getSupabaseClientWithToken = (
  accessToken: string
): SupabaseClient => {
  return createClient(supabaseUrl, accessToken);
};
