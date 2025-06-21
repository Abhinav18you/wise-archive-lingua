
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const MobileBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Don't show back button on home page or if not mobile
  if (!isMobile || location.pathname === '/') {
    return null;
  }

  const handleBack = () => {
    // Try to go back in history, fallback to home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/20 px-4 py-2 md:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="flex items-center gap-2 text-foreground hover:bg-accent/20 transition-all duration-200"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="font-medium">Back</span>
      </Button>
    </div>
  );
};

export default MobileBackButton;
