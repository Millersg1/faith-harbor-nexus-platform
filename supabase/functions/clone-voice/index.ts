import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');

interface CloneVoiceRequest {
  name: string;
  description?: string;
  labels?: {
    accent?: string;
    age?: string;
    gender?: string;
    use_case?: string;
  };
  files: Array<{
    name: string;
    size: number;
    type: string;
  }>;
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

    const { name, description, labels, files }: CloneVoiceRequest = await req.json();

    if (!name) {
      throw new Error('Voice name is required');
    }

    if (!files || files.length === 0) {
      throw new Error('At least one audio file is required');
    }

    console.log(`Cloning voice "${name}" with ${files.length} files`);

    // Create voice with ElevenLabs API
    const formData = new FormData();
    formData.append('name', name);
    
    if (description) {
      formData.append('description', description);
    }

    // Add labels as JSON
    if (labels) {
      formData.append('labels', JSON.stringify(labels));
    }

    // Note: In a real implementation, you would need to handle file uploads
    // This is a simplified version that shows the API structure
    
    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        // Don't set Content-Type for FormData, let the browser set it
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      throw new Error(`Failed to clone voice: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    
    console.log('Voice cloned successfully:', result.voice_id);

    return new Response(JSON.stringify({
      success: true,
      voice_id: result.voice_id,
      message: 'Voice cloned successfully',
      name: name
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in clone-voice function:", error);
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