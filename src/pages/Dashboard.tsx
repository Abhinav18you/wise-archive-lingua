
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Brain, FolderOpen, BarChart3 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentCollections from "@/components/ai/ContentCollections";
import ContentInsightsDashboard from "@/components/ai/ContentInsightsDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");
  const [showTypes, setShowTypes] = useState<ContentType[]>(["link", "text", "image", "video", "file"]);
  const [activeTab, setActiveTab] = useState("content");

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
      const aiKeywordsMatch = content.ai_keywords?.some(keyword => keyword.toLowerCase().includes(searchLower));
      
      if (!(titleMatch || contentMatch || descriptionMatch || tagsMatch || aiKeywordsMatch)) {
        return false;
      }
    }
    
    return true;
  });

  // Sort contents with AI-enhanced priority
  const sortedContents = [...filteredContents].sort((a, b) => {
    if (filter === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (filter === "a-z") {
      return (a.title || "").localeCompare(b.title || "");
    } else if (filter === "z-a") {
      return (b.title || "").localeCompare(a.title || "");
    } else if (filter === "priority") {
      return (b.priority_score || 0) - (a.priority_score || 0);
    } else if (filter === "views") {
      return (b.view_count || 0) - (a.view_count || 0);
    } else {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Your Digital Brain
              </h1>
              <p className="text-lg text-muted-foreground">
                AI-powered content management and insights
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 backdrop-blur-sm bg-white/80 border-white/20 hover:bg-white/90 transition-all duration-200"
                onClick={() => navigate("/search")}
              >
                <Search className="h-4 w-4" />
                <span>Smart Search</span>
              </Button>
              <Button
                size="sm"
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg transition-all duration-200"
                onClick={() => navigate("/add")}
              >
                <Plus className="h-4 w-4" />
                <span>Add Content</span>
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-fit backdrop-blur-sm bg-white/80 border border-white/20">
              <TabsTrigger value="content" className="gap-2">
                <FolderOpen className="h-4 w-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="collections" className="gap-2">
                <Brain className="h-4 w-4" />
                Collections
              </TabsTrigger>
              <TabsTrigger value="insights" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
                <div className="flex-1 w-full">
                  <Input
                    placeholder="Search by keywords, tags, or AI insights..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full backdrop-blur-sm bg-white/80 border-white/20 focus:bg-white/90 transition-all duration-200"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 backdrop-blur-sm bg-white/80 border-white/20 hover:bg-white/90">
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px] backdrop-blur-md bg-white/95 border-white/20">
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
                  <SelectTrigger className="w-[180px] backdrop-blur-sm bg-white/80 border-white/20">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="backdrop-blur-md bg-white/95 border-white/20">
                    <SelectItem value="most-recent">Most Recent</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="priority">AI Priority</SelectItem>
                    <SelectItem value="views">Most Viewed</SelectItem>
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
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full p-6 mb-6 backdrop-blur-sm">
                    <Plus className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    No content found
                  </h3>
                  <p className="text-muted-foreground mb-6 text-center max-w-md text-lg">
                    {contents.length === 0
                      ? "Start building your digital brain by adding your first piece of content"
                      : "No content matches your current filters"}
                  </p>
                  {contents.length === 0 ? (
                    <Button 
                      onClick={() => navigate("/add")}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg"
                    >
                      Add Your First Content
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setKeyword("");
                        setShowTypes(["link", "text", "image", "video", "file"]);
                        setFilter(null);
                      }}
                      className="backdrop-blur-sm bg-white/80 border-white/20 hover:bg-white/90"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="collections">
              <ContentCollections />
            </TabsContent>

            <TabsContent value="insights">
              <ContentInsightsDashboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
