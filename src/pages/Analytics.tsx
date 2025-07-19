import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, DollarSign, Calendar, Mail, Eye } from "lucide-react";
import AuthenticatedNavigation from "@/components/AuthenticatedNavigation";

const Analytics = () => {
  const [donationStats, setDonationStats] = useState<any[]>([]);
  const [memberStats, setMemberStats] = useState<any[]>([]);
  const [eventStats, setEventStats] = useState<any[]>([]);
  const [emailStats, setEmailStats] = useState<any[]>([]);
  const [overview, setOverview] = useState({
    totalDonations: 0,
    totalMembers: 0,
    totalEvents: 0,
    totalEmails: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Donation analytics
      const { data: donations } = await supabase
        .from('donations')
        .select('amount, created_at, status')
        .eq('status', 'completed');

      // Member analytics
      const { data: members } = await supabase
        .from('profiles')
        .select('created_at, member_status');

      // Event analytics
      const { data: events } = await supabase
        .from('events')
        .select('created_at, category, status');

      // Email campaign analytics
      const { data: emails } = await supabase
        .from('email_campaigns')
        .select('created_at, status, recipient_count, open_count');

      if (donations) {
        const monthlyDonations = donations.reduce((acc: any, donation) => {
          const month = new Date(donation.created_at).toLocaleString('default', { month: 'short' });
          acc[month] = (acc[month] || 0) + (donation.amount / 100);
          return acc;
        }, {});

        setDonationStats(Object.entries(monthlyDonations).map(([month, amount]) => ({
          month,
          amount
        })));

        setOverview(prev => ({ ...prev, totalDonations: donations.reduce((sum, d) => sum + (d.amount / 100), 0) }));
      }

      if (members) {
        const monthlyMembers = members.reduce((acc: any, member) => {
          const month = new Date(member.created_at).toLocaleString('default', { month: 'short' });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});

        setMemberStats(Object.entries(monthlyMembers).map(([month, count]) => ({
          month,
          count
        })));

        setOverview(prev => ({ ...prev, totalMembers: members.length }));
      }

      if (events) {
        const eventsByCategory = events.reduce((acc: any, event) => {
          const category = event.category || 'general';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        setEventStats(Object.entries(eventsByCategory).map(([category, count]) => ({
          category,
          count
        })));

        setOverview(prev => ({ ...prev, totalEvents: events.length }));
      }

      if (emails) {
        setEmailStats(emails.map(email => ({
          title: email.created_at,
          sent: email.recipient_count || 0,
          opened: email.open_count || 0,
          rate: email.recipient_count ? ((email.open_count || 0) / email.recipient_count * 100) : 0
        })));

        setOverview(prev => ({ ...prev, totalEmails: emails.length }));
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNavigation />
      
      <div className="container mx-auto p-6 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your ministry's growth and engagement</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${overview.totalDonations.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All time contributions</p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.totalMembers}</div>
              <p className="text-xs text-muted-foreground">Registered members</p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.totalEvents}</div>
              <p className="text-xs text-muted-foreground">Events created</p>
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Email Campaigns</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overview.totalEmails}</div>
              <p className="text-xs text-muted-foreground">Campaigns sent</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="donations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="emails">Email Marketing</TabsTrigger>
          </TabsList>

          <TabsContent value="donations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Donation Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={donationStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Member Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={memberStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Events by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={eventStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {eventStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emails" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={emailStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sent" fill="hsl(var(--primary))" name="Sent" />
                    <Bar dataKey="opened" fill="hsl(var(--secondary))" name="Opened" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;