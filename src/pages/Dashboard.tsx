
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Content, ContentType } from "@/types";
import { api } from "@/lib/api";
import { toast } from "@/lib/toast";
import ContentCard from "@/components/content/ContentCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const [showTypes, setShowTypes] = useState<ContentType[]>(["link", "text", "image", "video", "file"]);

  const fetchContents = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching contents...");
      const { contents, error } = await api.content.getAll();
      if (error) throw error;
      console.log("Fetched contents:", contents);
      setContents(contents);
    } catch (error) {
      console.error("Error fetching contents:", error);
      toast.error("Failed to load your content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const justAdded = params.get('added') === 'true';
    
    if (justAdded) {
      navigate('/dashboard', { replace: true });
      fetchContents();
      toast.success("Your content has been added successfully!");
    }
  }, [location.search, navigate, fetchContents]);

  const handleDelete = (id: string) => {
    console.log("Deleting content with ID:", id);
    setContents(contents.filter((content) => content.id !== id));
  };

  const filteredContents = contents.filter((content) => {
    if (!showTypes.includes(content.type)) return false;
    
    if (keyword) {
      const searchLower = keyword.toLowerCase();
      const titleMatch = content.title?.toLowerCase().includes(searchLower);
      const contentMatch = content.content.toLowerCase().includes(searchLower);
      const descriptionMatch = content.description?.toLowerCase().includes(searchLower);
      const tagsMatch = content.tags?.some(tag => tag.toLowerCase().includes(searchLower));
      
      if (!(titleMatch || contentMatch || descriptionMatch || tagsMatch)) {
        return false;
      }
    }
    
    return true;
  });

  // Sort contents if needed
  const sortedContents = [...filteredContents].sort((a, b) => {
    if (filter === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (filter === "a-z") {
      return (a.title || "").localeCompare(b.title || "");
    } else if (filter === "z-a") {
      return (b.title || "").localeCompare(a.title || "");
    } else {
      // Default to most recent
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const toggleContentType = (type: ContentType) => {
    if (showTypes.includes(type)) {
      setShowTypes(showTypes.filter(t => t !== type));
    } else {
      setShowTypes([...showTypes, type]);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Content</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your saved content
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => navigate("/search")}
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>
          <Button
            size="sm"
            className="gap-1"
            onClick={() => navigate("/add")}
          >
            <Plus className="h-4 w-4" />
            <span>Add Content</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="flex-1 w-full">
          <Input
            placeholder="Filter by keyword..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>Content Types</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={showTypes.includes("link")}
              onCheckedChange={() => toggleContentType("link")}
            >
              Links
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showTypes.includes("text")}
              onCheckedChange={() => toggleContentType("text")}
            >
              Text
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showTypes.includes("image")}
              onCheckedChange={() => toggleContentType("image")}
            >
              Images
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showTypes.includes("video")}
              onCheckedChange={() => toggleContentType("video")}
            >
              Videos
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showTypes.includes("file")}
              onCheckedChange={() => toggleContentType("file")}
            >
              Files
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Select
          value={filter || "most-recent"}
          onValueChange={(value) => setFilter(value === "most-recent" ? null : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="most-recent">Most Recent</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="a-z">A-Z</SelectItem>
            <SelectItem value="z-a">Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse text-xl text-muted-foreground">
            Loading your content...
          </div>
        </div>
      ) : sortedContents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedContents.map((content) => (
            <ContentCard
              key={content.id}
              content={content}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
          <div className="bg-muted/50 rounded-full p-4 mb-4">
            <Plus className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No content found</h3>
          <p className="text-muted-foreground mb-4 text-center max-w-md">
            {contents.length === 0
              ? "Start by adding your first piece of content"
              : "No content matches your current filters"}
          </p>
          {contents.length === 0 ? (
            <Button onClick={() => navigate("/add")}>Add Content</Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => {
                setKeyword("");
                setShowTypes(["link", "text", "image", "video", "file"]);
                setFilter(null);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
