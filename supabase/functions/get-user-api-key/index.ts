import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    // Get the user from the auth token
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user) throw new Error('User not authenticated');

    // Check if user has an active subscription
    const { data: subscription, error: subError } = await supabaseClient
      .from('subscriptions')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (subError && subError.code !== 'PGRST116') {
      throw new Error('Error checking subscription');
    }

    if (!subscription) {
      return new Response(JSON.stringify({ error: 'Active subscription required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    // Get the request body
    const { serviceName } = await req.json();
    
    if (!serviceName) {
      throw new Error('Service name is required');
    }

    // Get the API key for the specified service
    const { data: apiKeyData, error: apiKeyError } = await supabaseClient
      .from('user_api_keys')
      .select('api_key_encrypted, service_label')
      .eq('user_id', user.id)
      .eq('service_name', serviceName)
      .eq('is_active', true)
      .single();

    if (apiKeyError && apiKeyError.code !== 'PGRST116') {
      throw new Error(`Error retrieving API key: ${apiKeyError.message}`);
    }

    if (!apiKeyData) {
      return new Response(JSON.stringify({ 
        error: `No API key found for service: ${serviceName}`,
        hasKey: false 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Decrypt the API key (simple base64 decode - in production, use proper encryption)
    const decryptedKey = atob(apiKeyData.api_key_encrypted);

    return new Response(JSON.stringify({ 
      apiKey: decryptedKey,
      serviceLabel: apiKeyData.service_label,
      hasKey: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Error in get-user-api-key:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});