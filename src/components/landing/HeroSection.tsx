
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Database, FileText, Bot, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    
    // Add parallax effect
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrollPosition * 0.1}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
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
    <section className="py-16 md:py-28 w-full max-w-6xl mx-auto text-center relative" ref={heroRef}>
      {/* Enhanced dynamic background */}
      <div className="absolute inset-0 bg-gradient-radial opacity-50 -z-10"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      
      {/* Animated blob background elements */}
      <div className="absolute top-20 left-1/4 w-80 h-80 blur-circle blob" style={{ background: 'linear-gradient(135deg, rgba(155, 135, 245, 0.2), rgba(133, 89, 244, 0.1))', animationDuration: '12s' }}></div>
      <div className="absolute bottom-10 right-1/4 w-72 h-72 blur-circle blob" style={{ background: 'linear-gradient(135deg, rgba(133, 89, 244, 0.15), rgba(155, 135, 245, 0.05))', animationDuration: '15s', animationDelay: '1s' }}></div>
      
      <div className={`space-y-6 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6 floating-badge shadow-soft border border-primary/10">
          <span className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-primary radar-ping"></span>
            Your Personal Content Repository
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight animate-slide-left" style={{ animationDelay: "300ms" }}>
          Store anything,<br />
          <span className="text-gradient bg-gradient-to-r from-primary to-accent highlight-text">find it naturally</span>
        </h1>
        
        <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-right" style={{ animationDelay: "500ms" }}>
          Save links, notes, images, and files. Then find them using natural language instead of rigid keywords.
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 mt-12 animate-zoom" style={{ animationDelay: "700ms" }}>
          <Button size="lg" onClick={handleGetStarted} className="gap-2 text-lg py-7 px-8 rounded-full fancy-button bg-gradient-to-r from-primary to-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-105">
            Get Started
            <ArrowRight className="h-5 w-5" />
          </Button>
          
          <Button variant="outline" size="lg" onClick={() => navigate("/chat")} 
            className="gap-2 text-lg py-7 px-8 bg-white/80 backdrop-blur-sm border border-primary/20 hover:bg-primary/5 rounded-full fancy-button hover:scale-105 transition-all duration-300">
            <Sparkles className="h-5 w-5 text-primary" />
            Try AI Chat
          </Button>
        </div>
      </div>
      
      {/* Enhanced floating elements with parallax effect and 3D animations */}
      <div className="hidden md:block">
        <div className="absolute top-20 left-10 p-3 glassmorphism rounded-lg animate-float hover-3d" style={{ animationDelay: "0.5s", animationDuration: "6s", zIndex: 2 }}>
          <Search className="h-6 w-6 text-primary" />
        </div>
        <div className="absolute bottom-20 right-10 p-3 glassmorphism rounded-lg animate-float hover-3d" style={{ animationDelay: "1.7s", animationDuration: "7s", zIndex: 2 }}>
          <FileText className="h-6 w-6 text-accent" />
        </div>
        <div className="absolute top-40 right-20 p-3 glassmorphism rounded-lg animate-float hover-3d" style={{ animationDelay: "1s", animationDuration: "5s", zIndex: 2 }}>
          <Database className="h-6 w-6 text-primary" />
        </div>
        <div className="absolute bottom-40 left-20 p-3 glassmorphism rounded-lg animate-float hover-3d" style={{ animationDelay: "1.3s", animationDuration: "8s", zIndex: 2 }}>
          <Bot className="h-6 w-6 text-accent" />
        </div>
        <div className="absolute top-60 left-1/3 p-3 glassmorphism rounded-lg animate-float hover-3d" style={{ animationDelay: "2s", animationDuration: "9s", zIndex: 2 }}>
          <Sparkles className="h-6 w-6 text-accent" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
