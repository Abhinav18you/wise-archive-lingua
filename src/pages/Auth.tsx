
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("Auth page: checking session", data.session);
      if (data.session) {
        console.log("User already has session, redirecting to dashboard");
        navigate("/dashboard", { replace: true });
      }
    };
    
    checkSession();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-3xl font-bold mb-8 animate-fade-in">Welcome to Memoria</h1>
      <AuthForm />
    </div>
  );
};

export default Auth;
