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
    const { amount, donationType, category, donorName, donorEmail, message, anonymous, frequency } = await req.json();
    
    // Get authenticated user if available
    const authHeader = req.headers.get("Authorization");
    let user = null;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      user = data.user;
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ 
      email: donorEmail, 
      limit: 1 
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    let session;
    
    if (donationType === 'recurring') {
      // Create recurring donation subscription
      session = await stripe.checkout.sessions.create({
        customer: customerId,
        customer_email: customerId ? undefined : donorEmail,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { 
                name: `${category} Donation - ${frequency}`,
                description: message || `Monthly donation to Faith Harbor`
              },
              unit_amount: amount,
              recurring: { 
                interval: frequency === 'weekly' ? 'week' : frequency === 'yearly' ? 'year' : 'month'
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.get("origin")}/donation-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get("origin")}/`,
        metadata: {
          donationType: 'recurring',
          category,
          donorName,
          anonymous: anonymous.toString(),
          userId: user?.id || '',
        }
      });
    } else {
      // Create one-time donation
      session = await stripe.checkout.sessions.create({
        customer: customerId,
        customer_email: customerId ? undefined : donorEmail,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { 
                name: `${category} Donation`,
                description: message || `One-time donation to Faith Harbor`
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.get("origin")}/donation-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get("origin")}/`,
        metadata: {
          donationType: 'one-time',
          category,
          donorName,
          anonymous: anonymous.toString(),
          userId: user?.id || '',
        }
      });
    }

    // Record donation in database
    await supabaseClient.from("donations").insert({
      donor_id: user?.id || null,
      donor_email: donorEmail,
      donor_name: donorName,
      amount,
      donation_type: donationType,
      category,
      stripe_payment_intent_id: donationType === 'one-time' ? session.payment_intent : null,
      stripe_subscription_id: donationType === 'recurring' ? session.subscription : null,
      status: 'pending',
      message,
      anonymous,
      recurring_frequency: donationType === 'recurring' ? frequency : null,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Donation creation error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});