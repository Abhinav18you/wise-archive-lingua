
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Search, FileText, Link as LinkIcon, Image, Sparkles, Check, MessageSquareText, Bot, BrainCircuit, Zap, Star } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { WelcomePopup } from "@/components/WelcomePopup";

const Index = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setIsVisible(true);
    
    // Initialize intersection observer for scroll animations with enhanced options
    const observerOptions = { 
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe all sections with the data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(section => {
      section.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-1000');
      observer.observe(section);
    });

    // Add parallax effect to hero section
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrollPosition * 0.1}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      observer.disconnect();
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
    <div className="flex flex-col items-center overflow-hidden">
      <WelcomePopup />
      
      {/* Hero Section with enhanced animations */}
      <section className="py-16 md:py-28 w-full max-w-6xl mx-auto text-center relative" ref={heroRef}>
        <div className="absolute inset-0 bg-gradient-primary opacity-5 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-10 right-1/4 w-60 h-60 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>
        
        <div className={`space-y-6 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6 animate-bounce-in" style={{ animationDelay: "100ms" }}>
            <span className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              Your Personal Content Repository
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight animate-slide-left" style={{ animationDelay: "300ms" }}>
            Store anything,<br /><span className="text-gradient bg-gradient-to-r from-primary to-accent">find it naturally</span>
          </h1>
          
          <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-right" style={{ animationDelay: "500ms" }}>
            Save links, notes, images, and files. Then find them using natural language instead of rigid keywords.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-12 animate-zoom" style={{ animationDelay: "700ms" }}>
            <Button size="lg" onClick={handleGetStarted} className="gap-2 text-lg py-7 px-8 rounded-full button-shine bg-gradient-to-r from-primary to-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Button>
            
            <Button variant="outline" size="lg" onClick={() => navigate("/chat")} 
              className="gap-2 text-lg py-7 px-8 bg-white/80 backdrop-blur-sm border border-primary/20 hover:bg-primary/5 rounded-full button-shine">
              <Sparkles className="h-5 w-5 text-primary" />
              Try AI Chat
            </Button>
          </div>
        </div>
        
        {/* Enhanced floating elements with parallax effect */}
        <div className="hidden md:block">
          <div className="absolute top-20 left-10 p-3 glassmorphism rounded-lg animate-float" style={{ animationDelay: "0.5s", animationDuration: "6s" }}>
            <Search className="h-6 w-6 text-primary" />
          </div>
          <div className="absolute bottom-20 right-10 p-3 glassmorphism rounded-lg animate-float" style={{ animationDelay: "1.7s", animationDuration: "7s" }}>
            <FileText className="h-6 w-6 text-accent" />
          </div>
          <div className="absolute top-40 right-20 p-3 glassmorphism rounded-lg animate-float" style={{ animationDelay: "1s", animationDuration: "5s" }}>
            <Database className="h-6 w-6 text-primary" />
          </div>
          <div className="absolute bottom-40 left-20 p-3 glassmorphism rounded-lg animate-float" style={{ animationDelay: "1.3s", animationDuration: "8s" }}>
            <Bot className="h-6 w-6 text-accent" />
          </div>
          <div className="absolute top-60 left-1/3 p-3 glassmorphism rounded-lg animate-float" style={{ animationDelay: "2s", animationDuration: "9s" }}>
            <Star className="h-6 w-6 text-accent" />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="w-full py-24 bg-gradient-to-b from-background to-muted/30" data-animate>
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
                How It Works
              </div>
              <h2 className="text-4xl font-bold tracking-tight mb-6">
                Save now, find later with <span className="text-gradient bg-gradient-to-r from-primary to-accent">AI-powered search</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Memoria uses advanced AI to understand the content you save and match it with your natural language searches, so you can find exactly what you're looking for without remembering exact keywords.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p>Natural language processing understands your intent</p>
                </div>
                <div className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p>Contextual search across all your content types</p>
                </div>
                <div className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p>Automatic tagging and organization</p>
                </div>
                <div className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                  <div className="bg-primary/10 p-1 rounded-full">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p>AI Chat assistance to help manage and explore your content</p>
                </div>
              </div>
              <Button onClick={() => navigate("/auth")} className="gap-2 rounded-full button-shine bg-gradient-to-r from-primary to-primary/90">
                Try It Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="order-1 md:order-2">
              <div className="glassmorphism p-8 rounded-xl relative overflow-hidden shadow-lg transform transition-all duration-700 hover:scale-105 hover:shadow-xl">
                <div className="absolute h-40 w-40 bg-primary/20 rounded-full blur-3xl -right-10 -top-10"></div>
                <div className="absolute h-40 w-40 bg-accent/20 rounded-full blur-3xl -left-10 -bottom-10"></div>
                <div className="relative">
                  <div className="absolute -top-6 -left-6 bg-primary text-primary-foreground p-4 rounded-2xl shadow-lg animate-bounce" style={{ animationDuration: '5s' }}>
                    <Search className="h-7 w-7" />
                  </div>
                  <div className="bg-background/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                    <div className="text-xl font-semibold mb-4">Natural Language Search</div>
                    <p className="text-muted-foreground mb-6">Type searches the way you think:</p>
                    <div className="space-y-4 text-sm">
                      <div className="bg-accent/10 p-3 rounded-lg transform transition-all duration-500 hover:-translate-y-1 hover:shadow-md">
                        "That article about AI ethics I saved"
                      </div>
                      <div className="bg-accent/10 p-3 rounded-lg transform transition-all duration-500 hover:-translate-y-1 hover:shadow-md" style={{ transitionDelay: "100ms" }}>
                        "Photos from my trip to Japan"
                      </div>
                      <div className="bg-accent/10 p-3 rounded-lg transform transition-all duration-500 hover:-translate-y-1 hover:shadow-md" style={{ transitionDelay: "200ms" }}>
                        "Research papers I saved last month"
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="w-full py-24" data-animate ref={featuresRef}>
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
              Key Features
            </div>
            <h2 className="text-4xl font-bold tracking-tight">
              Everything you need to <span className="text-gradient bg-gradient-to-r from-primary to-accent">organize your digital life</span>
            </h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 perspective">
            <div className="feature-card transform transition-all duration-800 hover:rotate-y-5" style={{ transitionDelay: "100ms" }}>
              <div className="feature-icon bg-primary/10 p-4 rounded-xl w-fit mb-6">
                <Database className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Store Anything</h3>
              <p className="text-muted-foreground flex-grow">
                Save links, text notes, images, videos, and files all in one secure place with automated AI-powered organization.
              </p>
            </div>
            
            <div className="feature-card transform transition-all duration-800 hover:rotate-y-5" style={{ transitionDelay: "200ms" }}>
              <div className="feature-icon bg-accent/10 p-4 rounded-xl w-fit mb-6">
                <Search className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Natural Search</h3>
              <p className="text-muted-foreground flex-grow">
                Find content using everyday language. Our AI understands your intent, not just keywords, for more accurate results.
              </p>
            </div>
            
            <div className="feature-card transform transition-all duration-800 hover:rotate-y-5" style={{ transitionDelay: "300ms" }}>
              <div className="feature-icon bg-primary/10 p-4 rounded-xl w-fit mb-6">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Organized Tags</h3>
              <p className="text-muted-foreground flex-grow">
                AI-powered automatic tagging with custom categories keeps your content structured. Create your own tag system or let AI suggest tags.
              </p>
            </div>

            <div className="feature-card transform transition-all duration-800 hover:rotate-y-5" style={{ transitionDelay: "400ms" }}>
              <div className="feature-icon bg-accent/10 p-4 rounded-xl w-fit mb-6">
                <MessageSquareText className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">AI Chat Assistant</h3>
              <p className="text-muted-foreground flex-grow">
                Interact with your stored content through natural conversation. Ask questions, generate summaries, and get insights from your data.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Content Types Section with enhanced animations */}
      <section className="w-full py-24 bg-gradient-to-t from-background to-muted/30" data-animate>
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
              Save Anything
            </div>
            <h2 className="text-4xl font-bold tracking-tight">
              Multiple content types for <span className="text-gradient bg-gradient-to-r from-primary to-accent">all your needs</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-soft hover:shadow-glow transition-all duration-500 hover:-translate-y-2" style={{ transitionDelay: "100ms" }}>
              <div className="bg-primary/10 p-5 rounded-2xl w-fit mx-auto mb-6 animate-pulse" style={{ animationDuration: '3s' }}>
                <LinkIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium">Links</h3>
            </div>
            
            <div className="bg-white rounded-2xl p-8 text-center shadow-soft hover:shadow-glow transition-all duration-500 hover:-translate-y-2" style={{ transitionDelay: "200ms" }}>
              <div className="bg-accent/10 p-5 rounded-2xl w-fit mx-auto mb-6 animate-pulse" style={{ animationDuration: '4s' }}>
                <FileText className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-medium">Notes</h3>
            </div>
            
            <div className="bg-white rounded-2xl p-8 text-center shadow-soft hover:shadow-glow transition-all duration-500 hover:-translate-y-2" style={{ transitionDelay: "300ms" }}>
              <div className="bg-primary/10 p-5 rounded-2xl w-fit mx-auto mb-6 animate-pulse" style={{ animationDuration: '5s' }}>
                <Image className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium">Images</h3>
            </div>
            
            <div className="bg-white rounded-2xl p-8 text-center shadow-soft hover:shadow-glow transition-all duration-500 hover:-translate-y-2" style={{ transitionDelay: "400ms" }}>
              <div className="bg-accent/10 p-5 rounded-2xl w-fit mx-auto mb-6 animate-pulse" style={{ animationDuration: '6s' }}>
                <Database className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-medium">Files</h3>
            </div>
          </div>
        </div>
      </section>
      
      {/* AI Chat Section with enhanced visuals */}
      <section className="w-full py-24 bg-gradient-to-b from-background to-muted/30" data-animate>
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-1 md:order-1 transform transition-all duration-700 hover:scale-105">
              <div className="glassmorphism p-8 rounded-xl relative overflow-hidden shadow-lg">
                <div className="absolute h-40 w-40 bg-accent/20 rounded-full blur-3xl -right-10 -bottom-10 animate-pulse" style={{ animationDuration: '7s' }}></div>
                <div className="absolute h-40 w-40 bg-primary/20 rounded-full blur-3xl -left-10 -top-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
                <div className="relative">
                  <div className="absolute -top-6 -right-6 bg-accent text-accent-foreground p-4 rounded-2xl shadow-lg animate-float" style={{ animationDuration: '4s' }}>
                    <BrainCircuit className="h-7 w-7" />
                  </div>
                  <div className="bg-background/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                    <div className="text-xl font-semibold mb-4">AI Chat Assistant</div>
                    <p className="text-muted-foreground mb-6">Ask your AI assistant:</p>
                    <div className="space-y-4 text-sm">
                      <div className="message-animation bg-primary/10 p-3 rounded-lg transform transition-all duration-500 hover:-translate-y-1 hover:shadow-md" style={{ animationDelay: '0.2s' }}>
                        "Summarize that article about climate change"
                      </div>
                      <div className="message-animation bg-primary/10 p-3 rounded-lg transform transition-all duration-500 hover:-translate-y-1 hover:shadow-md" style={{ animationDelay: "0.5s" }}>
                        "Find patterns in my saved research notes"
                      </div>
                      <div className="message-animation bg-primary/10 p-3 rounded-lg transform transition-all duration-500 hover:-translate-y-1 hover:shadow-md" style={{ animationDelay: "0.8s" }}>
                        "What connections exist between my saved topics?"
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-2 md:order-2">
              <div className="inline-block bg-accent/10 text-accent rounded-full px-4 py-2 text-sm font-medium mb-6">
                <span className="flex items-center gap-1"><Zap className="h-4 w-4" /> AI-Powered Assistance</span>
              </div>
              <h2 className="text-4xl font-bold tracking-tight mb-6">
                Your personal <span className="text-gradient bg-gradient-to-r from-accent to-primary">AI research assistant</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our intelligent AI chat assistant helps you interact with your stored content in new ways. Ask questions about your notes, get summaries of articles, find connections between topics, and receive personalized insights.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                  <div className="bg-accent/10 p-1 rounded-full">
                    <Check className="h-5 w-5 text-accent" />
                  </div>
                  <p>Ask questions about your saved content in natural language</p>
                </div>
                <div className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                  <div className="bg-accent/10 p-1 rounded-full">
                    <Check className="h-5 w-5 text-accent" />
                  </div>
                  <p>Generate summaries and insights from complex documents</p>
                </div>
                <div className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                  <div className="bg-accent/10 p-1 rounded-full">
                    <Check className="h-5 w-5 text-accent" />
                  </div>
                  <p>Discover connections between different pieces of content</p>
                </div>
                <div className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
                  <div className="bg-accent/10 p-1 rounded-full">
                    <Check className="h-5 w-5 text-accent" />
                  </div>
                  <p>Get assistance organizing and categorizing your information</p>
                </div>
              </div>
              <Button onClick={() => navigate("/chat")} variant="secondary" className="gap-2 rounded-full button-shine bg-accent hover:bg-accent/80 text-white">
                Try AI Chat Now
                <Bot className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Enhanced CTA Section */}
      <section className="w-full py-24 relative overflow-hidden" data-animate>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-80 -z-10"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
        
        <div className="absolute top-20 right-10 opacity-20">
          <div className="animate-float" style={{ animationDuration: '7s', animationDelay: '0.5s' }}>
            <FileText className="h-12 w-12 text-primary" />
          </div>
        </div>
        <div className="absolute bottom-20 left-10 opacity-20">
          <div className="animate-float" style={{ animationDuration: '8s', animationDelay: '1s' }}>
            <Database className="h-12 w-12 text-accent" />
          </div>
        </div>
        
        <div className="container max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 animate-fade-in">
            Ready to organize your <span className="text-gradient bg-gradient-to-r from-primary to-accent">digital life</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Join Memoria today and start saving your content with powerful natural language search and AI assistance.
          </p>
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")} 
              className="text-lg py-7 px-12 rounded-full shadow-lg hover:shadow-primary/25 button-shine bg-gradient-to-r from-primary to-primary/90 transition-all duration-500 hover:scale-105">
              Get Started for Free
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
