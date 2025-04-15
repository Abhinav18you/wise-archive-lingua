
import { useEffect } from "react";
import { WelcomePopup } from "@/components/WelcomePopup";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CtaSection from "@/components/landing/CtaSection";
import { BookOpen, TrendingUp, Users, ChevronRight, Clock, Link as LinkIcon, Image, FileText, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // For testing purposes, uncomment to reset the welcome popup state
    // localStorage.removeItem('hasShownWelcome');
    
    // Initialize intersection observer for scroll animations
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
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col items-center overflow-hidden">
      <WelcomePopup />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Content Types Section with enhanced animations */}
      <section className="w-full py-24 bg-gradient-to-t from-background to-muted/30" data-animate>
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6 shadow-soft border border-primary/10">
              Save Anything
            </div>
            <h2 className="text-4xl font-bold tracking-tight">
              Multiple content types for <span className="text-gradient bg-gradient-to-r from-primary to-accent">all your needs</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <ContentTypeCard 
              icon={<LinkIcon className="h-8 w-8 text-primary" />} 
              title="Links" 
              description="Save web articles and resources with automatic previews"
              bgClass="bg-primary/10"
              delay={0.1}
            />
            
            <ContentTypeCard 
              icon={<FileText className="h-8 w-8 text-accent" />} 
              title="Notes" 
              description="Create rich text notes with formatting and embedded content"
              bgClass="bg-accent/10"
              delay={0.2}
            />
            
            <ContentTypeCard 
              icon={<Image className="h-8 w-8 text-primary" />} 
              title="Images" 
              description="Store and categorize images with AI-powered recognition"
              bgClass="bg-primary/10"
              delay={0.3}
            />
            
            <ContentTypeCard 
              icon={<Database className="h-8 w-8 text-accent" />} 
              title="Files" 
              description="Upload and manage documents, PDFs and more"
              bgClass="bg-accent/10"
              delay={0.4}
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* How It Works Section - Visual Update */}
      <section className="w-full py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden" data-animate>
        <div className="absolute inset-0 bg-dots bg-[size:20px_20px] opacity-10"></div>
        
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6 shadow-soft border border-primary/10">
                How It Works
              </div>
              <h2 className="text-4xl font-bold tracking-tight mb-6">
                Save now, find later with <span className="text-gradient bg-gradient-to-r from-primary to-accent">AI-powered search</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Memoria uses advanced AI to understand the content you save and match it with your natural language searches, so you can find exactly what you're looking for without remembering exact keywords.
              </p>
              <div className="space-y-4 mb-8">
                <FeatureItem text="Natural language processing understands your intent" />
                <FeatureItem text="Contextual search across all your content types" />
                <FeatureItem text="Automatic tagging and organization" />
                <FeatureItem text="AI Chat assistance to help manage and explore your content" />
              </div>
              <Button onClick={() => navigate("/auth")} className="gap-2 rounded-full fancy-button bg-gradient-to-r from-primary to-primary/90 hover:scale-105 transition-all duration-300">
                Try It Now
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="order-1 md:order-2">
              <div className="glassmorphism p-8 rounded-xl relative overflow-hidden shadow-lg transform transition-all duration-700 hover-3d">
                <div className="absolute h-40 w-40 bg-primary/20 rounded-full blur-3xl -right-10 -top-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
                <div className="absolute h-40 w-40 bg-accent/20 rounded-full blur-3xl -left-10 -bottom-10 animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }}></div>
                <div className="relative">
                  <div className="absolute -top-6 -left-6 bg-primary text-primary-foreground p-4 rounded-2xl shadow-lg animate-float" style={{ animationDuration: '5s' }}>
                    <Clock className="h-7 w-7" />
                  </div>
                  <div className="bg-background/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                    <div className="text-xl font-semibold mb-4">Natural Language Search</div>
                    <p className="text-muted-foreground mb-6">Type searches the way you think:</p>
                    <div className="space-y-4 text-sm">
                      <SearchExample text="That article about AI ethics I saved" delay={0} />
                      <SearchExample text="Photos from my trip to Japan" delay={0.2} />
                      <SearchExample text="Research papers I saved last month" delay={0.4} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* Learn More Section */}
      <section className="w-full py-24 bg-white" data-animate>
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <ResourceCard 
              icon={<BookOpen className="h-10 w-10 text-primary" />}
              title="Comprehensive Guides"
              description="Explore our detailed documentation and tutorials to get the most out of Memoria."
              buttonText="View Documentation"
              delay={0.1}
            />
            
            <ResourceCard 
              icon={<TrendingUp className="h-10 w-10 text-accent" />}
              title="Latest Updates"
              description="Stay informed about the newest features and improvements to enhance your experience."
              buttonText="Read Changelog"
              delay={0.3}
            />
            
            <ResourceCard 
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Community"
              description="Join our community of users to share tips, ask questions, and connect with others."
              buttonText="Join Community"
              delay={0.5}
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <CtaSection />
    </div>
  );
};

// Helper components
const FeatureItem = ({ text }: { text: string }) => (
  <div className="flex items-start gap-3 transition-all duration-500 hover:translate-x-2">
    <div className="bg-primary/10 p-1 rounded-full">
      <div className="h-5 w-5 text-primary flex items-center justify-center">✓</div>
    </div>
    <p>{text}</p>
  </div>
);

interface ContentTypeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgClass: string;
  delay: number;
}

const ContentTypeCard = ({ icon, title, description, bgClass, delay }: ContentTypeCardProps) => (
  <div 
    className="bg-white rounded-2xl p-8 text-center shadow-soft hover-3d transition-all duration-500 opacity-0"
    style={{ 
      animation: `fade-in 0.5s ease-out forwards, scale-in 0.5s ease-out forwards`,
      animationDelay: `${delay}s`
    }}
  >
    <div className={`${bgClass} p-5 rounded-2xl w-fit mx-auto mb-6 animate-pulse group-hover:scale-110 transition-all duration-300`} 
      style={{ animationDuration: `${3 + delay}s` }}
    >
      {icon}
    </div>
    <h3 className="text-xl font-medium">{title}</h3>
    <p className="text-sm text-muted-foreground mt-2">{description}</p>
  </div>
);

interface ResourceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  delay: number;
}

const ResourceCard = ({ icon, title, description, buttonText, delay }: ResourceCardProps) => (
  <div 
    className="p-6 rounded-xl border border-primary/10 shadow-soft hover-3d opacity-0"
    style={{ 
      animation: `fade-in 0.5s ease-out forwards, slide-up 0.5s ease-out forwards`,
      animationDelay: `${delay}s`
    }}
  >
    {icon}
    <h3 className="text-xl font-semibold mb-3 mt-4">{title}</h3>
    <p className="text-muted-foreground mb-4">{description}</p>
    <Button variant="outline" className="gap-2 group">
      {buttonText}
      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Button>
  </div>
);

interface SearchExampleProps {
  text: string;
  delay: number;
}

const SearchExample = ({ text, delay }: SearchExampleProps) => (
  <div 
    className="bg-accent/10 p-3 rounded-lg transform transition-all duration-500 hover:-translate-y-1 hover:shadow-md opacity-0"
    style={{ 
      animation: `fade-in 0.5s ease-out forwards, slide-up 0.5s ease-out forwards`,
      animationDelay: `${delay}s`
    }}
  >
    {text}
  </div>
);

export default Index;
