
import { useState } from "react";
import ChatBot from "@/components/chat/ChatBot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";

const Chat = () => {
  const [activeTab, setActiveTab] = useState("llama4");
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-center animate-fade-in">
          AI Chat Assistant
        </h1>
        <p className="text-muted-foreground text-center mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
          Chat with an advanced AI assistant powered by Llama 4 Maverick
        </p>
      </div>
      
      <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
        <Tabs defaultValue="llama4" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-1 mb-6">
            <TabsTrigger value="llama4" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Llama 4 Maverick
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="llama4">
            <ChatBot />
          </TabsContent>
        </Tabs>
      </div>
      
      <Card className="bg-muted/30 mt-8 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <CardHeader>
          <CardTitle>Chat Tips</CardTitle>
          <CardDescription>Get the most out of your AI chat experience</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Ask questions about any topic - Llama 4 has broad knowledge</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Get help with creative writing or brainstorming ideas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Ask for summaries of complex topics or concepts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Provide clear instructions for the best results</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
