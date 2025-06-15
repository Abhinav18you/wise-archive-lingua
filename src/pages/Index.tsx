
import { useEffect } from "react";
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
      
      {/* Modern Content Types Section */}
      <section className="w-full py-32 bg-gradient-to-b from-white to-gray-50/50" data-animate>
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 text-primary rounded-full px-6 py-3 text-sm font-medium mb-8">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              Save Anything
            </div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              One place for 
              <span className="block bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
                everything you save
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              From web articles to personal notes, organize all your digital content with AI-powered intelligence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ModernContentCard 
              icon={<LinkIcon className="h-7 w-7" />} 
              title="Links" 
              description="Web articles with smart previews"
              gradient="from-blue-500 to-cyan-500"
              delay={0.1}
            />
            
            <ModernContentCard 
              icon={<FileText className="h-7 w-7" />} 
              title="Notes" 
              description="Rich text with embedded content"
              gradient="from-purple-500 to-pink-500"
              delay={0.2}
            />
            
            <ModernContentCard 
              icon={<Image className="h-7 w-7" />} 
              title="Images" 
              description="Visual content with AI recognition"
              gradient="from-emerald-500 to-teal-500"
              delay={0.3}
            />
            
            <ModernContentCard 
              icon={<Database className="h-7 w-7" />} 
              title="Files" 
              description="Documents and PDFs organized"
              gradient="from-orange-500 to-red-500"
              delay={0.4}
            />
          </div>
        </div>
      </section>
      
      <FeaturesSection />
      
      {/* Modern How It Works Section */}
      <section className="w-full py-32 bg-white relative" data-animate>
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-accent/5 border border-accent/10 text-accent rounded-full px-6 py-3 text-sm font-medium mb-8">
                <Clock className="h-4 w-4" />
                How It Works
              </div>
              <h2 className="text-5xl font-bold tracking-tight mb-6">
                Search like you
                <span className="block bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  think and speak
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Stop struggling with keywords. Our AI understands context and finds exactly what you're looking for using natural language.
              </p>
              
              <div className="space-y-6 mb-10">
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
                  text="Chat with your content collection" 
                  delay={0.4}
                />
              </div>
              
              <Button 
                onClick={() => navigate("/auth")} 
                size="lg"
                className="group bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105 rounded-full px-8 py-6 text-lg"
              >
                Experience the Magic
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-2xl shadow-gray-900/10 border border-gray-100">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1 bg-gray-100 rounded-lg h-8 flex items-center px-4">
                      <div className="text-sm text-gray-500">Natural Language Search</div>
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
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg animate-float">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-accent to-pink-500 rounded-2xl flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <TestimonialsSection />
      
      {/* Modern Resources Section */}
      <section className="w-full py-32 bg-gradient-to-b from-gray-50 to-white" data-animate>
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Learn more about Memoria
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our resources to get the most out of your content management experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <ModernResourceCard 
              icon={<BookOpen className="h-8 w-8" />}
              title="Documentation"
              description="Comprehensive guides and tutorials to master Memoria's features"
              buttonText="Read Docs"
              delay={0.1}
            />
            
            <ModernResourceCard 
              icon={<TrendingUp className="h-8 w-8" />}
              title="What's New"
              description="Latest features and improvements to enhance your workflow"
              buttonText="View Updates"
              delay={0.3}
            />
            
            <ModernResourceCard 
              icon={<Users className="h-8 w-8" />}
              title="Community"
              description="Connect with other users and share tips and best practices"
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

// Modern Content Card Component
interface ModernContentCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}

const ModernContentCard = ({ icon, title, description, gradient, delay }: ModernContentCardProps) => (
  <div 
    className="group relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-gray-900/10 transition-all duration-500 hover:-translate-y-2 opacity-0"
    style={{ 
      animation: `fade-in 0.6s ease-out forwards`,
      animationDelay: `${delay}s`
    }}
  >
    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
      <div className="text-white">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

// Feature Point Component
interface FeaturePointProps {
  text: string;
  delay: number;
}

const FeaturePoint = ({ text, delay }: FeaturePointProps) => (
  <div 
    className="flex items-center gap-4 opacity-0"
    style={{ 
      animation: `fade-in 0.5s ease-out forwards`,
      animationDelay: `${delay}s`
    }}
  >
    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
      <div className="text-white text-sm">✓</div>
    </div>
    <p className="text-gray-700">{text}</p>
  </div>
);

// Search Demo Item Component
interface SearchDemoItemProps {
  text: string;
  delay: number;
}

const SearchDemoItem = ({ text, delay }: SearchDemoItemProps) => (
  <div 
    className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:bg-gray-100 transition-colors duration-300 opacity-0"
    style={{ 
      animation: `fade-in 0.5s ease-out forwards`,
      animationDelay: `${delay}s`
    }}
  >
    <div className="text-gray-700">{text}</div>
  </div>
);

// Modern Resource Card Component
interface ModernResourceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  delay: number;
}

const ModernResourceCard = ({ icon, title, description, buttonText, delay }: ModernResourceCardProps) => (
  <div 
    className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0"
    style={{ 
      animation: `fade-in 0.6s ease-out forwards`,
      animationDelay: `${delay}s`
    }}
  >
    <div className="text-primary mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-4 text-gray-900">{title}</h3>
    <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
    <Button variant="outline" className="group border-gray-200 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300">
      {buttonText}
      <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
    </Button>
  </div>
);

export default Index;
