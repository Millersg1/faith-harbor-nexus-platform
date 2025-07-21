import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Calendar,
  Trophy,
  TrendingUp
} from "lucide-react";
import { format } from "date-fns";

interface VolunteerApplication {
  id: string;
  opportunity_id: string;
  status: string;
  applied_at: string;
  responded_at: string | null;
  hours_completed: number;
  application_message: string;
  availability: string;
  relevant_experience: string;
  response_message: string | null;
  volunteer_opportunities: {
    title: string;
    department: string;
    time_commitment: string;
    location: string;
  };
}

interface VolunteerStats {
  totalApplications: number;
  approvedApplications: number;
  pendingApplications: number;
  totalHours: number;
  currentPositions: number;
}

export const VolunteerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [stats, setStats] = useState<VolunteerStats>({
    totalApplications: 0,
    approvedApplications: 0,
    pendingApplications: 0,
    totalHours: 0,
    currentPositions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserApplications();
    }
  }, [user]);

  const fetchUserApplications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('volunteer_applications')
        .select(`
          *,
          volunteer_opportunities (
            title,
            department,
            time_commitment,
            location
          )
        `)
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;

      const apps = data as VolunteerApplication[] || [];
      setApplications(apps);

      // Calculate stats
      const stats = {
        totalApplications: apps.length,
        approvedApplications: apps.filter(app => app.status === 'approved').length,
        pendingApplications: apps.filter(app => app.status === 'pending').length,
        totalHours: apps.reduce((sum, app) => sum + (app.hours_completed || 0), 0),
        currentPositions: apps.filter(app => app.status === 'approved').length
      };
      setStats(stats);

    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load volunteer applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return "bg-green-100 text-green-800";
      case 'rejected':
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getDepartmentColor = (department: string) => {
    const colors = {
      "worship": "bg-purple-100 text-purple-800",
      "children": "bg-green-100 text-green-800",
      "youth": "bg-blue-100 text-blue-800",
      "outreach": "bg-orange-100 text-orange-800",
      "hospitality": "bg-pink-100 text-pink-800",
      "admin": "bg-gray-100 text-gray-800",
      "media": "bg-indigo-100 text-indigo-800"
    };
    return colors[department as keyof typeof colors] || colors.admin;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">Loading volunteer dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Volunteer Dashboard</h1>
        <p className="text-muted-foreground">Track your volunteer applications and service hours</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              Volunteer positions applied for
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Positions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentPositions}</div>
            <p className="text-xs text-muted-foreground">
              Active volunteer roles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}</div>
            <p className="text-xs text-muted-foreground">
              Hours volunteered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Apps</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="active">Active Positions</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-6">
          {applications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't applied for any volunteer positions yet
                </p>
                <Button onClick={() => navigate('/volunteers')}>
                  Browse Opportunities
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {applications.map((application) => (
                <Card key={application.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {application.volunteer_opportunities.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className={getDepartmentColor(application.volunteer_opportunities.department)}>
                            {application.volunteer_opportunities.department}
                          </Badge>
                          <Badge className={getStatusColor(application.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(application.status)}
                              {application.status}
                            </span>
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Applied {format(new Date(application.applied_at), 'MMM d, yyyy')}
                        </p>
                        {application.responded_at && (
                          <p className="text-sm text-muted-foreground">
                            Response {format(new Date(application.responded_at), 'MMM d, yyyy')}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {application.volunteer_opportunities.time_commitment}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {application.volunteer_opportunities.location}
                      </div>
                    </div>

                    {application.hours_completed > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Trophy className="h-4 w-4 text-yellow-600" />
                        <span>{application.hours_completed} hours completed</span>
                      </div>
                    )}

                    {application.response_message && (
                      <div className="p-3 bg-muted rounded-lg">
                        <h4 className="font-medium text-sm mb-1">Coordinator Response:</h4>
                        <p className="text-sm text-muted-foreground">
                          {application.response_message}
                        </p>
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <h4 className="font-medium text-sm mb-2">Your Application:</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Motivation:</strong> {application.application_message}
                      </p>
                      {application.availability && (
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Availability:</strong> {application.availability}
                        </p>
                      )}
                      {application.relevant_experience && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Experience:</strong> {application.relevant_experience}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          {applications.filter(app => app.status === 'approved').length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Active Positions</h3>
                <p className="text-muted-foreground">
                  You don't have any approved volunteer positions yet
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {applications
                .filter(app => app.status === 'approved')
                .map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">
                            {application.volunteer_opportunities.title}
                          </CardTitle>
                          <Badge className={getDepartmentColor(application.volunteer_opportunities.department)}>
                            {application.volunteer_opportunities.department}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">Active</span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {application.volunteer_opportunities.time_commitment}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {application.volunteer_opportunities.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-600" />
                          <span>{application.hours_completed || 0} hours served</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Started {format(new Date(application.responded_at!), 'MMM d, yyyy')}
                        </span>
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          <span>Contributing to ministry</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};