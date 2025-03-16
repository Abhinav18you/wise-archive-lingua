
import { supabase } from "@/integrations/supabase/client";

// Default redirect URL
const DEFAULT_REDIRECT = "/dashboard";

/**
 * Sign up a user with email and password
 */
export const signUpWithEmail = async (email: string, password: string, username?: string) => {
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
  
  return { data, error };
};

/**
 * Sign in a user with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/**
 * Get the current user's session
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
};

/**
 * Set up auth state change listener
 */
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};

/**
 * Handle the auth callback after email verification
 */
export const handleAuthCallback = async () => {
  const { data, error } = await supabase.auth.getSession();
  // Process the redirect if there's a valid session
  if (data.session) {
    // Navigate to the default page after successful auth
    window.location.href = DEFAULT_REDIRECT;
  }
  return { session: data.session, error };
};
