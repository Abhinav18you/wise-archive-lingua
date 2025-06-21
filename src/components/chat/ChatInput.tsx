
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal } from "lucide-react";
import React, { FormEvent, useRef, useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSend, 
  isLoading, 
  disabled = false,
  placeholder = "Type your message..." 
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  // Auto-resize textarea as user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    const maxHeight = isMobile ? 120 : 200;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [message, isMobile]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    onSend(message);
    setMessage("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
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
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className={`resize-none overflow-hidden pr-12 transition-all duration-200 ${
            isMobile 
              ? 'min-h-[48px] text-base rounded-xl' 
              : 'min-h-[56px] rounded-lg'
          }`}
          disabled={disabled || isLoading}
        />
        <Button
          type="submit"
          size="sm"
          variant="ghost"
          className={`absolute hover:bg-primary/10 hover:text-primary transition-all duration-200 ${
            isMobile 
              ? 'bottom-1 right-1 h-10 w-10' 
              : 'bottom-1.5 right-1.5'
          }`}
          disabled={!message.trim() || disabled || isLoading}
        >
          <SendHorizonal className={isMobile ? "h-5 w-5" : "h-4 w-4"} />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
