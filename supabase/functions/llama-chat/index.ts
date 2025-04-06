
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
      throw new Error('LLAMA_API_KEY is not set');
    }

    // Parse request body
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('Valid messages array is required');
    }

    // Call Llama API for chat
    const llamaResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LLAMA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-4-maverick',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    // Parse Llama response
    const llamaData = await llamaResponse.json();
    
    if (!llamaData.choices || !llamaData.choices[0]) {
      throw new Error('Invalid response from Llama API');
    }

    // Return the chat response
    return new Response(
      JSON.stringify(llamaData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
