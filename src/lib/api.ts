
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";
import { AuthFormData, Content, ContentType } from "@/types";
import { signUpWithEmail, signInWithEmail, signOut, getSession } from "@/lib/auth";

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
        
        // Insert into Supabase
        const { data: insertedContent, error } = await supabase
          .from('user_content')
          .insert([
            {
              user_id: userId,
              type: data.type,
              content: data.content,
              title: data.title || null,
              description: data.description || null,
              tags: data.tags || null,
              thumbnail_url: data.thumbnail_url || null,
            }
          ])
          .select('*')
          .single();
        
        if (error) throw error;
        
        // Also save to localStorage as a fallback
        try {
          const existingContents = JSON.parse(localStorage.getItem('userContents') || '[]');
          const localContent = {
            ...data,
            id: insertedContent.id,
            user_id: userId,
            created_at: insertedContent.created_at,
            updated_at: insertedContent.updated_at,
          };
          localStorage.setItem('userContents', JSON.stringify([localContent, ...existingContents]));
        } catch (err) {
          console.error("Error saving to localStorage:", err);
          // Continue anyway since we have Supabase storage
        }
        
        return { 
          content: {
            id: insertedContent.id,
            user_id: userId,
            type: insertedContent.type as ContentType,
            content: insertedContent.content,
            title: insertedContent.title || undefined,
            description: insertedContent.description || undefined,
            tags: insertedContent.tags || undefined,
            thumbnail_url: insertedContent.thumbnail_url || undefined,
            created_at: insertedContent.created_at,
            updated_at: insertedContent.updated_at,
          }, 
          error: null 
        };
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
        const { data: contents, error } = await supabase
          .from('user_content')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Map Supabase data to Content type
        const mappedContents: Content[] = contents.map(item => ({
          id: item.id,
          user_id: item.user_id,
          type: item.type as ContentType,
          content: item.content,
          title: item.title || undefined,
          description: item.description || undefined,
          tags: item.tags || undefined,
          thumbnail_url: item.thumbnail_url || undefined,
          created_at: item.created_at,
          updated_at: item.updated_at,
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
    
    search: async (query: string): Promise<{ results: Content[]; error: any }> => {
      console.log("Searching for:", query);
      
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
        
        // Normalize query for search
        const normalizedQuery = query.toLowerCase().trim();
        
        // Search in Supabase using ILIKE for text search
        const { data: results, error } = await supabase
          .from('user_content')
          .select('*')
          .or(`content.ilike.%${normalizedQuery}%,title.ilike.%${normalizedQuery}%,description.ilike.%${normalizedQuery}%`)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Map Supabase data to Content type
        const mappedResults: Content[] = results.map(item => ({
          id: item.id,
          user_id: item.user_id,
          type: item.type as ContentType,
          content: item.content,
          title: item.title || undefined,
          description: item.description || undefined,
          tags: item.tags || undefined,
          thumbnail_url: item.thumbnail_url || undefined,
          created_at: item.created_at,
          updated_at: item.updated_at,
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
        
        // Delete from Supabase
        const { error } = await supabase
          .from('user_content')
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
        
        // Update in Supabase
        const { data: updatedContent, error } = await supabase
          .from('user_content')
          .update({
            type: data.type,
            content: data.content,
            title: data.title,
            description: data.description,
            tags: data.tags,
            thumbnail_url: data.thumbnail_url,
            updated_at: new Date().toISOString()
          })
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
        
        return { 
          content: {
            id: updatedContent.id,
            user_id: updatedContent.user_id,
            type: updatedContent.type as ContentType,
            content: updatedContent.content,
            title: updatedContent.title || undefined,
            description: updatedContent.description || undefined,
            tags: updatedContent.tags || undefined,
            thumbnail_url: updatedContent.thumbnail_url || undefined,
            created_at: updatedContent.created_at,
            updated_at: updatedContent.updated_at,
          }, 
          error: null 
        };
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
