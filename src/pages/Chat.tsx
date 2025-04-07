
import { useState, useEffect } from "react";
import ChatBot from "@/components/chat/ChatBot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Bot, MessagesSquare, AlertCircle, Key, Settings, Check } from "lucide-react";
import { toast } from "@/lib/toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Chat = () => {
  const [activeTab, setActiveTab] = useState("llama4");
  const [llamaAPIKeyValid, setLlamaAPIKeyValid] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  
  // Check if the Llama API key is configured
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        setChecking(true);
        const { data, error } = await supabase.functions.invoke('llama-chat', {
          body: { 
            message: "API key check",
            checkOnly: true
          }
        });
        
        if (error || data?.error) {
          console.error("API key check failed:", error || data?.error);
          setLlamaAPIKeyValid(false);
        } else {
          setLlamaAPIKeyValid(true);
          setApiKeyConfigured(true);
        }
      } catch (err) {
        console.error("Error checking API key:", err);
        setLlamaAPIKeyValid(false);
      } finally {
        setChecking(false);
      }
    };
    
    checkApiKey();
  }, []);

  const handleApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      toast.error("Please enter an API key");
      return;
    }

    setChecking(true);
    try {
      // Test the API key
      const { data, error } = await supabase.functions.invoke('llama-chat', {
        body: { 
          message: "API key check",
          checkOnly: true,
          customApiKey: apiKey
        }
      });
      
      if (error || data?.error) {
        console.error("Custom API key check failed:", error || data?.error);
        toast.error("Invalid API key. Please try again.");
        setLlamaAPIKeyValid(false);
      } else {
        toast.success("API key configured successfully!");
        setLlamaAPIKeyValid(true);
        setApiKeyConfigured(true);
        setShowApiKeyDialog(false);
        // Save the API key in local storage
        localStorage.setItem('llamaApiKey', apiKey);
      }
    } catch (err) {
      console.error("Error testing API key:", err);
      toast.error("Failed to test API key");
      setLlamaAPIKeyValid(false);
    } finally {
      setChecking(false);
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-center animate-fade-in flex items-center justify-center gap-2">
          <MessagesSquare className="h-8 w-8" />
          AI Chat Assistant
        </h1>
        <p className="text-muted-foreground text-center mb-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
          Chat with Llama 4 Maverick, an advanced AI assistant powered by Meta via OpenRouter API
        </p>
        
        <div className="flex justify-center mb-4 animate-fade-in" style={{ animationDelay: "150ms" }}>
          <Dialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                {apiKeyConfigured ? "Change API Key" : "Configure API Key"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configure OpenRouter API Key</DialogTitle>
                <DialogDescription>
                  Enter your OpenRouter API key to use Llama 4 Maverick.
                  You can get an API key at <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-primary underline">openrouter.ai/keys</a>.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleApiKeySubmit} className="space-y-4">
                <Input
                  placeholder="OpenRouter API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  type="password"
                />
                <Button type="submit" className="w-full" disabled={checking}>
                  {checking ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Save API Key
                    </>
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
        <Tabs defaultValue="llama4" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-1 mb-6">
            <TabsTrigger value="llama4" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Llama 4 Maverick Chat
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="llama4">
            {llamaAPIKeyValid === false && !apiKeyConfigured && (
              <Card className="mb-6 border-destructive">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <CardTitle>OpenRouter API Configuration Required</CardTitle>
                  </div>
                  <CardDescription>
                    An OpenRouter API key is required to access Llama 4 Maverick.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    To use the chat feature, please configure your OpenRouter API key which provides access to Meta's Llama 4 Maverick assistant.
                  </p>
                  <Button 
                    onClick={() => setShowApiKeyDialog(true)} 
                    className="flex items-center gap-2"
                  >
                    <Key className="h-4 w-4" />
                    Configure API Key
                  </Button>
                </CardContent>
              </Card>
            )}
            
            <ChatBot customApiKey={localStorage.getItem('llamaApiKey') || undefined} />
          </TabsContent>
        </Tabs>
      </div>
      
      <Card className="bg-muted/30 mt-8 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Chat with Llama 4 Maverick
          </CardTitle>
          <CardDescription>Get intelligent responses to your questions and prompts</CardDescription>
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
