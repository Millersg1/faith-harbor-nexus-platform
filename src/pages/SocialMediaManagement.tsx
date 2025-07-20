import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, TrendingUp, Users, Share2, Plus, Settings, BarChart3 } from "lucide-react";
import DashboardNavigation from "@/components/DashboardNavigation";
import { SocialMediaAccounts } from "@/components/social-media/SocialMediaAccounts";
import { PostScheduler } from "@/components/social-media/PostScheduler";
import { ContentTemplates } from "@/components/social-media/ContentTemplates";
import { SocialAnalytics } from "@/components/social-media/SocialAnalytics";

const SocialMediaManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    {
      title: "Total Followers",
      value: "12.4K",
      change: "+12%",
      icon: Users,
      trend: "up"
    },
    {
      title: "Scheduled Posts",
      value: "24",
      change: "+8",
      icon: CalendarDays,
      trend: "up"
    },
    {
      title: "Engagement Rate",
      value: "4.2%",
      change: "+0.8%",
      icon: TrendingUp,
      trend: "up"
    },
    {
      title: "Total Reach",
      value: "8.9K",
      change: "+15%",
      icon: Share2,
      trend: "up"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Social Media Management</h1>
              <p className="text-muted-foreground mt-2">
                Manage your ministry's social media presence across all platforms
              </p>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <Badge variant={stat.trend === "up" ? "default" : "secondary"} className="mt-1">
                      {stat.change}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SocialAnalytics />
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarDays className="w-5 h-5" />
                      Upcoming Posts
                    </CardTitle>
                    <CardDescription>
                      Your scheduled content for this week
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { platform: "Facebook", time: "Today 2:00 PM", content: "Sunday service reminder" },
                        { platform: "Instagram", time: "Tomorrow 10:00 AM", content: "Weekly scripture verse" },
                        { platform: "Twitter", time: "Wed 3:00 PM", content: "Prayer request highlight" }
                      ].map((post, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <Badge variant="outline">{post.platform}</Badge>
                            <p className="text-sm text-muted-foreground mt-1">{post.time}</p>
                            <p className="text-sm font-medium">{post.content}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="accounts">
              <SocialMediaAccounts />
            </TabsContent>

            <TabsContent value="scheduler">
              <PostScheduler />
            </TabsContent>

            <TabsContent value="templates">
              <ContentTemplates />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaManagement;