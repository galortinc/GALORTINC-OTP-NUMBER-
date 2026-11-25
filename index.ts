// Secure server-side provider adapter TEMPLATE.
// Deploy as a Supabase Edge Function only after reviewing the provider's official
// terms, permitted use cases, and API documentation. This intentionally does not
// call a live provider or implement temporary-number/account-verification resale.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("APP_ORIGIN") ?? "https://your-approved-app.example",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });
  }

  // Require a signed-in user. In production, validate the JWT with Supabase Auth
  // and check that this user is authorized for the business/service requested.
  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return Response.json({ error: "Authentication required" }, { status: 401, headers: corsHeaders });
  }

  // Secret is read only on the server. Set it with:
  // supabase secrets set SMS_PROVIDER_API_KEY=...
  const providerApiKey = Deno.env.get("SMS_PROVIDER_API_KEY");
  if (!providerApiKey) {
    return Response.json({ error: "Provider is not configured yet" }, { status: 503, headers: corsHeaders });
  }

  let body: { action?: string; businessService?: string; recipient?: string };
  try { body = await req.json(); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400, headers: corsHeaders }); }

  // TODO: validate action against an allowlist; validate the recipient's consent;
  // verify business ownership; apply rate limits; write audit log.
  // TODO: implement ONLY endpoints and request formats from the provider's
  // official documentation, for an approved business-owned messaging workflow.
  // Never return providerApiKey or raw secret-bearing headers to the client.
  void providerApiKey;
  void body;

  return Response.json({
    status: "not_implemented",
    message: "Provider adapter placeholder. Add approved documented API calls here."
  }, { status: 501, headers: corsHeaders });
});