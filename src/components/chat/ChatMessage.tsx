
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Sparkles, User } from "lucide-react";
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
        "flex items-start gap-4 py-4",
        isUser ? "flex-row-reverse" : ""
      )}
    >
      <Avatar className={cn("mt-1", isUser ? "" : "bg-primary/10")}>
        {isUser ? (
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        ) : (
          <>
            <AvatarImage src="/placeholder.svg" alt="AI" />
            <AvatarFallback className="bg-primary/10 text-primary dark:text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </AvatarFallback>
          </>
        )}
      </Avatar>
      <div
        className={cn(
          "flex flex-col gap-2 rounded-lg px-4 py-3 max-w-[85%] sm:max-w-[75%]",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
        {message.createdAt && (
          <div className="text-xs opacity-70 mt-1">
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
