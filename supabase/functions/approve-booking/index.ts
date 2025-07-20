import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
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
    const { bookingId, action, providerNotes } = await req.json(); // action: 'approve' or 'reject'

    // Get booking details and verify provider ownership
    const { data: booking, error: bookingError } = await supabaseClient
      .from('service_bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('provider_id', user.id)
      .single();

    if (bookingError || !booking) {
      throw new Error("Booking not found or unauthorized");
    }

    if (booking.status !== 'pending_approval') {
      throw new Error("Booking is not pending approval");
    }

    let newStatus = action === 'approve' ? 'approved' : 'cancelled';
    let updateData: any = {
      status: newStatus,
      provider_notes: providerNotes,
      updated_at: new Date().toISOString()
    };

    if (action === 'approve') {
      updateData.approved_at = new Date().toISOString();
    }

    // Update booking status
    const { error: updateError } = await supabaseClient
      .from('service_bookings')
      .update(updateData)
      .eq('id', bookingId);

    if (updateError) {
      throw new Error(`Failed to update booking: ${updateError.message}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      action: action,
      message: action === 'approve' ? 
        "Booking approved. Customer can now proceed with payment." : 
        "Booking rejected."
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in approve-booking function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});