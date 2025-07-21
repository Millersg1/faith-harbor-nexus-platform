import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

interface RoboCallRequest {
  name: string;
  message: string;
  recipients: string[];
  voice?: 'alice' | 'man' | 'woman';
  language?: string;
  scheduledFor?: string;
  gatherResponses?: boolean;
  maxRetries?: number;
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

    const { 
      name, 
      message, 
      recipients, 
      voice = 'alice', 
      language = 'en',
      scheduledFor,
      gatherResponses = false,
      maxRetries = 2
    }: RoboCallRequest = await req.json();

    if (!recipients || recipients.length === 0) {
      throw new Error('Recipients list is required and cannot be empty');
    }

    if (!message) {
      throw new Error('Message is required');
    }

    console.log(`Starting robo call campaign "${name}" to ${recipients.length} recipients`);

    // Create TwiML for the robo call
    let twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say voice="${voice}" language="${language}">Hello, this is an important message from Faith Harbor Church.</Say>
      <Pause length="1"/>
      <Say voice="${voice}" language="${language}">${message}</Say>`;

    if (gatherResponses) {
      twiml += `
        <Pause length="1"/>
        <Gather input="dtmf" numDigits="1" timeout="10" action="/robo-call-response">
          <Say voice="${voice}" language="${language}">Press 1 if you received this message clearly, press 2 if you need to speak with someone, or simply hang up.</Say>
        </Gather>
        <Say voice="${voice}" language="${language}">Thank you for your time.</Say>`;
    } else {
      twiml += `
        <Pause length="1"/>
        <Say voice="${voice}" language="${language}">Thank you and God bless!</Say>`;
    }

    twiml += `
    </Response>`;

    const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
    const callResults = [];
    const batchSize = 5; // Process calls in batches to avoid overwhelming Twilio
    
    // Process recipients in batches
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
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
          if (scheduledFor) {
            // For scheduled calls, you'd typically store in database and use a cron job
            console.log(`Call to ${phoneNumber} scheduled for ${scheduledFor}`);
            return {
              to: phoneNumber,
              status: 'scheduled',
              scheduled_for: scheduledFor
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
      campaignName: name,
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