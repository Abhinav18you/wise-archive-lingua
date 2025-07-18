
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
    // Parse request body
    const body = await req.json();
    const { message, conversation, checkOnly, customApiKey } = body;
    
    // Use custom API key if provided, otherwise fall back to environment variable
    const LLAMA_API_KEY = customApiKey || Deno.env.get('LLAMA_API_KEY');
    
    if (!LLAMA_API_KEY) {
      console.error('LLAMA_API_KEY is not set or provided');
      return new Response(
        JSON.stringify({ error: 'OpenRouter API key is not configured' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If this is just a check to see if the API key exists
    if (checkOnly === true) {
      console.log('API key check initiated');
      
      try {
        // Make a minimal API call to verify the key works
        const testResponse = await fetch('https://openrouter.ai/api/v1/auth/key', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${LLAMA_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!testResponse.ok) {
          console.error('API key validation failed:', testResponse.status);
          return new Response(
            JSON.stringify({ error: `OpenRouter API key validation failed: ${testResponse.status}` }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        console.log('API key check successful');
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (err) {
        console.error('API key validation error:', err);
        return new Response(
          JSON.stringify({ error: `Error validating OpenRouter API key: ${err.message}` }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message parameter is required' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Received chat message:', message);
    console.log('Conversation history length:', conversation?.length || 0);

    // Format conversation history
    const messages = [
      {
        role: 'system',
        content: `You are Mistral, an AI assistant powered by Mistral AI's advanced language model. 
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

    console.log('Calling OpenRouter API with Mistral Small model');
    
    // Call OpenRouter API to access Llama 4 Maverick
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LLAMA_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://lovable.dev', // Replace with your actual domain
          'X-Title': 'Memoria Chat App'  // Optional title for rankings
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-small-3.2-24b-instruct:free',
          messages,
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      console.log('OpenRouter API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenRouter API error (${response.status}):`, errorText);
        return new Response(
          JSON.stringify({ error: `OpenRouter API error: ${response.status}` }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Parse response
      const data = await response.json();
      
      if (!data.choices || !data.choices[0]) {
        console.error('Invalid response from OpenRouter API:', data);
        return new Response(
          JSON.stringify({ error: 'Invalid response structure from OpenRouter API' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const aiResponse = data.choices[0].message.content;
      console.log('Received response from Mistral via OpenRouter:', aiResponse.substring(0, 100) + '...');

      // Return the AI response
      return new Response(
        JSON.stringify({ 
          message: aiResponse,
          role: 'assistant' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (fetchError) {
      console.error('Fetch error:', fetchError.message);
      return new Response(
        JSON.stringify({ error: `Error calling OpenRouter API: ${fetchError.message}` }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in llama-chat function:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
