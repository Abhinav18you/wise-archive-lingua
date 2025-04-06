
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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
    const { query } = await req.json();
    
    if (!query) {
      throw new Error('Query parameter is required');
    }

    // Create Supabase client to access the user's materials
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the user's identity
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Get user's materials
    const { data: materials, error: materialsError } = await supabase
      .from('user_materials')
      .select('*')
      .eq('user_id', user.id);

    if (materialsError) {
      throw materialsError;
    }

    // If no materials found, return empty results
    if (!materials || materials.length === 0) {
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prepare data for the Llama API
    const documents = materials.map(item => ({
      id: item.id,
      text: `${item.title || ''} ${item.description || ''} ${item.data || ''}`,
      metadata: { 
        type: item.type,
        created_at: item.created_at
      }
    }));

    // Call Llama API for semantic search
    const llamaResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LLAMA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-4-maverick',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that helps users search through their personal content collection. 
                    Given a search query and a collection of documents, identify the most relevant documents 
                    to the query. Understand semantic meanings and user intent. 
                    Only return document IDs in a JSON array, nothing else.`
          },
          {
            role: 'user',
            content: `Query: "${query}"
                    Documents: ${JSON.stringify(documents)}
                    Return only a JSON array of the most relevant document IDs matching the query, 
                    ordered by relevance. Format: ["id1", "id2", ...]`
          }
        ]
      })
    });

    // Parse Llama response
    const llamaData = await llamaResponse.json();
    
    if (!llamaData.choices || !llamaData.choices[0]) {
      throw new Error('Invalid response from Llama API');
    }

    // Extract document IDs from Llama response
    const content = llamaData.choices[0].message.content;
    let relevantIds;
    
    try {
      // The content should be a JSON array of IDs
      relevantIds = JSON.parse(content.trim());
      
      if (!Array.isArray(relevantIds)) {
        throw new Error('Expected array of IDs');
      }
    } catch (e) {
      console.error('Error parsing Llama response:', e);
      console.log('Raw response:', content);
      
      // Try to extract IDs using regex as fallback
      const matches = content.match(/["']([0-9a-f-]+)["']/g);
      relevantIds = matches 
        ? matches.map(m => m.replace(/["']/g, ''))
        : [];
    }

    // Filter materials to only include the relevant ones
    const results = materials
      .filter(item => relevantIds.includes(item.id))
      .map(item => ({
        id: item.id,
        user_id: user.id,
        type: item.type,
        content: item.data,
        title: item.title || undefined,
        description: item.description || undefined,
        tags: [],
        thumbnail_url: undefined,
        created_at: item.created_at,
        updated_at: item.created_at
      }));

    // Return the search results
    return new Response(
      JSON.stringify({ results }),
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
