
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className, size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-8 gap-0.5",
    md: "h-10 gap-1",
    lg: "h-14 gap-2"
  };

  return (
    <Link 
      to="/" 
      className={`flex items-center ${sizeClasses[size]} transition-all hover:scale-105 ${className || ""}`}
    >
      <div className="flex h-full aspect-square items-center justify-center bg-gradient-primary text-primary-foreground rounded-full shadow-glow">
        <span className="font-bold text-lg tracking-wide">M</span>
      </div>
      <span className="font-heading font-semibold tracking-tight text-3xl">
        <span className="text-gradient bg-gradient-to-r from-primary to-accent">Mem</span>oria
      </span>
    </Link>
  );
};

export default Logo;
