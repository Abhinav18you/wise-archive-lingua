
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Sparkles, User, Bot } from "lucide-react";
import React from "react";

export type ChatMessageType = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
};

interface ChatMessageProps {
  message: ChatMessageType;
}

// Meta logo as SVG component
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

  return (
    <div
      className={cn(
        "flex items-start gap-4 py-4 animate-slide-up opacity-0 message-animation",
        isUser ? "flex-row-reverse" : ""
      )}
    >
      <Avatar className={cn(
        "mt-1 transition-all duration-300 hover:scale-110 border-2 flex-shrink-0 w-10 h-10",
        isUser 
          ? "border-primary/20 bg-primary/5 hover:border-primary/40" 
          : "border-accent/20 bg-gradient-to-br from-blue-500/10 to-blue-600/10 hover:border-blue-500/40 hover:shadow-glow"
      )}>
        {isUser ? (
          <AvatarFallback className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <User className="h-4 w-4" />
          </AvatarFallback>
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 text-blue-600 hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 animate-pulse"></div>
            <div className="relative flex items-center justify-center">
              <MetaLogo className="h-5 w-5 text-blue-600" />
              <Sparkles className="h-2 w-2 text-blue-500 absolute -top-0.5 -right-0.5 animate-pulse" />
            </div>
          </AvatarFallback>
        )}
      </Avatar>
      <div
        className={cn(
          "flex flex-col gap-2 rounded-xl px-4 py-3 max-w-[85%] sm:max-w-[75%] transition-all duration-300 hover:shadow-lg animate-scale-in",
          isUser
            ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-soft hover:shadow-glow hover:-translate-y-0.5"
            : "bg-gradient-to-br from-muted/80 to-muted/60 hover:from-muted/90 hover:to-muted/70 border border-border/50 hover:border-accent/20 hover:-translate-y-0.5"
        )}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
        {message.createdAt && (
          <div className={cn(
            "text-xs opacity-60 mt-1 transition-opacity hover:opacity-80",
            isUser ? "text-primary-foreground/70" : "text-muted-foreground"
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
