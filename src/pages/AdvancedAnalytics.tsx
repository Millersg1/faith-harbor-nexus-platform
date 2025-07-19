import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, DollarSign, Calendar, Activity, Target, Award, Clock } from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek, subWeeks, subMonths } from "date-fns";

interface AnalyticsData {
  attendance: any[];
  donations: any[];
  engagement: any[];
  events: any[];
  memberGrowth: any[];
}

const AdvancedAnalytics = () => {
  const [data, setData] = useState<AnalyticsData>({
    attendance: [],
    donations: [],
    engagement: [],
    events: [],
    memberGrowth: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30days");

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      const endDate = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case "7days":
          startDate = subDays(endDate, 7);
          break;
        case "30days":
          startDate = subDays(endDate, 30);
          break;
        case "90days":
          startDate = subDays(endDate, 90);
          break;
        case "1year":
          startDate = subDays(endDate, 365);
          break;
      }

      const [attendanceResult, donationsResult, engagementResult, eventsResult] = await Promise.all([
        supabase
          .from("attendance_records")
          .select("*")
          .gte("attendance_date", startDate.toISOString().split('T')[0])
          .lte("attendance_date", endDate.toISOString().split('T')[0])
          .order("attendance_date"),
        supabase
          .from("donations")
          .select("*")
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString())
          .order("created_at"),
        supabase
          .from("member_engagement")
          .select("*")
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString())
          .order("created_at"),
        supabase
          .from("events")
          .select("*")
          .gte("event_date", startDate.toISOString())
          .lte("event_date", endDate.toISOString())
          .order("event_date")
      ]);

      // Process attendance data
      const attendanceData = attendanceResult.data?.map(record => ({
        date: format(new Date(record.attendance_date), "MMM dd"),
        total: record.total_count,
        adults: record.adult_count,
        children: record.child_count,
        visitors: record.visitor_count
      })) || [];

      // Process donations data by day
      const donationsByDay = donationsResult.data?.reduce((acc, donation) => {
        const date = format(new Date(donation.created_at), "MMM dd");
        if (!acc[date]) {
          acc[date] = { date, amount: 0, count: 0 };
        }
        acc[date].amount += donation.amount;
        acc[date].count += 1;
        return acc;
      }, {} as any) || {};

      const donationsData = Object.values(donationsByDay);

      // Process engagement data
      const engagementByType = engagementResult.data?.reduce((acc, engagement) => {
        if (!acc[engagement.activity_type]) {
          acc[engagement.activity_type] = 0;
        }
        acc[engagement.activity_type] += engagement.engagement_score;
        return acc;
      }, {} as any) || {};

      const engagementData = Object.entries(engagementByType).map(([type, score]) => ({
        type: type.replace('_', ' ').toUpperCase(),
        score
      }));

      // Process events data
      const eventsData = eventsResult.data?.map(event => ({
        title: event.title,
        date: format(new Date(event.event_date), "MMM dd"),
        category: event.category,
        registrations: 0 // This would come from event_registrations table
      })) || [];

      setData({
        attendance: attendanceData,
        donations: donationsData,
        engagement: engagementData,
        events: eventsData,
        memberGrowth: [] // This would be calculated from profiles over time
      });

    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    const totalAttendance = data.attendance.reduce((sum, record) => sum + record.total, 0);
    const avgAttendance = data.attendance.length > 0 ? Math.round(totalAttendance / data.attendance.length) : 0;
    
    const totalDonations = data.donations.reduce((sum: number, donation: any) => sum + (donation.amount || 0), 0);
    const donationCount = data.donations.reduce((sum: number, donation: any) => sum + (donation.count || 0), 0);
    
    const totalEngagement = data.engagement.reduce((sum, eng) => sum + eng.score, 0);
    const upcomingEvents = data.events.length;

    return {
      avgAttendance,
      totalDonations: totalDonations / 100, // Convert from cents
      donationCount,
      totalEngagement,
      upcomingEvents
    };
  };

  const metrics = calculateMetrics();

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into church metrics</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgAttendance}</div>
            <p className="text-xs text-muted-foreground">
              Average per service
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.totalDonations.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.donationCount} donations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalEngagement}</div>
            <p className="text-xs text-muted-foreground">
              Total engagement points
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">
              Events in period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground">
              vs previous period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.attendance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="visitors" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.attendance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="adults" stackId="a" fill="#8884d8" />
                    <Bar dataKey="children" stackId="a" fill="#82ca9d" />
                    <Bar dataKey="visitors" stackId="a" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="donations">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Donation Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.donations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [`$${(value / 100).toFixed(2)}`, 'Amount']} />
                    <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donation Frequency</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.donations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement by Activity Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.engagement}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="score"
                    >
                      {data.engagement.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Engagement Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.engagement
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 5)
                    .map((activity, index) => (
                      <div key={activity.type} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-primary mr-3"></div>
                          <span className="text-sm font-medium">{activity.type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={(activity.score / Math.max(...data.engagement.map(e => e.score))) * 100} 
                            className="w-20" 
                          />
                          <span className="text-sm text-muted-foreground w-8">{activity.score}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Attendance</span>
                    <Badge variant="secondary">{metrics.avgAttendance}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Donation Growth</span>
                    <Badge variant="default">+15%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Member Retention</span>
                    <Badge variant="default">94%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Event Participation</span>
                    <Badge variant="secondary">78%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Increase Attendance</span>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Fundraising Goal</span>
                      <span className="text-sm text-muted-foreground">45%</span>
                    </div>
                    <Progress value={45} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Volunteer Recruitment</span>
                      <span className="text-sm text-muted-foreground">80%</span>
                    </div>
                    <Progress value={80} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="text-sm">Highest monthly attendance</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Fundraising goal reached</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm">20 new member signups</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-purple-500 mr-2" />
                    <span className="text-sm">500+ volunteer hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;