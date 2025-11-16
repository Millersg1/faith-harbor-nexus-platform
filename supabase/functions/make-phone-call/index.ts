import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

const PhoneCallSchema = z.object({
  to: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  message: z.string().trim().max(1000, 'Message too long').optional(),
  voice: z.enum(['alice', 'man', 'woman']).default('alice'),
  language: z.string().max(10).default('en'),
  recordCall: z.boolean().default(false),
  gatherInput: z.boolean().default(false),
});

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Authentication required' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      throw new Error('Missing required Twilio credentials');
    }

    // Input validation
    const body = await req.json();
    const validated = PhoneCallSchema.parse(body);

    console.log(`Initiating call to ${validated.to} with message: ${validated.message}`);

    // Create TwiML for the call with escaped content
    let twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>`;

    if (validated.message) {
      const safeMessage = escapeXml(validated.message);
      twiml += `
        <Say voice="${validated.voice}" language="${validated.language}">${safeMessage}</Say>`;
    }

    if (validated.gatherInput) {
      const safePrompt = escapeXml('Press 1 to confirm your attendance, or press 2 to decline. Press 9 to speak with someone.');
      twiml += `
        <Gather input="dtmf" numDigits="1" timeout="10">
          <Say voice="${validated.voice}" language="${validated.language}">${safePrompt}</Say>
        </Gather>
        <Say voice="${validated.voice}" language="${validated.language}">We didn't receive a response. Thank you for your time.</Say>`;
    }

    if (validated.recordCall) {
      twiml += `
        <Record maxLength="60" playBeep="true" recordingStatusCallback="/recording-status" />`;
    }

    twiml += `
      <Say voice="${validated.voice}" language="${validated.language}">Thank you and God bless!</Say>
    </Response>`;

    console.log('Generated TwiML:', twiml);

    // Make the call using Twilio API
    const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
    const callData = new URLSearchParams({
      To: validated.to,
      From: TWILIO_PHONE_NUMBER,
      Twiml: twiml,
      Record: validated.recordCall ? 'true' : 'false',
      RecordingStatusCallback: validated.recordCall ? `${Deno.env.get('SUPABASE_URL')}/functions/v1/recording-webhook` : '',
      StatusCallback: `${Deno.env.get('SUPABASE_URL')}/functions/v1/call-status-webhook`,
      StatusCallbackEvent: 'initiated,ringing,answered,completed'
    });

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: callData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Twilio API error:', errorText);
      throw new Error(`Failed to initiate call: ${response.status} ${errorText}`);
    }

    const callResult = await response.json();
    
    console.log('Call initiated successfully:', callResult.sid);

    return new Response(JSON.stringify({
      success: true,
      callSid: callResult.sid,
      status: callResult.status,
      to: callResult.to,
      from: callResult.from,
      message: 'Call initiated successfully'
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in make-phone-call function:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          error: 'Validation failed',
          details: error.errors,
          success: false
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 400,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
