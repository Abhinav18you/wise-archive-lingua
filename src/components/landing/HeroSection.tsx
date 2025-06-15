
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Database, FileText, Bot, Search, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    
    // Add parallax effect
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrollPosition * 0.05}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleGetStarted = () => {
    console.log("Get Started button clicked, attempting navigation to /auth");
    try {
      navigate("/auth");
      console.log("Navigation to /auth completed");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  return (
    <section className="py-16 md:py-28 w-full max-w-6xl mx-auto text-center relative overflow-hidden" ref={heroRef}>
      {/* Enhanced dynamic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 -z-20"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-20 left-1/4 w-80 h-80 bg-gradient-to-br from-primary/10 to-accent/5 rounded-full blur-3xl animate-float -z-10" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-gradient-to-br from-accent/10 to-primary/5 rounded-full blur-3xl animate-float -z-10" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
      
      <div className={`space-y-8 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="inline-block bg-gradient-to-r from-primary/10 to-accent/10 text-primary rounded-full px-6 py-3 text-sm font-medium mb-6 border border-primary/20 animate-bounce-in backdrop-blur-sm">
          <span className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            Your Personal Content Repository
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight animate-fade-in" style={{ animationDelay: "300ms" }}>
          Store anything,<br />
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
            find it naturally
          </span>
        </h1>
        
        <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: "500ms" }}>
          Save links, notes, images, and files. Then find them using natural language instead of rigid keywords.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 mt-12 animate-fade-in" style={{ animationDelay: "700ms" }}>
          <Button 
            size="lg" 
            onClick={handleGetStarted} 
            className="gap-2 text-lg py-7 px-8 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-500 hover:shadow-xl hover:shadow-primary/20 hover:scale-105 group"
          >
            Get Started
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate("/chat")} 
            className="gap-2 text-lg py-7 px-8 bg-white/80 backdrop-blur-sm border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/30 rounded-full transition-all duration-500 hover:scale-105 group"
          >
            <Sparkles className="h-5 w-5 text-primary transition-transform duration-300 group-hover:rotate-12" />
            Try AI Chat
          </Button>
        </div>
      </div>
      
      {/* Enhanced floating elements with improved animations */}
      <div className="hidden md:block">
        <div className="absolute top-20 left-10 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-primary/10 animate-float hover:scale-110 transition-all duration-300" style={{ animationDelay: "0.5s", animationDuration: "6s" }}>
          <Search className="h-6 w-6 text-primary" />
        </div>
        <div className="absolute bottom-20 right-10 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-accent/10 animate-float hover:scale-110 transition-all duration-300" style={{ animationDelay: "1.7s", animationDuration: "7s" }}>
          <FileText className="h-6 w-6 text-accent" />
        </div>
        <div className="absolute top-40 right-20 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-primary/10 animate-float hover:scale-110 transition-all duration-300" style={{ animationDelay: "1s", animationDuration: "5s" }}>
          <Database className="h-6 w-6 text-primary" />
        </div>
        <div className="absolute bottom-40 left-20 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-accent/10 animate-float hover:scale-110 transition-all duration-300" style={{ animationDelay: "1.3s", animationDuration: "8s" }}>
          <Bot className="h-6 w-6 text-accent" />
        </div>
        <div className="absolute top-60 left-1/3 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-accent/10 animate-float hover:scale-110 transition-all duration-300" style={{ animationDelay: "2s", animationDuration: "9s" }}>
          <Sparkles className="h-6 w-6 text-accent" />
        </div>
        <div className="absolute bottom-60 right-1/3 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-primary/10 animate-float hover:scale-110 transition-all duration-300" style={{ animationDelay: "2.5s", animationDuration: "7s" }}>
          <Zap className="h-6 w-6 text-primary" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
