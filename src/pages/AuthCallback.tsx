
import { useEffect, useState } from "react";
import { handleAuthCallback } from "@/lib/auth";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  useEffect(() => {
    const processAuthRedirect = async () => {
      try {
        console.log("Processing auth redirect...");
        const { session, error } = await handleAuthCallback();
        
        if (error) {
          console.error("Auth callback error:", error);
          setError(error.message);
          setDebugInfo(JSON.stringify(error, null, 2));
        } else if (session) {
          console.log("Auth successful, redirecting to dashboard");
          navigate("/dashboard");
        } else {
          console.log("No session or error returned");
          setError("Authentication failed. No session was created.");
        }
      } catch (err: any) {
        console.error("Unhandled error in auth callback:", err);
        setError(err.message || "An error occurred during authentication");
        setDebugInfo(JSON.stringify(err, null, 2));
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
