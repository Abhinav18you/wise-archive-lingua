
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Add metadata if username is provided
        data: username ? { username } : undefined,
        // Set the redirect URL for email confirmation
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) {
      console.error("Sign up error:", error);
      return { data: null, error };
    } else {
      console.log("Sign up successful, awaiting confirmation:", data);
      return { data, error: null };
    }
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
    } else {
      console.log("Sign in successful:", data);
      return { data, error: null };
    }
  } catch (err) {
    console.error("Unexpected error during signin:", err);
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('Unknown error during signin') 
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
    } else {
      toast.success("Signed out successfully");
      return { error: null };
    }
  } catch (err) {
    console.error("Unexpected error during signout:", err);
    return { 
      error: err instanceof Error ? err : new Error('Unknown error during signout') 
    };
  }
};

/**
 * Get the current user's session
 */
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Get session error:", error);
      return { session: null, error };
    } else if (data.session) {
      console.log("Session found for user:", data.session.user.id);
      return { session: data.session, error: null };
    } else {
      console.log("No active session found");
      return { session: null, error: null };
    }
  } catch (err) {
    console.error("Unexpected error getting session:", err);
    return { 
      session: null, 
      error: err instanceof Error ? err : new Error('Unknown error getting session') 
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

/**
 * Handle the auth callback after email verification
 */
export const handleAuthCallback = async () => {
  console.log("Handling auth callback");
  
  try {
    // Get the current URL hash and query parameters (Supabase uses these for auth)
    const hash = window.location.hash;
    const query = new URLSearchParams(window.location.search);
    
    // Log hash and query for debugging
    if (hash) console.log("URL hash present:", hash);
    if (query.toString()) console.log("URL query params:", query.toString());
    
    // Check for error in query parameters
    const errorDescription = query.get("error_description");
    if (errorDescription) {
      console.error("Error in redirect:", errorDescription);
      return { 
        session: null, 
        error: { message: `Authentication error: ${errorDescription}` } 
      };
    }
    
    // This will exchange the auth code for a session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error getting session after redirect:", error);
      return { session: null, error };
    }
    
    if (data.session) {
      console.log("Authentication successful, session established", data.session);
      return { session: data.session, error: null };
    } else {
      console.log("No session found after redirect");
      // Try refreshing auth state
      try {
        const refreshResult = await supabase.auth.refreshSession();
        if (refreshResult.data.session) {
          console.log("Successfully refreshed session", refreshResult.data.session);
          return { session: refreshResult.data.session, error: null };
        }
      } catch (refreshErr) {
        console.error("Error refreshing session:", refreshErr);
      }
      
      return { 
        session: null, 
        error: { message: "No session was established after authentication." } 
      };
    }
  } catch (err) {
    console.error("Unexpected error in auth callback:", err);
    return { 
      session: null, 
      error: { 
        message: "An unexpected error occurred during authentication.",
        details: err instanceof Error ? err.message : String(err)
      } 
    };
  }
};
