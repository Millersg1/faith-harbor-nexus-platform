import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, Users, DollarSign, Heart, TrendingUp, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsData {
  attendance: Array<{ date: string; count: number }>;
  donations: Array<{ month: string; amount: number }>;
  prayerRequests: Array<{ category: string; count: number }>;
  memberGrowth: Array<{ month: string; members: number }>;
  engagement: Array<{ activity: string; count: number }>;
}

export const AdvancedAnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const { toast } = useToast();

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Get attendance data
      const { data: attendanceData } = await supabase
        .from('attendance_records')
        .select('attendance_date, total_count')
        .order('attendance_date', { ascending: true })
        .limit(20);

      // Get donation data (last 12 months)
      const { data: donationData } = await supabase
        .from('donations')
        .select('amount, created_at')
        .eq('status', 'completed')
        .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());

      // Get prayer request categories
      const { data: prayerData } = await supabase
        .from('prayer_requests')
        .select('category')
        .eq('status', 'open');

      // Get user activity logs for engagement
      const { data: activityData } = await supabase
        .from('user_activity_logs')
        .select('activity_type, created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Process data for charts
      const processedData: AnalyticsData = {
        attendance: attendanceData?.map(record => ({
          date: new Date(record.attendance_date).toLocaleDateString(),
          count: record.total_count
        })) || [],

        donations: processDonationsByMonth(donationData || []),
        prayerRequests: processPrayerRequestsByCategory(prayerData || []),
        memberGrowth: generateMemberGrowthData(),
        engagement: processEngagementData(activityData || [])
      };

      setAnalyticsData(processedData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Error Loading Analytics",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processDonationsByMonth = (donations: any[]) => {
    const monthlyTotals = donations.reduce((acc, donation) => {
      const month = new Date(donation.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
      const amount = typeof donation.amount === 'number' ? donation.amount : 0;
      acc[month] = (acc[month] || 0) + (amount / 100); // Convert cents to dollars
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthlyTotals).map(([month, amount]) => ({
      month,
      amount: Number(amount)
    }));
  };

  const processPrayerRequestsByCategory = (prayers: any[]) => {
    const categoryCounts = prayers.reduce((acc, prayer) => {
      const category = prayer.category || 'general';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts).map(([category, count]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      count: Number(count)
    }));
  };

  const generateMemberGrowthData = () => {
    // Mock member growth data - in real implementation, track member registration dates
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      members: 150 + (index * 25) + Math.floor(Math.random() * 20)
    }));
  };

  const processEngagementData = (activities: any[]) => {
    const activityCounts = activities.reduce((acc, activity) => {
      const type = activity.activity_type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(activityCounts)
      .sort(([,a], [,b]) => Number(b) - Number(a))
      .slice(0, 5)
      .map(([activity, count]) => ({ activity, count: Number(count) }));
  };

  const exportAnalytics = () => {
    if (!analyticsData) return;

    const exportData = {
      generated_at: new Date().toISOString(),
      period: selectedPeriod,
      data: analyticsData
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Analytics Exported",
      description: "Analytics data has been downloaded",
    });
  };

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88'];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Advanced Analytics</h2>
          <p className="text-muted-foreground">Comprehensive insights into your church's activities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportAnalytics}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Attendance</p>
                <p className="text-2xl font-bold">
                  {Math.round(analyticsData.attendance.reduce((sum, item) => sum + item.count, 0) / analyticsData.attendance.length || 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Donations</p>
                <p className="text-2xl font-bold">
                  ${analyticsData.donations.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prayer Requests</p>
                <p className="text-2xl font-bold">
                  {analyticsData.prayerRequests.reduce((sum, item) => sum + item.count, 0)}
                </p>
              </div>
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Member Growth</p>
                <p className="text-2xl font-bold">
                  +{analyticsData.memberGrowth[analyticsData.memberGrowth.length - 1]?.members - analyticsData.memberGrowth[0]?.members || 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trends</CardTitle>
            <CardDescription>Weekly attendance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.attendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Donations</CardTitle>
            <CardDescription>Donation amounts by month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.donations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                <Area type="monotone" dataKey="amount" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prayer Request Categories</CardTitle>
            <CardDescription>Distribution of prayer request types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.prayerRequests}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analyticsData.prayerRequests.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <CardDescription>Most common user activities</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.engagement} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="activity" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Member Growth Timeline</CardTitle>
          <CardDescription>Membership growth over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.memberGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="members" stroke="#ff7300" fill="#ff7300" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};