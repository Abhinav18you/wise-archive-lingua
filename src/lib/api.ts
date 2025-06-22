import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";
import { AuthFormData, Content, ContentType } from "@/types";
import { signUpWithEmail, signInWithEmail, signOut, getSession } from "@/lib/auth";

// Enhanced error handling utilities
class APIError extends Error {
  constructor(message: string, public code?: string, public statusCode?: number) {
    super(message);
    this.name = 'APIError';
  }
}

const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 1,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on authentication errors or client errors
      if (error instanceof APIError && error.statusCode && error.statusCode < 500) {
        throw error;
      }
      
      // Don't retry on certain error types
      if (lastError.message.includes('401') || lastError.message.includes('403')) {
        throw lastError;
      }
      
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Retry attempt ${attempt + 1} after ${delay}ms delay`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
};

export const api = {
  auth: {
    signUp: async (data: AuthFormData): Promise<{ user: any; error: any }> => {
      console.log("Signing up with:", data);
      
      const { data: authData, error } = await signUpWithEmail(
        data.email,
        data.password,
        data.username
      );
      
      return { 
        user: authData?.user, 
        error 
      };
    },
    
    signIn: async (data: { email: string; password: string }): Promise<{ user: any; error: any }> => {
      console.log("Signing in with:", data);
      
      const { data: authData, error } = await signInWithEmail(data.email, data.password);
      
      return { 
        user: authData?.user, 
        error 
      };
    },
    
    signOut: async (): Promise<{ error: any }> => {
      console.log("Signing out");
      const { error } = await signOut();
      return { error };
    },
    
    getUser: async () => {
      const { session } = await getSession();
      return session?.user || null;
    }
  },
  
  content: {
    create: async (data: Omit<Content, "id" | "user_id" | "created_at" | "updated_at">): Promise<{ content: Content | null; error: any }> => {
      console.log("Create content:", data);
      
      try {
        const { session } = await getSession();
        if (!session?.user) {
          throw new Error("User is not authenticated");
        }
        
        const userId = session.user.id;
        
        // Prepare the data for insertion - mapping to user_materials table structure
        const contentData = {
          type: data.type,
          data: data.content, // content field is stored as data in user_materials
          title: data.title || '',
          description: data.description || '',
          user_id: userId // Add user_id field explicitly for RLS policy to work
        };
        
        console.log("Prepared content data:", contentData);
        
        // Insert into Supabase
        const { data: insertedContent, error } = await supabase
          .from('user_materials')
          .insert(contentData)
          .select('*')
          .single();
        
        if (error) {
          console.error("Supabase insert error:", error);
          throw error;
        }
        
        console.log("Successfully inserted content:", insertedContent);
        
        // Also save to localStorage as a fallback
        try {
          const existingContents = JSON.parse(localStorage.getItem('userContents') || '[]');
          const localContent = {
            ...data,
            id: insertedContent.id,
            user_id: userId,
            created_at: insertedContent.created_at,
            updated_at: insertedContent.created_at,
          };
          localStorage.setItem('userContents', JSON.stringify([localContent, ...existingContents]));
        } catch (err) {
          console.error("Error saving to localStorage:", err);
          // Continue anyway since we have Supabase storage
        }
        
        // Map the database content structure to our application Content type
        const mappedContent: Content = {
          id: insertedContent.id,
          user_id: userId,
          type: insertedContent.type as ContentType,
          content: insertedContent.data,
          title: insertedContent.title || undefined,
          description: insertedContent.description || undefined,
          tags: [],
          thumbnail_url: undefined,
          created_at: insertedContent.created_at,
          updated_at: insertedContent.created_at,
        };
        
        return { content: mappedContent, error: null };
      } catch (err) {
        console.error("Error creating content:", err);
        return { content: null, error: err };
      }
    },
    
    getAll: async (): Promise<{ contents: Content[]; error: any }> => {
      try {
        const { session } = await getSession();
        if (!session?.user) {
          // Fallback to local storage if not authenticated
          const storedContents = localStorage.getItem('userContents');
          const userContents: Content[] = storedContents ? JSON.parse(storedContents) : [];
          
          if (userContents.length === 0) {
            // Return mock examples only when no content exists
            const mockContents: Content[] = [
              {
                id: "content-1",
                user_id: "user-id",
                type: "link",
                content: "https://example.com",
                title: "Example Website",
                description: "This is an example website",
                tags: ["example", "website"],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: "content-2",
                user_id: "user-id",
                type: "text",
                content: "This is some example text content.",
                title: "Example Text",
                tags: ["example", "text"],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              {
                id: "content-3",
                user_id: "user-id",
                type: "image",
                content: "https://via.placeholder.com/300",
                title: "Example Image",
                description: "This is an example image",
                thumbnail_url: "https://via.placeholder.com/150",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ];
            return { contents: mockContents, error: null };
          }
          
          return { contents: userContents, error: null };
        }
        
        // Fetch from Supabase
        const { data: materials, error } = await supabase
          .from('user_materials')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Map Supabase data to Content type - matching the user_materials schema
        const mappedContents: Content[] = materials.map(item => ({
          id: item.id,
          user_id: session.user.id,
          type: item.type as ContentType,
          content: item.data,
          title: item.title || undefined,
          description: item.description || undefined,
          tags: [],
          thumbnail_url: undefined,
          created_at: item.created_at,
          updated_at: item.created_at,
        }));
        
        // Sync with localStorage for offline capability
        localStorage.setItem('userContents', JSON.stringify(mappedContents));
        
        return { contents: mappedContents, error: null };
      } catch (err) {
        console.error("Error retrieving content:", err);
        
        // Attempt to fall back to localStorage
        try {
          const storedContents = localStorage.getItem('userContents');
          const userContents: Content[] = storedContents ? JSON.parse(storedContents) : [];
          return { contents: userContents, error: null };
        } catch (localErr) {
          return { contents: [], error: err };
        }
      }
    },
    
    search: async (query: string, useLlama: boolean = false): Promise<{ results: Content[]; error: any }> => {
      console.log("Searching for:", query, "Using AI Search:", useLlama);
      
      try {
        const { session } = await getSession();
        if (!session?.user) {
          // Fall back to localStorage search if not authenticated
          const storedContents = localStorage.getItem('userContents');
          const userContents: Content[] = storedContents ? JSON.parse(storedContents) : [];
          
          if (userContents.length === 0) {
            return { results: [], error: null };
          }
          
          // Normalize the query for case-insensitive search
          const normalizedQuery = query.toLowerCase().trim();
          
          // Filter content based on the search query
          const results = userContents.filter(content => {
            const titleMatch = content.title?.toLowerCase().includes(normalizedQuery) || false;
            const contentMatch = content.content.toLowerCase().includes(normalizedQuery);
            const descriptionMatch = content.description?.toLowerCase().includes(normalizedQuery) || false;
            const tagMatch = content.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery)) || false;
            
            return titleMatch || contentMatch || descriptionMatch || tagMatch;
          });
          
          console.log("Search results from localStorage:", results);
          return { results, error: null };
        }
        
        // If AI search is enabled, use the llama-search edge function with retry logic
        if (useLlama) {
          console.log("Using AI search via OpenRouter API");
          try {
            const aiSearchOperation = async () => {
              const { data, error } = await supabase.functions.invoke('llama-search', {
                body: { query }
              });
              
              if (error) {
                console.error("AI search error details:", error);
                
                // Create more specific errors based on the response
                if (error.message?.includes('401') || error.message?.includes('Authorization')) {
                  throw new APIError('AI search authentication failed. Please check your OpenRouter API key configuration.', 'AUTH_ERROR', 401);
                } else if (error.message?.includes('429')) {
                  throw new APIError('AI search rate limit exceeded. Please try again in a moment.', 'RATE_LIMIT', 429);
                } else if (error.message?.includes('500')) {
                  throw new APIError('AI search service is temporarily unavailable.', 'SERVER_ERROR', 500);
                } else if (error.message?.includes('timeout')) {
                  throw new APIError('AI search request timed out. Please try again.', 'TIMEOUT_ERROR', 408);
                } else {
                  throw new APIError(`AI search failed: ${error.message}`, 'SEARCH_ERROR');
                }
              }
              
              return data;
            };
            
            const data = await retryWithBackoff(aiSearchOperation, 1, 1500);
            
            console.log("AI search results:", data);
            return { results: data.results || [], error: null };
          } catch (err) {
            console.error("Error with AI search:", err);
            
            // Provide user-friendly error messages based on error type
            if (err instanceof APIError) {
              if (err.statusCode === 401) {
                toast.error("AI search is not properly configured. Please contact support or use regular search.");
              } else if (err.statusCode === 429) {
                toast.warning("AI search is temporarily busy. Trying regular search instead.");
              } else if (err.statusCode === 408) {
                toast.warning("AI search timed out. Using regular search instead.");
              } else {
                toast.warning("AI search temporarily unavailable. Using regular search.");
              }
            } else {
              toast.warning("AI search failed. Using regular search instead.");
            }
            
            // Automatically fall back to regular search
            console.log("Falling back to regular search due to AI search failure");
          }
        }
        
        // Regular search in Supabase using ILIKE for text search
        const normalizedQuery = query.toLowerCase().trim();
        
        const { data: materials, error } = await supabase
          .from('user_materials')
          .select('*')
          .or(`data.ilike.%${normalizedQuery}%,title.ilike.%${normalizedQuery}%,description.ilike.%${normalizedQuery}%`)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Map Supabase data to Content type
        const mappedResults: Content[] = materials.map(item => ({
          id: item.id,
          user_id: session.user.id,
          type: item.type as ContentType,
          content: item.data,
          title: item.title || undefined,
          description: item.description || undefined,
          tags: [],
          thumbnail_url: undefined,
          created_at: item.created_at,
          updated_at: item.created_at,
        }));
        
        console.log("Search results from Supabase:", mappedResults);
        return { results: mappedResults, error: null };
      } catch (err) {
        console.error("Error searching content:", err);
        return { results: [], error: err };
      }
    },
    
    delete: async (id: string): Promise<{ error: any }> => {
      console.log("Delete content:", id);
      
      try {
        const { session } = await getSession();
        if (!session?.user) {
          throw new Error("User is not authenticated");
        }
        
        // Delete from Supabase - using user_materials table
        const { error } = await supabase
          .from('user_materials')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        // Also remove from localStorage
        try {
          const existingContents = JSON.parse(localStorage.getItem('userContents') || '[]');
          const updatedContents = existingContents.filter((item: Content) => item.id !== id);
          localStorage.setItem('userContents', JSON.stringify(updatedContents));
        } catch (err) {
          console.error("Error removing from localStorage:", err);
          // Continue anyway since we deleted from Supabase
        }
        
        return { error: null };
      } catch (err) {
        console.error("Error deleting content:", err);
        return { error: err };
      }
    },
    
    update: async (id: string, data: Partial<Content>): Promise<{ content: Content | null; error: any }> => {
      console.log("Update content:", id, data);
      
      try {
        const { session } = await getSession();
        if (!session?.user) {
          throw new Error("User is not authenticated");
        }
        
        // Prepare the data for update - mapping to user_materials table structure
        const updateData: any = {};
        if (data.type) updateData.type = data.type;
        if (data.content) updateData.data = data.content; // content maps to data
        if (data.title !== undefined) updateData.title = data.title;
        if (data.description !== undefined) updateData.description = data.description;
        
        // Update in Supabase
        const { data: updatedContent, error } = await supabase
          .from('user_materials')
          .update(updateData)
          .eq('id', id)
          .select('*')
          .single();
        
        if (error) throw error;
        
        // Update in localStorage too
        try {
          const existingContents = JSON.parse(localStorage.getItem('userContents') || '[]');
          const updatedContents = existingContents.map((item: Content) => {
            if (item.id === id) {
              return {
                ...item,
                ...data,
                updated_at: new Date().toISOString()
              };
            }
            return item;
          });
          localStorage.setItem('userContents', JSON.stringify(updatedContents));
        } catch (err) {
          console.error("Error updating localStorage:", err);
          // Continue anyway since we updated Supabase
        }
        
        // Map the database content structure to our application Content type
        const mappedContent: Content = {
          id: updatedContent.id,
          user_id: session.user.id,
          type: updatedContent.type as ContentType,
          content: updatedContent.data,
          title: updatedContent.title || undefined,
          description: updatedContent.description || undefined,
          tags: [],
          thumbnail_url: undefined,
          created_at: updatedContent.created_at,
          updated_at: updatedContent.created_at,
        };
        
        return { content: mappedContent, error: null };
      } catch (err) {
        console.error("Error updating content:", err);
        return { content: null, error: err };
      }
    },
  }
};

export const handleApiError = (error: any): string => {
  console.error("API Error:", error);
  const errorMessage = error?.message || "An unexpected error occurred";
  toast.error(errorMessage);
  return errorMessage;
};
