
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const Layout = ({ children, requireAuth = false }: LayoutProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication status on mount and route change
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        console.log("Layout: checking auth session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking auth session:", error);
          setError(error.message);
          setIsAuthenticated(false);
        } else {
          console.log("Session check result:", !!data.session, data.session?.user?.id);
          setIsAuthenticated(!!data.session);
        }
      } catch (err) {
        console.error("Unexpected error checking session:", err);
        setError(`Error loading session: ${err instanceof Error ? err.message : String(err)}`);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, !!session);
      setIsAuthenticated(!!session);
      
      // Handle sign-in and sign-out events
      if (event === 'SIGNED_IN') {
        console.log("User signed in, redirecting to dashboard");
        navigate('/dashboard', { replace: true });
        toast.success("Signed in successfully!");
      } else if (event === 'SIGNED_OUT' && requireAuth) {
        console.log("User signed out, redirecting to auth");
        navigate('/auth', { replace: true });
        toast.info("Signed out");
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate, requireAuth]);

  // Handle protected routes
  useEffect(() => {
    if (!isLoading && requireAuth && isAuthenticated === false) {
      console.log("Redirecting to auth page - not authenticated. Current path:", location.pathname);
      navigate('/auth', { replace: true, state: { from: location.pathname } });
    }
  }, [isAuthenticated, isLoading, navigate, requireAuth, location.pathname]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar isAuthenticated={false} />
        <main className="flex-1 container py-8 px-4 sm:px-6 flex items-center justify-center">
          <Spinner size="lg" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar isAuthenticated={false} />
        <main className="flex-1 container py-8 px-4 sm:px-6 flex items-center justify-center">
          <div className="max-w-md w-full p-6 bg-card rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Error Loading Application</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar isAuthenticated={!!isAuthenticated} />
      <main className="flex-1 container py-8 px-4 sm:px-6">
        {children}
      </main>
      <footer className="border-t py-6 bg-background/80 backdrop-blur-sm">
        <div className="container flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Memoria. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
