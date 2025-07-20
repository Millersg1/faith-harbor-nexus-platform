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
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { message, context = [], customPrompt } = await req.json();

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get any additional context from the knowledge base
    const { data: knowledgeBase } = await supabase
      .from('chatbot_knowledge')
      .select('content, category')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(20);

    // Combine all context
    const combinedContext = [
      ...context,
      ...(knowledgeBase?.map(kb => kb.content) || [])
    ].join('\n\n');

    const systemPrompt = customPrompt || `You are Faith Harbor AI, an intelligent assistant for a comprehensive Christian ministry platform. You help with:

🏛️ PLATFORM FEATURES:
- Complete church management (members, events, donations, communications)
- AI-powered analytics and insights
- Financial management and budgeting
- Service planning and worship coordination
- Small groups and ministry teams
- Prayer request management
- Sermon management and archives
- Mobile app capabilities
- Website and funnel builder
- Business tools for Christian enterprises

⛪ MINISTRY GUIDANCE:
- Biblical wisdom and spiritual guidance
- Church growth strategies
- Community building
- Stewardship and giving
- Pastoral care support

🤝 YOUR APPROACH:
- Respond with wisdom, compassion, and biblical principles
- Keep responses helpful, practical, and encouraging
- Reference relevant scripture when appropriate
- Focus on building stronger faith communities
- Emphasize Kingdom impact and spiritual growth

CONTEXT: ${combinedContext}

Always be encouraging, wise, and focused on helping users grow their ministry impact.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    const aiResponse = data.choices[0].message.content;

    // Store the conversation for learning
    await supabase
      .from('chatbot_conversations')
      .insert({
        user_message: message,
        ai_response: aiResponse,
        context_used: combinedContext.slice(0, 1000), // Limit for storage
      });

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment, or contact our support team for assistance."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});