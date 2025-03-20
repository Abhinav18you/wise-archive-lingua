
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { Content } from "@/types";
import { toast } from "@/lib/toast";

interface SearchBarProps {
  onResults: (results: Content[]) => void;
}

const SearchBar = ({ onResults }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.warning("Please enter a search query");
      return;
    }
    
    setIsSearching(true);
    
    try {
      const { results, error } = await api.content.search(query);
      
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
              placeholder="Search by natural language (e.g., 'that article about AI ethics')"
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
          <p className="text-xs text-muted-foreground mt-2 ml-1">
            Search your content across all your devices (requires sign in)
          </p>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
