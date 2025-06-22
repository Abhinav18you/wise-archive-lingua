
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
      throw new Error('OpenRouter API key is not configured');
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
      throw new Error('User authentication failed');
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

    // Prepare data for the OpenRouter API
    const documentsText = materials.map(item => 
      `ID: ${item.id}\nTitle: ${item.title || ''}\nDescription: ${item.description || ''}\nContent: ${item.data || ''}\nType: ${item.type}\n---`
    ).join('\n');

    console.log('Calling OpenRouter API for semantic search');

    // Call OpenRouter API using Llama model
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LLAMA_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.dev',
        'X-Title': 'Memoria Search App'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-maverick:free',
        messages: [
          {
            role: 'system',
            content: `You are a semantic search assistant. Given a user's search query and their personal content collection, identify the most relevant content IDs that match the query. 

Instructions:
1. Analyze the query semantically to understand user intent
2. Match against titles, descriptions, and content
3. Return ONLY a JSON array of relevant document IDs in order of relevance
4. If no relevant content is found, return an empty array []
5. Format: ["id1", "id2", "id3"]`
          },
          {
            role: 'user',
            content: `Search Query: "${query}"

User's Content Collection:
${documentsText}

Return only the JSON array of most relevant document IDs:`
          }
        ],
        temperature: 0.2,
        max_tokens: 500
      })
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error('OpenRouter API error:', errorText);
      throw new Error(`OpenRouter API error: ${openRouterResponse.status}`);
    }

    // Parse OpenRouter response
    const openRouterData = await openRouterResponse.json();
    
    if (!openRouterData.choices || !openRouterData.choices[0]) {
      console.error('Invalid response from OpenRouter API:', openRouterData);
      throw new Error('Invalid response from OpenRouter API');
    }

    console.log('Received response from OpenRouter API');

    // Extract document IDs from OpenRouter response
    const content = openRouterData.choices[0].message.content;
    let relevantIds;
    
    try {
      console.log('Parsing response content:', content.trim());
      relevantIds = JSON.parse(content.trim());
      
      if (!Array.isArray(relevantIds)) {
        console.error('Expected array of IDs but got:', typeof relevantIds);
        throw new Error('Expected array of IDs');
      }
      
      console.log('Successfully parsed relevant IDs:', relevantIds);
    } catch (e) {
      console.error('Error parsing OpenRouter response:', e);
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
