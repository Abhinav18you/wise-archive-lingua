
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/lib/toast";

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const Layout = ({ children, requireAuth = false }: LayoutProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication status on mount and route change
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking auth session:", error);
          setIsAuthenticated(false);
        } else {
          console.log("Session check result:", !!data.session, data.session?.user?.id);
          setIsAuthenticated(!!data.session);
        }
      } catch (err) {
        console.error("Unexpected error checking session:", err);
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
        navigate('/dashboard');
        toast.success("Signed in successfully!");
      } else if (event === 'SIGNED_OUT' && requireAuth) {
        console.log("User signed out, redirecting to auth");
        navigate('/auth');
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
      navigate('/auth', { replace: true });
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
