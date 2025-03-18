
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangleIcon, CheckCircleIcon, ArrowLeftIcon, RefreshCwIcon } from "lucide-react";
import { SESSION_STORAGE_KEY } from "@/lib/auth";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");

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
              
              // Wait a bit before redirecting to ensure state is updated
              setTimeout(() => {
                navigate("/dashboard", { replace: true });
              }, 500);
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
          
          // Wait a bit before redirecting to ensure state is updated
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 500);
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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircleIcon className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-semibold">Authentication Successful!</CardTitle>
            <CardDescription>You have successfully verified your account</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-4">
            <p>Redirecting you to your dashboard...</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={() => navigate("/dashboard", { replace: true })}
              className="gap-2"
            >
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangleIcon className="h-16 w-16 text-amber-500" />
            </div>
            <CardTitle className="text-2xl font-semibold text-red-600">Authentication Failed</CardTitle>
          </CardHeader>
          <CardContent className="py-4">
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            
            <div className="mt-6 space-y-2">
              <h3 className="font-medium">Possible causes:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>The verification link has expired or is invalid</li>
                <li>Your callback URL is not configured in Supabase</li>
                <li>You've already verified your email</li>
                <li>There's a temporary issue with the authentication service</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button 
              onClick={() => navigate("/auth")}
              variant="default"
              className="w-full gap-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Return to Sign In
            </Button>
            
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full gap-2"
            >
              <RefreshCwIcon className="h-4 w-4" />
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Verifying your account...</CardTitle>
          <CardDescription>This may take a few moments</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Spinner size="lg" />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
