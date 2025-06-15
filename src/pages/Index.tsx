
import { useEffect } from "react";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CtaSection from "@/components/landing/CtaSection";
import { BookOpen, TrendingUp, Users, ChevronRight, Clock, Link as LinkIcon, Image, FileText, Database, Sparkles, Zap, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
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
      <HeroSection />
      <StatsSection />
      
      {/* Enhanced Content Types Section */}
      <section className="w-full py-32 bg-gradient-to-b from-white via-gray-50/30 to-primary/5 relative" data-animate>
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }}></div>
        </div>

        <div className="container max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-primary/20 text-primary rounded-full px-8 py-4 text-sm font-medium mb-8 shadow-lg">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Organization</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
              One intelligent hub for 
              <span className="block bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent mt-2">
                everything you save
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From web articles to personal notes, let AI organize and understand your digital content like never before
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ModernContentCard 
              icon={<LinkIcon className="h-8 w-8" />} 
              title="Smart Links" 
              description="Web articles with AI-powered previews and auto-tagging"
              gradient="from-blue-500 via-blue-600 to-cyan-500"
              delay={0.1}
            />
            
            <ModernContentCard 
              icon={<FileText className="h-8 w-8" />} 
              title="Rich Notes" 
              description="Intelligent text with embedded content and smart search"
              gradient="from-purple-500 via-purple-600 to-pink-500"
              delay={0.2}
            />
            
            <ModernContentCard 
              icon={<Image className="h-8 w-8" />} 
              title="Visual Content" 
              description="Images with AI recognition and automatic categorization"
              gradient="from-emerald-500 via-green-600 to-teal-500"
              delay={0.3}
            />
            
            <ModernContentCard 
              icon={<Database className="h-8 w-8" />} 
              title="Documents" 
              description="PDFs and files with intelligent content extraction"
              gradient="from-orange-500 via-red-500 to-pink-500"
              delay={0.4}
            />
          </div>
        </div>
      </section>
      
      <FeaturesSection />
      
      {/* Enhanced How It Works Section */}
      <section className="w-full py-32 bg-gradient-to-br from-white via-gray-50/50 to-primary/5 relative" data-animate>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.03)_25%,rgba(59,130,246,0.03)_50%,transparent_50%,transparent_75%,rgba(59,130,246,0.03)_75%)] bg-[length:20px_20px]"></div>
        
        <div className="container max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-accent/20 text-accent rounded-full px-8 py-4 text-sm font-medium mb-8 shadow-lg">
                <Brain className="h-4 w-4" />
                <span>Intelligent Search</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
                Search like you
                <span className="block bg-gradient-to-r from-accent via-purple-600 to-primary bg-clip-text text-transparent mt-2">
                  think and speak
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
                Stop struggling with keywords. Our AI understands context and finds exactly what you're looking for using natural language.
              </p>
              
              <div className="space-y-6 mb-12">
                <FeaturePoint 
                  text="AI understands your search intent naturally" 
                  delay={0.1}
                />
                <FeaturePoint 
                  text="Contextual search across all content types" 
                  delay={0.2}
                />
                <FeaturePoint 
                  text="Smart auto-tagging and organization" 
                  delay={0.3}
                />
                <FeaturePoint 
                  text="Chat with your entire content library" 
                  delay={0.4}
                />
              </div>
              
              <Button 
                onClick={() => navigate("/auth")} 
                size="lg"
                className="group bg-gradient-to-r from-primary via-purple-600 to-accent hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 hover:scale-105 rounded-full px-10 py-8 text-lg font-medium text-white border-0"
              >
                <Zap className="h-6 w-6 mr-3 transition-transform group-hover:scale-110" />
                Experience the Magic
                <ChevronRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-white via-gray-50 to-primary/5 rounded-3xl p-8 shadow-2xl shadow-gray-900/10 border border-gray-100 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg"></div>
                    <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-lg"></div>
                    <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
                    <div className="flex-1 bg-gray-100 rounded-xl h-10 flex items-center px-6 ml-4">
                      <div className="text-sm text-gray-500 font-medium">Natural Language Search</div>
                    </div>
                  </div>
                  
                  <SearchDemoItem 
                    text="Show me that article about AI ethics I saved last week" 
                    delay={0.5}
                  />
                  <SearchDemoItem 
                    text="Find photos from my Japan trip" 
                    delay={0.7}
                  />
                  <SearchDemoItem 
                    text="Research papers about machine learning" 
                    delay={0.9}
                  />
                  <SearchDemoItem 
                    text="That funny video I bookmarked yesterday" 
                    delay={1.1}
                  />
                </div>
              </div>
              
              {/* Enhanced floating elements */}
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-xl animate-float">
                <Database className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-br from-accent to-pink-500 rounded-3xl flex items-center justify-center shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div className="absolute top-1/2 -left-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-primary rounded-2xl flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '2s' }}>
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <TestimonialsSection />
      
      {/* Enhanced Resources Section */}
      <section className="w-full py-32 bg-gradient-to-b from-gray-50/50 via-white to-primary/5" data-animate>
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Learn more about 
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Memoria
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our resources to get the most out of your AI-powered content management experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <ModernResourceCard 
              icon={<BookOpen className="h-8 w-8" />}
              title="Documentation"
              description="Comprehensive guides and tutorials to master Memoria's AI features"
              buttonText="Read Docs"
              delay={0.1}
            />
            
            <ModernResourceCard 
              icon={<TrendingUp className="h-8 w-8" />}
              title="What's New"
              description="Latest AI improvements and features to enhance your workflow"
              buttonText="View Updates"
              delay={0.3}
            />
            
            <ModernResourceCard 
              icon={<Users className="h-8 w-8" />}
              title="Community"
              description="Connect with other users and share AI-powered productivity tips"
              buttonText="Join Us"
              delay={0.5}
            />
          </div>
        </div>
      </section>
      
      <CtaSection />
    </div>
  );
};

