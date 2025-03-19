
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Auth page: checking session");
        
        // First check if Supabase has a session directly
        const { data, error: supabaseError } = await supabase.auth.getSession();
        
        if (supabaseError) {
          console.error("Error checking Supabase session:", supabaseError);
          setError(supabaseError.message);
          setIsLoading(false);
          return;
        }
        
        if (data.session) {
          console.log("User already has session in Supabase, redirecting to dashboard");
          navigate("/dashboard", { replace: true });
          return;
        }
        
        // If no Supabase session, fall back to our getSession helper
        const { session, error } = await getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          setError(error.message);
          setIsLoading(false);
          return;
        }
        
        console.log("Auth page session check result:", !!session);
        
        if (session) {
          console.log("User already has session, redirecting to dashboard");
          navigate("/dashboard", { replace: true });
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Unexpected error in Auth page:", err);
        setError(`Error checking authentication: ${err instanceof Error ? err.message : String(err)}`);
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Also listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed in Auth page:", event);
      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in, redirecting to dashboard");
        navigate("/dashboard", { replace: true });
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4 max-w-md">
          <p><strong>Error:</strong> {error}</p>
        </div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-3xl font-bold mb-8 animate-fade-in">Welcome to Memoria</h1>
      <AuthForm />
    </div>
  );
};

export default Auth;
