
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import React from "react";

export type ChatMessageType = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
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
            U
          </AvatarFallback>
        ) : (
          <>
            <AvatarImage src="/placeholder.svg" />
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
      </div>
    </div>
  );
};

export default ChatMessage;
