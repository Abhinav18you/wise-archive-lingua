
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "@/lib/toast";
import { Menu, X, LogOut, User } from "lucide-react";

interface NavbarProps {
  isAuthenticated: boolean;
}

const Navbar = ({ isAuthenticated }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoggingOut(true);
      const { error } = await api.auth.signOut();
      if (error) throw error;
      
      navigate("/", { replace: true });
      toast.success("You have been signed out");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    } finally {
      setLoggingOut(false);
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo and brand */}
        <Link to="/" className="flex items-center gap-2 mr-4" onClick={() => setMobileMenuOpen(false)}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            M
          </div>
          <span className="text-xl font-semibold tracking-tight">Memoria</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex items-center gap-6 text-sm">
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`transition-colors hover:text-foreground/80 ${isActive("/dashboard") ? "text-foreground font-medium" : "text-foreground/60"}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/search" 
                  className={`transition-colors hover:text-foreground/80 ${isActive("/search") ? "text-foreground font-medium" : "text-foreground/60"}`}
                >
                  Search
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/profile")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                  disabled={loggingOut}
                >
                  {loggingOut ? "Signing out..." : "Sign out"}
                </Button>
              </>
            ) : (
              <Button 
                size="sm"
                onClick={() => navigate("/auth")}
              >
                Sign in
              </Button>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t md:hidden">
          <div className="container py-4 space-y-3">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/dashboard");
                    setMobileMenuOpen(false);
                  }}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/search");
                    setMobileMenuOpen(false);
                  }}
                >
                  Search
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => {
                    navigate("/profile");
                    setMobileMenuOpen(false);
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleSignOut}
                  disabled={loggingOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {loggingOut ? "Signing out..." : "Sign out"}
                </Button>
              </>
            ) : (
              <Button 
                className="w-full"
                onClick={() => {
                  navigate("/auth");
                  setMobileMenuOpen(false);
                }}
              >
                Sign in
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
