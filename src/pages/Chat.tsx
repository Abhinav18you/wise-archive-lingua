
import { useState } from "react";
import ChatBot from "@/components/chat/ChatBot";

const Chat = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-center animate-fade-in">
          Llama 4 Maverick Chat
        </h1>
        <p className="text-muted-foreground text-center mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
          Chat with an advanced AI assistant powered by Llama 4
        </p>
      </div>
      
      <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
        <ChatBot />
      </div>
      
      <div className="bg-muted/30 rounded-lg p-6 mt-8 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <h3 className="text-lg font-medium mb-3">Chat Tips</h3>
        <ul className="space-y-2 text-muted-foreground">
          <li>• Ask questions about any topic</li>
          <li>• Get help with creative writing or brainstorming</li>
          <li>• Summarize information or explain complex topics</li>
          <li>• Provide clear instructions for best results</li>
        </ul>
      </div>
    </div>
  );
};

export default Chat;
