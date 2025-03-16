
import { useEffect, useState } from "react";
import { handleAuthCallback } from "@/lib/auth";
import { Spinner } from "@/components/ui/spinner"; // We'll create this next

const AuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processAuthRedirect = async () => {
      try {
        const { error } = await handleAuthCallback();
        if (error) {
          setError(error.message);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred during authentication");
      } finally {
        setLoading(false);
      }
    };

    processAuthRedirect();
  }, []);

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
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <h1 className="text-2xl font-semibold mb-4 text-red-500">Authentication Error</h1>
        <p className="text-gray-700 mb-4">{error}</p>
        <a href="/auth" className="text-primary hover:underline">
          Return to sign in
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-2xl font-semibold mb-4">Authentication successful!</h1>
      <p className="text-gray-700 mb-4">Redirecting you to your dashboard...</p>
    </div>
  );
};

export default AuthCallback;
