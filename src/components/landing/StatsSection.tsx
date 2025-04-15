
import { TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';

export const StatsSection = () => {
  return (
    <section className="w-full py-12 bg-primary/5 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-dots bg-[size:20px_20px] opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50"></div>
      
      <div className="container max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 px-4 relative z-10">
        <StatsCard 
          value="2x" 
          label="Faster Information Retrieval" 
          icon={<Clock className="h-5 w-5 text-primary" />} 
          delay={0.1}
        />
        <StatsCard 
          value="95%" 
          label="Search Accuracy" 
          icon={<CheckCircle className="h-5 w-5 text-primary" />} 
          delay={0.2}
        />
        <StatsCard 
          value="10k+" 
          label="Active Users" 
          icon={<Users className="h-5 w-5 text-primary" />} 
          delay={0.3}
        />
        <StatsCard 
          value="4.8" 
          label="Average Rating" 
          icon={<TrendingUp className="h-5 w-5 text-primary" />} 
          delay={0.4}
        />
      </div>
    </section>
  );
};

interface StatsCardProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  delay: number;
}

const StatsCard = ({ value, label, icon, delay }: StatsCardProps) => {
  return (
    <div 
      className="flex flex-col items-center text-center p-4 transition-all duration-500 hover:transform hover:scale-105 opacity-0 translate-y-4"
      style={{ animation: `fade-in 0.5s ease-out forwards ${delay}s` }}
    >
      <div className="bg-white rounded-full p-2 shadow-soft mb-3">
        {icon}
      </div>
      <div className="text-4xl font-bold text-primary mb-2 animated-gradient-text">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

export default StatsSection;
