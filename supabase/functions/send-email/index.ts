// Deploy with: supabase functions deploy send-email
// Set RESEND_API_KEY and EMAIL_FROM as Supabase Function secrets.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("APP_ORIGIN") ?? "http://localhost:5173",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[char] ?? char));

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return Response.json({ success: false, error: "Method not allowed" }, { status: 405, headers: corsHeaders });

  const authorization = request.headers.get("Authorization");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("EMAIL_FROM");

  if (!authorization || !supabaseUrl || !anonKey) {
    return Response.json({ success: false, error: "Authentication is required." }, { status: 401, headers: corsHeaders });
  }
  if (!resendKey || !from) {
    return Response.json({ success: false, error: "Email provider secrets are not configured." }, { status: 503, headers: corsHeaders });
  }

  const client = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } });
  const { data: userResult, error: userError } = await client.auth.getUser();
  const user = userResult.user;
  if (userError || !user || !user.email) {
    return Response.json({ success: false, error: "Invalid authentication session." }, { status: 401, headers: corsHeaders });
  }

  let payload: Record<string, unknown>;
  try { payload = await request.json(); }
  catch { return Response.json({ success: false, error: "Invalid JSON body." }, { status: 400, headers: corsHeaders }); }

  const recipient = String(payload.to ?? "").trim().toLowerCase();
  if (!recipient || recipient !== user.email.toLowerCase()) {
    return Response.json({ success: false, error: "Users may only send account emails to their own verified address." }, { status: 403, headers: corsHeaders });
  }

  const subject = String(payload.subject ?? "UnavuLink notification").slice(0, 180);
  const title = escapeHtml(String(payload.title ?? subject).slice(0, 180));
  const recipientName = escapeHtml(String(payload.recipientName ?? "UnavuLink member").slice(0, 100));
  const bodyLines = Array.isArray(payload.bodyLines) ? payload.bodyLines.slice(0, 8).map((line) => `<p>${escapeHtml(String(line).slice(0, 1000))}</p>`).join("") : "";
  const actionUrl = typeof payload.actionUrl === "string" ? payload.actionUrl : "";
  const safeAction = actionUrl.startsWith("https://") || actionUrl.startsWith("http://") ? actionUrl : "";
  const actionLabel = escapeHtml(String(payload.actionLabel ?? "Open UnavuLink").slice(0, 80));
  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;color:#26332B"><h2 style="color:#2E6B3F">UnavuLink</h2><h3>${title}</h3><p>Hello ${recipientName},</p>${bodyLines}${safeAction ? `<p><a href="${escapeHtml(safeAction)}" style="display:inline-block;background:#2E6B3F;color:white;padding:12px 18px;border-radius:6px;text-decoration:none">${actionLabel}</a></p>` : ""}<hr/><small>Every Meal Deserves a Destination.</small></div>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [recipient], subject, html }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    return Response.json({ success: false, error: result.message ?? "Email provider rejected the request." }, { status: 502, headers: corsHeaders });
  }
  return Response.json({ success: true, id: result.id }, { headers: corsHeaders });
});
