
import { TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';

export const StatsSection = () => {
  return (
    <section className="w-full py-20 bg-white border-t border-gray-100">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <ModernStatsCard 
            value="2x" 
            label="Faster Retrieval" 
            icon={<Clock className="h-6 w-6" />} 
            delay={0.1}
          />
          <ModernStatsCard 
            value="95%" 
            label="Search Accuracy" 
            icon={<CheckCircle className="h-6 w-6" />} 
            delay={0.2}
          />
          <ModernStatsCard 
            value="10k+" 
            label="Active Users" 
            icon={<Users className="h-6 w-6" />} 
            delay={0.3}
          />
          <ModernStatsCard 
            value="4.8★" 
            label="User Rating" 
            icon={<TrendingUp className="h-6 w-6" />} 
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
};

interface ModernStatsCardProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  delay: number;
}

const ModernStatsCard = ({ value, label, icon, delay }: ModernStatsCardProps) => {
  return (
    <div 
      className="text-center group opacity-0"
      style={{ 
        animation: `fade-in 0.6s ease-out forwards`,
        animationDelay: `${delay}s`
      }}
    >
      <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
        <div className="text-primary">
          {icon}
        </div>
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-sm text-gray-600 font-medium">{label}</div>
    </div>
  );
};

export default StatsSection;
