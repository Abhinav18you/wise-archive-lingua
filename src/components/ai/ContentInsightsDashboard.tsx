
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  TrendingUp,
  Brain,
  Eye,
  Clock,
  Target,
  Zap,
  BookOpen,
  Star,
  AlertCircle,
  Download
} from 'lucide-react';

interface InsightData {
  mostAccessedContent: Array<{name: string, views: number, category: string}>;
  contentByCategory: Array<{name: string, value: number, color: string}>;
  usageOverTime: Array<{date: string, saves: number, views: number}>;
  aiInsights: Array<{type: string, message: string, confidence: number}>;
}

export const ContentInsightsDashboard = () => {
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate AI analysis of user's content patterns
    const loadInsights = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockInsights: InsightData = {
        mostAccessedContent: [
          { name: 'React Hooks Guide', views: 45, category: 'Tutorial' },
          { name: 'AI Ethics Paper', views: 38, category: 'Research' },
          { name: 'Design System Examples', views: 32, category: 'Design' },
          { name: 'Node.js Best Practices', views: 28, category: 'Development' },
          { name: 'UX Case Study', views: 24, category: 'Design' }
        ],
        contentByCategory: [
          { name: 'Development', value: 35, color: '#8B5CF6' },
          { name: 'Design', value: 28, color: '#06B6D4' },
          { name: 'Research', value: 20, color: '#10B981' },
          { name: 'Tools', value: 17, color: '#F59E0B' }
        ],
        usageOverTime: [
          { date: '2024-01-01', saves: 12, views: 45 },
          { date: '2024-01-02', saves: 15, views: 52 },
          { date: '2024-01-03', saves: 8, views: 38 },
          { date: '2024-01-04', saves: 22, views: 67 },
          { date: '2024-01-05', saves: 18, views: 58 },
          { date: '2024-01-06', saves: 25, views: 72 },
          { date: '2024-01-07', saves: 20, views: 65 }
        ],
        aiInsights: [
          {
            type: 'pattern',
            message: 'You access development content 40% more on weekdays',
            confidence: 92
          },
          {
            type: 'recommendation',
            message: 'Consider creating a "Quick Reference" collection for frequently accessed items',
            confidence: 87
          },
          {
            type: 'trend',
            message: 'Your AI-related content consumption increased 65% this month',
            confidence: 94
          }
        ]
      };
      
      setInsights(mockInsights);
      setIsLoading(false);
    };
    
    loadInsights();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Brain className="h-8 w-8 text-purple-500 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">AI is analyzing your content patterns...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-500" />
            AI Content Insights
          </h2>
          <p className="text-gray-600">Understand your content usage patterns with AI analysis</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500 rounded-full">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">Total Views</p>
                <p className="text-2xl font-bold text-purple-900">1,247</p>
                <p className="text-xs text-purple-600">+23% this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 rounded-full">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Items Saved</p>
                <p className="text-2xl font-bold text-blue-900">89</p>
                <p className="text-xs text-blue-600">+12 this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500 rounded-full">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Avg. Session</p>
                <p className="text-2xl font-bold text-green-900">24m</p>
                <p className="text-xs text-green-600">+8% improvement</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500 rounded-full">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-orange-600 font-medium">AI Score</p>
                <p className="text-2xl font-bold text-orange-900">92/100</p>
                <p className="text-xs text-orange-600">Excellent organization</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Usage Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={insights.usageOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="saves" stroke="#8B5CF6" strokeWidth={2} />
                <Line type="monotone" dataKey="views" stroke="#06B6D4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Content by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Content Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={insights.contentByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {insights.contentByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Most Accessed Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Most Accessed Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.mostAccessedContent.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{item.views} views</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-500" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.aiInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-white/60 rounded-lg border border-purple-200/30">
                <div className="p-2 bg-purple-100 rounded-full">
                  {insight.type === 'pattern' && <TrendingUp className="h-4 w-4 text-purple-600" />}
                  {insight.type === 'recommendation' && <Target className="h-4 w-4 text-purple-600" />}
                  {insight.type === 'trend' && <AlertCircle className="h-4 w-4 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 mb-2">{insight.message}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {insight.confidence}% confidence
                    </Badge>
                    <span className="text-xs text-purple-600 capitalize">{insight.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentInsightsDashboard;
