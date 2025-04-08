
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
import { ExternalLink, Key, CheckCircle2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface ApiKeyInstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApiKeyInstructionsDialog = ({ open, onOpenChange }: ApiKeyInstructionsDialogProps) => {
  // Mark in localStorage that user has seen the instructions
  const handleClose = () => {
    localStorage.setItem('has-seen-api-instructions', 'true');
    onOpenChange(false);
  };
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-3xl flex items-center gap-2">
            <Key className="h-7 w-7 text-primary" />
            Get Started with Llama 4 Maverick Chat
          </AlertDialogTitle>
          <AlertDialogDescription className="text-lg">
            To use our AI chat feature, you need a free OpenRouter API key
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-6">
          <div className="rounded-md border border-muted p-5 bg-muted/40">
            <h3 className="font-semibold text-xl mb-3">How to get your free API key:</h3>
            <ol className="list-decimal space-y-3 ml-6">
              <li className="text-base">Go to <a 
                href="https://openrouter.ai/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline font-medium text-lg"
              >
                OpenRouter.ai/keys
              </a></li>
              <li className="text-base">Create a free account or sign in</li>
              <li className="text-base">Generate a new API key</li>
              <li className="text-base">Search for <span className="font-mono text-base bg-muted px-2 py-0.5 rounded-md">llama-4-maverick:free</span> in their model list</li>
              <li className="text-base">Copy your API key and paste it in the settings panel</li>
            </ol>
          </div>
          
          <div className="flex gap-4 items-center">
            <Button 
              onClick={() => window.open("https://openrouter.ai/keys", "_blank")}
              className="flex items-center gap-2 py-6 text-base"
              size="lg"
            >
              <ExternalLink className="h-5 w-5" />
              Get Free API Key
            </Button>
            
            <p className="text-muted-foreground">
              It only takes a minute to setup!
            </p>
          </div>
          
          <div className="rounded-md border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-950/20 p-5">
            <h3 className="font-medium text-amber-800 dark:text-amber-400 mb-2 text-lg">Important:</h3>
            <p className="text-amber-700 dark:text-amber-300 text-base">
              The Llama 4 Maverick model is available for free with OpenRouter. 
              Your API key will be stored securely in your browser's local storage.
            </p>
          </div>
          
          <div className="rounded-md border border-muted p-5 bg-muted/40">
            <h3 className="font-medium mb-2 text-lg">Sample model usage:</h3>
            <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`model: "meta-llama/llama-4-maverick:free",
messages: [
  {
    role: "system",
    content: "You are Llama 4, a helpful AI assistant."
  },
  {
    role: "user", 
    content: "What can you do?"
  }
]`}
            </pre>
          </div>
        </div>
        
        <AlertDialogFooter className="gap-3 sm:gap-0">
          <AlertDialogAction asChild>
            <Button onClick={handleClose} size="lg" className="font-medium text-base py-6 w-full flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Continue to API Key Setup
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ApiKeyInstructionsDialog;