// Enhanced Modern Content Card Component
interface ModernContentCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}

const ModernContentCard = ({ icon, title, description, gradient, delay }: ModernContentCardProps) => (
  <div 
    className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100/50 hover:shadow-2xl hover:shadow-gray-900/10 transition-all duration-700 hover:-translate-y-3 opacity-0 hover:border-primary/20"
    style={{ 
      animation: `fade-in 0.8s ease-out forwards`,
      animationDelay: `${delay}s`
    }}
  >
    <div className={`inline-flex p-5 rounded-3xl bg-gradient-to-br ${gradient} mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
      <div className="text-white">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-semibold mb-4 text-gray-900 group-hover:text-primary transition-colors duration-300">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
    
    {/* Hover effect overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
  </div>
);

// Enhanced Feature Point Component
interface FeaturePointProps {
  text: string;
  delay: number;
}

const FeaturePoint = ({ text, delay }: FeaturePointProps) => (
  <div 
    className="flex items-center gap-4 opacity-0 group"
    style={{ 
      animation: `fade-in 0.6s ease-out forwards`,
      animationDelay: `${delay}s`
    }}
  >
    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
      <div className="text-white text-sm font-bold">✓</div>
    </div>
    <p className="text-gray-700 text-lg">{text}</p>
  </div>
);

// Enhanced Search Demo Item Component
interface SearchDemoItemProps {
  text: string;
  delay: number;
}

const SearchDemoItem = ({ text, delay }: SearchDemoItemProps) => (
  <div 
    className="bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl p-5 border border-gray-100 hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 hover:border-primary/20 transition-all duration-500 opacity-0 cursor-pointer group"
    style={{ 
      animation: `fade-in 0.6s ease-out forwards`,
      animationDelay: `${delay}s`
    }}
  >
    <div className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300 font-medium">{text}</div>
  </div>
);

// Enhanced Modern Resource Card Component
interface ModernResourceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  delay: number;
}

const ModernResourceCard = ({ icon, title, description, buttonText, delay }: ModernResourceCardProps) => (
  <div 
    className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 opacity-0 group hover:border-primary/20"
    style={{ 
      animation: `fade-in 0.8s ease-out forwards`,
      animationDelay: `${delay}s`
    }}
  >
    <div className="text-primary mb-8 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-5 text-gray-900 group-hover:text-primary transition-colors duration-300">{title}</h3>
    <p className="text-gray-600 mb-8 leading-relaxed">{description}</p>
    <Button variant="outline" className="group/btn border-gray-200 hover:border-primary hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-white transition-all duration-300 rounded-full px-6 py-6">
      {buttonText}
      <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
    </Button>
  </div>
);

export default Index;
