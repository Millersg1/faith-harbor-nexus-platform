import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    const { campaignId } = await req.json();

    // Get campaign details
    const { data: campaign, error: campaignError } = await supabaseClient
      .from("email_campaigns")
      .select("*")
      .eq("id", campaignId)
      .single();

    if (campaignError) throw campaignError;
    if (!campaign) throw new Error("Campaign not found");

    // Get subscribers
    const { data: subscribers, error: subscribersError } = await supabaseClient
      .from("newsletter_subscriptions")
      .select("email")
      .eq("subscribed", true)
      .eq("confirmed", true);

    if (subscribersError) throw subscribersError;
    if (!subscribers || subscribers.length === 0) {
      throw new Error("No subscribers found");
    }

    const recipientEmails = subscribers.map(sub => sub.email);
    let sentCount = 0;
    let failedCount = 0;

    // Send emails in batches to avoid rate limits
    const batchSize = 50;
    for (let i = 0; i < recipientEmails.length; i += batchSize) {
      const batch = recipientEmails.slice(i, i + batchSize);
      
      try {
        const emailResponse = await resend.emails.send({
          from: "Faith Harbor <noreply@faithharbor.org>",
          to: batch,
          subject: campaign.subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <header style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">Faith Harbor</h1>
              </header>
              
              <main style="padding: 30px; background: #ffffff;">
                <h2 style="color: #1f2937; margin-bottom: 20px;">${campaign.title}</h2>
                
                <div style="color: #374151; line-height: 1.6; white-space: pre-wrap;">
                  ${campaign.content}
                </div>
              </main>
              
              <footer style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                  Faith Harbor - Building Faith, Fostering Community, Spreading Hope
                </p>
                <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
                  <a href="mailto:unsubscribe@faithharbor.org" style="color: #6b7280;">Unsubscribe</a>
                </p>
              </footer>
            </div>
          `,
        });

        if (emailResponse.error) {
          console.error("Email send error:", emailResponse.error);
          failedCount += batch.length;
        } else {
          sentCount += batch.length;
          
          // Track email sends
          const trackingData = batch.map(email => ({
            campaign_id: campaignId,
            recipient_email: email,
            sent_at: new Date().toISOString(),
          }));
          
          await supabaseClient
            .from("email_tracking")
            .insert(trackingData);
        }
      } catch (batchError) {
        console.error("Batch send error:", batchError);
        failedCount += batch.length;
      }
    }

    // Update campaign status
    await supabaseClient
      .from("email_campaigns")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        recipient_count: sentCount,
      })
      .eq("id", campaignId);

    return new Response(
      JSON.stringify({
        success: true,
        sent: sentCount,
        failed: failedCount,
        total: recipientEmails.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Campaign send error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});