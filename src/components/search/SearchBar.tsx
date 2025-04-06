
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Loader2, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { Content } from "@/types";
import { toast } from "@/lib/toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SearchBarProps {
  onResults: (results: Content[]) => void;
}

const SearchBar = ({ onResults }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [useLlama, setUseLlama] = useState(false);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.warning("Please enter a search query");
      return;
    }
    
    setIsSearching(true);
    
    try {
      const { results, error } = await api.content.search(query, useLlama);
      
      if (error) throw error;
      
      onResults(results);
      
      if (results.length === 0) {
        toast.info(`No results found for "${query}". Try a different search term.`);
      } else {
        toast.success(`Found ${results.length} result${results.length === 1 ? '' : 's'}`);
      }
    } catch (error) {
      console.error("Error searching:", error);
      toast.error("Search failed. Please try again.");
      // If user is not authenticated, suggest logging in
      if (error instanceof Error && error.message.includes("not authenticated")) {
        toast.error("Please sign in to search your content across devices");
      }
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <div className="w-full animate-fade-in">
      <div className="mx-auto max-w-3xl">
        <form onSubmit={handleSearch} className="relative">
          <div className="rounded-lg glassmorphism overflow-hidden p-1 flex items-center">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your saved content..."
              className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            />
            <Button 
              type="submit" 
              className="shrink-0 ml-2" 
              disabled={isSearching}
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <SearchIcon className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 ml-1">
            <p className="text-xs text-muted-foreground">
              Search your content across all your devices (requires sign in)
            </p>
            <div className="flex items-center space-x-2">
              <Label htmlFor="use-llama" className="text-xs cursor-pointer">
                <Sparkles className="h-3 w-3 inline mr-1" />
                Llama 4
              </Label>
              <Switch
                id="use-llama"
                checked={useLlama}
                onCheckedChange={setUseLlama}
                size="sm"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
