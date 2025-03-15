
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { supabase } from "@/integrations/supabase/client";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  // Check authentication status on mount and route change
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar isAuthenticated={isAuthenticated} />
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
