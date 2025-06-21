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
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
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
      <div className={`${isMobile ? 'px-0' : 'container'} mx-auto ${isMobile ? 'py-4' : 'px-4 py-8'}`}>
        <div className="animate-fade-in">
          <div className={`flex flex-col ${isMobile ? 'gap-4 mb-6' : 'md:flex-row items-start md:items-center justify-between mb-8 gap-4'}`}>
            <div className="space-y-2">
              <h1 className={`font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent ${
                isMobile ? 'text-2xl' : 'text-4xl'
              }`}>
                Your Digital Brain
              </h1>
              <p className={`text-muted-foreground ${isMobile ? 'text-base' : 'text-lg'}`}>
                AI-powered content management and insights
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size={isMobile ? "default" : "sm"}
                className="gap-2 backdrop-blur-sm bg-white/80 border-white/20 hover:bg-white/90 transition-all duration-200"
                onClick={() => navigate("/search")}
              >
                <Search className="h-4 w-4" />
                <span>{isMobile ? "Search" : "Smart Search"}</span>
              </Button>
              <Button
                size={isMobile ? "default" : "sm"}
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg transition-all duration-200"
                onClick={() => navigate("/add")}
              >
                <Plus className="h-4 w-4" />
                <span>Add Content</span>
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className={`${isMobile ? 'grid w-full grid-cols-3' : 'grid w-full grid-cols-3 lg:w-fit'} backdrop-blur-sm bg-white/80 border border-white/20`}>
              <TabsTrigger value="content" className={`gap-2 ${isMobile ? 'text-xs' : ''}`}>
                <FolderOpen className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                Content
              </TabsTrigger>
              <TabsTrigger value="collections" className={`gap-2 ${isMobile ? 'text-xs' : ''}`}>
                <Brain className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                Collections
              </TabsTrigger>
              <TabsTrigger value="insights" className={`gap-2 ${isMobile ? 'text-xs' : ''}`}>
                <BarChart3 className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <div className={`flex flex-col gap-3 mb-6 ${isMobile ? 'space-y-3' : 'sm:flex-row items-start sm:items-center'}`}>
                <div className="flex-1 w-full">
                  <Input
                    placeholder={isMobile ? "Search content..." : "Search by keywords, tags, or AI insights..."}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full backdrop-blur-sm bg-white/80 border-white/20 focus:bg-white/90 transition-all duration-200"
                  />
                </div>
                <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className={`gap-2 backdrop-blur-sm bg-white/80 border-white/20 hover:bg-white/90 ${isMobile ? 'flex-1' : ''}`}>
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
                    <SelectTrigger className={`backdrop-blur-sm bg-white/80 border-white/20 ${isMobile ? 'w-[120px]' : 'w-[180px]'}`}>
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
              </div>

              {loading ? (
                <div className={`flex justify-center ${isMobile ? 'py-8' : 'py-12'}`}>
                  <div className={`animate-pulse text-muted-foreground ${isMobile ? 'text-lg' : 'text-xl'}`}>
                    Loading your content...
                  </div>
                </div>
              ) : sortedContents.length > 0 ? (
                <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
                  {sortedContents.map((content) => (
                    <ContentCard
                      key={content.id}
                      content={content}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              ) : (
                <div className={`flex flex-col items-center justify-center animate-fade-in ${isMobile ? 'py-8' : 'py-12'}`}>
                  <div className={`bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full backdrop-blur-sm ${
                    isMobile ? 'p-4 mb-4' : 'p-6 mb-6'
                  }`}>
                    <Plus className={`text-blue-600 dark:text-blue-400 ${isMobile ? 'h-8 w-8' : 'h-12 w-12'}`} />
                  </div>
                  <h3 className={`font-semibold mb-3 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent ${
                    isMobile ? 'text-xl' : 'text-2xl'
                  }`}>
                    No content found
                  </h3>
                  <p className={`text-muted-foreground mb-6 text-center max-w-md ${isMobile ? 'text-base px-4' : 'text-lg'}`}>
                    {contents.length === 0
                      ? "Start building your digital brain by adding your first piece of content"
                      : "No content matches your current filters"}
                  </p>
                  {contents.length === 0 ? (
                    <Button 
                      onClick={() => navigate("/add")}
                      className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg ${
                        isMobile ? 'w-full max-w-xs' : ''
                      }`}
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
                      className={`backdrop-blur-sm bg-white/80 border-white/20 hover:bg-white/90 ${
                        isMobile ? 'w-full max-w-xs' : ''
                      }`}
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
