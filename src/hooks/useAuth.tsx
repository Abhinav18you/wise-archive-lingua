
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/lib/toast";
import { signUpWithEmail, signInWithEmail, resetPassword, getSession, SESSION_STORAGE_KEY } from "@/lib/auth";
import { AuthFormData } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    username: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignUp = async () => {
    setLoading(true);
    setAuthError(null);

    try {
      console.log("Signing up user with email:", formData.email);
      
      // First check if user already exists
      const { data: existingUserData, error: checkError } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          shouldCreateUser: false // Just check if user exists, don't create OTP
        }
      });
      
      // If no error from OTP check, user likely exists
      if (!checkError && existingUserData) {
        setAuthError("An account with this email already exists. Please sign in instead.");
        setLoading(false);
        return;
      }
      
      // Proceed with sign up if user doesn't exist
      const { error } = await signUpWithEmail(
        formData.email,
        formData.password,
        formData.username
      );
      
      if (error) throw error;
      
      setConfirmationSent(true);
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error: any) {
      console.error("Auth error:", error);
      
      // Handle specific error cases
      if (error.message?.includes("already") || error.message?.includes("exists")) {
        setAuthError("An account with this email already exists. Please sign in instead.");
      } else {
        setAuthError(error.message || "Sign up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    setAuthError(null);

    try {
      console.log("Signing in user with email:", formData.email);
      const { data, error } = await signInWithEmail(
        formData.email,
        formData.password
      );
      
      if (error) throw error;
      
      console.log("Sign in successful, data:", data);
      
      // Store session immediately
      if (data.session) {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.session));
      }
      
      setIsAuthenticated(true);
      toast.success("Signed in successfully!");
      
      // Navigate immediately, don't wait
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      console.error("Auth error:", error);
      
      // Handle specific cases for better UX
      if (error.message?.includes("Invalid login")) {
        setAuthError("Invalid email or password. Please try again.");
      } else if (error.message?.includes("Email not confirmed")) {
        // If email not confirmed, show confirmation screen
        setConfirmationSent(true);
        setAuthError("Please verify your email before signing in.");
      } else {
        setAuthError(error.message || "Sign in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    setLoading(true);
    setAuthError(null);

    try {
      console.log("Password reset requested for email:", email);
      const { error } = await resetPassword(email);
      
      if (error) throw error;
      
      setForgotPasswordMode(false);
      toast.success("Password reset link sent! Please check your inbox and follow the instructions to reset your password.");
    } catch (error: any) {
      console.error("Password reset error:", error);
      setAuthError(error.message || "Password reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const toggleForgotPassword = (value: boolean) => {
    setForgotPasswordMode(value);
    setAuthError(null);
  };

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthSession = async () => {
      setCheckingSession(true);
      try {
        console.log("useAuth: checking session");
        const { session, error } = await getSession();
        
        if (error) {
          console.error("Session check error:", error);
          setIsAuthenticated(false);
        } else if (session) {
          console.log("Found existing session, user is authenticated");
          setIsAuthenticated(true);
          // If on auth page, redirect
          if (window.location.pathname === '/auth') {
            navigate("/dashboard", { replace: true });
          }
        } else {
          console.log("No session found, user is not authenticated");
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Error checking session in useAuth:", err);
        setIsAuthenticated(false);
      } finally {
        setCheckingSession(false);
      }
    };
    
    checkAuthSession();
    
    // Also set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed in useAuth:", event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in via state change", session.user.id);
        setIsAuthenticated(true);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out via state change");
        setIsAuthenticated(false);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  return {
    formData,
    loading,
    authError,
    checkingSession,
    confirmationSent,
    isAuthenticated,
    forgotPasswordMode,
    setIsAuthenticated,
    setConfirmationSent,
    toggleForgotPassword,
    handleChange,
    handleSignUp,
    handleSignIn,
    handleForgotPassword,
    setAuthError
  };
};
