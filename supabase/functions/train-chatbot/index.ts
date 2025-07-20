import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    const { trainingData, category = 'general' } = await req.json();

    if (!trainingData || trainingData.trim().length === 0) {
      throw new Error('Training data is required');
    }

    // Split large training data into chunks for better management
    const chunkSize = 2000;
    const chunks = [];
    
    for (let i = 0; i < trainingData.length; i += chunkSize) {
      chunks.push(trainingData.slice(i, i + chunkSize));
    }

    // Insert training data chunks into knowledge base
    const insertPromises = chunks.map((chunk, index) => 
      supabase
        .from('chatbot_knowledge')
        .insert({
          content: chunk,
          category: category,
          chunk_index: index,
          total_chunks: chunks.length,
          active: true
        })
    );

    await Promise.all(insertPromises);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully added ${chunks.length} knowledge chunks to the AI assistant`,
        chunks_added: chunks.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Training error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});