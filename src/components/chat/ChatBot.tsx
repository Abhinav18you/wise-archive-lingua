import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Bot, User, Loader2, RefreshCw, Zap } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
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

  // Smooth scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "end" 
      });
    }
  };

  useEffect(() => {
    // Delay scroll to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading]);

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
    <div className="flex flex-col h-[85vh] max-h-[900px] w-full max-w-4xl mx-auto rounded-2xl border border-border/30 bg-gradient-to-br from-card/98 to-card/95 shadow-2xl overflow-hidden backdrop-blur-sm">
      {/* Fixed Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border/40 bg-gradient-to-r from-background/95 to-muted/50 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <div className="absolute -top-1 -right-1 p-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse">
                <Zap className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground tracking-tight">Llama 4 Maverick</h3>
              <p className="text-sm text-muted-foreground font-medium">AI Assistant by Meta</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm bg-muted/60 px-4 py-2 rounded-full border border-border/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
              <span className="font-medium text-foreground">Online</span>
            </div>
            <div className="w-px h-4 bg-border/60"></div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500 animate-spin-slow" />
              <span className="text-muted-foreground font-medium">OpenRouter</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scrollable Messages Container */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full px-6 py-4">
          <div className="space-y-6 pb-4">
            {messages.map((message, index) => (
              <ChatMessage 
                key={index} 
                message={mapToChatMessageType(message, index)} 
              />
            ))}
            
            {isLoading && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-muted/80 to-muted/60 border border-border/40 animate-pulse shadow-lg">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">Llama 4 is thinking...</p>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500/70 animate-bounce"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500/70 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500/70 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="p-5 rounded-xl bg-gradient-to-r from-destructive/15 to-destructive/10 border border-destructive/30 text-destructive space-y-4 animate-slide-up shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-destructive/20">
                    <RefreshCw className="h-4 w-4" />
                  </div>
                  <p className="font-semibold">Connection Error</p>
                </div>
                <p className="text-sm opacity-90 leading-relaxed">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry}
                  className="flex items-center gap-2 hover:bg-destructive/10 hover:border-destructive/40 transition-all duration-300 font-medium"
                >
                  <RefreshCw className="h-4 w-4" /> 
                  Try Again
                </Button>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>
      
      {/* Fixed Input Bar */}
      <div className="flex-shrink-0 border-t border-border/40 p-6 bg-gradient-to-r from-background/95 to-muted/50 backdrop-blur-md">
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
