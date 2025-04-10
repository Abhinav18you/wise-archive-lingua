
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "@/lib/toast";
import { Menu, X, LogOut, User, Bot, Search as SearchIcon } from "lucide-react";

interface NavbarProps {
  isAuthenticated: boolean;
}

const Navbar = ({ isAuthenticated }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <nav 
      className={`sticky top-0 z-40 w-full backdrop-blur transition-all duration-300 ${
        scrolled 
          ? "bg-background/95 shadow-sm border-b" 
          : "bg-background/50"
      }`}
    >
      <div className="container flex h-16 items-center">
        {/* Logo and brand */}
        <Link 
          to="/" 
          className="flex items-center gap-2 mr-4 transition-all hover:scale-105" 
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="flex h-10 w-10 items-center justify-center bg-gradient-primary text-primary-foreground rounded-full shadow-glow">
            <span className="font-bold text-lg">M</span>
          </div>
          <span className="font-heading font-semibold tracking-tight text-3xl">
            <span className="text-gradient">Mem</span>oria
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex items-center gap-8 text-sm">
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`relative transition-colors hover:text-foreground/80 after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:bg-primary ${
                    isActive("/dashboard") 
                      ? "text-foreground font-medium after:scale-x-100 after:bg-primary" 
                      : "text-foreground/60"
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/search" 
                  className={`flex items-center gap-2 relative transition-colors hover:text-foreground/80 after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:bg-primary ${
                    isActive("/search") 
                      ? "text-foreground font-medium after:scale-x-100 after:bg-primary" 
                      : "text-foreground/60"
                  }`}
                >
                  <SearchIcon className="h-3.5 w-3.5" />
                  Search
                </Link>
                <Link 
                  to="/chat" 
                  className={`flex items-center gap-2 relative transition-colors hover:text-foreground/80 after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:bg-primary ${
                    isActive("/chat") 
                      ? "text-foreground font-medium after:scale-x-100 after:bg-primary" 
                      : "text-foreground/60"
                  }`}
                >
                  <Bot className="h-3.5 w-3.5" />
                  AI Chat
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate("/profile")}
                  className="hover:bg-accent/20 transition-all duration-300"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut} 
                  disabled={loggingOut}
                  className="hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
                >
                  {loggingOut ? "Signing out..." : (
                    <>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button 
                size="sm" 
                onClick={() => navigate("/auth")} 
                className="font-normal text-xl bg-gradient-primary hover:shadow-glow transition-all duration-300"
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
            className="hover:bg-primary/10 transition-all duration-300"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t md:hidden animate-slide-down">
          <div className="container py-4 space-y-3">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-primary/10 transition-all duration-300" 
                  onClick={() => {
                    navigate("/dashboard");
                    setMobileMenuOpen(false);
                  }}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-primary/10 transition-all duration-300" 
                  onClick={() => {
                    navigate("/search");
                    setMobileMenuOpen(false);
                  }}
                >
                  <SearchIcon className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-primary/10 transition-all duration-300" 
                  onClick={() => {
                    navigate("/chat");
                    setMobileMenuOpen(false);
                  }}
                >
                  <Bot className="h-4 w-4 mr-2" />
                  AI Chat
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-primary/10 transition-all duration-300" 
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
                  className="w-full hover:bg-destructive/10 hover:text-destructive transition-all duration-300" 
                  onClick={handleSignOut} 
                  disabled={loggingOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {loggingOut ? "Signing out..." : "Sign out"}
                </Button>
              </>
            ) : (
              <Button 
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300" 
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
