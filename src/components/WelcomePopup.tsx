
import { useState, useEffect } from 'react';
import { X, Sparkles, Search, Database, BookOpen, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show popup after a delay for better UX
    const timer = setTimeout(() => {
      setIsOpen(true);
      console.log("Setting welcome popup to open");
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasShownWelcome', 'true');
  };

  const handleGetStarted = () => {
    handleClose();
    navigate('/auth');
  };

  const handleExplore = () => {
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md glassmorphism border-primary/20 animate-scale-in shadow-2xl">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-primary text-primary-foreground h-16 w-16 rounded-full flex items-center justify-center shadow-glow animate-float">
            <span className="font-bold text-2xl relative">M</span>
          </div>
        </div>
        <DialogHeader className="pt-6">
          <DialogTitle className="text-2xl font-bold text-center">
            <span className="text-gradient bg-gradient-to-r from-primary to-accent">Welcome to Memoria</span>
          </DialogTitle>
          <DialogDescription className="text-base pt-2 text-center">
            Your ultimate tool for organizing digital content with AI-powered features
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <p className="text-sm text-muted-foreground text-center">
            Memoria helps you save, organize, and find your digital content using natural language search and AI assistance.
          </p>
          
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex flex-col items-center p-3 rounded-lg bg-primary/5 border border-primary/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
              <Database className="h-5 w-5 text-primary mb-2" />
              <div className="text-primary font-medium">Store Anything</div>
              <span className="text-xs text-muted-foreground">Links, notes, images & files</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-accent/5 border border-accent/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
              <Search className="h-5 w-5 text-accent mb-2" />
              <div className="text-accent font-medium">Find Naturally</div>
              <span className="text-xs text-muted-foreground">AI-powered search</span>
            </div>
          </div>
          
          <div className="glassmorphism p-3 rounded-lg border border-accent/10 flex items-center space-x-3 animate-pulse" style={{ animationDuration: '3s' }}>
            <div className="p-2 bg-accent/10 rounded-full">
              <Sparkles className="h-4 w-4 text-accent" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">AI-Powered Assistant</div>
              <div className="text-xs text-muted-foreground">Chat with your content using natural language</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center text-center mt-2 py-2 px-3 bg-primary/5 rounded-lg">
            <BookOpen className="h-5 w-5 text-primary mb-2" />
            <p className="text-sm font-medium">Unlock a new way to manage your digital life</p>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-center gap-3">
          <Button variant="outline" onClick={handleExplore} className="sm:flex-1 transition-all duration-300 hover:bg-primary/5">
            Explore First
          </Button>
          <Button onClick={handleGetStarted} className="sm:flex-1 gap-2 bg-gradient-to-r from-primary to-primary/90 hover:shadow-glow transition-all duration-300">
            Get Started
            <ArrowRight className="h-4 w-4 animate-slide-right" style={{ animationDuration: '1s', animationIterationCount: 'infinite', animationDirection: 'alternate' }} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
