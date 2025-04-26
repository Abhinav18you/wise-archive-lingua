
import { useState, useEffect } from 'react';
import { Sparkles, Search, Database, BookOpen, ArrowRight, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("WelcomePopup component initialized");
    
    const hasShown = localStorage.getItem('hasShownWelcome');
    
    setIsInitialized(true);
    
    if (!hasShown) {
      console.log("Showing welcome popup - no previous record found");
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      console.log("Welcome popup already shown before");
    }
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

  if (!isInitialized) return null;

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent 
        className="sm:max-w-md bg-white border-primary/20 shadow-xl relative overflow-hidden transition-all duration-300 animate-fade-in"
      >
        <div className="absolute -z-10 top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/5 rounded-full blur-xl animate-float" />
        </div>
        
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-primary to-accent text-white h-16 w-16 rounded-full flex items-center justify-center shadow-glow animate-float">
            <span className="font-bold text-2xl relative z-10">M</span>
          </div>
        </div>
        
        <DialogHeader className="pt-10">
          <DialogTitle className="text-2xl font-bold text-center">
            <span className="animated-gradient-text">Welcome to Memoria</span>
          </DialogTitle>
          <DialogDescription className="text-base pt-2 text-center">
            Your ultimate tool for organizing digital content with AI-powered features
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 py-4">
          <p className="text-sm text-foreground text-center">
            Memoria helps you save, organize, and find your digital content using natural language search and AI assistance.
          </p>
          
          <div className="grid grid-cols-2 gap-3 pt-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col items-center p-3 rounded-lg bg-primary/5 border border-primary/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow group cursor-pointer">
              <Database className="h-5 w-5 text-primary mb-2 transition-transform duration-300 group-hover:scale-110" />
              <div className="text-primary font-medium">Store Anything</div>
              <span className="text-xs text-muted-foreground">Links, notes, images & files</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-accent/5 border border-accent/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow group cursor-pointer">
              <Search className="h-5 w-5 text-accent mb-2 transition-transform duration-300 group-hover:scale-110" />
              <div className="text-accent font-medium">Find Naturally</div>
              <span className="text-xs text-muted-foreground">AI-powered search</span>
            </div>
          </div>
          
          <div className="p-3 rounded-lg border border-accent/10 flex items-center space-x-3 relative bg-white hover-card-rise cursor-pointer animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="p-2 bg-accent/10 rounded-full">
              <Sparkles className="h-4 w-4 text-accent animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">AI-Powered Assistant</div>
              <div className="text-xs text-muted-foreground">Chat with your content using natural language</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center mt-2 py-2 px-3 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <Zap className="h-5 w-5 text-primary mb-2 animate-bounce-horizontal" />
            <p className="text-sm font-medium">Unlock a new way to manage your digital life</p>
          </div>
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row sm:justify-center gap-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button variant="outline" onClick={handleExplore} className="sm:flex-1 border-primary/20 hover:bg-primary/5 transition-all duration-300">
            Explore First
          </Button>
          <Button onClick={handleGetStarted} className="sm:flex-1 gap-2 bg-gradient-to-r from-primary to-accent hover:shadow-glow transition-all duration-300 button-shine">
            <span className="flex items-center gap-2">
              Get Started
              <ArrowRight className="h-4 w-4 animate-slide-right" />
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
