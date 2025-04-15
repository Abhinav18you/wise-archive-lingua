
import { useRef } from 'react';
import { 
  Database, 
  Search, 
  FileText, 
  MessageSquareText, 
  Clock, 
  Shield, 
  TrendingUp 
} from 'lucide-react';

export const FeaturesSection = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

  return (
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
          <FeatureCard 
            icon={<Database className="h-8 w-8 text-primary" />}
            title="Store Anything"
            description="Save links, text notes, images, videos, and files all in one secure place with automated AI-powered organization."
            delay={0.1}
            bgClass="bg-primary/10"
            iconClass="text-primary"
          />
          
          <FeatureCard 
            icon={<Search className="h-8 w-8 text-accent" />}
            title="Natural Search"
            description="Find content using everyday language. Our AI understands your intent, not just keywords, for more accurate results."
            delay={0.2}
            bgClass="bg-accent/10"
            iconClass="text-accent"
          />
          
          <FeatureCard 
            icon={<FileText className="h-8 w-8 text-primary" />}
            title="Organized Tags"
            description="AI-powered automatic tagging with custom categories keeps your content structured. Create your own tag system or let AI suggest tags."
            delay={0.3}
            bgClass="bg-primary/10"
            iconClass="text-primary"
          />

          <FeatureCard 
            icon={<MessageSquareText className="h-8 w-8 text-accent" />}
            title="AI Chat Assistant"
            description="Interact with your stored content through natural conversation. Ask questions, generate summaries, and get insights from your data."
            delay={0.4}
            bgClass="bg-accent/10"
            iconClass="text-accent"
          />
        </div>
        
        {/* Additional Features */}
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <AdditionalFeatureCard 
            icon={<Clock className="h-5 w-5 text-primary" />}
            title="Time-saving Automation"
            description="Automatic content categorization and smart suggestions save you hours of manual organization."
            delay={0.5}
            bgClass="bg-primary/10"
          />
          
          <AdditionalFeatureCard 
            icon={<Shield className="h-5 w-5 text-accent" />}
            title="Enhanced Privacy"
            description="Advanced encryption and security measures keep your personal data and documents safe."
            delay={0.6}
            bgClass="bg-accent/10"
          />
          
          <AdditionalFeatureCard 
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
            title="Personal Analytics"
            description="Gain insights into your content consumption and productivity patterns over time."
            delay={0.7}
            bgClass="bg-primary/10"
          />
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  bgClass: string;
  iconClass: string;
}

const FeatureCard = ({ icon, title, description, delay, bgClass, iconClass }: FeatureCardProps) => {
  return (
    <div className="feature-card hover-3d opacity-0" 
      style={{ 
        animation: `fade-in 0.5s ease-out forwards, scale-in 0.5s ease-out forwards`,
        animationDelay: `${delay}s`
      }}
    >
      <div className={`feature-icon ${bgClass} p-4 rounded-xl w-fit mb-6`}>
        {icon}
      </div>
      <h3 className="text-2xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground flex-grow">{description}</p>
    </div>
  );
};

interface AdditionalFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  bgClass: string;
}

const AdditionalFeatureCard = ({ icon, title, description, delay, bgClass }: AdditionalFeatureCardProps) => {
  return (
    <div className="p-6 rounded-xl border border-primary/10 bg-white shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-md opacity-0"
      style={{ 
        animation: `fade-in 0.5s ease-out forwards, slide-up 0.5s ease-out forwards`,
        animationDelay: `${delay}s`
      }}
    >
      <div className={`${bgClass} p-3 rounded-full w-fit mb-4`}>
        {icon}
      </div>
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeaturesSection;
