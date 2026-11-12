/**
 * Supabase Edge Function: whatsapp-webhook
 * 
 * Handles Meta / WhatsApp Cloud API webhooks:
 * 1. GET: Webhook endpoint verification handshake (hub.challenge)
 * 2. POST: Inbound WhatsApp messages, quick replies, and button actions
 * 
 * Secure Environment Variables required in Supabase dashboard:
 * - WHATSAPP_VERIFY_TOKEN
 * - WHATSAPP_ACCESS_TOKEN
 * - WHATSAPP_PHONE_NUMBER_ID
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);

  // 1. Verification Handshake (GET)
  if (req.method === 'GET') {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    const expectedToken = Deno.env.get('WHATSAPP_VERIFY_TOKEN') || 'unavulink_webhook_secret_2026';

    if (mode === 'subscribe' && token === expectedToken) {
      console.log('WhatsApp webhook verified successfully.');
      return new Response(challenge, { status: 200 });
    }

    return new Response('Forbidden', { status: 403 });
  }

  // 2. Inbound Message Processing (POST)
  if (req.method === 'POST') {
    try {
      const body = await req.json();

      // Check if this is an incoming WhatsApp message notification
      if (body.object === 'whatsapp_business_account') {
        const entries = body.entry || [];
        for (const entry of entries) {
          const changes = entry.changes || [];
          for (const change of changes) {
            const value = change.value;
            const messages = value?.messages || [];

            for (const message of messages) {
              const fromNumber = message.from;
              const messageType = message.type;
              let userText = '';

              if (messageType === 'text') {
                userText = message.text.body;
              } else if (messageType === 'interactive') {
                userText = message.interactive?.button_reply?.title || message.interactive?.list_reply?.title || '';
              }

              console.log(`Received WhatsApp from ${fromNumber}: "${userText}"`);

              // Process query and route response
              await routeAndRespond(fromNumber, userText);
            }
          }
        }

        return new Response(JSON.stringify({ status: 'EVENT_RECEIVED' }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response('Not Found', { status: 404 });
    } catch (err: any) {
      console.error('Error handling WhatsApp webhook:', err);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response('Method not allowed', { status: 405 });
});

/**
 * Dispatch automated response back via Meta Graph API
 */
async function routeAndRespond(toPhone: string, text: string) {
  const token = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
  const phoneId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');

  if (!token || !phoneId) {
    console.warn('WhatsApp credentials not set; running in local virtual mock mode.');
    return;
  }

  const normalized = text.toLowerCase();
  let replyBody = '';

  if (normalized.includes('donate')) {
    replyBody = '🍛 UnavuLink Surplus Intake:\nPlease reply with:\n1. Food Name & Quantity (portions)\n2. Safe Temperature (°C)\n3. Pickup Address';
  } else if (normalized.includes('track')) {
    replyBody = '🛵 UnavuLink Live Tracking:\nActive rescue mission #MSN-101 is en route to Ukkadam Shelter.\nDriver: Karthik S. (+91 98422 60006)\nETA: 14 mins.';
  } else if (normalized.includes('otp')) {
    replyBody = '🔑 Dual OTP Verification:\nYour 6-digit delivery receipt verification code is: 482910.\nPlease hand this only to the verified volunteer upon receiving catering drums.';
  } else {
    replyBody = 'Vanakkam! 🙏 UnavuLink is Tamil Nadu’s AI Food Rescue Network.\nReply:\n• "DONATE" to report surplus meals\n• "TRACK" to check mission status\n• "OTP" to verify delivery handover';
  }

  const payload = {
    messaging_product: 'whatsapp',
    to: toPhone,
    type: 'text',
    text: { body: replyBody }
  };

  try {
    const res = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const resJson = await res.json();
    console.log('WhatsApp reply sent:', resJson);
  } catch (err) {
    console.error('Failed to post to Meta Graph API:', err);
  }
}
