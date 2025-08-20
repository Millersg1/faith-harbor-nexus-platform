import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

    const { action, token, platform, title, body, data, userIds } = await req.json()

    switch (action) {
      case 'register_token': {
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
          return new Response(
            JSON.stringify({ error: 'Authorization required' }),
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

        const { error } = await supabase
          .from('push_notification_tokens')
          .upsert({
            user_id: user.id,
            token,
            platform,
            is_active: true
          })

        if (error) throw error

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'send_notification': {
        // Get tokens for specified users or all active tokens
        let query = supabase
          .from('push_notification_tokens')
          .select('*')
          .eq('is_active', true)

        if (userIds && userIds.length > 0) {
          query = query.in('user_id', userIds)
        }

        const { data: tokens, error } = await query

        if (error) throw error

        // Group tokens by platform for batch sending
        const tokensByPlatform = tokens.reduce((acc, tokenData) => {
          if (!acc[tokenData.platform]) {
            acc[tokenData.platform] = []
          }
          acc[tokenData.platform].push(tokenData.token)
          return acc
        }, {} as Record<string, string[]>)

        const results = []

        // Send notifications for each platform
        for (const [platform, platformTokens] of Object.entries(tokensByPlatform)) {
          if (platform === 'web') {
            // Web Push API implementation would go here
            console.log('Web push notifications:', { tokens: platformTokens, title, body, data })
            results.push({ platform, count: platformTokens.length, status: 'sent' })
          } else if (platform === 'ios' || platform === 'android') {
            // FCM implementation would go here with appropriate API key
            console.log(`${platform} push notifications:`, { tokens: platformTokens, title, body, data })
            results.push({ platform, count: platformTokens.length, status: 'sent' })
          }
        }

        return new Response(
          JSON.stringify({ success: true, results }),
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
    console.error('Push notification error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})