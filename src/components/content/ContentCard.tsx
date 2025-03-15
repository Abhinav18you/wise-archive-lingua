
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Link, ExternalLink, MoreVertical, Pencil, Trash, File, FileText, Image, Video } from "lucide-react";
import { Content } from "@/types";
import { api } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface ContentCardProps {
  content: Content;
  onDelete: (id: string) => void;
}

const ContentCard = ({ content, onDelete }: ContentCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleDelete = async () => {
    try {
      await api.content.delete(content.id);
      onDelete(content.id);
      toast.success("Content deleted successfully");
    } catch (error) {
      console.error("Error deleting content:", error);
      toast.error("Failed to delete content");
    }
  };
  
  const getIcon = () => {
    switch (content.type) {
      case "link":
        return <Link className="h-5 w-5 text-blue-500" />;
      case "text":
        return <FileText className="h-5 w-5 text-gray-500" />;
      case "image":
        return <Image className="h-5 w-5 text-green-500" />;
      case "video":
        return <Video className="h-5 w-5 text-red-500" />;
      case "file":
        return <File className="h-5 w-5 text-amber-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md animate-scale-in">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getIcon()}
            <Badge variant="outline" className="text-xs">
              {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex items-center text-destructive"
                onClick={handleDelete}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="line-clamp-1">{content.title || "Untitled"}</CardTitle>
        <CardDescription className="line-clamp-2">
          {content.description || content.content.substring(0, 100)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        {content.type === "image" && content.thumbnail_url && (
          <div className="w-full h-36 overflow-hidden rounded-md mb-3">
            <img 
              src={content.thumbnail_url} 
              alt={content.title || "Image"} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
        
        {content.tags && content.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {content.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 justify-between">
        <div className="text-xs text-muted-foreground">
          {formatDate(content.created_at)}
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getIcon()}
                {content.title || "Untitled"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {content.description && (
                <p className="text-muted-foreground">{content.description}</p>
              )}
              
              {content.type === "link" && (
                <div className="flex items-center justify-center py-3">
                  <Button asChild variant="outline" className="gap-1">
                    <a href={content.content} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Open Link
                    </a>
                  </Button>
                </div>
              )}
              
              {content.type === "image" && (
                <div className="w-full max-h-[500px] overflow-hidden rounded-md">
                  <img 
                    src={content.content} 
                    alt={content.title || "Image"} 
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              
              {content.type === "text" && (
                <div className="p-4 bg-muted rounded-md">
                  <p>{content.content}</p>
                </div>
              )}
              
              {content.tags && content.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {content.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="text-sm text-muted-foreground">
                Added on {formatDate(content.created_at)}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default ContentCard;
