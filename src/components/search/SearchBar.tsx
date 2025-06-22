
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { Content } from "@/types";
import { toast } from "@/lib/toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SearchBarProps {
  onResults: (results: Content[]) => void;
}

const SearchBar = ({ onResults }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [useLlama, setUseLlama] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.warning("Please enter a search query");
      return;
    }
    
    setIsSearching(true);
    setSearchError(null);
    
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
      console.error("Search error:", error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes("not authenticated")) {
          setSearchError("Please sign in to search your content across devices");
          toast.error("Authentication required for search");
        } else if (error.message.includes("API key") || error.message.includes("401")) {
          setSearchError("AI search service is temporarily unavailable. Using regular search instead.");
          // Automatically retry with regular search if Llama fails
          if (useLlama) {
            setUseLlama(false);
            try {
              const { results, error: fallbackError } = await api.content.search(query, false);
              if (!fallbackError) {
                onResults(results);
                toast.success(`Found ${results.length} result${results.length === 1 ? '' : 's'} using regular search`);
                return;
              }
            } catch (fallbackError) {
              console.error("Fallback search also failed:", fallbackError);
            }
          }
        } else {
          setSearchError("Search failed. Please try again in a moment.");
        }
      } else {
        setSearchError("An unexpected error occurred during search.");
      }
      
      toast.error("Search failed. Please try again.");
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
                AI Search
              </Label>
              <Switch
                id="use-llama"
                checked={useLlama}
                onCheckedChange={setUseLlama}
              />
            </div>
          </div>
          
          {searchError && (
            <Alert className="mt-3 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
              <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                {searchError}
              </AlertDescription>
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
