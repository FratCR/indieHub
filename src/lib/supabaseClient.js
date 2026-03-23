import { createClient } from "@supabase/supabase-js";

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function normalizeSupabaseUrl(url) {
  if (!url) return "";
  // Kullanıcı bazen sadece "projectRef" verir: vljvqftirubxeggagiub
  // Supabase client için tam URL gerekir: https://<ref>.supabase.co
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}.supabase.co`;
}

let supabaseClient = null;
let supabaseInitError = "";

// Secret bilgileri kodun içine koymak yerine env değişkenlerinden okuyarak tutuyoruz.
// Hatalı URL gibi durumlarda crash olmaması için try/catch ile koruyoruz.
try {
  const supabaseUrl = normalizeSupabaseUrl(rawSupabaseUrl);
  if (supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (e) {
  supabaseInitError =
    e instanceof Error ? e.message : "Supabase client init hatası";
}

export { supabaseClient as supabase, supabaseInitError };

