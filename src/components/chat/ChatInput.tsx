
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";
import React, { FormEvent, useRef, useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, disabled = false }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    onSend(message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
      <div className="relative flex-1">
        <Textarea
          ref={textareaRef}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className="min-h-[56px] resize-none overflow-hidden pr-12"
          disabled={disabled || isLoading}
        />
        <Button
          type="submit"
          size="sm"
          variant="ghost"
          className="absolute bottom-1.5 right-1.5"
          disabled={!message.trim() || disabled || isLoading}
        >
          <SendHorizonal className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
