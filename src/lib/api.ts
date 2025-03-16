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
      // Mock content creation
      console.log("Create content:", data);
      
      // Simulate successful content creation
      const content = {
        ...data,
        id: "content-" + Math.random().toString(36).substring(2, 9),
        user_id: "user-id",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      return { content, error: null };
    },
    
    getAll: async (): Promise<{ contents: Content[]; error: any }> => {
      // Mock getting all content for user
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
    },
    
    search: async (query: string): Promise<{ results: Content[]; error: any }> => {
      // Mock search functionality
      console.log("Searching for:", query);
      
      // Mock search results
      const mockResults: Content[] = [
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
      ];
      
      return { results: mockResults, error: null };
    },
    
    delete: async (id: string): Promise<{ error: any }> => {
      // Mock delete
      console.log("Delete content:", id);
      return { error: null };
    },
    
    update: async (id: string, data: Partial<Content>): Promise<{ content: Content | null; error: any }> => {
      // Mock update
      console.log("Update content:", id, data);
      
      // Simulate successful update
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

// Helper function to handle API errors
export const handleApiError = (error: any): string => {
  console.error("API Error:", error);
  const errorMessage = error?.message || "An unexpected error occurred";
  toast.error(errorMessage);
  return errorMessage;
};
