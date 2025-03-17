
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  useEffect(() => {
    const processAuthRedirect = async () => {
      try {
        console.log("Processing auth redirect...");
        console.log("Current URL:", window.location.href);
        console.log("URL hash:", window.location.hash);
        console.log("URL search params:", window.location.search);
        
        // Parse query parameters to check for error or access_token
        const query = new URLSearchParams(location.search);
        const errorDescription = query.get("error_description");
        const hashParams = new URLSearchParams(location.hash.replace('#', ''));
        const accessToken = hashParams.get("access_token");
        
        if (errorDescription) {
          console.error("Error in redirect:", errorDescription);
          setError(`Authentication error: ${errorDescription}`);
          setLoading(false);
          return;
        }
        
        // If we have an access token in the URL, we can use it directly
        if (accessToken) {
          console.log("Found access token in URL, setting session");
          
          try {
            const { data, error } = await supabase.auth.getSession();
            if (error) throw error;
            
            console.log("Session established:", !!data.session);
            toast.success("Authentication successful!");
            navigate("/dashboard", { replace: true });
            return;
          } catch (err) {
            console.error("Error setting session from token:", err);
            setError("Failed to set session from token.");
            setLoading(false);
            return;
          }
        }
        
        // Handle normal email confirmation flow
        const { data, error } = await supabase.auth.getSession();
        console.log("Get session result:", !!data.session, error);
        
        if (error) {
          console.error("Error getting session:", error);
          setError(error.message);
          setLoading(false);
          return;
        }
        
        if (data.session) {
          console.log("Session found, authentication successful");
          toast.success("Email verified successfully!");
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 300);
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
              setLoading(false);
              return;
            }
            
            if (data.session) {
              console.log("Session established from code");
              toast.success("Authentication successful!");
              navigate("/dashboard", { replace: true });
              return;
            }
          } catch (err) {
            console.error("Error in code exchange:", err);
            setError("Failed to exchange code for session.");
            setLoading(false);
            return;
          }
        }
        
        // If we reach here, no session was established
        console.log("No session established");
        setError("Authentication failed. Please try signing in again.");
        setLoading(false);
      } catch (err: any) {
        console.error("Unhandled error in auth callback:", err);
        setError(err.message || "An error occurred during authentication");
        setDebugInfo(JSON.stringify(err, null, 2));
        setLoading(false);
      }
    };

    processAuthRedirect();
  }, [navigate, location]);

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
