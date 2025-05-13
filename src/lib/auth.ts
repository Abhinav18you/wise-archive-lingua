
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";

// Default redirect URL
const DEFAULT_REDIRECT = "/dashboard";

// Consistent session storage key - must match across all files
export const SESSION_STORAGE_KEY = 'memoria.session';

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
    
    // Store session info in localStorage consistently
    if (data.session) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.session));
    }
    
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
 * Reset password for a user
 */
export const resetPassword = async (email: string) => {
  console.log("Resetting password for email:", email);
  
  try {
    // Get the current origin dynamically for the reset password redirect
    const redirectUrl = `${window.location.origin}/auth/callback`;
    console.log("Using redirect URL for password reset:", redirectUrl);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    
    if (error) {
      console.error("Password reset error:", error);
      return { error };
    }

    console.log("Password reset email sent successfully");
    return { error: null };
  } catch (err) {
    console.error("Unexpected error during password reset:", err);
    return { 
      error: err instanceof Error ? err : new Error('Unknown error during password reset') 
    };
  }
};

/**
 * Get the current user's session
 */
export const getSession = async () => {
  console.log("Getting user session");
  
  try {
    // First try to get the session from Supabase
    const { data: supabaseData, error: supabaseError } = await supabase.auth.getSession();
    
    if (supabaseError) {
      console.error("Get session error from Supabase:", supabaseError);
      return { session: null, error: supabaseError };
    }
    
    if (supabaseData.session) {
      console.log("Active Supabase session found for user:", supabaseData.session.user.id);
      // Update localStorage with the latest session
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(supabaseData.session));
      return { session: supabaseData.session, error: null };
    }
    
    // If no Supabase session, check localStorage as a fallback
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
    if (storedSession) {
      console.log("Found stored session in localStorage");
      try {
        // Try to parse the stored session
        const parsedSession = JSON.parse(storedSession);
        if (parsedSession && parsedSession.expires_at && new Date(parsedSession.expires_at * 1000) > new Date()) {
          console.log("Using stored session from localStorage");
          return { session: parsedSession, error: null };
        } else {
          console.log("Stored session is expired or invalid");
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }
      } catch (e) {
        console.error("Error parsing stored session:", e);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
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
    // First clear localStorage to prevent any stale session data
    localStorage.removeItem(SESSION_STORAGE_KEY);
    
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
