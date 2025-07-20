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

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    const user = userData.user;
    const { bookingId, paymentType } = await req.json(); // paymentType: 'upfront' or 'completion'

    // Get booking details
    const { data: booking, error: bookingError } = await supabaseClient
      .from('service_bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('customer_id', user.id)
      .single();

    if (bookingError || !booking) {
      throw new Error("Booking not found or unauthorized");
    }

    // Validate payment type and booking status
    if (paymentType === 'upfront' && booking.status !== 'approved') {
      throw new Error("Booking must be approved before payment");
    }
    
    if (paymentType === 'completion' && booking.status !== 'in_progress') {
      throw new Error("Service must be in progress for completion payment");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Get or create Stripe customer
    const customers = await stripe.customers.list({ 
      email: user.email, 
      limit: 1 
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id }
      });
      customerId = customer.id;
    }

    // Determine payment amount
    const amount = paymentType === 'upfront' ? booking.upfront_amount : booking.completion_amount;

    // Create payment based on booking type
    let sessionUrl;
    
    if (booking.booking_type === 'one_time') {
      // One-time payment session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { 
                name: `Service Payment - ${paymentType === 'upfront' ? 'Upfront' : 'Completion'}`,
                metadata: { 
                  booking_id: bookingId,
                  payment_type: paymentType 
                }
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.get("origin")}/marketplace?payment=success&booking=${bookingId}`,
        cancel_url: `${req.headers.get("origin")}/marketplace?payment=cancelled&booking=${bookingId}`,
        metadata: {
          booking_id: bookingId,
          payment_type: paymentType,
          user_id: user.id
        }
      });
      sessionUrl = session.url;

      // Create payment transaction record
      await supabaseClient
        .from('payment_transactions')
        .insert({
          booking_id: bookingId,
          stripe_payment_intent_id: session.payment_intent as string,
          amount: amount,
          transaction_type: paymentType,
          payment_method: 'stripe_card',
          status: 'pending'
        });

    } else {
      // Recurring subscription
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { 
                name: `Recurring Service - ${paymentType === 'upfront' ? 'Setup' : 'Service'}`,
                metadata: { 
                  booking_id: bookingId,
                  payment_type: paymentType 
                }
              },
              unit_amount: amount,
              recurring: { 
                interval: booking.recurring_frequency === 'weekly' ? 'week' : 
                          booking.recurring_frequency === 'quarterly' ? 'month' : 'month',
                interval_count: booking.recurring_frequency === 'quarterly' ? 3 : 1
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.get("origin")}/marketplace?payment=success&booking=${bookingId}`,
        cancel_url: `${req.headers.get("origin")}/marketplace?payment=cancelled&booking=${bookingId}`,
        metadata: {
          booking_id: bookingId,
          payment_type: paymentType,
          user_id: user.id
        }
      });
      sessionUrl = session.url;

      // Create payment transaction record
      await supabaseClient
        .from('payment_transactions')
        .insert({
          booking_id: bookingId,
          stripe_subscription_id: session.subscription as string,
          amount: amount,
          transaction_type: paymentType,
          payment_method: 'stripe_subscription',
          status: 'pending'
        });
    }

    // Update booking status
    const newStatus = paymentType === 'upfront' ? 'upfront_paid' : 'completed';
    await supabaseClient
      .from('service_bookings')
      .update({ 
        status: 'payment_pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId);

    return new Response(JSON.stringify({ url: sessionUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in process-payment function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});