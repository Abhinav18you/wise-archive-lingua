
import { useState, useEffect } from 'react';
import { Sparkles, Search, Database, BookOpen, ArrowRight, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("WelcomePopup component initialized");
    
    const hasShown = localStorage.getItem('hasShownWelcome');
    
    setIsInitialized(true);
    
    if (!hasShown) {
      console.log("Showing welcome popup - no previous record found");
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
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
        className="sm:max-w-md bg-white border-primary/20 shadow-2xl relative overflow-hidden transition-all duration-300 animate-scale-in"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-primary to-accent text-white h-12 w-12 rounded-full flex items-center justify-center shadow-lg animate-bounce-in border-4 border-white">
            <span className="font-bold text-xl">M</span>
          </div>
        </div>
        
        <DialogHeader className="pt-8 relative z-10">
          <DialogTitle className="text-2xl font-bold text-center animate-fade-in">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to Memoria
            </span>
          </DialogTitle>
          <DialogDescription className="text-base pt-2 text-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Your ultimate tool for organizing digital content with AI-powered features
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 py-4 relative z-10">
          <p className="text-sm text-foreground text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Memoria helps you save, organize, and find your digital content using natural language search and AI assistance.
          </p>
          
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 transition-all duration-500 hover:scale-105 hover:shadow-lg group cursor-pointer animate-slide-left" style={{ animationDelay: "0.3s" }}>
              <Database className="h-5 w-5 text-primary mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <div className="text-primary font-medium">Store Anything</div>
              <span className="text-xs text-muted-foreground text-center">Links, notes, images & files</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 transition-all duration-500 hover:scale-105 hover:shadow-lg group cursor-pointer animate-slide-right" style={{ animationDelay: "0.4s" }}>
              <Search className="h-5 w-5 text-accent mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <div className="text-accent font-medium">Find Naturally</div>
              <span className="text-xs text-muted-foreground text-center">AI-powered search</span>
            </div>
          </div>
          
          <div className="p-4 rounded-lg border border-gradient-to-r from-primary/20 to-accent/20 bg-gradient-to-r from-white to-gray-50/50 flex items-center space-x-3 relative hover:shadow-md transition-all duration-300 cursor-pointer animate-zoom" style={{ animationDelay: "0.5s" }}>
            <div className="p-2 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full">
              <Sparkles className="h-4 w-4 text-accent animate-pulse" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">AI-Powered Assistant</div>
              <div className="text-xs text-muted-foreground">Chat with your content using natural language</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center mt-2 py-3 px-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10 animate-bounce-in" style={{ animationDelay: "0.6s" }}>
            <Zap className="h-5 w-5 text-primary mb-2 animate-pulse" />
            <p className="text-sm font-medium text-foreground">Unlock a new way to manage your digital life</p>
          </div>
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row sm:justify-center gap-3 relative z-10 animate-fade-in" style={{ animationDelay: "0.7s" }}>
          <Button 
            variant="outline" 
            onClick={handleExplore} 
            className="sm:flex-1 border-primary/30 hover:bg-primary/10 transition-all duration-300 hover:scale-105"
          >
            Explore First
          </Button>
          <Button 
            onClick={handleGetStarted} 
            className="sm:flex-1 gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <span className="flex items-center gap-2">
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
