
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Bot, User, Loader2 } from "lucide-react";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessage from "@/components/chat/ChatMessage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hello! I'm Llama 4 Maverick, an AI assistant. How can I help you today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Add user message to the chat
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    
    try {
      // Get conversation history (excluding system messages)
      const conversationHistory = messages.filter(m => m.role !== 'system');
      
      // Call the Llama chat edge function
      const { data, error } = await supabase.functions.invoke('llama-chat', {
        body: { 
          message,
          conversation: conversationHistory
        }
      });
      
      if (error) throw error;
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Add AI response to the chat
      const aiMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error calling Llama chat:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response from AI';
      setError(errorMessage);
      toast.error('Failed to get response from Llama 4. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden flex flex-col h-[70vh]">
      <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <h3 className="font-semibold">Llama 4 Maverick</h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3" />
          <span>Powered by Perplexity API</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollBehavior: 'smooth' }}>
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            message={message.content} 
            isUser={message.role === 'user'}
            timestamp={message.timestamp}
          />
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-sm text-muted-foreground">Llama 4 is thinking...</p>
          </div>
        )}
        
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            Error: {error}. Please try again.
          </div>
        )}
      </div>
      
      <div className="border-t p-4">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
          placeholder="Send a message to Llama 4 Maverick..." 
        />
      </div>
    </div>
  );
};

export default ChatBot;
