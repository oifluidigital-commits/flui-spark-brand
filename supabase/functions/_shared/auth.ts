import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

export { corsHeaders };

/**
 * Authenticate the request and return the user object.
 * Throws a Response if auth fails.
 */
export async function authenticateRequest(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    throw new Response(
      JSON.stringify({ error: "Não autorizado. Faça login para continuar." }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader } } }
  );

  const {
    data: { user },
    error: authError,
  } = await supabaseClient.auth.getUser();

  if (authError || !user) {
    throw new Response(
      JSON.stringify({ error: "Token inválido ou expirado." }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return { user, supabaseClient };
}

/**
 * Sanitize a string input: trim, truncate to maxLength, collapse newlines.
 */
export function sanitizeString(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  return input.trim().substring(0, maxLength).replace(/[\n\r]+/g, " ");
}

/**
 * Sanitize an array of strings with per-item and total limits.
 */
export function sanitizeStringArray(
  input: unknown,
  maxItems: number,
  maxItemLength: number
): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .slice(0, maxItems)
    .map((item) => sanitizeString(item, maxItemLength))
    .filter((s) => s.length > 0);
}

/**
 * Clamp a number between min and max.
 */
export function clampNumber(input: unknown, min: number, max: number, fallback: number): number {
  const n = typeof input === "number" ? input : Number(input);
  if (isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}
