
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Folder, 
  Plus, 
  Brain, 
  Sparkles, 
  Search,
  Filter,
  MoreVertical,
  Share2,
  Star,
  Archive
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Collection {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  tags: string[];
  isAIGenerated: boolean;
  lastUpdated: Date;
  color: string;
}

interface ContentCollectionsProps {
  onCollectionSelect: (collectionId: string) => void;
}

export const ContentCollections = ({ onCollectionSelect }: ContentCollectionsProps) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  // Mock collections data with AI-generated suggestions
  useEffect(() => {
    const mockCollections: Collection[] = [
      {
        id: '1',
        name: 'AI & Machine Learning',
        description: 'Articles and resources about artificial intelligence',
        itemCount: 24,
        tags: ['ai', 'machine-learning', 'technology'],
        isAIGenerated: true,
        lastUpdated: new Date(),
        color: 'from-purple-500 to-pink-500'
      },
      {
        id: '2',
        name: 'Web Development',
        description: 'Frontend and backend development resources',
        itemCount: 18,
        tags: ['javascript', 'react', 'node.js'],
        isAIGenerated: false,
        lastUpdated: new Date(Date.now() - 86400000),
        color: 'from-blue-500 to-cyan-500'
      },
      {
        id: '3',
        name: 'Design Inspiration',
        description: 'UI/UX design patterns and inspiration',
        itemCount: 31,
        tags: ['design', 'ui', 'ux', 'inspiration'],
        isAIGenerated: true,
        lastUpdated: new Date(Date.now() - 172800000),
        color: 'from-emerald-500 to-teal-500'
      },
      {
        id: '4',
        name: 'Productivity Tools',
        description: 'Apps and workflows for better productivity',
        itemCount: 12,
        tags: ['productivity', 'tools', 'workflow'],
        isAIGenerated: true,
        lastUpdated: new Date(Date.now() - 259200000),
        color: 'from-orange-500 to-red-500'
      }
    ];
    setCollections(mockCollections);
  }, []);

  const createAICollection = async () => {
    setIsCreating(true);
    console.log("Creating AI-powered collection:", newCollectionName);
    
    try {
      // Simulate AI analysis for collection creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newCollection: Collection = {
        id: Date.now().toString(),
        name: newCollectionName,
        description: `AI-curated collection for ${newCollectionName.toLowerCase()}`,
        itemCount: 0,
        tags: [newCollectionName.toLowerCase().replace(/\s+/g, '-')],
        isAIGenerated: true,
        lastUpdated: new Date(),
        color: 'from-indigo-500 to-purple-500'
      };
      
      setCollections(prev => [newCollection, ...prev]);
      setNewCollectionName('');
    } catch (error) {
      console.error('Error creating collection:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collection.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header with search and create */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Smart Collections</h2>
          <p className="text-gray-600">AI-powered content organization</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  Create AI-Powered Collection
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Collection name..."
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                />
                <Button 
                  onClick={createAICollection}
                  disabled={!newCollectionName.trim() || isCreating}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500"
                >
                  {isCreating ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Creating with AI...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 mr-2" />
                      Create Smart Collection
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCollections.map((collection) => (
          <Card 
            key={collection.id}
            className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-gray-200/50 bg-white/80 backdrop-blur-sm"
            onClick={() => onCollectionSelect(collection.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${collection.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Folder className="h-6 w-6 text-white" />
                </div>
                
                <div className="flex items-center gap-2">
                  {collection.isAIGenerated && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI
                    </Badge>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Star className="h-4 w-4 mr-2" />
                        Favorite
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div>
                <CardTitle className="text-lg mb-2 group-hover:text-purple-600 transition-colors">
                  {collection.name}
                </CardTitle>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {collection.description}
                </p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {collection.itemCount} items
                </span>
                <span className="text-gray-500">
                  {collection.lastUpdated.toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {collection.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="text-xs hover:bg-purple-50 border-gray-300"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Suggestions */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Collection Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Based on your content, AI suggests creating these collections:
          </p>
          <div className="flex flex-wrap gap-3">
            {['Research Papers', 'Tutorial Videos', 'Design Resources', 'Code Snippets'].map((suggestion) => (
              <Button 
                key={suggestion}
                variant="outline" 
                size="sm"
                className="hover:bg-purple-50 border-purple-200"
              >
                <Plus className="h-3 w-3 mr-2" />
                {suggestion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentCollections;
