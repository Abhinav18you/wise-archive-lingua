
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Database } from "lucide-react";

export const CtaSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full py-24 relative overflow-hidden" data-animate>
      {/* Enhanced background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-80 -z-10"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-radial opacity-30"></div>
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
      </div>
      
      <div className="container max-w-4xl mx-auto text-center px-4 relative z-10">
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
            className="text-lg py-7 px-12 rounded-full shadow-lg hover:shadow-primary/25 fancy-button bg-gradient-to-r from-primary to-accent transition-all duration-500 hover:scale-105 relative overflow-hidden">
            <span className="relative z-10">Get Started for Free</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
