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

    const startTime = Date.now()
    const healthChecks = {
      database: { status: 'unknown', responseTime: 0 },
      auth: { status: 'unknown', responseTime: 0 },
      storage: { status: 'unknown', responseTime: 0 },
      overall: { status: 'unknown', responseTime: 0 }
    }

    // Database health check
    try {
      const dbStart = Date.now()
      await supabase.from('profiles').select('id').limit(1)
      healthChecks.database = {
        status: 'healthy',
        responseTime: Date.now() - dbStart
      }
    } catch (error) {
      healthChecks.database = {
        status: 'unhealthy',
        responseTime: Date.now() - startTime
      }
    }

    // Auth health check
    try {
      const authStart = Date.now()
      await supabase.auth.getSession()
      healthChecks.auth = {
        status: 'healthy',
        responseTime: Date.now() - authStart
      }
    } catch (error) {
      healthChecks.auth = {
        status: 'unhealthy',
        responseTime: Date.now() - startTime
      }
    }

    // Storage health check
    try {
      const storageStart = Date.now()
      await supabase.storage.listBuckets()
      healthChecks.storage = {
        status: 'healthy',
        responseTime: Date.now() - storageStart
      }
    } catch (error) {
      healthChecks.storage = {
        status: 'unhealthy',
        responseTime: Date.now() - startTime
      }
    }

    // Overall health
    const allHealthy = Object.values(healthChecks)
      .filter(check => check.status !== 'unknown')
      .every(check => check.status === 'healthy')

    healthChecks.overall = {
      status: allHealthy ? 'healthy' : 'degraded',
      responseTime: Date.now() - startTime
    }

    // Store health metrics
    await supabase.from('system_health_metrics').insert([
      {
        metric_type: 'database_response_time',
        metric_value: healthChecks.database.responseTime,
        metadata: { status: healthChecks.database.status }
      },
      {
        metric_type: 'auth_response_time',
        metric_value: healthChecks.auth.responseTime,
        metadata: { status: healthChecks.auth.status }
      },
      {
        metric_type: 'storage_response_time',
        metric_value: healthChecks.storage.responseTime,
        metadata: { status: healthChecks.storage.status }
      },
      {
        metric_type: 'overall_health',
        metric_value: allHealthy ? 1 : 0,
        metadata: { status: healthChecks.overall.status, responseTime: healthChecks.overall.responseTime }
      }
    ])

    const statusCode = allHealthy ? 200 : 503

    return new Response(
      JSON.stringify({
        status: healthChecks.overall.status,
        timestamp: new Date().toISOString(),
        checks: healthChecks,
        version: '1.0.0'
      }),
      { 
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Health check error:', error)
    return new Response(
      JSON.stringify({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      }),
      { 
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})