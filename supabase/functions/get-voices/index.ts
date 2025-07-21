import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key is required');
    }

    console.log('Fetching voices from ElevenLabs API');

    // Get all voices from ElevenLabs
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      throw new Error(`Failed to fetch voices: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    // Filter and format voices
    const voices = data.voices?.map((voice: any) => ({
      voice_id: voice.voice_id,
      name: voice.name,
      description: voice.description || `${voice.category} voice`,
      category: voice.category || 'custom',
      labels: voice.labels || {},
      preview_url: voice.preview_url,
      available_for_tiers: voice.available_for_tiers,
      settings: voice.settings,
      sharing: voice.sharing,
      high_quality_base_model_ids: voice.high_quality_base_model_ids,
      safety_control: voice.safety_control,
      voice_verification: voice.voice_verification,
      permission_on_resource: voice.permission_on_resource
    })) || [];

    console.log(`Retrieved ${voices.length} voices`);

    return new Response(JSON.stringify({
      success: true,
      voices: voices,
      total_count: voices.length
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in get-voices function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 400,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);