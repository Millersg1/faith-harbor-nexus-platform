import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Music, Users, Clock, Plus, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface ServicePlan {
  id: string;
  service_date: string;
  service_type: string;
  theme?: string;
  scripture_reading?: string;
  sermon_title?: string;
  sermon_speaker?: string;
  worship_leader?: string;
  tech_lead?: string;
  notes?: string;
  status: string;
  created_at: string;
}

interface ServiceElement {
  id: string;
  service_plan_id: string;
  element_type: string;
  title: string;
  duration_minutes?: number;
  order_index: number;
  notes?: string;
  assigned_to?: string;
}

interface Team {
  id: string;
  name: string;
  description?: string;
  team_type: string;
  leader_id?: string;
  status: string;
}

const ServicePlanning = () => {
  const [servicePlans, setServicePlans] = useState<ServicePlan[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isElementDialogOpen, setIsElementDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServicePlan | null>(null);
  const [serviceElements, setServiceElements] = useState<ServiceElement[]>([]);
  const [serviceForm, setServiceForm] = useState({
    service_date: "",
    service_type: "sunday_morning",
    theme: "",
    scripture_reading: "",
    sermon_title: "",
    sermon_speaker: "",
    notes: ""
  });
  const [elementForm, setElementForm] = useState({
    element_type: "song",
    title: "",
    duration_minutes: "",
    notes: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesResult, teamsResult] = await Promise.all([
        supabase.from("service_plans").select("*").order("service_date", { ascending: false }),
        supabase.from("teams").select("*").eq("status", "active")
      ]);

      if (servicesResult.error) throw servicesResult.error;
      if (teamsResult.error) throw teamsResult.error;

      setServicePlans(servicesResult.data || []);
      setTeams(teamsResult.data || []);
    } catch (error) {
      console.error("Error fetching service planning data:", error);
      toast({
        title: "Error",
        description: "Failed to load service planning data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceElements = async (servicePlanId: string) => {
    try {
      const { data, error } = await supabase
        .from("service_elements")
        .select("*")
        .eq("service_plan_id", servicePlanId)
        .order("order_index", { ascending: true });

      if (error) throw error;
      setServiceElements(data || []);
    } catch (error) {
      console.error("Error fetching service elements:", error);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from("service_plans")
        .insert({
          service_date: serviceForm.service_date,
          service_type: serviceForm.service_type,
          theme: serviceForm.theme || null,
          scripture_reading: serviceForm.scripture_reading || null,
          sermon_title: serviceForm.sermon_title || null,
          sermon_speaker: serviceForm.sermon_speaker || null,
          notes: serviceForm.notes || null,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service plan created successfully",
      });

      setServiceForm({
        service_date: "",
        service_type: "sunday_morning",
        theme: "",
        scripture_reading: "",
        sermon_title: "",
        sermon_speaker: "",
        notes: ""
      });
      setIsServiceDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error creating service plan:", error);
      toast({
        title: "Error",
        description: "Failed to create service plan",
        variant: "destructive",
      });
    }
  };

  const handleAddElement = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService) return;

    try {
      const { error } = await supabase
        .from("service_elements")
        .insert({
          service_plan_id: selectedService.id,
          element_type: elementForm.element_type,
          title: elementForm.title,
          duration_minutes: elementForm.duration_minutes ? parseInt(elementForm.duration_minutes) : null,
          order_index: serviceElements.length + 1,
          notes: elementForm.notes || null,
          assigned_to: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service element added successfully",
      });

      setElementForm({
        element_type: "song",
        title: "",
        duration_minutes: "",
        notes: ""
      });
      setIsElementDialogOpen(false);
      fetchServiceElements(selectedService.id);
    } catch (error) {
      console.error("Error adding service element:", error);
      toast({
        title: "Error",
        description: "Failed to add service element",
        variant: "destructive",
      });
    }
  };

  const updateServiceStatus = async (serviceId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("service_plans")
        .update({ status: newStatus })
        .eq("id", serviceId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service status updated successfully",
      });

      fetchData();
    } catch (error) {
      console.error("Error updating service status:", error);
      toast({
        title: "Error",
        description: "Failed to update service status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'song':
        return <Music className="h-4 w-4" />;
      case 'prayer':
        return <Users className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

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
          <h1 className="text-3xl font-bold">Service Planning</h1>
          <p className="text-muted-foreground">Plan and coordinate worship services</p>
        </div>
        <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Service Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Service Plan</DialogTitle>
              <DialogDescription>
                Plan a new worship service with all the details.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateService} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="service_date">Service Date</Label>
                  <Input
                    id="service_date"
                    type="datetime-local"
                    value={serviceForm.service_date}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, service_date: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service_type">Service Type</Label>
                  <select
                    id="service_type"
                    value={serviceForm.service_type}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, service_type: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="sunday_morning">Sunday Morning</option>
                    <option value="sunday_evening">Sunday Evening</option>
                    <option value="wednesday_night">Wednesday Night</option>
                    <option value="special_event">Special Event</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Input
                  id="theme"
                  value={serviceForm.theme}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, theme: e.target.value }))}
                  placeholder="Service theme or series"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scripture_reading">Scripture Reading</Label>
                <Input
                  id="scripture_reading"
                  value={serviceForm.scripture_reading}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, scripture_reading: e.target.value }))}
                  placeholder="e.g., John 3:16-21"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sermon_title">Sermon Title</Label>
                  <Input
                    id="sermon_title"
                    value={serviceForm.sermon_title}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, sermon_title: e.target.value }))}
                    placeholder="Sermon title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sermon_speaker">Speaker</Label>
                  <Input
                    id="sermon_speaker"
                    value={serviceForm.sermon_speaker}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, sermon_speaker: e.target.value }))}
                    placeholder="Speaker name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={serviceForm.notes}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes or instructions..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsServiceDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Service Plan</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList>
          <TabsTrigger value="services">Service Plans</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <div className="space-y-4">
            {servicePlans.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No service plans found</h3>
                  <p className="text-muted-foreground text-center">
                    Create your first service plan using the button above.
                  </p>
                </CardContent>
              </Card>
            ) : (
              servicePlans.map((service) => (
                <Card key={service.id} className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => {
                    setSelectedService(service);
                    fetchServiceElements(service.id);
                  }}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          <Calendar className="mr-2 h-5 w-5" />
                          {format(new Date(service.service_date), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {service.service_type.replace('_', ' ').toUpperCase()}
                        </p>
                        {service.theme && (
                          <p className="text-sm font-medium mt-2">Theme: {service.theme}</p>
                        )}
                        {service.sermon_title && (
                          <p className="text-sm text-muted-foreground">
                            Sermon: {service.sermon_title}
                            {service.sermon_speaker && ` by ${service.sermon_speaker}`}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getStatusColor(service.status)}>
                          {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                        </Badge>
                        <div className="flex space-x-1">
                          {service.status === 'planning' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateServiceStatus(service.id, 'ready');
                              }}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Mark Ready
                            </Button>
                          )}
                          {service.status === 'ready' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateServiceStatus(service.id, 'completed');
                              }}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  {service.scripture_reading && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Scripture: {service.scripture_reading}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="teams">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No teams found</h3>
                  <p className="text-muted-foreground text-center">
                    Contact an administrator to set up ministry teams.
                  </p>
                </CardContent>
              </Card>
            ) : (
              teams.map((team) => (
                <Card key={team.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5" />
                      {team.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {team.team_type.replace('_', ' ').toUpperCase()}
                    </p>
                  </CardHeader>
                  {team.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{team.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Service Elements Dialog */}
      {selectedService && (
        <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>
                Service Elements - {format(new Date(selectedService.service_date), "MMMM d, yyyy")}
              </DialogTitle>
              <DialogDescription>
                Manage the order and details of service elements.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Service Elements</h4>
                <Dialog open={isElementDialogOpen} onOpenChange={setIsElementDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-3 w-3" />
                      Add Element
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Service Element</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddElement} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="element_type">Element Type</Label>
                        <select
                          id="element_type"
                          value={elementForm.element_type}
                          onChange={(e) => setElementForm(prev => ({ ...prev, element_type: e.target.value }))}
                          className="w-full p-2 border rounded-md"
                          required
                        >
                          <option value="song">Song</option>
                          <option value="prayer">Prayer</option>
                          <option value="reading">Scripture Reading</option>
                          <option value="announcement">Announcement</option>
                          <option value="offering">Offering</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="element_title">Title</Label>
                        <Input
                          id="element_title"
                          value={elementForm.title}
                          onChange={(e) => setElementForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Element title"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                        <Input
                          id="duration_minutes"
                          type="number"
                          value={elementForm.duration_minutes}
                          onChange={(e) => setElementForm(prev => ({ ...prev, duration_minutes: e.target.value }))}
                          placeholder="5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="element_notes">Notes</Label>
                        <Textarea
                          id="element_notes"
                          value={elementForm.notes}
                          onChange={(e) => setElementForm(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Additional notes..."
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsElementDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Add Element</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {serviceElements.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No service elements added yet. Click "Add Element" to get started.
                  </p>
                ) : (
                  serviceElements.map((element, index) => (
                    <div key={element.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <span className="text-sm font-medium text-muted-foreground w-6">
                        {index + 1}.
                      </span>
                      {getElementIcon(element.element_type)}
                      <div className="flex-1">
                        <p className="font-medium">{element.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {element.element_type.charAt(0).toUpperCase() + element.element_type.slice(1)}
                          {element.duration_minutes && ` • ${element.duration_minutes} min`}
                        </p>
                        {element.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{element.notes}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ServicePlanning;