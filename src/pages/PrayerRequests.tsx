import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Heart, Clock, CheckCircle, MessageCircle, Search, Filter } from "lucide-react";
import { DynamicScriptureQuote } from "@/components/DynamicScriptureQuote";
import { PrayerUpdates } from "@/components/PrayerUpdates";

interface PrayerRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  privacy_level: string;
  status: string;
  requester_name?: string;
  created_at: string;
  answered_at?: string;
  answer_description?: string;
}

const PrayerRequests = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general",
    privacy_level: "public",
    is_anonymous: false,
    requester_name: "",
    requester_email: ""
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPrayerRequests();
    }
  }, [filter, searchTerm, categoryFilter, user]);

  const fetchPrayerRequests = async () => {
    try {
      let query = supabase
        .from('prayer_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== "all") {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Apply client-side filtering for search and category
      let filteredData = data || [];
      
      if (searchTerm) {
        filteredData = filteredData.filter(request => 
          request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (request.requester_name && request.requester_name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      if (categoryFilter !== "all") {
        filteredData = filteredData.filter(request => request.category === categoryFilter);
      }
      
      setRequests(filteredData);
    } catch (error) {
      console.error('Error fetching prayer requests:', error);
      toast({
        title: "Error",
        description: "Failed to load prayer requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const requestData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        privacy_level: formData.privacy_level,
        is_anonymous: formData.is_anonymous,
        requester_id: user?.id,
        requester_name: formData.is_anonymous ? null : (formData.requester_name || user?.email),
        requester_email: formData.is_anonymous ? null : (formData.requester_email || user?.email)
      };

      const { error } = await supabase
        .from('prayer_requests')
        .insert([requestData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Prayer request submitted successfully",
      });

      setFormData({
        title: "",
        description: "",
        category: "general",
        privacy_level: "public",
        is_anonymous: false,
        requester_name: "",
        requester_email: ""
      });
      setIsDialogOpen(false);
      fetchPrayerRequests();
    } catch (error) {
      console.error('Error submitting prayer request:', error);
      toast({
        title: "Error",
        description: "Failed to submit prayer request",
        variant: "destructive",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      general: "bg-blue-100 text-blue-800",
      healing: "bg-green-100 text-green-800",
      family: "bg-purple-100 text-purple-800",
      ministry: "bg-orange-100 text-orange-800",
      guidance: "bg-indigo-100 text-indigo-800"
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: "bg-yellow-100 text-yellow-800",
      answered: "bg-green-100 text-green-800",
      ongoing: "bg-blue-100 text-blue-800"
    };
    return colors[status as keyof typeof colors] || colors.open;
  };

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
          <div className="text-center">Loading prayer requests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        
        <DynamicScriptureQuote 
          variant="random"
          theme="faith"
        />
        
        <div className="mt-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Prayer Requests</h1>
            <p className="text-muted-foreground">Submit and view prayer requests from our community</p>
          </div>
          
          
          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search prayer requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="healing">Healing</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="ministry">Ministry</SelectItem>
                <SelectItem value="guidance">Guidance</SelectItem>
              </SelectContent>
            </Select>
            
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="answered">Answered</SelectItem>
              </SelectContent>
            </Select>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Submit Prayer Request</DialogTitle>
                  <DialogDescription>
                    Share your prayer request with our community
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Brief title for your prayer request"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Please share the details of your prayer request"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="healing">Healing</SelectItem>
                          <SelectItem value="family">Family</SelectItem>
                          <SelectItem value="ministry">Ministry</SelectItem>
                          <SelectItem value="guidance">Guidance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="privacy">Privacy Level</Label>
                      <Select 
                        value={formData.privacy_level} 
                        onValueChange={(value) => setFormData({ ...formData, privacy_level: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="members">Members Only</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="anonymous"
                      checked={formData.is_anonymous}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_anonymous: checked })}
                    />
                    <Label htmlFor="anonymous">Submit anonymously</Label>
                  </div>

                  {!formData.is_anonymous && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="requester_name">Your Name</Label>
                        <Input
                          id="requester_name"
                          value={formData.requester_name}
                          onChange={(e) => setFormData({ ...formData, requester_name: e.target.value })}
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="requester_email">Your Email</Label>
                        <Input
                          id="requester_email"
                          type="email"
                          value={formData.requester_email}
                          onChange={(e) => setFormData({ ...formData, requester_email: e.target.value })}
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Submit Request</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          </div>
          </div>
        </div>

        <div className="grid gap-6">
          {requests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No prayer requests found</h3>
                <p className="text-muted-foreground">Be the first to submit a prayer request</p>
              </CardContent>
            </Card>
          ) : (
            requests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{request.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge className={getCategoryColor(request.category)}>
                          {request.category}
                        </Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status === 'answered' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {request.status === 'ongoing' && <Clock className="h-3 w-3 mr-1" />}
                          {request.status}
                        </Badge>
                        <Badge variant="outline">
                          {request.privacy_level}
                        </Badge>
                      </div>
                      {request.requester_name && (
                        <CardDescription>
                          Requested by {request.requester_name}
                        </CardDescription>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-4">{request.description}</p>
                  
                  {request.status === 'answered' && request.answer_description && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Prayer Answered
                      </h4>
                      <p className="text-green-800">{request.answer_description}</p>
                      {request.answered_at && (
                        <p className="text-green-600 text-sm mt-2">
                          Answered on {new Date(request.answered_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {/* Prayer Updates Section */}
                  <div className="mt-6 pt-4 border-t">
                    <PrayerUpdates 
                      prayerRequestId={request.id}
                      onUpdateAdded={fetchPrayerRequests}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PrayerRequests;