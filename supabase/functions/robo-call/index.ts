import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

const RoboCallSchema = z.object({
  recipients: z.array(z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')).min(1).max(1000, 'Too many recipients'),
  message: z.string().trim().min(1, 'Message required').max(1000, 'Message too long'),
  name: z.string().trim().max(100).optional(),
  voice: z.enum(['alice', 'man', 'woman']).default('alice'),
  language: z.string().max(10).default('en'),
  scheduledFor: z.string().optional(),
  gatherResponses: z.boolean().default(false),
  maxRetries: z.number().int().min(0).max(5).default(2),
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
    const validated = RoboCallSchema.parse(body);

    console.log(`Starting robo call campaign "${validated.name || 'Unnamed'}" to ${validated.recipients.length} recipients`);

    // Create TwiML for the robo call with escaped content
    const safeMessage = escapeXml(validated.message);
    let twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say voice="${validated.voice}" language="${validated.language}">Hello, this is an important message from Faith Harbor Church.</Say>
      <Pause length="1"/>
      <Say voice="${validated.voice}" language="${validated.language}">${safeMessage}</Say>`;

    if (validated.gatherResponses) {
      const safePrompt = escapeXml('Press 1 if you received this message clearly, press 2 if you need to speak with someone, or simply hang up.');
      twiml += `
        <Pause length="1"/>
        <Gather input="dtmf" numDigits="1" timeout="10" action="/robo-call-response">
          <Say voice="${validated.voice}" language="${validated.language}">${safePrompt}</Say>
        </Gather>
        <Say voice="${validated.voice}" language="${validated.language}">Thank you for your time.</Say>`;
    } else {
      twiml += `
        <Pause length="1"/>
        <Say voice="${validated.voice}" language="${validated.language}">Thank you and God bless!</Say>`;
    }

    twiml += `
    </Response>`;

    const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
    const callResults = [];
    const batchSize = 5; // Process calls in batches to avoid overwhelming Twilio
    
    // Process recipients in batches
    for (let i = 0; i < validated.recipients.length; i += batchSize) {
      const batch = validated.recipients.slice(i, i + batchSize);
      const batchPromises = batch.map(async (phoneNumber) => {
        try {
          const callData = new URLSearchParams({
            To: phoneNumber,
            From: TWILIO_PHONE_NUMBER,
            Twiml: twiml,
            StatusCallback: `${Deno.env.get('SUPABASE_URL')}/functions/v1/robo-call-status`,
            StatusCallbackEvent: 'initiated,ringing,answered,completed,busy,failed,no-answer',
            MachineDetection: 'Enable', // Detect answering machines
            MachineDetectionTimeout: '5'
          });

          // If scheduled, use Twilio's scheduling (requires TwiML Bins)
          if (validated.scheduledFor) {
            // For scheduled calls, you'd typically store in database and use a cron job
            console.log(`Call to ${phoneNumber} scheduled for ${validated.scheduledFor}`);
            return {
              to: phoneNumber,
              status: 'scheduled',
              scheduled_for: validated.scheduledFor
            };
          }

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
            console.error(`Failed to call ${phoneNumber}:`, errorText);
            return {
              to: phoneNumber,
              status: 'failed',
              error: errorText
            };
          }

          const callResult = await response.json();
          console.log(`Call initiated to ${phoneNumber}: ${callResult.sid}`);
          
          return {
            to: phoneNumber,
            status: 'initiated',
            callSid: callResult.sid,
            twilioStatus: callResult.status
          };

        } catch (error) {
          console.error(`Error calling ${phoneNumber}:`, error);
          return {
            to: phoneNumber,
            status: 'failed',
            error: error.message
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      callResults.push(...batchResults);

      // Add delay between batches to respect rate limits
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Calculate statistics
    const stats = {
      total: callResults.length,
      initiated: callResults.filter(r => r.status === 'initiated').length,
      failed: callResults.filter(r => r.status === 'failed').length,
      scheduled: callResults.filter(r => r.status === 'scheduled').length
    };

    console.log('Robo call campaign completed:', stats);

    return new Response(JSON.stringify({
      success: true,
      campaignName: validated.name || 'Unnamed',
      message: 'Robo call campaign initiated successfully',
      results: callResults,
      statistics: stats,
      twiml: twiml
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in robo-call function:", error);

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
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);