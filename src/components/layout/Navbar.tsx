import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, User, LogOut, Menu, X } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "@/lib/toast";

type NavbarProps = {
  isAuthenticated: boolean;
};

const Navbar = ({ isAuthenticated }: NavbarProps) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await api.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-semibold text-xl bg-primary text-primary-foreground px-2 py-1 rounded">M</span>
            <span className="font-semibold text-xl hidden sm:inline-block">Memoria</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated && (
            <>
              <Link 
                to="/dashboard" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Button asChild variant="outline" size="sm" className="gap-1">
                <Link to="/search">
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </Link>
              </Button>
              <Button asChild size="sm" className="gap-1">
                <Link to="/add">
                  <Plus className="h-4 w-4" />
                  <span>Add Content</span>
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    asChild
                  >
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          
          {!isAuthenticated && (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/auth">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t py-4 px-4 bg-background/95 backdrop-blur-md animate-slide-down">
          <nav className="flex flex-col space-y-3">
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className="px-2 py-1.5 rounded-md hover:bg-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/search" 
                  className="px-2 py-1.5 rounded-md hover:bg-accent transition-colors flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Link>
                <Link 
                  to="/add" 
                  className="px-2 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Content
                </Link>
                <Link 
                  to="/profile" 
                  className="px-2 py-1.5 rounded-md hover:bg-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  className="px-2 py-1.5 rounded-md text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-start w-full text-left"
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </button>
              </>
            )}
            
            {!isAuthenticated && (
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/auth" 
                  className="px-2 py-1.5 rounded-md border hover:bg-accent transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/auth" 
                  className="px-2 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
