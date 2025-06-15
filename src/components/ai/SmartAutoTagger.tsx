
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, X } from "lucide-react";
import { aiProcessor } from "@/services/aiProcessor";
import { toast } from "@/lib/toast";

interface SmartAutoTaggerProps {
  content: string;
  existingTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const SmartAutoTagger = ({ content, existingTags, onTagsChange }: SmartAutoTaggerProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);

  const generateTags = async () => {
    if (!content.trim()) {
      toast.warning("Please add some content first");
      return;
    }

    setIsGenerating(true);
    try {
      const tags = await aiProcessor.generateSmartTags(content);
      setSuggestedTags(tags.filter(tag => !existingTags.includes(tag)));
      
      if (tags.length > 0) {
        toast.success(`Generated ${tags.length} smart tags`);
      } else {
        toast.info("No new tags generated");
      }
    } catch (error) {
      console.error('Tag generation error:', error);
      toast.error("Failed to generate tags");
    } finally {
      setIsGenerating(false);
    }
  };

  const addTag = (tag: string) => {
    const newTags = [...existingTags, tag];
    onTagsChange(newTags);
    setSuggestedTags(suggestedTags.filter(t => t !== tag));
  };

  const removeTag = (tag: string) => {
    onTagsChange(existingTags.filter(t => t !== tag));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Smart Tags</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateTags}
          disabled={isGenerating}
          className="h-8 px-3"
        >
          {isGenerating ? (
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
          ) : (
            <Sparkles className="h-3 w-3 mr-1" />
          )}
          Generate
        </Button>
      </div>

      {existingTags.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Current Tags:</p>
          <div className="flex flex-wrap gap-1">
            {existingTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                onClick={() => removeTag(tag)}
              >
                {tag}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {suggestedTags.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Suggested Tags:</p>
          <div className="flex flex-wrap gap-1">
            {suggestedTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => addTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartAutoTagger;
