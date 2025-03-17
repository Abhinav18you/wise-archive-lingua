
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";

// Default redirect URL
const DEFAULT_REDIRECT = "/dashboard";

/**
 * Sign up a user with email and password
 */
export const signUpWithEmail = async (email: string, password: string, username?: string) => {
  console.log("Signing up with email:", email);
  
  try {
    // Get the current origin dynamically
    const callbackUrl = `${window.location.origin}/auth/callback`;
    console.log("Using callback URL:", callbackUrl);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Add metadata if username is provided
        data: username ? { username } : undefined,
        // Set the redirect URL for email confirmation
        emailRedirectTo: callbackUrl,
      },
    });
    
    if (error) {
      console.error("Sign up error:", error);
      return { data: null, error };
    }

    console.log("Sign up successful, awaiting confirmation:", data);
    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error during signup:", err);
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('Unknown error during signup') 
    };
  }
};

/**
 * Sign in a user with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  console.log("Signing in with email:", email);
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Sign in error:", error);
      return { data: null, error };
    }

    console.log("Sign in successful:", data.user?.id);
    return { data, error: null };
  } catch (err) {
    console.error("Unexpected error during signin:", err);
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('Unknown error during signin') 
    };
  }
};

/**
 * Get the current user's session
 */
export const getSession = async () => {
  console.log("Getting user session");
  
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Get session error:", error);
      return { session: null, error };
    }
    
    if (data.session) {
      console.log("Session found for user:", data.session.user.id);
      return { session: data.session, error: null };
    }
    
    console.log("No active session found");
    return { session: null, error: null };
  } catch (err) {
    console.error("Unexpected error getting session:", err);
    return { 
      session: null, 
      error: err instanceof Error ? err : new Error('Unknown error getting session') 
    };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  console.log("Signing out user");
  
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out. Please try again.");
      return { error };
    }
    
    toast.success("Signed out successfully");
    return { error: null };
  } catch (err) {
    console.error("Unexpected error during signout:", err);
    return { 
      error: err instanceof Error ? err : new Error('Unknown error during signout') 
    };
  }
};

/**
 * Set up auth state change listener
 */
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  console.log("Setting up auth state change listener");
  return supabase.auth.onAuthStateChange(callback);
};
