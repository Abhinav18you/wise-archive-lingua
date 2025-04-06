
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
      console.error('LLAMA_API_KEY is not set');
      throw new Error('LLAMA_API_KEY is not set');
    }

    // Parse request body
    const { query } = await req.json();
    
    if (!query) {
      throw new Error('Query parameter is required');
    }

    console.log('Received search query:', query);

    // Create Supabase client to access the user's materials
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the user's identity
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Authentication token is required');
    }

    console.log('Authenticating user with token');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error('User authentication failed:', userError);
      throw new Error('Unauthorized');
    }

    console.log('User authenticated:', user.id);

    // Get user's materials
    const { data: materials, error: materialsError } = await supabase
      .from('user_materials')
      .select('*')
      .eq('user_id', user.id);

    if (materialsError) {
      console.error('Error fetching materials:', materialsError);
      throw materialsError;
    }

    console.log(`Found ${materials?.length || 0} materials for user`);

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

    console.log('Calling Perplexity API (Llama 4) for semantic search');

    // Call Llama API using Perplexity's API
    const llamaResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LLAMA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online', // Using llama-3.1 which is compatible with Llama 4 Maverick
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
        ],
        temperature: 0.2, // Lower temperature for more deterministic results
        max_tokens: 500
      })
    });

    if (!llamaResponse.ok) {
      const errorText = await llamaResponse.text();
      console.error('Perplexity API error:', errorText);
      throw new Error(`Perplexity API error: ${llamaResponse.status}`);
    }

    // Parse Llama response
    const llamaData = await llamaResponse.json();
    
    if (!llamaData.choices || !llamaData.choices[0]) {
      console.error('Invalid response from Perplexity API:', llamaData);
      throw new Error('Invalid response from Perplexity API');
    }

    console.log('Received response from Perplexity API');

    // Extract document IDs from Llama response
    const content = llamaData.choices[0].message.content;
    let relevantIds;
    
    try {
      // The content should be a JSON array of IDs
      console.log('Parsing response content:', content.trim());
      relevantIds = JSON.parse(content.trim());
      
      if (!Array.isArray(relevantIds)) {
        console.error('Expected array of IDs but got:', typeof relevantIds);
        throw new Error('Expected array of IDs');
      }
      
      console.log('Successfully parsed relevant IDs:', relevantIds);
    } catch (e) {
      console.error('Error parsing Perplexity response:', e);
      console.log('Raw response:', content);
      
      // Try to extract IDs using regex as fallback
      const matches = content.match(/["']([0-9a-f-]+)["']/g);
      relevantIds = matches 
        ? matches.map(m => m.replace(/["']/g, ''))
        : [];
      
      console.log('Extracted IDs using fallback method:', relevantIds);
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

    console.log(`Returning ${results.length} search results`);

    // Return the search results
    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in llama-search function:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
