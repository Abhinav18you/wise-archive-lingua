
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Sparkles, User, Bot } from "lucide-react";
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export type ChatMessageType = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
};

interface ChatMessageProps {
  message: ChatMessageType;
}

// Enhanced Meta logo as SVG component
const MetaLogo = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={cn("fill-current", className)}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.6 4.1c-2.6 0-4.7 1.9-5.6 4.4-.9-2.5-3-4.4-5.6-4.4C3.7 4.1 1.5 6.3 1.5 9v6c0 2.7 2.2 4.9 4.9 4.9 1.8 0 3.4-.1 4.6-1.9 1.2 1.8 2.8 1.9 4.6 1.9 2.7 0 4.9-2.2 4.9-4.9V9c0-2.7-2.2-4.9-4.9-4.9zM8.5 16.5c-.8 0-1.5-.7-1.5-1.5V9c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v6c0 .8-.7 1.5-1.5 1.5zm7 0c-.8 0-1.5-.7-1.5-1.5V9c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v6c0 .8-.7 1.5-1.5 1.5z"/>
  </svg>
);

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "flex items-start animate-slide-up opacity-0 message-animation group",
        isUser ? "flex-row-reverse" : "",
        isMobile ? "gap-3 py-2" : "gap-4 py-3"
      )}
    >
      <Avatar className={cn(
        "mt-1 transition-all duration-300 group-hover:scale-110 border-2 flex-shrink-0 shadow-lg",
        isUser 
          ? "border-primary/30 bg-gradient-to-br from-primary/10 to-primary/20 hover:border-primary/50 hover:shadow-primary/25" 
          : "border-blue-500/30 bg-gradient-to-br from-blue-500/15 to-blue-600/15 hover:border-blue-500/50 hover:shadow-blue-500/25",
        isMobile ? "w-9 h-9" : "w-11 h-11"
      )}>
        {isUser ? (
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary hover:from-primary/30 hover:to-primary/40 transition-all duration-300">
            <User className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
          </AvatarFallback>
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-blue-600/25 text-blue-600 hover:from-blue-500/30 hover:to-blue-600/35 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 animate-pulse"></div>
            <div className="relative flex items-center justify-center">
              <MetaLogo className={`text-blue-600 drop-shadow-sm ${isMobile ? "h-5 w-5" : "h-6 w-6"}`} />
              <Sparkles className={`text-blue-400 absolute -top-1 -right-1 animate-pulse ${
                isMobile ? "h-2 w-2" : "h-2.5 w-2.5"
              }`} />
            </div>
          </AvatarFallback>
        )}
      </Avatar>
      <div
        className={cn(
          "flex flex-col gap-2 rounded-2xl transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-0.5 animate-scale-in shadow-lg",
          isUser
            ? "bg-gradient-to-br from-primary/90 to-primary text-primary-foreground shadow-primary/20 hover:shadow-primary/30"
            : "bg-gradient-to-br from-muted/95 to-muted/80 hover:from-muted to-muted/90 border border-border/40 hover:border-accent/30 shadow-muted/20",
          isMobile 
            ? "px-4 py-3 max-w-[82%] text-sm" 
            : "px-5 py-4 max-w-[85%] sm:max-w-[75%]"
        )}
      >
        <div className={cn(
          "whitespace-pre-wrap leading-relaxed font-medium tracking-wide",
          isMobile ? "text-sm" : "text-sm"
        )}>
          {message.content}
        </div>
        {message.createdAt && (
          <div className={cn(
            "opacity-60 mt-1 transition-opacity group-hover:opacity-80 font-medium",
            isUser ? "text-primary-foreground/70" : "text-muted-foreground",
            isMobile ? "text-xs" : "text-xs"
          )}>
            {new Intl.DateTimeFormat('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            }).format(message.createdAt)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
