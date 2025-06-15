
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Play, Stars } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 200);
    
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
    <section className="relative min-h-screen flex items-center justify-center w-full overflow-hidden bg-gradient-to-br from-white via-gray-50/30 to-primary/5" ref={heroRef}>
      {/* Modern background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] opacity-20"></div>
      
      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        <div className={`text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3 mb-8 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Your AI-Powered Content Hub</span>
            </div>
            <Stars className="h-4 w-4 text-primary" />
          </div>
          
          {/* Main heading */}
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-tight mb-8">
            <span className="block text-gray-900 mb-4">Save anything,</span>
            <span className="block bg-gradient-to-r from-primary via-purple-600 to-accent bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
              find everything
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Transform how you organize digital content with AI that understands natural language.
            <span className="block mt-2 text-lg text-gray-500">No more searching through endless folders or forgotten bookmarks.</span>
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              onClick={handleGetStarted} 
              className="group bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 hover:scale-105 rounded-full px-10 py-6 text-lg font-medium"
            >
              <span className="flex items-center gap-3">
                Start Building Your Library
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate("/chat")} 
              className="group bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-primary/30 hover:bg-white rounded-full px-10 py-6 text-lg font-medium transition-all duration-500 hover:scale-105"
            >
              <Play className="h-5 w-5 mr-3 text-primary transition-transform duration-300 group-hover:scale-110" />
              See It In Action
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI-Powered Search</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span>Free to Start</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                <div className="w-4 h-4 bg-primary rounded-full border border-white"></div>
                <div className="w-4 h-4 bg-accent rounded-full border border-white"></div>
                <div className="w-4 h-4 bg-purple-500 rounded-full border border-white"></div>
              </div>
              <span>10k+ Users</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute bottom-10 left-10 opacity-30">
        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl backdrop-blur-sm animate-float" style={{ animationDuration: '6s' }}></div>
      </div>
      <div className="absolute top-20 right-10 opacity-30">
        <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl backdrop-blur-sm animate-float" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
      </div>
    </section>
  );
};

export default HeroSection;
