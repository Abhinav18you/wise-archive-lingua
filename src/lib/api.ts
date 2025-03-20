
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
      
      const { session } = await getSession();
      const userId = session?.user?.id || "user-id";
      
      const now = new Date().toISOString();
      const content = {
        ...data,
        id: "content-" + Math.random().toString(36).substring(2, 9),
        user_id: userId,
        created_at: now,
        updated_at: now,
      };
      
      try {
        const existingContents = JSON.parse(localStorage.getItem('userContents') || '[]');
        localStorage.setItem('userContents', JSON.stringify([content, ...existingContents]));
      } catch (err) {
        console.error("Error saving to localStorage:", err);
      }
      
      return { content, error: null };
    },
    
    getAll: async (): Promise<{ contents: Content[]; error: any }> => {
      try {
        const storedContents = localStorage.getItem('userContents');
        const userContents: Content[] = storedContents ? JSON.parse(storedContents) : [];
        
        if (userContents.length === 0) {
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
      } catch (err) {
        console.error("Error retrieving from localStorage:", err);
        return { contents: [], error: err };
      }
    },
    
    search: async (query: string): Promise<{ results: Content[]; error: any }> => {
      console.log("Searching for:", query);
      
      try {
        // Get stored content from localStorage
        const storedContents = localStorage.getItem('userContents');
        const userContents: Content[] = storedContents ? JSON.parse(storedContents) : [];
        
        if (userContents.length === 0) {
          // If no user content exists, don't return any results
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
        
        console.log("Search results:", results);
        return { results, error: null };
      } catch (err) {
        console.error("Error searching content:", err);
        return { results: [], error: err };
      }
    },
    
    delete: async (id: string): Promise<{ error: any }> => {
      console.log("Delete content:", id);
      
      try {
        const existingContents = JSON.parse(localStorage.getItem('userContents') || '[]');
        const updatedContents = existingContents.filter((item: Content) => item.id !== id);
        localStorage.setItem('userContents', JSON.stringify(updatedContents));
      } catch (err) {
        console.error("Error removing from localStorage:", err);
      }
      
      return { error: null };
    },
    
    update: async (id: string, data: Partial<Content>): Promise<{ content: Content | null; error: any }> => {
      console.log("Update content:", id, data);
      
      const content = {
        ...data,
        id,
        user_id: "user-id",
        type: data.type as ContentType || "text",
        content: data.content || "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Content;
      
      return { content, error: null };
    },
  }
};

export const handleApiError = (error: any): string => {
  console.error("API Error:", error);
  const errorMessage = error?.message || "An unexpected error occurred";
  toast.error(errorMessage);
  return errorMessage;
};
