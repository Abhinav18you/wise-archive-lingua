
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";
import { SESSION_STORAGE_KEY } from "@/lib/auth";
import LoadingState from "@/components/auth/callback/LoadingState";
import SuccessState from "@/components/auth/callback/SuccessState";
import ErrorState from "@/components/auth/callback/ErrorState";

type AuthStatus = "processing" | "success" | "error";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>("processing");

  useEffect(() => {
    const processAuthRedirect = async () => {
      try {
        console.log("Processing auth redirect...");
        console.log("Current URL:", window.location.href);
        
        // Parse query parameters to check for error or access_token
        const query = new URLSearchParams(location.search);
        const errorDescription = query.get("error_description");
        
        if (errorDescription) {
          console.error("Error in redirect:", errorDescription);
          setError(`Authentication error: ${errorDescription}`);
          setStatus("error");
          setLoading(false);
          return;
        }
        
        // Try exchanging the auth code for a session if present
        const code = query.get("code");
        if (code) {
          console.log("Found auth code, exchanging for session");
          
          try {
            // Exchange code for session
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (error) {
              console.error("Error exchanging code for session:", error);
              setError(error.message);
              setStatus("error");
              setLoading(false);
              return;
            }
            
            if (data.session) {
              console.log("Session established from code:", data.session.user.id);
              
              // Store session in localStorage for persistence
              localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.session));
              
              setStatus("success");
              toast.success("Authentication successful!");
              
              // Navigate immediately without delay
              navigate("/dashboard", { replace: true });
              return;
            } else {
              console.error("No session established from code");
              setError("Failed to establish a session. Please try signing in again.");
              setStatus("error");
              setLoading(false);
              return;
            }
          } catch (err) {
            console.error("Error in code exchange:", err);
            setError("Failed to exchange code for session.");
            setStatus("error");
            setLoading(false);
            return;
          }
        }
        
        // If no code, check if we already have a session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setError(error.message);
          setStatus("error");
          setLoading(false);
          return;
        }
        
        if (data.session) {
          console.log("Session found, authentication successful", data.session.user.id);
          // Store session in localStorage for persistence
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.session));
          
          setStatus("success");
          toast.success("Email verified successfully!");
          
          // Navigate immediately without delay
          navigate("/dashboard", { replace: true });
          return;
        }
        
        // If we reach here, no session was established
        console.log("No session established");
        setError("Authentication failed. Please try signing in again.");
        setStatus("error");
        setLoading(false);
      } catch (err: any) {
        console.error("Unhandled error in auth callback:", err);
        setError(err.message || "An error occurred during authentication");
        setStatus("error");
        setLoading(false);
      }
    };

    processAuthRedirect();
  }, [navigate, location]);

  if (status === "success") {
    return <SuccessState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return <LoadingState />;
};

export default AuthCallback;
