import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { authenticator } from 'https://esm.sh/otplib@12.0.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { action, token } = await req.json()

    switch (action) {
      case 'setup': {
        // Generate secret for 2FA setup
        const secret = authenticator.generateSecret()
        const qrCodeUrl = authenticator.keyuri(user.email!, 'Faith Harbor', secret)
        
        // Store secret temporarily (not enabled yet)
        const backupCodes = Array.from({ length: 8 }, () => 
          Math.random().toString(36).substring(2, 8).toUpperCase()
        )
        
        const { error } = await supabase
          .from('user_two_factor')
          .upsert({
            user_id: user.id,
            secret,
            backup_codes: backupCodes,
            is_enabled: false
          })
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ secret, qrCodeUrl, backupCodes }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'verify': {
        // Verify token and enable 2FA
        const { data: twoFactor } = await supabase
          .from('user_two_factor')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        if (!twoFactor) {
          return new Response(
            JSON.stringify({ error: '2FA not set up' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        const isValid = authenticator.verify({ token, secret: twoFactor.secret })
        
        if (!isValid) {
          return new Response(
            JSON.stringify({ error: 'Invalid token' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        await supabase
          .from('user_two_factor')
          .update({ is_enabled: true, last_used_at: new Date().toISOString() })
          .eq('user_id', user.id)
        
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'disable': {
        await supabase
          .from('user_two_factor')
          .delete()
          .eq('user_id', user.id)
        
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('2FA Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})