import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');

interface GenerateSpeechRequest {
  text: string;
  voice_id: string;
  model_id?: string;
  voice_settings?: {
    stability?: number;
    similarity_boost?: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
  output_format?: string;
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

    const { 
      text, 
      voice_id, 
      model_id = 'eleven_multilingual_v2',
      voice_settings = {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true
      },
      output_format = 'mp3_44100_128'
    }: GenerateSpeechRequest = await req.json();

    if (!text) {
      throw new Error('Text is required');
    }

    if (!voice_id) {
      throw new Error('Voice ID is required');
    }

    console.log(`Generating speech for voice ${voice_id}: "${text.substring(0, 50)}..."`);

    // Generate speech with ElevenLabs API
    const requestBody = {
      text: text,
      model_id: model_id,
      voice_settings: voice_settings
    };

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      throw new Error(`Failed to generate speech: ${response.status} ${errorText}`);
    }

    // Get the audio data
    const audioBuffer = await response.arrayBuffer();
    
    // Convert to base64 for easier handling in the frontend
    const audioBase64 = btoa(
      String.fromCharCode(...new Uint8Array(audioBuffer))
    );

    console.log('Speech generated successfully');

    return new Response(JSON.stringify({
      success: true,
      audio_base64: audioBase64,
      audio_format: output_format,
      text: text,
      voice_id: voice_id,
      character_count: text.length,
      message: 'Speech generated successfully'
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in generate-speech function:", error);
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