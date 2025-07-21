import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

interface CallRequest {
  to: string;
  message?: string;
  voice?: 'alice' | 'man' | 'woman';
  language?: string;
  recordCall?: boolean;
  gatherInput?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      throw new Error('Missing required Twilio credentials');
    }

    const { to, message, voice = 'alice', language = 'en', recordCall = false, gatherInput = false }: CallRequest = await req.json();

    if (!to) {
      throw new Error('Phone number (to) is required');
    }

    console.log(`Initiating call to ${to} with message: ${message}`);

    // Create TwiML for the call
    let twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>`;

    if (message) {
      twiml += `
        <Say voice="${voice}" language="${language}">${message}</Say>`;
    }

    if (gatherInput) {
      twiml += `
        <Gather input="dtmf" numDigits="1" timeout="10">
          <Say voice="${voice}" language="${language}">Press 1 to confirm your attendance, or press 2 to decline. Press 9 to speak with someone.</Say>
        </Gather>
        <Say voice="${voice}" language="${language}">We didn't receive a response. Thank you for your time.</Say>`;
    }

    if (recordCall) {
      twiml += `
        <Record maxLength="60" playBeep="true" recordingStatusCallback="/recording-status" />`;
    }

    twiml += `
      <Say voice="${voice}" language="${language}">Thank you and God bless!</Say>
    </Response>`;

    console.log('Generated TwiML:', twiml);

    // Make the call using Twilio API
    const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
    const callData = new URLSearchParams({
      To: to,
      From: TWILIO_PHONE_NUMBER,
      Twiml: twiml,
      Record: recordCall ? 'true' : 'false',
      RecordingStatusCallback: recordCall ? `${Deno.env.get('SUPABASE_URL')}/functions/v1/recording-webhook` : '',
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