
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Loader2, Sparkles, AlertCircle, RotateCcw } from "lucide-react";
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
  const [retryCount, setRetryCount] = useState(0);
  
  const handleSearch = async (e: React.FormEvent, isRetry = false) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.warning("Please enter a search query");
      return;
    }
    
    setIsSearching(true);
    setSearchError(null);
    
    try {
      console.log(`Starting search - Query: "${query}", AI Search: ${useLlama}, Retry: ${isRetry ? retryCount + 1 : 0}`);
      
      const { results, error } = await api.content.search(query, useLlama);
      
      if (error) throw error;
      
      onResults(results);
      setRetryCount(0); // Reset retry count on success
      
      if (results.length === 0) {
        toast.info(`No results found for "${query}". Try a different search term.`);
      } else {
        const searchType = useLlama ? "AI search" : "search";
        toast.success(`Found ${results.length} result${results.length === 1 ? '' : 's'} using ${searchType}`);
      }
    } catch (error) {
      console.error("Search error:", error);
      
      const currentRetry = isRetry ? retryCount + 1 : 0;
      setRetryCount(currentRetry);
      
      // Handle specific error types with better user messaging
      if (error instanceof Error) {
        if (error.message.includes("not authenticated")) {
          setSearchError("Please sign in to search your content across devices");
          toast.error("Authentication required - please sign in to continue");
        } else if (error.message.includes("API key") || error.message.includes("401")) {
          if (useLlama) {
            setSearchError("AI search is temporarily unavailable. We'll use regular search instead.");
            console.log("AI search failed with 401 - API key issue, falling back to regular search");
            
            // Automatically retry with regular search
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
              setSearchError("Search service is currently unavailable. Please try again in a moment.");
            }
          } else {
            setSearchError("Search service authentication failed. Please try again later.");
          }
        } else if (error.message.includes("429")) {
          setSearchError("Search service is busy. Please wait a moment and try again.");
          toast.warning("Search service is temporarily overloaded");
        } else if (error.message.includes("timeout") || error.message.includes("network")) {
          setSearchError("Connection timeout. Please check your internet connection and try again.");
          toast.error("Network connection issue");
        } else {
          // Generic error handling with retry option
          if (currentRetry < 1 && useLlama) {
            console.log("Retrying AI search once before showing error");
            setTimeout(() => handleSearch(e, true), 1500);
            return;
          }
          
          setSearchError(useLlama 
            ? "AI search is currently unavailable. Please try regular search or try again later."
            : "Search is temporarily unavailable. Please try again in a moment."
          );
        }
      } else {
        setSearchError("An unexpected error occurred. Please try again.");
      }
      
      const errorType = useLlama ? "AI search" : "Regular search";
      toast.error(`${errorType} failed. Please try again.`);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleRetrySearch = () => {
    setSearchError(null);
    setRetryCount(0);
    handleSearch({ preventDefault: () => {} } as React.FormEvent);
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
              <AlertDescription className="text-orange-800 dark:text-orange-200 flex items-center justify-between">
                <span>{searchError}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetrySearch}
                  className="ml-3 h-8 px-3 text-xs border-orange-300 hover:bg-orange-100 dark:border-orange-700 dark:hover:bg-orange-900"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
