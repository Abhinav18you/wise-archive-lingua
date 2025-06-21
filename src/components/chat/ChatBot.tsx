
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Bot, User, Loader2, RefreshCw, Zap } from "lucide-react";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessage, { ChatMessageType } from "@/components/chat/ChatMessage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

interface ChatBotProps {
  customApiKey?: string;
}

const ChatBot = ({ customApiKey }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hello! I'm Llama 4 Maverick, an AI assistant powered by Meta. How can I help you today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when they change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      
      const apiKeyToUse = customApiKey || localStorage.getItem('llamaApiKey');
      console.log("Using API key:", apiKeyToUse ? "API key provided" : "No API key");
      
      // Call the Llama chat edge function with custom API key
      const { data, error: funcError } = await supabase.functions.invoke('llama-chat', {
        body: { 
          message,
          conversation: conversationHistory,
          customApiKey: apiKeyToUse
        }
      });
      
      console.log("Response from Llama chat function:", data);
      
      if (funcError) {
        console.error("Edge function error:", funcError);
        throw new Error(`Edge function error: ${funcError.message || 'Unknown error'}`);
      }
      
      if (data?.error) {
        console.error("Data error:", data.error);
        throw new Error(data.error);
      }
      
      if (!data?.message) {
        throw new Error("No response received from AI");
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
      // Ensure we scroll to bottom after loading is complete
      setTimeout(scrollToBottom, 100);
    }
  };
  
  const handleRetry = () => {
    setError(null);
    // Check if the last message was from a user to retry that message
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content);
    }
  };
  
  // Map our Message type to ChatMessageType for the ChatMessage component
  const mapToChatMessageType = (message: Message, index: number): ChatMessageType => {
    return {
      id: index.toString(),
      role: message.role as 'user' | 'assistant',
      content: message.content,
      createdAt: message.timestamp ? new Date(message.timestamp) : new Date()
    };
  };
  
  return (
    <div className="rounded-xl border border-border/50 bg-gradient-to-br from-card/95 to-card/80 shadow-layered overflow-hidden flex flex-col h-[70vh] animate-scale-in hover:shadow-3d transition-all duration-500">
      <div className="p-4 border-b border-border/50 bg-gradient-to-r from-muted/50 to-muted/30 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20 border border-accent/20 animate-float">
              <Bot className="h-5 w-5 text-accent" />
            </div>
            <div className="absolute -top-1 -right-1 p-0.5 rounded-full bg-primary animate-pulse">
              <Zap className="h-2.5 w-2.5 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Llama 4 Maverick</h3>
            <p className="text-xs text-muted-foreground">AI Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Online</span>
          </div>
          <div className="w-px h-3 bg-border/50"></div>
          <div className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-primary animate-spin-slow" />
            <span>OpenRouter API</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background/50 to-background/80" style={{ scrollBehavior: 'smooth' }}>
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            message={mapToChatMessageType(message, index)} 
          />
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-muted/60 to-muted/40 border border-border/30 animate-pulse">
            <div className="p-2 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20">
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-sm text-foreground">Llama 4 is thinking...</p>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-accent/60 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-destructive/10 to-destructive/5 border border-destructive/20 text-destructive space-y-3 animate-slide-up">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-destructive/20">
                <RefreshCw className="h-3.5 w-3.5" />
              </div>
              <p className="text-sm font-medium">Connection Error</p>
            </div>
            <p className="text-sm opacity-90">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry}
              className="flex items-center gap-2 hover:bg-destructive/10 hover:border-destructive/30 transition-all duration-200"
            >
              <RefreshCw className="h-3.5 w-3.5" /> 
              Try Again
            </Button>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-border/50 p-4 bg-gradient-to-r from-muted/30 to-muted/20 backdrop-blur-sm">
        <ChatInput 
          onSend={handleSendMessage} 
          isLoading={isLoading} 
          disabled={isLoading} 
          placeholder="Type your message to Llama 4..."
        />
      </div>
    </div>
  );
};

export default ChatBot;
