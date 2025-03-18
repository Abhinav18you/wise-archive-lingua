
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
        
        // First check localStorage for a session
        const storedSession = localStorage.getItem('supabase.auth.token');
        let sessionFound = false;
        
        if (storedSession) {
          try {
            const parsedSession = JSON.parse(storedSession);
            if (parsedSession && new Date(parsedSession.expires_at * 1000) > new Date()) {
              console.log("Using cached session from localStorage");
              setIsAuthenticated(true);
              sessionFound = true;
              setIsLoading(false);
            }
          } catch (e) {
            console.error("Error parsing stored session:", e);
          }
        }
        
        if (!sessionFound) {
          // If no valid session in localStorage, check with Supabase
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error checking auth session:", error);
            setError(error.message);
            setIsAuthenticated(false);
          } else {
            console.log("Session check result:", !!data.session, data.session?.user?.id);
            
            if (data.session) {
              localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
            }
            
            setIsAuthenticated(!!data.session);
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Unexpected error checking session:", err);
        setError(`Error loading session: ${err instanceof Error ? err.message : String(err)}`);
        setIsAuthenticated(false);
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
        console.log("User signed in, redirecting to dashboard", session?.user?.id);
        
        if (session) {
          localStorage.setItem('supabase.auth.token', JSON.stringify(session));
        }
        
        toast.success("Signed in successfully!");
        
        // Use setTimeout to ensure state is updated before navigation
        setTimeout(() => {
          if (location.pathname !== '/dashboard') {
            navigate('/dashboard', { replace: true });
          }
        }, 100);
      } else if (event === 'SIGNED_OUT' && requireAuth) {
        console.log("User signed out, redirecting to auth");
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('supabase.auth.session');
        navigate('/auth', { replace: true });
        toast.info("Signed out");
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate, requireAuth, location.pathname]);

  // Handle protected routes
  useEffect(() => {
    // Only redirect if we're not currently loading and we know the auth state
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
