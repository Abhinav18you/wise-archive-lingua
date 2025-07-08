
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Bot, User, Loader2, RefreshCw, Zap } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessage, { ChatMessageType } from "@/components/chat/ChatMessage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";
import { useIsMobile } from "@/hooks/use-mobile";

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
      content: "Hello! I'm Mistral, an AI assistant powered by Mistral AI. How can I help you today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

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
      console.log("Using API key for Mistral chat:", apiKeyToUse ? "API key provided" : "No API key");
      
      // Call the Llama chat edge function with custom API key
      const { data, error: funcError } = await supabase.functions.invoke('llama-chat', {
        body: { 
          message,
          conversation: conversationHistory,
          customApiKey: apiKeyToUse
        }
      });
      
      console.log("Response from Mistral chat function:", data);
      
      if (funcError) {
        console.error("Edge function error:", funcError);
        throw new Error(`Mistral chat service error: ${funcError.message || 'Unknown error'}`);
      }
      
      if (data?.error) {
        console.error("Mistral chat API error:", data.error);
        
        // Handle specific OpenRouter API errors
        if (data.error.includes('401') || data.error.includes('Authorization')) {
          throw new Error('Mistral chat authentication failed. Please check your OpenRouter API key.');
        } else if (data.error.includes('429')) {
          throw new Error('Mistral chat rate limit exceeded. Please wait a moment and try again.');
        } else if (data.error.includes('timeout')) {
          throw new Error('Mistral chat request timed out. Please try again.');
        } else {
          throw new Error('Mistral chat is currently unavailable. Please try again later.');
        }
      }
      
      if (!data?.message) {
        throw new Error("Mistral chat is currently unavailable. Please try again later.");
      }
      
      // Add AI response to the chat
      const aiMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error calling Mistral chat:', err);
      const errorMessage = err instanceof Error ? err.message : 'Mistral chat is currently unavailable. Please try again later.';
      setError(errorMessage);
      
      // Show user-friendly toast message
      if (errorMessage.includes('authentication') || errorMessage.includes('API key')) {
        toast.error('Mistral chat authentication issue. Please check your API key configuration.');
      } else if (errorMessage.includes('rate limit')) {
        toast.warning('Mistral chat is temporarily busy. Please wait a moment and try again.');
      } else if (errorMessage.includes('timeout')) {
        toast.warning('Mistral chat request timed out. Please try again.');
      } else {
        toast.error('Mistral chat is currently unavailable. Please try again later.');
      }
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
    <div className={`flex flex-col w-full mx-auto rounded-2xl border border-border/30 bg-gradient-to-br from-card/98 to-card/95 shadow-2xl overflow-hidden backdrop-blur-sm ${
      isMobile 
        ? 'h-[calc(100vh-8rem)] max-h-none' 
        : 'h-[85vh] max-h-[900px] max-w-4xl'
    }`}>
      {/* Fixed Header - Mobile Optimized */}
      <div className={`flex-shrink-0 border-b border-border/40 bg-gradient-to-r from-background/95 to-muted/50 backdrop-blur-md ${
        isMobile ? 'px-4 py-3' : 'px-6 py-4'
      }`}>
        <div className="flex items-center justify-between">
          <div className={`flex items-center ${isMobile ? 'gap-3' : 'gap-4'}`}>
            <div className="relative group">
              <div className={`rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300 ${
                isMobile ? 'p-2' : 'p-3'
              }`}>
                <Bot className={`text-blue-600 ${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
              </div>
              <div className="absolute -top-1 -right-1 p-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse">
                <Zap className={`text-white ${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />
              </div>
            </div>
            <div>
              <h3 className={`font-bold text-foreground tracking-tight ${isMobile ? 'text-lg' : 'text-xl'}`}>
                Mistral AI
              </h3>
              <p className={`text-muted-foreground font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                AI Assistant by Mistral
              </p>
            </div>
          </div>
          
          {/* Status indicator - responsive */}
          <div className={`flex items-center gap-2 bg-muted/60 rounded-full border border-border/50 backdrop-blur-sm ${
            isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50 ${
                isMobile ? 'w-2 h-2' : 'w-2.5 h-2.5'
              }`}></div>
              <span className="font-medium text-foreground">Online</span>
            </div>
            {!isMobile && (
              <>
                <div className="w-px h-4 bg-border/60"></div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500 animate-spin-slow" />
                  <span className="text-muted-foreground font-medium">OpenRouter</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Scrollable Messages Container - Mobile Optimized */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className={`space-y-4 pb-4 ${isMobile ? 'px-4 py-3' : 'px-6 py-4'}`}>
            {messages.map((message, index) => (
              <ChatMessage 
                key={index} 
                message={mapToChatMessageType(message, index)} 
              />
            ))}
            
            {isLoading && (
              <div className={`flex items-center gap-3 rounded-xl bg-gradient-to-r from-muted/80 to-muted/60 border border-border/40 animate-pulse shadow-lg ${
                isMobile ? 'p-3' : 'p-4'
              }`}>
                <div className={`rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 ${
                  isMobile ? 'p-2' : 'p-3'
                }`}>
                  <Loader2 className={`animate-spin text-blue-600 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                </div>
                <div className="space-y-2">
                  <p className={`font-semibold text-foreground ${isMobile ? 'text-sm' : ''}`}>
                    Mistral is thinking...
                  </p>
                  <div className="flex gap-1.5">
                    <div className={`rounded-full bg-blue-500/70 animate-bounce ${
                      isMobile ? 'w-2 h-2' : 'w-2.5 h-2.5'
                    }`}></div>
                    <div className={`rounded-full bg-blue-500/70 animate-bounce ${
                      isMobile ? 'w-2 h-2' : 'w-2.5 h-2.5'
                    }`} style={{ animationDelay: '0.1s' }}></div>
                    <div className={`rounded-full bg-blue-500/70 animate-bounce ${
                      isMobile ? 'w-2 h-2' : 'w-2.5 h-2.5'
                    }`} style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className={`rounded-xl bg-gradient-to-r from-destructive/15 to-destructive/10 border border-destructive/30 text-destructive space-y-3 animate-slide-up shadow-lg ${
                isMobile ? 'p-4' : 'p-5'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-destructive/20">
                    <RefreshCw className="h-4 w-4" />
                  </div>
                  <p className={`font-semibold ${isMobile ? 'text-sm' : ''}`}>Connection Error</p>
                </div>
                <p className={`opacity-90 leading-relaxed ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {error}
                </p>
                <Button 
                  variant="outline" 
                  size={isMobile ? "sm" : "sm"}
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
      
      {/* Fixed Input Bar - Mobile Optimized */}
      <div className={`flex-shrink-0 border-t border-border/40 bg-gradient-to-r from-background/95 to-muted/50 backdrop-blur-md ${
        isMobile ? 'px-4 py-4' : 'px-6 py-6'
      }`}>
        <ChatInput 
          onSend={handleSendMessage} 
          isLoading={isLoading} 
          disabled={isLoading} 
          placeholder={isMobile ? "Type message..." : "Type your message to Mistral..."}
        />
      </div>
    </div>
  );
};

export default ChatBot;
