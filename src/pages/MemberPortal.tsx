import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { DynamicScriptureQuote } from "@/components/DynamicScriptureQuote";
import { 
  User, 
  Calendar, 
  Users, 
  MessageSquare, 
  Heart,
  DollarSign,
  Clock,
  TrendingUp,
  Bell,
  BookOpen,
  Target,
  Award,
  Activity
} from "lucide-react";

interface MemberStats {
  totalDonations: number;
  eventsAttended: number;
  prayerRequests: number;
  smallGroupInvolvement: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  date: string;
  icon: any;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
}

const MemberPortal = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [memberStats, setMemberStats] = useState<MemberStats>({
    totalDonations: 0,
    eventsAttended: 0,
    prayerRequests: 0,
    smallGroupInvolvement: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchMemberData();
    }
  }, [user]);

  const fetchMemberData = async () => {
    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      setProfile(profileData);

      // Fetch donation stats
      const { data: donations } = await supabase
        .from('donations')
        .select('amount')
        .eq('donor_id', user?.id)
        .eq('status', 'completed');

      const totalDonations = donations?.reduce((sum, donation) => sum + donation.amount, 0) || 0;

      // Fetch events attended (using event registrations as proxy)
      const { data: eventRegistrations } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('user_id', user?.id);

      const eventsAttended = eventRegistrations?.length || 0;

      // Fetch prayer requests count
      const { data: prayerRequests } = await supabase
        .from('prayer_requests')
        .select('id')
        .eq('requester_id', user?.id);

      const prayerRequestsCount = prayerRequests?.length || 0;

      // Fetch small group involvement
      const { data: smallGroupMembers } = await supabase
        .from('small_group_members')
        .select('id')
        .eq('user_id', user?.id)
        .eq('status', 'active');

      const smallGroupInvolvement = smallGroupMembers?.length || 0;

      setMemberStats({
        totalDonations,
        eventsAttended,
        prayerRequests: prayerRequestsCount,
        smallGroupInvolvement
      });

      // Fetch upcoming events
      const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true })
        .limit(5);

      setUpcomingEvents(events?.map(event => ({
        id: event.id,
        title: event.title,
        date: new Date(event.event_date).toLocaleDateString(),
        location: event.location || 'TBD',
        category: event.category
      })) || []);

      // Generate recent activity (simplified for now)
      const activities: RecentActivity[] = [
        {
          id: '1',
          type: 'donation',
          description: 'Made a donation to General Fund',
          date: '2 days ago',
          icon: DollarSign
        },
        {
          id: '2',
          type: 'event',
          description: 'Attended Sunday Service',
          date: '3 days ago',
          icon: Calendar
        },
        {
          id: '3',
          type: 'prayer',
          description: 'Submitted prayer request',
          date: '1 week ago',
          icon: Heart
        }
      ];

      setRecentActivity(activities);

    } catch (error) {
      console.error('Error fetching member data:', error);
      toast({
        title: "Error",
        description: "Failed to load your dashboard data",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your member portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const membershipProgress = Math.min(
    ((memberStats.eventsAttended * 10) + 
     (memberStats.smallGroupInvolvement * 25) + 
     (memberStats.prayerRequests * 5)) / 100 * 100, 
    100
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-20">
        <DynamicScriptureQuote 
          variant="daily"
          theme="faith"
        />
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold" style={{color: "hsl(var(--gold))"}}>
                Welcome back, {profile?.first_name || user.email?.split('@')[0]}!
              </h1>
              <p className="text-muted-foreground">
                Your personal faith journey continues here
              </p>
            </div>
            <Badge variant="outline" className="text-primary border-primary">
              <User className="h-4 w-4 mr-2" />
              Active Member
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Giving</p>
                    <p className="text-2xl font-bold">${memberStats.totalDonations}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Events Attended</p>
                    <p className="text-2xl font-bold">{memberStats.eventsAttended}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Prayer Requests</p>
                    <p className="text-2xl font-bold">{memberStats.prayerRequests}</p>
                  </div>
                  <Heart className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Small Groups</p>
                    <p className="text-2xl font-bold">{memberStats.smallGroupInvolvement}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="overview" className="text-xs md:text-sm">Overview</TabsTrigger>
              <TabsTrigger value="activity" className="text-xs md:text-sm">Activity</TabsTrigger>
              <TabsTrigger value="events" className="text-xs md:text-sm">Events</TabsTrigger>
              <TabsTrigger value="growth" className="text-xs md:text-sm">Growth</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              {/* Membership Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Membership Engagement
                  </CardTitle>
                  <CardDescription>
                    Your involvement and participation in church activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Overall Engagement</span>
                      <span className="font-bold">{Math.round(membershipProgress)}%</span>
                    </div>
                    <Progress value={membershipProgress} className="h-2" />
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>• Event Participation: {memberStats.eventsAttended} events</div>
                      <div>• Small Group Involvement: {memberStats.smallGroupInvolvement} groups</div>
                      <div>• Prayer Life: {memberStats.prayerRequests} requests</div>
                      <div>• Giving: ${memberStats.totalDonations} contributed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/prayer-requests')}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Heart className="h-5 w-5 mr-2" />
                      Prayer Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">
                      Submit or view prayer requests from the community
                    </p>
                    <Button variant="outline" className="w-full">
                      View Prayers
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/small-groups')}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Small Groups
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">
                      Connect with others in intimate fellowship groups
                    </p>
                    <Button variant="outline" className="w-full">
                      Find Groups
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/donate')}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Give Online
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">
                      Support the ministry through online giving
                    </p>
                    <Button variant="outline" className="w-full">
                      Give Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your recent participation and engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <activity.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="events" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Upcoming Events
                  </CardTitle>
                  <CardDescription>
                    Events you might be interested in attending
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">{event.location}</p>
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{event.category}</Badge>
                          <Button size="sm" onClick={() => navigate('/events')}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="growth" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Spiritual Growth Journey
                  </CardTitle>
                  <CardDescription>
                    Track your spiritual development and learning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        Growth Goals
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Daily Bible Reading</span>
                          <Badge variant="outline">In Progress</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Weekly Small Group</span>
                          <Badge variant="outline">Completed</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Monthly Service</span>
                          <Badge variant="outline">New</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center">
                        <Award className="h-4 w-4 mr-2" />
                        Achievements
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-primary" />
                          <span className="text-sm">Faithful Giver</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="text-sm">Small Group Regular</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4 text-primary" />
                          <span className="text-sm">Prayer Warrior</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MemberPortal;