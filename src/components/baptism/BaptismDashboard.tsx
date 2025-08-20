import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, Award, BookOpen, Plus, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CreateBaptismDialog } from './CreateBaptismDialog';
import { BaptismScheduleCalendar } from './BaptismScheduleCalendar';
import { PreparationSessionManager } from './PreparationSessionManager';
import { CertificateManager } from './CertificateManager';

interface Baptism {
  id: string;
  candidate_name: string;
  candidate_email: string;
  baptism_date: string;
  sacrament_type: string;
  baptism_method: string;
  location: string;
  status: string;
  preparation_completed: boolean;
  certificate_issued: boolean;
  created_at: string;
}

export const BaptismDashboard: React.FC = () => {
  const [baptisms, setBaptisms] = useState<Baptism[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    loadBaptisms();
  }, []);

  const loadBaptisms = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('baptisms')
        .select('*')
        .order('baptism_date', { ascending: true });

      if (error) throw error;
      setBaptisms(data || []);
    } catch (error) {
      console.error('Error loading baptisms:', error);
      toast({
        title: "Error",
        description: "Failed to load baptism records",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'postponed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSacramentIcon = (type: string) => {
    switch (type) {
      case 'baptism': return '💧';
      case 'confirmation': return '✋';
      case 'communion': return '🍞';
      case 'dedication': return '🙏';
      case 'blessing': return '✨';
      default: return '⛪';
    }
  };

  const upcomingBaptisms = baptisms.filter(b => 
    new Date(b.baptism_date) > new Date() && b.status === 'scheduled'
  );
  
  const completedBaptisms = baptisms.filter(b => b.status === 'completed');
  const pendingPreparation = baptisms.filter(b => !b.preparation_completed && b.status === 'scheduled');
  const pendingCertificates = baptisms.filter(b => !b.certificate_issued && b.status === 'completed');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Baptism & Sacraments</h1>
          <p className="text-muted-foreground">Manage baptisms, confirmations, and sacramental records</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Baptism
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Baptisms</p>
                <p className="text-2xl font-bold">{upcomingBaptisms.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Completed</p>
                <p className="text-2xl font-bold">{completedBaptisms.length}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Preparation</p>
                <p className="text-2xl font-bold">{pendingPreparation.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Certificates</p>
                <p className="text-2xl font-bold">{pendingCertificates.length}</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="preparation">Preparation</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {baptisms.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Baptisms Scheduled</h3>
                <p className="text-muted-foreground mb-4">
                  Start by scheduling your first baptism or sacrament
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule First Baptism
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {baptisms.slice(0, 6).map((baptism) => (
                <Card key={baptism.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getSacramentIcon(baptism.sacrament_type)}</span>
                        <CardTitle className="text-lg">{baptism.candidate_name}</CardTitle>
                      </div>
                      <Badge className={getStatusColor(baptism.status)}>
                        {baptism.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {baptism.sacrament_type.charAt(0).toUpperCase() + baptism.sacrament_type.slice(1)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p><strong>Date:</strong> {new Date(baptism.baptism_date).toLocaleDateString()}</p>
                      <p><strong>Location:</strong> {baptism.location}</p>
                      {baptism.baptism_method && (
                        <p><strong>Method:</strong> {baptism.baptism_method}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-3">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span className={baptism.preparation_completed ? 'text-green-600' : 'text-orange-600'}>
                            {baptism.preparation_completed ? 'Complete' : 'Pending'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="h-4 w-4" />
                          <span className={baptism.certificate_issued ? 'text-green-600' : 'text-gray-500'}>
                            {baptism.certificate_issued ? 'Issued' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="schedule">
          <BaptismScheduleCalendar baptisms={baptisms} onRefresh={loadBaptisms} />
        </TabsContent>

        <TabsContent value="preparation">
          <PreparationSessionManager onRefresh={loadBaptisms} />
        </TabsContent>

        <TabsContent value="certificates">
          <CertificateManager onRefresh={loadBaptisms} />
        </TabsContent>
      </Tabs>

      <CreateBaptismDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onBaptismCreated={loadBaptisms}
      />
    </div>
  );
};