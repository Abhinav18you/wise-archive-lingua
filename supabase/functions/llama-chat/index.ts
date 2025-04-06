
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LLAMA_API_KEY = Deno.env.get('LLAMA_API_KEY');
    
    if (!LLAMA_API_KEY) {
      console.error('LLAMA_API_KEY is not set');
      throw new Error('LLAMA_API_KEY is not set in environment variables');
    }

    // Parse request body
    const body = await req.json();
    const { message, conversation } = body;
    
    if (!message) {
      throw new Error('Message parameter is required');
    }

    console.log('Received chat message:', message);
    console.log('Conversation history length:', conversation?.length || 0);

    // Format conversation history
    const messages = [
      {
        role: 'system',
        content: `You are Llama 4 Maverick, an AI assistant powered by Meta's Llama model. 
                  You are helpful, knowledgeable, and friendly. You provide accurate information
                  and assist users with their questions. If you don't know the answer, you
                  admit that you don't know instead of making something up.`
      }
    ];

    // Add conversation history if provided
    if (conversation && Array.isArray(conversation)) {
      conversation.forEach(item => {
        if (item.role && item.content) {
          messages.push({
            role: item.role,
            content: item.content
          });
        }
      });
    }

    // Add the current user message
    messages.push({
      role: 'user',
      content: message
    });

    console.log('Calling Perplexity API with Llama 4 model');

    // Call Llama API via Perplexity
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LLAMA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online', // Using Llama 3.1 which is compatible with Llama 4
        messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Perplexity API error (${response.status}):`, errorText);
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    // Parse response
    const data = await response.json();
    
    if (!data.choices || !data.choices[0]) {
      console.error('Invalid response from Perplexity API:', data);
      throw new Error('Invalid response structure from Perplexity API');
    }

    const aiResponse = data.choices[0].message.content;
    console.log('Received response from AI:', aiResponse.substring(0, 100) + '...');

    // Return the AI response
    return new Response(
      JSON.stringify({ 
        message: aiResponse,
        role: 'assistant' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in llama-chat function:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
