import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');

interface DeleteVoiceRequest {
  voice_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key is required');
    }

    const { voice_id }: DeleteVoiceRequest = await req.json();

    if (!voice_id) {
      throw new Error('Voice ID is required');
    }

    console.log(`Deleting voice: ${voice_id}`);

    // Delete voice from ElevenLabs
    const response = await fetch(`https://api.elevenlabs.io/v1/voices/${voice_id}`, {
      method: 'DELETE',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      
      // Handle specific error cases
      if (response.status === 404) {
        throw new Error('Voice not found');
      } else if (response.status === 403) {
        throw new Error('Cannot delete this voice - it may be a default voice or you lack permissions');
      } else {
        throw new Error(`Failed to delete voice: ${response.status} ${errorText}`);
      }
    }

    console.log('Voice deleted successfully');

    return new Response(JSON.stringify({
      success: true,
      message: 'Voice deleted successfully',
      voice_id: voice_id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in delete-voice function:", error);
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