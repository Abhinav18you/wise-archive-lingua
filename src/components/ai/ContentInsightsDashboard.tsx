
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Eye, Search, Archive, Calendar, Brain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ContentInsight {
  totalContent: number;
  viewsThisWeek: number;
  searchesThisWeek: number;
  archivedContent: number;
  topTags: Array<{ tag: string; count: number }>;
  recentActivity: Array<{
    type: string;
    content_title: string;
    created_at: string;
  }>;
  aiProcessingStats: {
    completed: number;
    pending: number;
    failed: number;
  };
}

const ContentInsightsDashboard = () => {
  const [insights, setInsights] = useState<ContentInsight | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      // Fetch basic content stats
      const { data: materials } = await supabase
        .from('user_materials')
        .select('id, title, tags, view_count, is_archived, created_at');

      // Fetch analytics data
      const { data: analytics } = await supabase
        .from('content_analytics')
        .select('action_type, created_at')
        .gte('created_at', oneWeekAgo.toISOString());

      // Fetch AI processing stats
      const { data: aiStats } = await supabase
        .from('ai_processing_queue')
        .select('status');

      if (materials) {
        // Calculate tag frequency
        const tagCounts: Record<string, number> = {};
        materials.forEach(material => {
          material.tags?.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        });

        const topTags = Object.entries(tagCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([tag, count]) => ({ tag, count }));

        // Calculate AI processing stats
        const aiProcessingStats = {
          completed: aiStats?.filter(s => s.status === 'completed').length || 0,
          pending: aiStats?.filter(s => s.status === 'pending').length || 0,
          failed: aiStats?.filter(s => s.status === 'failed').length || 0
        };

        // Get recent activity
        const recentActivity = analytics?.slice(0, 5).map(a => ({
          type: a.action_type,
          content_title: 'Recent Activity',
          created_at: a.created_at
        })) || [];

        setInsights({
          totalContent: materials.length,
          viewsThisWeek: analytics?.filter(a => a.action_type === 'view').length || 0,
          searchesThisWeek: analytics?.filter(a => a.action_type === 'search').length || 0,
          archivedContent: materials.filter(m => m.is_archived).length,
          topTags,
          recentActivity,
          aiProcessingStats
        });
      }
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-lg" />
        ))}
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Content Insights</h2>
        <p className="text-muted-foreground">AI-powered analytics for your knowledge base</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Archive className="h-4 w-4 text-blue-500" />
              Total Content
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.totalContent}</div>
            <p className="text-xs text-muted-foreground">Items saved</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4 text-green-500" />
              Views This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.viewsThisWeek}</div>
            <p className="text-xs text-muted-foreground">Content accessed</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Search className="h-4 w-4 text-purple-500" />
              Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.searchesThisWeek}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4 text-orange-500" />
              AI Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.aiProcessingStats.completed}
            </div>
            <p className="text-xs text-muted-foreground">
              {insights.aiProcessingStats.pending} pending
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Popular Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.topTags.map(({ tag, count }) => (
                <div key={tag} className="flex items-center justify-between">
                  <Badge variant="secondary">{tag}</Badge>
                  <span className="text-sm text-muted-foreground">{count} items</span>
                </div>
              ))}
              {insights.topTags.length === 0 && (
                <p className="text-sm text-muted-foreground">No tags found</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              AI Processing Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Completed</span>
                <Badge variant="default">{insights.aiProcessingStats.completed}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pending</span>
                <Badge variant="secondary">{insights.aiProcessingStats.pending}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Failed</span>
                <Badge variant="destructive">{insights.aiProcessingStats.failed}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentInsightsDashboard;
