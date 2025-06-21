
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Menu, X, LogOut, User, Bot, Search as SearchIcon } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavbarProps {
  isAuthenticated: boolean;
}

const Navbar = ({ isAuthenticated }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);
  const isMobile = useIsMobile();

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
      className={`sticky top-0 z-40 w-full backdrop-blur-md transition-all duration-300 ${
        scrolled 
          ? "bg-background/95 shadow-lg border-b border-border/50" 
          : "bg-background/80"
      }`}
    >
      <div className={`${isMobile ? 'px-4' : 'container'} flex ${isMobile ? 'h-14' : 'h-16'} items-center`}>
        {/* Logo and brand */}
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex items-center gap-8 lg:gap-10 text-sm ml-6 lg:ml-8">
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className={cn(
                    "relative transition-all duration-300 hover:text-foreground font-medium px-3 py-2 rounded-md",
                    "after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[3px] after:rounded-full",
                    "after:origin-left after:scale-x-0 after:transition-transform after:duration-300",
                    "hover:after:scale-x-100 hover:after:bg-gradient-to-r hover:after:from-primary hover:after:to-accent",
                    "hover:bg-primary/5",
                    isActive("/dashboard") 
                      ? "text-foreground after:scale-x-100 after:bg-gradient-to-r after:from-primary after:to-accent bg-primary/5" 
                      : "text-foreground/70"
                  )}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/search" 
                  className={cn(
                    "flex items-center gap-2 relative transition-all duration-300 hover:text-foreground font-medium px-3 py-2 rounded-md",
                    "after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[3px] after:rounded-full",
                    "after:origin-left after:scale-x-0 after:transition-transform after:duration-300",
                    "hover:after:scale-x-100 hover:after:bg-gradient-to-r hover:after:from-primary hover:after:to-accent",
                    "hover:bg-primary/5",
                    isActive("/search") 
                      ? "text-foreground after:scale-x-100 after:bg-gradient-to-r after:from-primary after:to-accent bg-primary/5" 
                      : "text-foreground/70"
                  )}
                >
                  <SearchIcon className="h-4 w-4" />
                  Search
                </Link>
                <Link 
                  to="/chat" 
                  className={cn(
                    "flex items-center gap-2 relative transition-all duration-300 hover:text-foreground font-medium px-3 py-2 rounded-md",
                    "after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[3px] after:rounded-full",
                    "after:origin-left after:scale-x-0 after:transition-transform after:duration-300",
                    "hover:after:scale-x-100 hover:after:bg-gradient-to-r hover:after:from-primary hover:after:to-accent",
                    "hover:bg-primary/5 hover:scale-105",
                    isActive("/chat") 
                      ? "text-foreground after:scale-x-100 after:bg-gradient-to-r after:from-primary after:to-accent bg-primary/5 scale-105" 
                      : "text-foreground/70"
                  )}
                >
                  <Bot className="h-4 w-4" />
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
                  className="hover:bg-accent/20 transition-all duration-300 hover:scale-105 font-medium"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut} 
                  disabled={loggingOut}
                  className="hover:bg-destructive/10 hover:text-destructive transition-all duration-300 hover:scale-105 font-medium"
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
                className="font-medium bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
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
            className="hover:bg-primary/10 transition-all duration-300 hover:scale-110 h-9 w-9"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t md:hidden animate-slide-down bg-background/95 backdrop-blur-md">
          <div className="px-4 py-3 space-y-2">
            {isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-primary/10 transition-all duration-300 h-12 text-base font-medium" 
                  onClick={() => {
                    navigate("/dashboard");
                    setMobileMenuOpen(false);
                  }}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-primary/10 transition-all duration-300 h-12 text-base font-medium" 
                  onClick={() => {
                    navigate("/search");
                    setMobileMenuOpen(false);
                  }}
                >
                  <SearchIcon className="h-4 w-4 mr-3" />
                  Search
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-primary/10 transition-all duration-300 h-12 text-base font-medium" 
                  onClick={() => {
                    navigate("/chat");
                    setMobileMenuOpen(false);
                  }}
                >
                  <Bot className="h-4 w-4 mr-3" />
                  AI Chat
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start hover:bg-primary/10 transition-all duration-300 h-12 text-base font-medium" 
                  onClick={() => {
                    navigate("/profile");
                    setMobileMenuOpen(false);
                  }}
                >
                  <User className="h-4 w-4 mr-3" />
                  Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full hover:bg-destructive/10 hover:text-destructive transition-all duration-300 h-12 text-base font-medium mt-2" 
                  onClick={handleSignOut} 
                  disabled={loggingOut}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  {loggingOut ? "Signing out..." : "Sign out"}
                </Button>
              </>
            ) : (
              <Button 
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 h-12 text-base font-medium" 
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
