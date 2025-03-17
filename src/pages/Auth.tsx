
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Auth page: checking session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          setIsLoading(false);
          return;
        }
        
        console.log("Auth page session check result:", !!data.session);
        
        if (data.session) {
          console.log("User already has session, redirecting to dashboard");
          navigate("/dashboard", { replace: true });
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Unexpected error in Auth page:", err);
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Spinner size="lg" />
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
