
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/lib/toast";
import { signUpWithEmail, signInWithEmail, getSession } from "@/lib/auth";
import { AuthFormData } from "@/types";

export const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  
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
      const { error } = await signInWithEmail(
        formData.email,
        formData.password
      );
      
      if (error) throw error;
      
      toast.success("Signed in successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Auth error:", error);
      setAuthError(error.message || "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthSession = async () => {
      setCheckingSession(true);
      const { session } = await getSession();
      console.log("useAuth: checking session", !!session);
      if (session) {
        console.log("Found existing session, user is authenticated");
      }
      setCheckingSession(false);
    };
    
    checkAuthSession();
  }, [navigate]);

  return {
    formData,
    loading,
    authError,
    checkingSession,
    confirmationSent,
    setConfirmationSent,
    handleChange,
    handleSignUp,
    handleSignIn,
    setAuthError
  };
};
