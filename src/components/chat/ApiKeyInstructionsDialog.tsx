
import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Key, CheckCircle2, Copy, Check } from "lucide-react";
import { toast } from "@/lib/toast";

interface ApiKeyInstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApiKeyInstructionsDialog = ({ open, onOpenChange }: ApiKeyInstructionsDialogProps) => {
  const [copiedStep, setCopiedStep] = useState<string | null>(null);
  
  const handleCopy = async (text: string, stepId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStep(stepId);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedStep(null), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const handleClose = () => {
    localStorage.setItem('has-seen-api-instructions', 'true');
    onOpenChange(false);
  };
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-3xl flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl">
              <Key className="h-7 w-7 text-white" />
            </div>
            Get Started with Llama 4 Maverick Chat
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg text-muted-foreground">
            Get your free OpenRouter API key to unlock AI chat features
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-8">
          {/* Step-by-step instructions */}
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 border border-primary/10">
            <h3 className="font-semibold text-xl mb-6 flex items-center gap-2">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Quick Setup Guide
              </span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-base mb-2">Visit OpenRouter to create your account</p>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-3 py-2 rounded-md text-sm font-mono flex-1">
                      https://openrouter.ai/keys
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy("https://openrouter.ai/keys", "url")}
                      className="flex-shrink-0"
                    >
                      {copiedStep === "url" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-base">Create a free account or sign in to your existing account</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-base">Generate a new API key from your dashboard</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                  4
                </div>
                <div className="flex-1">
                  <p className="text-base mb-2">Search for the Llama 4 Maverick model</p>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-3 py-2 rounded-md text-sm font-mono flex-1">
                      meta-llama/llama-4-maverick:free
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy("meta-llama/llama-4-maverick:free", "model")}
                      className="flex-shrink-0"
                    >
                      {copiedStep === "model" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                  5
                </div>
                <div className="flex-1">
                  <p className="text-base">Copy your API key and paste it in the chat settings</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick action button */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20">
            <Button 
              onClick={() => window.open("https://openrouter.ai/keys", "_blank")}
              className="group bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105 text-white border-0 px-8 py-6 text-base"
              size="lg"
            >
              <ExternalLink className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
              Get Your Free API Key
            </Button>
            
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              ✨ Setup takes less than 2 minutes!
            </p>
          </div>
          
          {/* Important notice */}
          <div className="rounded-xl border-l-4 border-amber-400 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-6">
            <h3 className="font-medium text-amber-800 dark:text-amber-400 mb-3 text-lg flex items-center gap-2">
              <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              Important Information
            </h3>
            <div className="text-amber-700 dark:text-amber-300 space-y-2">
              <p className="text-base">• The Llama 4 Maverick model is completely free with OpenRouter</p>
              <p className="text-base">• Your API key is stored securely in your browser's local storage</p>
              <p className="text-base">• We never store or access your API key on our servers</p>
            </div>
          </div>
        </div>
        
        <AlertDialogFooter className="gap-3 sm:gap-0 pt-6">
          <AlertDialogAction asChild>
            <Button 
              onClick={handleClose} 
              size="lg" 
              className="font-medium text-base py-6 w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300"
            >
              <CheckCircle2 className="h-5 w-5" />
              Continue to Setup
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ApiKeyInstructionsDialog;
