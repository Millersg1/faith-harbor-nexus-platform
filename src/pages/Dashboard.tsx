import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import ProfileSection from "@/components/ProfileSection";
import { 
  User, 
  Settings, 
  Building, 
  Calendar, 
  Users, 
  MessageSquare, 
  BarChart3,
  LogOut,
  Bell,
  Star,
  Zap
} from "lucide-react";

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const upcomingFeatures = [
    { icon: Users, name: "Member Management", status: "Live", description: "Complete member database with family tracking" },
    { icon: Calendar, name: "Event Planning", status: "Live", description: "Advanced event management and scheduling" },
    { icon: MessageSquare, name: "Communication Hub", status: "Live", description: "Email, SMS, and social media management" },
    { icon: BarChart3, name: "Analytics Dashboard", status: "Live", description: "AI-powered insights and reporting" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold" style={{color: "hsl(var(--gold))"}}>
                Welcome to Faith Harbor
              </h1>
              <p className="text-muted-foreground">
                You're part of our early access program
              </p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Early Access Status */}
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="h-6 w-6 text-primary mr-3" />
                  <CardTitle>Early Access Member</CardTitle>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Founding Member
                </Badge>
              </div>
              <CardDescription>
                Thank you for joining Faith Harbor's development journey! Your feedback helps shape the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">Early</div>
                  <div className="text-sm text-muted-foreground">Access Status</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">600+</div>
                  <div className="text-sm text-muted-foreground">Features Planned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">2025</div>
                  <div className="text-sm text-muted-foreground">Launch Year</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* Development Updates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Latest Development Updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">Phase 1 Complete ✅</h4>
                    <p className="text-muted-foreground text-sm">
                      Homepage, navigation, and core branding implemented
                    </p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">Phase 2 Complete ✅</h4>
                    <p className="text-muted-foreground text-sm">
                      Authentication system and user management fully implemented
                    </p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">Phase 3 Complete ✅</h4>
                    <p className="text-muted-foreground text-sm">
                      Core ministry features and member management fully deployed
                    </p>
                    <p className="text-xs text-muted-foreground">Live</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Provide Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">
                      Help us improve by sharing your thoughts
                    </p>
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Give Feedback
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Feature Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">
                      Suggest new features for the platform
                    </p>
                    <Button variant="outline" className="w-full">
                      <Zap className="h-4 w-4 mr-2" />
                      Request Feature
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Community</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">
                      Connect with other early access members
                    </p>
                    <Button variant="outline" className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Join Community
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Features</CardTitle>
                  <CardDescription>
                    Features currently in development or planned for future releases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {upcomingFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{feature.name}</h4>
                            <Badge variant="outline">{feature.status}</Badge>
                          </div>
                          <p className="text-muted-foreground text-sm mt-1">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="feedback" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>We Value Your Input</CardTitle>
                  <CardDescription>
                    Your feedback as an early access member is crucial to our development process
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    <MessageSquare className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Feedback Portal Live</h3>
                    <p className="text-muted-foreground mb-4">
                      Our comprehensive feedback system is now live! You can suggest features, 
                      report issues, and vote on upcoming developments.
                    </p>
                    <Button variant="default">
                      Access Feedback Portal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile" className="space-y-6">
              <ProfileSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;