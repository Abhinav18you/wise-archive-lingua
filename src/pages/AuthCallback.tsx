
import { useEffect, useState } from "react";
import { handleAuthCallback } from "@/lib/auth";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  useEffect(() => {
    const processAuthRedirect = async () => {
      try {
        console.log("Processing auth redirect...");
        console.log("Current URL:", window.location.href);
        
        // Log important details for debugging
        console.log("URL hash:", window.location.hash);
        console.log("URL search params:", window.location.search);
        
        const { session, error } = await handleAuthCallback();
        
        if (error) {
          console.error("Auth callback error:", error);
          setError(error.message);
          setDebugInfo(JSON.stringify(error, null, 2));
          
          // Try to recover by checking if we already have a session
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            console.log("Found existing session despite error, redirecting to dashboard");
            toast.success("Authentication successful!");
            navigate("/dashboard", { replace: true });
            return;
          }
        } else if (session) {
          console.log("Auth successful, redirecting to dashboard");
          toast.success("Authentication successful!");
          navigate("/dashboard", { replace: true });
        } else {
          console.log("No session or error returned");
          
          // Try to recover by refreshing the session
          const { data } = await supabase.auth.refreshSession();
          if (data.session) {
            console.log("Successfully refreshed session, redirecting");
            toast.success("Authentication successful!");
            navigate("/dashboard", { replace: true });
            return;
          }
          
          setError("Authentication failed. No session was created.");
          setDebugInfo("No session object returned and no error was thrown. This might indicate an issue with the authentication flow.");
        }
      } catch (err: any) {
        console.error("Unhandled error in auth callback:", err);
        setError(err.message || "An error occurred during authentication");
        setDebugInfo(JSON.stringify(err, null, 2));
        
        // Last resort recovery attempt
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            console.log("Found existing session despite error, redirecting to dashboard");
            toast.success("Authentication successful!");
            navigate("/dashboard", { replace: true });
            return;
          }
        } catch (sessionErr) {
          console.error("Failed to check session in recovery:", sessionErr);
        }
      } finally {
        setLoading(false);
      }
    };

    processAuthRedirect();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <h1 className="text-2xl font-semibold mb-4">Verifying your account...</h1>
        <Spinner size="lg" />
        <p className="text-muted-foreground mt-4">This may take a few moments</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] max-w-md mx-auto px-4">
        <Alert variant="destructive" className="mb-6">
          <AlertDescription className="text-center">{error}</AlertDescription>
        </Alert>
        
        {debugInfo && (
          <div className="bg-muted p-4 rounded-md w-full mb-6 max-h-60 overflow-auto">
            <pre className="text-xs">{debugInfo}</pre>
          </div>
        )}
        
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button 
            onClick={() => navigate("/auth")}
            variant="default"
            className="w-full"
          >
            Return to sign in
          </Button>
          
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="w-full"
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-2xl font-semibold mb-4">Authentication successful!</h1>
      <p className="text-gray-700 mb-4">Redirecting you to your dashboard...</p>
      <Spinner size="md" />
    </div>
  );
};

export default AuthCallback;
