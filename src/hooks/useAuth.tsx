
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/lib/toast";
import { signUpWithEmail, signInWithEmail, getSession, SESSION_STORAGE_KEY } from "@/lib/auth";
import { AuthFormData } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
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
      setAuthError(error.message || "Sign up failed. Please try again.");
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
      setAuthError(error.message || "Sign in failed. Please try again.");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
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
    setIsAuthenticated,
    setConfirmationSent,
    handleChange,
    handleSignUp,
    handleSignIn,
    setAuthError
  };
};
