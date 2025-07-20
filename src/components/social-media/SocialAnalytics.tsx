import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Heart, MessageCircle, Share2, Eye } from "lucide-react";

export const SocialAnalytics = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("engagement");

  // Mock data - in real implementation, this would come from your analytics API
  const engagementData = [
    { date: "Mon", likes: 45, comments: 12, shares: 8, reach: 320 },
    { date: "Tue", likes: 52, comments: 18, shares: 12, reach: 450 },
    { date: "Wed", likes: 38, comments: 9, shares: 6, reach: 280 },
    { date: "Thu", likes: 65, comments: 22, shares: 15, reach: 540 },
    { date: "Fri", likes: 71, comments: 28, shares: 18, reach: 620 },
    { date: "Sat", likes: 59, comments: 19, shares: 11, reach: 480 },
    { date: "Sun", likes: 83, comments: 35, shares: 24, reach: 750 }
  ];

  const platformData = [
    { platform: "Facebook", followers: 2400, engagement: 4.2, reach: 15600 },
    { platform: "Instagram", followers: 3800, engagement: 6.8, reach: 22400 },
    { platform: "Twitter", followers: 1900, engagement: 3.1, reach: 8500 },
    { platform: "YouTube", followers: 1200, engagement: 8.4, reach: 9800 }
  ];

  const topPosts = [
    {
      id: 1,
      content: "Sunday service reminder: Join us at 10 AM for worship and fellowship!",
      platform: "Facebook",
      likes: 156,
      comments: 23,
      shares: 12,
      reach: 2340
    },
    {
      id: 2,
      content: "\"Be still and know that I am God\" - Psalm 46:10 📖✨",
      platform: "Instagram",
      likes: 98,
      comments: 15,
      shares: 8,
      reach: 1890
    },
    {
      id: 3,
      content: "Prayer request: Please keep the Johnson family in your prayers during this difficult time.",
      platform: "Facebook",
      likes: 89,
      comments: 34,
      shares: 18,
      reach: 1560
    }
  ];

  const metrics = [
    { id: "engagement", label: "Engagement", icon: Heart },
    { id: "reach", label: "Reach", icon: Eye },
    { id: "comments", label: "Comments", icon: MessageCircle },
    { id: "shares", label: "Shares", icon: Share2 }
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Social Media Analytics
              </CardTitle>
              <CardDescription>
                Track your social media performance across all platforms
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {metrics.map(metric => (
                    <SelectItem key={metric.id} value={metric.id}>
                      {metric.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 days</SelectItem>
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <CardDescription>
              Compare performance across different social media platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {platformData.map((platform, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <h3 className="font-medium">{platform.platform}</h3>
                    <p className="text-sm text-muted-foreground">
                      {platform.followers.toLocaleString()} followers
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{platform.engagement}% engagement</Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {platform.reach.toLocaleString()} reach
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
            <CardDescription>
              Your most engaging content from the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPosts.map((post, index) => (
                <div key={post.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline">{post.platform}</Badge>
                    <span className="text-xs text-muted-foreground">#{index + 1}</span>
                  </div>
                  <p className="text-sm mb-3 line-clamp-2">{post.content}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {post.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="w-3 h-3" />
                      {post.shares}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.reach}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};