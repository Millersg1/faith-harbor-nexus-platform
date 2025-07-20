import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Heart, Clock, Users, MapPin, Calendar, AlertCircle, Search, Plus } from "lucide-react";

interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  department: string;
  skills_needed: string[];
  time_commitment: string;
  schedule_type: string;
  location: string;
  start_date: string;
  end_date: string;
  max_volunteers: number;
  current_volunteers: number;
  is_urgent: boolean;
  application_deadline: string;
  requirements: string;
  status: string;
}

interface VolunteerApplication {
  id: string;
  opportunity_id: string;
  status: string;
  applied_at: string;
  application_message: string;
}

const Volunteers = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<VolunteerOpportunity | null>(null);
  const [applicationForm, setApplicationForm] = useState({
    application_message: "",
    availability: "",
    relevant_experience: ""
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchOpportunities();
      fetchUserApplications();
    }
  }, [user]);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from('volunteer_opportunities' as any)
        .select('*')
        .eq('status', 'active')
        .order('is_urgent', { ascending: false })
        .order('application_deadline');

      if (error) throw error;
      setOpportunities(data as any || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast({
        title: "Error",
        description: "Failed to load volunteer opportunities",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserApplications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('volunteer_applications' as any)
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setApplications(data as any || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedOpportunity) {
      toast({
        title: "Error",
        description: "Please sign in to apply",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('volunteer_applications' as any)
        .insert([{
          opportunity_id: selectedOpportunity.id,
          user_id: user.id,
          application_message: applicationForm.application_message,
          availability: applicationForm.availability,
          relevant_experience: applicationForm.relevant_experience
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application submitted successfully!",
      });

      setApplicationForm({
        application_message: "",
        availability: "",
        relevant_experience: ""
      });
      setIsDialogOpen(false);
      setSelectedOpportunity(null);
      fetchUserApplications();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive",
      });
    }
  };

  const hasUserApplied = (opportunityId: string) => {
    return applications.some(app => app.opportunity_id === opportunityId);
  };

  const getUserApplication = (opportunityId: string) => {
    return applications.find(app => app.opportunity_id === opportunityId);
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

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const isDeadlineSoon = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || opp.department === departmentFilter;
    const matchesTime = timeFilter === "all" || opp.schedule_type === timeFilter;
    
    return matchesSearch && matchesDepartment && matchesTime;
  });

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading volunteer opportunities...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Volunteer Opportunities</h1>
          <p className="text-muted-foreground">Make a difference by volunteering in our various ministry areas</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="worship">Worship</SelectItem>
              <SelectItem value="children">Children's Ministry</SelectItem>
              <SelectItem value="youth">Youth Ministry</SelectItem>
              <SelectItem value="outreach">Outreach</SelectItem>
              <SelectItem value="hospitality">Hospitality</SelectItem>
              <SelectItem value="admin">Administration</SelectItem>
              <SelectItem value="media">Media & Tech</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Schedule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schedules</SelectItem>
              <SelectItem value="one_time">One Time</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="flexible">Flexible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Opportunities Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredOpportunities.length === 0 ? (
            <div className="col-span-full">
              <Card>
                <CardContent className="text-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No opportunities found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredOpportunities.map((opportunity) => {
              const userApplication = getUserApplication(opportunity.id);
              const hasApplied = hasUserApplied(opportunity.id);
              const deadlineSoon = isDeadlineSoon(opportunity.application_deadline);

              return (
                <Card key={opportunity.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {opportunity.title}
                          {opportunity.is_urgent && (
                            <Badge className="ml-2 bg-red-100 text-red-800">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className={getDepartmentColor(opportunity.department)}>
                            {opportunity.department}
                          </Badge>
                          <Badge variant="outline">
                            {opportunity.schedule_type.replace('_', ' ')}
                          </Badge>
                          {deadlineSoon && (
                            <Badge className="bg-orange-100 text-orange-800">
                              <Clock className="h-3 w-3 mr-1" />
                              Deadline Soon
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">
                      {opportunity.description}
                    </CardDescription>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        {opportunity.time_commitment}
                      </div>
                      
                      {opportunity.location && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          {opportunity.location}
                        </div>
                      )}

                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        {opportunity.current_volunteers}/{opportunity.max_volunteers} volunteers
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        Apply by {new Date(opportunity.application_deadline).toLocaleDateString()}
                      </div>
                    </div>

                    {opportunity.skills_needed && opportunity.skills_needed.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-sm mb-2">Skills Needed:</h4>
                        <div className="flex flex-wrap gap-1">
                          {opportunity.skills_needed.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {opportunity.requirements && (
                      <div className="mb-4 p-3 bg-muted rounded-lg">
                        <h4 className="font-medium text-sm mb-1">Requirements:</h4>
                        <p className="text-sm text-muted-foreground">{opportunity.requirements}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      {hasApplied ? (
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(userApplication?.status || 'pending')}>
                            {userApplication?.status || 'pending'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Applied {new Date(userApplication?.applied_at || '').toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => {
                            setSelectedOpportunity(opportunity);
                            setIsDialogOpen(true);
                          }}
                          disabled={opportunity.current_volunteers >= opportunity.max_volunteers}
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {opportunity.current_volunteers >= opportunity.max_volunteers ? 'Full' : 'Apply'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Application Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Apply for Volunteer Position</DialogTitle>
              <DialogDescription>
                {selectedOpportunity?.title}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <Label htmlFor="application_message">Why do you want to volunteer for this position?</Label>
                <Textarea
                  id="application_message"
                  value={applicationForm.application_message}
                  onChange={(e) => setApplicationForm({ ...applicationForm, application_message: e.target.value })}
                  placeholder="Share your motivation and what you hope to contribute..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="availability">What is your availability?</Label>
                <Textarea
                  id="availability"
                  value={applicationForm.availability}
                  onChange={(e) => setApplicationForm({ ...applicationForm, availability: e.target.value })}
                  placeholder="Please describe when you're available (days, times, frequency)..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="relevant_experience">Relevant Experience</Label>
                <Textarea
                  id="relevant_experience"
                  value={applicationForm.relevant_experience}
                  onChange={(e) => setApplicationForm({ ...applicationForm, relevant_experience: e.target.value })}
                  placeholder="Any relevant experience or skills that would help in this role..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Application</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Volunteers;