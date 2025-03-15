
import { useState } from "react";
import { Content } from "@/types";
import SearchBar from "@/components/search/SearchBar";
import ContentCard from "@/components/content/ContentCard";

const Search = () => {
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearchResults = (results: Content[]) => {
    setSearchResults(results);
    setHasSearched(true);
  };
  
  const handleDelete = (id: string) => {
    setSearchResults(searchResults.filter(result => result.id !== id));
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2 text-center animate-fade-in">Natural Language Search</h1>
        <p className="text-muted-foreground text-center mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
          Search your content using everyday language and questions
        </p>
        <SearchBar onResults={handleSearchResults} />
      </div>
      
      {hasSearched && (
        <div className="mt-10 animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">
            {searchResults.length > 0
              ? `Found ${searchResults.length} result${searchResults.length === 1 ? "" : "s"}`
              : "No results found"}
          </h2>
          
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((content) => (
                <ContentCard
                  key={content.id}
                  content={content}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">
                Try another search query or use different terms
              </p>
            </div>
          )}
        </div>
      )}
      
      {!hasSearched && (
        <div className="mt-16 animate-fade-in">
          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-3">Search Tips</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Try describing what you're looking for in natural language</li>
              <li>• Include context like when you saved it or what it was about</li>
              <li>• Search by content type ("find my images about...")</li>
              <li>• Include approximate dates ("links I saved last week")</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
