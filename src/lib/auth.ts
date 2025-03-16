
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";

// Default redirect URL
const DEFAULT_REDIRECT = "/dashboard";

/**
 * Sign up a user with email and password
 */
export const signUpWithEmail = async (email: string, password: string, username?: string) => {
  console.log("Signing up with email:", email);
  
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
  } else {
    console.log("Sign up successful, awaiting confirmation");
  }
  
  return { data, error };
};

/**
 * Sign in a user with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  console.log("Signing in with email:", email);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    console.error("Sign in error:", error);
  } else {
    console.log("Sign in successful");
  }
  
  return { data, error };
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  console.log("Signing out user");
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error("Sign out error:", error);
    toast.error("Failed to sign out. Please try again.");
  } else {
    toast.success("Signed out successfully");
  }
  
  return { error };
};

/**
 * Get the current user's session
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error("Get session error:", error);
  } else if (data.session) {
    console.log("Session found for user:", data.session.user.id);
  } else {
    console.log("No active session found");
  }
  
  return { session: data.session, error };
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
  
  try {
    // This will exchange the auth code for a session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error getting session after redirect:", error);
      return { session: null, error };
    }
    
    if (data.session) {
      console.log("Authentication successful, session established");
      return { session: data.session, error: null };
    } else {
      console.log("No session found after redirect");
      return { 
        session: null, 
        error: { message: "No session was established after authentication." } 
      };
    }
  } catch (err) {
    console.error("Unexpected error in auth callback:", err);
    return { 
      session: null, 
      error: { message: "An unexpected error occurred during authentication." } 
    };
  }
};
