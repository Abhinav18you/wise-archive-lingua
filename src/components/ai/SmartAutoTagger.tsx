
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Wand2, Tag, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SmartAutoTaggerProps {
  content: string;
  url?: string;
  onTagsGenerated: (tags: string[]) => void;
  existingTags?: string[];
}

export const SmartAutoTagger = ({ content, url, onTagsGenerated, existingTags = [] }: SmartAutoTaggerProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(existingTags);

  const generateTags = async () => {
    setIsGenerating(true);
    console.log("Generating AI tags for content:", content.substring(0, 100));
    
    try {
      // Simulate AI tag generation - in production, this would call your AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI-generated tags based on content analysis
      const mockTags = [
        'productivity', 'technology', 'web-development', 'ai-tools', 
        'research', 'tutorial', 'javascript', 'react', 'programming',
        'design', 'ux-ui', 'frontend', 'backend', 'database'
      ];
      
      // Simulate intelligent tag selection based on content
      const contentLower = content.toLowerCase();
      const intelligentTags = mockTags.filter(tag => {
        if (contentLower.includes(tag.replace('-', ' '))) return true;
        if (tag === 'technology' && (contentLower.includes('tech') || contentLower.includes('software'))) return true;
        if (tag === 'productivity' && (contentLower.includes('efficient') || contentLower.includes('workflow'))) return true;
        return Math.random() > 0.7; // Random selection for demo
      }).slice(0, 6);
      
      setSuggestedTags(intelligentTags);
    } catch (error) {
      console.error('Error generating tags:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const applyTags = () => {
    onTagsGenerated(selectedTags);
    console.log("Applied tags:", selectedTags);
  };

  useEffect(() => {
    if (content && content.length > 50) {
      generateTags();
    }
  }, [content]);

  return (
    <Card className="w-full bg-gradient-to-br from-purple-50/50 to-blue-50/50 border-purple-200/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
            <Brain className="h-4 w-4 text-white" />
          </div>
          AI Smart Tagging
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isGenerating ? (
          <div className="flex items-center gap-3 p-4 bg-white/60 rounded-lg border border-purple-200/30">
            <Sparkles className="h-5 w-5 text-purple-500 animate-spin" />
            <span className="text-sm text-gray-600">AI is analyzing your content...</span>
          </div>
        ) : suggestedTags.length > 0 ? (
          <div className="space-y-4">
            <div className="p-4 bg-white/60 rounded-lg border border-purple-200/30">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-purple-500" />
                AI Suggested Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                      selectedTags.includes(tag) 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0' 
                        : 'hover:bg-purple-50 border-purple-200'
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {selectedTags.length > 0 && (
              <div className="p-4 bg-green-50/60 rounded-lg border border-green-200/30">
                <h4 className="text-sm font-medium text-green-700 mb-3">Selected Tags</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedTags.map((tag) => (
                    <Badge key={tag} className="bg-green-500 text-white">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button 
                  onClick={applyTags}
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  Apply Tags
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Button 
            onClick={generateTags}
            disabled={!content || content.length < 50}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Smart Tags
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartAutoTagger;
