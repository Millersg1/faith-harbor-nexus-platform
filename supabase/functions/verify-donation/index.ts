import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const { sessionId } = await req.json();
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      // Update donation status
      if (session.mode === 'payment') {
        // One-time payment
        await supabaseClient
          .from("donations")
          .update({ 
            status: 'completed',
            stripe_payment_intent_id: session.payment_intent 
          })
          .eq('stripe_payment_intent_id', session.payment_intent);
      } else if (session.mode === 'subscription') {
        // Recurring payment
        await supabaseClient
          .from("donations")
          .update({ 
            status: 'completed',
            stripe_subscription_id: session.subscription 
          })
          .eq('stripe_subscription_id', session.subscription);
      }
    }

    return new Response(JSON.stringify({ 
      status: session.payment_status,
      amount: session.amount_total,
      currency: session.currency 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Donation verification error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});