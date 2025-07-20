import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Plus, CheckCircle, Heart } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { CreateBereavementCareDialog } from "./CreateBereavementCareDialog";

interface BereavementCare {
  id: string;
  care_type: string;
  description: string | null;
  scheduled_date: string | null;
  completed_date: string | null;
  status: string;
  created_at: string;
  memorial: {
    deceased_name: string;
  } | null;
}

export function BereavementCareSection() {
  const [careItems, setCareItems] = useState<BereavementCare[]>([]);
  const [isCreateCareOpen, setIsCreateCareOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBereavementCare();
  }, []);

  const fetchBereavementCare = async () => {
    try {
      const { data, error } = await supabase
        .from('bereavement_care')
        .select(`
          *,
          memorial:memorials(deceased_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCareItems(data || []);
    } catch (error) {
      console.error('Error fetching bereavement care:', error);
      toast({
        title: "Error",
        description: "Failed to load bereavement care items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkCompleted = async (careId: string) => {
    try {
      const { error } = await supabase
        .from('bereavement_care')
        .update({
          completed_date: new Date().toISOString(),
          status: 'completed'
        })
        .eq('id', careId);

      if (error) throw error;

      fetchBereavementCare();
      toast({
        title: "Success",
        description: "Care item marked as completed",
      });
    } catch (error) {
      console.error('Error updating care item:', error);
      toast({
        title: "Error",
        description: "Failed to update care item",
        variant: "destructive",
      });
    }
  };

  const getCareTypeColor = (type: string) => {
    switch (type) {
      case 'pastoral_visit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'meal_train': return 'bg-green-100 text-green-800 border-green-200';
      case 'transportation': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'childcare': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'other': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCareType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleCareCreated = () => {
    setIsCreateCareOpen(false);
    fetchBereavementCare();
    toast({
      title: "Success",
      description: "Bereavement care item created successfully",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-2"></div>
          <div className="h-4 bg-muted rounded w-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Bereavement Care Coordination</h2>
          <p className="text-muted-foreground">Organize and track care for grieving families</p>
        </div>
        <Button onClick={() => setIsCreateCareOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Care Item
        </Button>
      </div>

      {careItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Care Items Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start coordinating bereavement care for families in need
            </p>
            <Button onClick={() => setIsCreateCareOpen(true)} variant="outline">
              Add Care Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {careItems.map((care) => (
            <Card key={care.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge className={getCareTypeColor(care.care_type)}>
                    {formatCareType(care.care_type)}
                  </Badge>
                  <Badge className={getStatusColor(care.status)}>
                    {care.status.replace('_', ' ')}
                  </Badge>
                </div>
                {care.memorial && (
                  <CardTitle className="text-lg">For {care.memorial.deceased_name} Family</CardTitle>
                )}
                {care.description && (
                  <CardDescription className="line-clamp-2">{care.description}</CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {care.scheduled_date && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      Scheduled: {format(new Date(care.scheduled_date), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                  )}
                  
                  {care.completed_date && (
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed: {format(new Date(care.completed_date), "MMM d, yyyy")}
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    Created: {format(new Date(care.created_at), "MMM d, yyyy")}
                  </div>
                </div>

                {care.status !== 'completed' && (
                  <Button
                    onClick={() => handleMarkCompleted(care.id)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Completed
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateBereavementCareDialog
        open={isCreateCareOpen}
        onOpenChange={setIsCreateCareOpen}
        onCareCreated={handleCareCreated}
      />
    </div>
  );
}