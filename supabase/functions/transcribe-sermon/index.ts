import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcriptionId, audioBase64 } = await req.json();
    
    if (!transcriptionId || !audioBase64) {
      throw new Error('Missing transcriptionId or audioBase64');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Update status to processing
    await supabase
      .from('sermon_transcriptions')
      .update({ status: 'processing' })
      .eq('id', transcriptionId);

    // Process audio in chunks to avoid memory issues
    const binaryAudio = processBase64Chunks(audioBase64);
    
    // Prepare form data for OpenAI Whisper
    const formData = new FormData();
    const audioBlob = new Blob([binaryAudio], { type: 'audio/mpeg' });
    formData.append('file', audioBlob, 'sermon.mp3');
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'json');
    formData.append('language', 'en');

    console.log('Sending audio to OpenAI for transcription...');

    // Send to OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const transcriptionText = result.text;

    console.log('Transcription completed successfully');

    // Calculate word count and estimated duration
    const wordCount = transcriptionText.split(/\s+/).filter((word: string) => word.length > 0).length;
    const estimatedDuration = Math.round(wordCount / 150 * 60); // Assuming 150 words per minute

    // Update the transcription record with the result
    const { error: updateError } = await supabase
      .from('sermon_transcriptions')
      .update({
        transcription_text: transcriptionText,
        word_count: wordCount,
        duration_seconds: estimatedDuration,
        status: 'completed'
      })
      .eq('id', transcriptionId);

    if (updateError) {
      console.error('Error updating transcription:', updateError);
      throw new Error(`Error updating transcription: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        text: transcriptionText,
        wordCount,
        durationSeconds: estimatedDuration,
        status: 'completed'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in transcribe-sermon function:', error);
    
    // Update status to failed if we have a transcriptionId
    try {
      const { transcriptionId } = await req.json();
      if (transcriptionId) {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );
        
        await supabase
          .from('sermon_transcriptions')
          .update({ status: 'failed' })
          .eq('id', transcriptionId);
      }
    } catch (updateError) {
      console.error('Error updating failed status:', updateError);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});