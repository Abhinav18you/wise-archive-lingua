
import { useState, useEffect } from "react";
import { Plus, FolderPlus, Palette, Share2, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";

interface Collection {
  id: string;
  name: string;
  description: string;
  color: string;
  is_public: boolean;
  is_ai_generated: boolean;
  created_at: string;
  item_count?: number;
}

interface ContentCollectionsProps {
  onCollectionSelect?: (collectionId: string) => void;
}

const colors = [
  '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', 
  '#8B5A2B', '#EC4899', '#06B6D4', '#84CC16', '#F97316'
];

const ContentCollections = ({ onCollectionSelect }: ContentCollectionsProps) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    color: colors[0],
    is_public: false
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          collection_items(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const collectionsWithCounts = data.map(collection => ({
        ...collection,
        item_count: collection.collection_items?.[0]?.count || 0
      }));

      setCollections(collectionsWithCounts);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to load collections');
    } finally {
      setIsLoading(false);
    }
  };

  const createCollection = async () => {
    if (!newCollection.name.trim()) {
      toast.warning('Please enter a collection name');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('collections')
        .insert([{
          name: newCollection.name,
          description: newCollection.description,
          color: newCollection.color,
          is_public: newCollection.is_public
        }])
        .select()
        .single();

      if (error) throw error;

      setCollections([{ ...data, item_count: 0 }, ...collections]);
      setNewCollection({ name: '', description: '', color: colors[0], is_public: false });
      setIsCreateOpen(false);
      toast.success('Collection created successfully');
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Collections</h2>
          <p className="text-muted-foreground">Organize your content into smart collections</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <FolderPlus className="h-4 w-4" />
              New Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Collection Name</Label>
                <Input
                  id="name"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                  placeholder="Enter collection name..."
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newCollection.description}
                  onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                  placeholder="Describe this collection..."
                />
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex gap-2 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        newCollection.color === color ? 'border-primary scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewCollection({ ...newCollection, color })}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="public"
                  checked={newCollection.is_public}
                  onCheckedChange={(checked) => setNewCollection({ ...newCollection, is_public: checked })}
                />
                <Label htmlFor="public">Make this collection public</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={createCollection} className="flex-1">
                  Create Collection
                </Button>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <Card
            key={collection.id}
            className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-l-4"
            style={{ borderLeftColor: collection.color }}
            onClick={() => onCollectionSelect?.(collection.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {collection.name}
                    {collection.is_ai_generated && (
                      <Badge variant="secondary" className="text-xs">
                        AI
                      </Badge>
                    )}
                  </CardTitle>
                  {collection.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {collection.is_public ? (
                    <Unlock className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{collection.item_count} items</span>
                <span>{formatDate(collection.created_at)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentCollections;
