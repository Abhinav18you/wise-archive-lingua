
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
        "mt-1 transition-all duration-300 hover:scale-110 border-2",
        isUser 
          ? "border-primary/20 bg-primary/5 hover:border-primary/40" 
          : "border-accent/20 bg-gradient-to-br from-accent/10 to-primary/10 hover:border-accent/40 hover:shadow-glow"
      )}>
        {isUser ? (
          <AvatarFallback className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <User className="h-4 w-4" />
          </AvatarFallback>
        ) : (
          <>
            <AvatarImage src="/placeholder.svg" alt="Llama 4 AI" />
            <AvatarFallback className="bg-gradient-to-br from-accent/20 to-primary/20 text-primary hover:from-accent/30 hover:to-primary/30 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10 animate-pulse"></div>
              <div className="relative flex items-center justify-center">
                <Bot className="h-3.5 w-3.5 text-accent animate-float" />
                <Sparkles className="h-2 w-2 text-primary absolute -top-0.5 -right-0.5 animate-pulse" />
              </div>
            </AvatarFallback>
          </>
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
