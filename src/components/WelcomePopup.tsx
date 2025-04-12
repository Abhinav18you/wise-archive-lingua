
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const WelcomePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the popup has been shown before
    const hasShownWelcome = localStorage.getItem('hasShownWelcome');
    
    if (!hasShownWelcome) {
      // Show popup after a small delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
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
      <DialogContent className="sm:max-w-md glassmorphism border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient">Welcome to Memoria</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Your ultimate tool for organizing digital content with AI-powered features
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Memoria helps you save, organize, and find your digital content using natural language search and AI assistance.
          </p>
          
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex flex-col items-center p-3 rounded-lg bg-primary/5 border border-primary/10">
              <div className="text-primary font-medium">Store Anything</div>
              <span className="text-xs text-muted-foreground">Links, notes, images & files</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-accent/5 border border-accent/10">
              <div className="text-accent font-medium">Find Naturally</div>
              <span className="text-xs text-muted-foreground">AI-powered search</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-center gap-3">
          <Button variant="outline" onClick={handleExplore} className="sm:flex-1">
            Explore First
          </Button>
          <Button onClick={handleGetStarted} className="sm:flex-1 gap-2 bg-primary">
            Get Started
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
            </svg>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
