
import { supabase } from "@/integrations/supabase/client";

export interface AIProcessingResult {
  summary?: string;
  keywords?: string[];
  tags?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  category?: string;
  priority?: number;
}

class AIProcessorService {
  async processContent(contentId: string, content: string, type: string): Promise<AIProcessingResult> {
    console.log('Processing content with AI:', { contentId, type });
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Create processing queue entry
      await supabase.from('ai_processing_queue').insert({
        content_id: contentId,
        user_id: user.id,
        processing_type: 'auto_analyze',
        status: 'processing'
      });

      // Get auth session for API calls
      const { data: { session } } = await supabase.auth.getSession();
      
      // Call Llama API for content analysis
      const response = await fetch(`https://lopilymjfynocjddhiig.supabase.co/functions/v1/llama-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          message: `Analyze this ${type} content and provide:
1. A brief summary (max 100 words)
2. 5-10 relevant keywords
3. 3-5 category tags
4. Sentiment analysis (positive/negative/neutral)
5. Priority score (1-10)
6. Main category

Content: ${content.substring(0, 2000)}`,
          systemPrompt: "You are an AI content analyst. Respond with structured JSON containing: summary, keywords, tags, sentiment, priority, category."
        })
      });

      if (!response.ok) {
        throw new Error('AI processing failed');
      }

      const result = await response.json();
      let aiResult: AIProcessingResult = {};

      try {
        // Try to parse AI response as JSON
        const parsed = JSON.parse(result.response);
        aiResult = {
          summary: parsed.summary,
          keywords: parsed.keywords || [],
          tags: parsed.tags || [],
          sentiment: parsed.sentiment || 'neutral',
          category: parsed.category,
          priority: parsed.priority || 5
        };
      } catch (e) {
        // Fallback parsing if not structured JSON
        const text = result.response;
        aiResult = {
          summary: this.extractSummary(text),
          keywords: this.extractKeywords(text),
          tags: this.extractTags(text),
          sentiment: this.extractSentiment(text),
          priority: 5
        };
      }

      // Update processing queue with result
      await supabase.from('ai_processing_queue')
        .update({
          status: 'completed',
          result: aiResult as any
        })
        .eq('content_id', contentId);

      return aiResult;
    } catch (error) {
      console.error('AI processing error:', error);
      
      // Get user for error logging
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Update processing queue with error
        await supabase.from('ai_processing_queue')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error'
          })
          .eq('content_id', contentId);
      }

      // Return basic fallback analysis
      return this.fallbackAnalysis(content, type);
    }
  }

  private extractSummary(text: string): string {
    const summaryMatch = text.match(/summary[:\s]*(.*?)(?:\n|keywords|tags|$)/i);
    return summaryMatch ? summaryMatch[1].trim().substring(0, 200) : '';
  }

  private extractKeywords(text: string): string[] {
    const keywordsMatch = text.match(/keywords[:\s]*(.*?)(?:\n|tags|sentiment|$)/i);
    if (keywordsMatch) {
      return keywordsMatch[1].split(/[,\n]/).map(k => k.trim()).filter(k => k);
    }
    return [];
  }

  private extractTags(text: string): string[] {
    const tagsMatch = text.match(/tags[:\s]*(.*?)(?:\n|sentiment|priority|$)/i);
    if (tagsMatch) {
      return tagsMatch[1].split(/[,\n]/).map(t => t.trim()).filter(t => t);
    }
    return [];
  }

  private extractSentiment(text: string): 'positive' | 'negative' | 'neutral' {
    const sentimentMatch = text.match(/sentiment[:\s]*(positive|negative|neutral)/i);
    return (sentimentMatch?.[1]?.toLowerCase() as any) || 'neutral';
  }

  private fallbackAnalysis(content: string, type: string): AIProcessingResult {
    // Basic keyword extraction
    const words: string[] = content.toLowerCase().match(/\b\w+\b/g) || [];
    const wordFreq: Record<string, number> = words.reduce((acc, word) => {
      if (word.length > 3) acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const keywords = Object.entries(wordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);

    return {
      summary: content.substring(0, 100) + '...',
      keywords,
      tags: [type],
      sentiment: 'neutral',
      priority: 5
    };
  }

  async generateSmartTags(content: string): Promise<string[]> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`https://lopilymjfynocjddhiig.supabase.co/functions/v1/llama-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          message: `Generate 5-7 relevant tags for this content: ${content.substring(0, 500)}`,
          systemPrompt: "Generate comma-separated tags that describe the content's topic, category, and key themes."
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result.response.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
      }
    } catch (error) {
      console.error('Smart tagging error:', error);
    }
    
    return [];
  }
}

export const aiProcessor = new AIProcessorService();
