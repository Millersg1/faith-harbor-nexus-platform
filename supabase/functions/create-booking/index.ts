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
    // Create Supabase client with service role key for backend operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get the authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("User not authenticated");
    }

    const user = userData.user;
    const { serviceId, bookingDate, duration, customerNotes, bookingType, recurringFrequency } = await req.json();

    // Get service details
    const { data: service, error: serviceError } = await supabaseClient
      .from('services')
      .select('*, provider:provider_profiles(user_id, business_name)')
      .eq('id', serviceId)
      .single();

    if (serviceError || !service) {
      throw new Error("Service not found");
    }

    // Calculate total amount
    let totalAmount = 0;
    if (service.price_type === 'fixed') {
      totalAmount = service.price_amount;
    } else if (service.price_type === 'hourly') {
      totalAmount = service.hourly_rate * (duration / 60); // Convert minutes to hours
    }

    // Create booking record with automatic amount calculations via trigger
    const { data: booking, error: bookingError } = await supabaseClient
      .from('service_bookings')
      .insert({
        service_id: serviceId,
        customer_id: user.id,
        provider_id: service.provider_id,
        booking_date: bookingDate,
        duration_hours: Math.ceil(duration / 60),
        total_amount: totalAmount,
        booking_type: bookingType,
        recurring_frequency: bookingType === 'recurring' ? recurringFrequency : null,
        customer_notes: customerNotes,
        status: 'pending_approval'
      })
      .select()
      .single();

    if (bookingError) {
      throw new Error(`Failed to create booking: ${bookingError.message}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      booking: booking,
      message: "Booking request sent to provider for approval"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in create-booking function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});