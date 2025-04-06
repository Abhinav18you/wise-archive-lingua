
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatMessage, { ChatMessageType } from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { getSession } from "@/lib/auth";
import { toast } from "@/lib/toast";
import { Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm powered by Llama 4 Maverick. How can I help you today?",
      createdAt: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { session } = await getSession();
        setIsAuthenticated(!!session?.user);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message to chat
    const userMessage: ChatMessageType = {
      id: uuidv4(),
      role: "user",
      content,
      createdAt: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare messages for API (include previous conversation for context)
      const apiMessages = messages
        .slice(-5) // Only include last 5 messages for context
        .concat(userMessage)
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      // Send to Llama API
      const { data, error } = await supabase.functions.invoke('llama-chat', {
        body: { messages: apiMessages }
      });

      if (error) throw error;

      // Extract response from Llama
      const responseContent = data.choices[0].message.content;

      // Add assistant message
      setMessages((prev) => [
        ...prev,
        {
          id: uuidv4(),
          role: "assistant",
          content: responseContent,
          createdAt: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectToLogin = () => {
    window.location.href = "/auth?redirect=/chat";
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <Alert className="max-w-2xl mx-auto my-8">
        <Sparkles className="h-4 w-4" />
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>
          <p className="mb-4">You need to be signed in to use the chatbot.</p>
          <Button onClick={handleRedirectToLogin}>Sign In</Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          Llama 4 Maverick Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 min-h-[400px] max-h-[500px] overflow-y-auto">
        <div className="px-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
          {isLoading && (
            <div className="flex justify-center py-2">
              <div className="animate-pulse text-sm text-muted-foreground">
                Llama is thinking...
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 border-t">
        <ChatInput 
          onSend={handleSendMessage} 
          isLoading={isLoading} 
          disabled={!isAuthenticated} 
        />
      </CardFooter>
    </Card>
  );
};

export default ChatBot;
