
import { useState, useEffect } from "react";
import ChatBot from "@/components/chat/ChatBot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Bot, MessagesSquare, AlertCircle, Key, Settings, Check, ExternalLink } from "lucide-react";
import { toast } from "@/lib/toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ApiKeyInstructionsDialog from "@/components/chat/ApiKeyInstructionsDialog";

const Chat = () => {
  const [activeTab, setActiveTab] = useState("llama4");
  const [llamaAPIKeyValid, setLlamaAPIKeyValid] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Check if user has seen instructions and if API key exists
  useEffect(() => {
    const hasSeenInstructions = localStorage.getItem('has-seen-api-instructions');
    const storedApiKey = localStorage.getItem('llamaApiKey');
    
    if (!hasSeenInstructions && !storedApiKey) {
      setShowInstructions(true);
    }
    
    if (storedApiKey) {
      setApiKeyConfigured(true);
      checkApiKey(storedApiKey);
    } else {
      // If no stored API key, check if there's a server-side one
      checkApiKey();
    }
  }, []);

  const checkApiKey = async (keyToCheck?: string) => {
    try {
      setChecking(true);
      const { data, error } = await supabase.functions.invoke('llama-chat', {
        body: { 
          message: "API key check",
          checkOnly: true,
          customApiKey: keyToCheck
        }
      });
      
      if (error || data?.error) {
        console.error("API key check failed:", error || data?.error);
        setLlamaAPIKeyValid(false);
      } else {
        console.log("API key check successful");
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
      {/* Instructions Dialog */}
      <ApiKeyInstructionsDialog 
        open={showInstructions} 
        onOpenChange={setShowInstructions} 
      />
      
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
              <Button size="lg" className="flex items-center gap-2 text-base font-medium px-5 py-6">
                <Key className="h-5 w-5" />
                {apiKeyConfigured ? "Change OpenRouter API Key" : "Configure OpenRouter API Key"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">Configure OpenRouter API Key</DialogTitle>
                <DialogDescription className="text-base">
                  Enter your OpenRouter API key to use Llama 4 Maverick.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-3">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => setShowInstructions(true)}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View Setup Instructions
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("https://openrouter.ai/keys", "_blank")}
                    className="flex items-center gap-1"
                  >
                    <Key className="h-3.5 w-3.5" />
                    Get Free API Key
                  </Button>
                </div>
                
                <form onSubmit={handleApiKeySubmit} className="space-y-4">
                  <Input
                    placeholder="Paste your OpenRouter API Key here"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    type="password"
                    className="text-base py-6"
                  />
                  <Button 
                    type="submit" 
                    className="w-full py-6 text-base font-medium" 
                    disabled={checking}
                  >
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
              </div>
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
            {!apiKeyConfigured && (
              <Card className="mb-6 border-amber-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 text-amber-500">
                    <AlertCircle className="h-5 w-5" />
                    <CardTitle>OpenRouter API Key Required</CardTitle>
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
                    className="flex items-center gap-2 font-medium text-base py-6"
                    size="lg"
                  >
                    <Key className="h-5 w-5" />
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
