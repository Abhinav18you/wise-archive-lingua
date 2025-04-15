
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className, size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-14"
  };

  return (
    <Link 
      to="/" 
      className={`flex items-center gap-2 transition-all duration-300 hover:scale-105 ${className || ""}`}
      aria-label="Memoria Home"
    >
      <div className="relative">
        <div className={`flex ${sizeClasses[size]} aspect-square items-center justify-center bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full shadow-glow`}>
          <span className="font-bold text-lg tracking-wide">M</span>
        </div>
      </div>
      <span className="font-heading font-semibold tracking-tight text-3xl flex items-center">
        <span className="text-gradient bg-gradient-to-r from-primary to-accent">Memoria</span>
      </span>
    </Link>
  );
};

export default Logo;
