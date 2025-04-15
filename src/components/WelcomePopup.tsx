
import { useState, useEffect } from 'react';
import { Sparkles, Search, Database, BookOpen, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("WelcomePopup component initialized");
    
    // Check if the welcome popup has been shown before
    const hasShown = localStorage.getItem('hasShownWelcome');
    
    // Use a short timeout to prevent the black screen flash
    // This allows the app to render properly before showing the modal
    const timer = setTimeout(() => {
      if (!hasShown) {
        console.log("Showing welcome popup - no previous record found");
        setIsOpen(true);
      } else {
        console.log("Welcome popup already shown before");
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasShownWelcome', 'true');
    console.log("Closing welcome popup and setting localStorage");
  };

  const handleGetStarted = () => {
    handleClose();
    navigate('/auth');
    console.log("Navigating to auth page from welcome popup");
  };

  const handleExplore = () => {
    handleClose();
    console.log("Exploring from welcome popup");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-background border-primary/20 shadow-2xl animate-scale-in relative overflow-hidden">
        {/* Enhanced background elements */}
        <div className="absolute -z-10 top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
        </div>
        
        {/* Logo badge with improved visibility */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-primary to-accent text-background h-16 w-16 rounded-full flex items-center justify-center shadow-lg animate-float">
            <span className="font-bold text-2xl relative z-10">M</span>
          </div>
        </div>
        
        <DialogHeader className="pt-10">
          <DialogTitle className="text-2xl font-bold text-center">
            <span className="text-gradient bg-gradient-to-r from-primary to-accent">Welcome to Memoria</span>
          </DialogTitle>
          <DialogDescription className="text-base pt-2 text-center">
            Your ultimate tool for organizing digital content with AI-powered features
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 py-4">
          <p className="text-sm text-foreground text-center">
            Memoria helps you save, organize, and find your digital content using natural language search and AI assistance.
          </p>
          
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex flex-col items-center p-3 rounded-lg bg-primary/5 border border-primary/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-md group">
              <Database className="h-5 w-5 text-primary mb-2 transition-transform duration-300 group-hover:scale-110" />
              <div className="text-primary font-medium">Store Anything</div>
              <span className="text-xs text-muted-foreground">Links, notes, images & files</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-accent/5 border border-accent/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-md group">
              <Search className="h-5 w-5 text-accent mb-2 transition-transform duration-300 group-hover:scale-110" />
              <div className="text-accent font-medium">Find Naturally</div>
              <span className="text-xs text-muted-foreground">AI-powered search</span>
            </div>
          </div>
          
          <div className="p-3 rounded-lg border border-accent/10 flex items-center space-x-3 relative overflow-hidden group bg-gradient-to-r from-background to-accent/5">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent shine-effect"></div>
            <div className="p-2 bg-accent/10 rounded-full">
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">AI-Powered Assistant</div>
              <div className="text-xs text-muted-foreground">Chat with your content using natural language</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center mt-2 py-2 px-3 bg-primary/5 rounded-lg transition-all duration-300 hover:bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary mb-2" />
            <p className="text-sm font-medium">Unlock a new way to manage your digital life</p>
          </div>
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row sm:justify-center gap-3">
          <Button variant="outline" onClick={handleExplore} className="sm:flex-1 transition-all duration-300 hover:bg-primary/5 border-primary/20">
            Explore First
          </Button>
          <Button onClick={handleGetStarted} className="sm:flex-1 gap-2 bg-gradient-to-r from-primary to-accent hover:shadow-md transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
