import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Heart, Calendar, Users, DollarSign, CheckCircle, Clock, Plus, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CreateWeddingDialog } from './CreateWeddingDialog';
import { WeddingTimelineManager } from './WeddingTimelineManager';
import { WeddingGuestManager } from './WeddingGuestManager';
import { WeddingBudgetTracker } from './WeddingBudgetTracker';

interface Wedding {
  id: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  venue_location: string;
  estimated_guests: number;
  budget_amount: number;
  planning_status: string;
  ceremony_type: string;
  reception_location: string;
}

interface WeddingTask {
  id: string;
  task_name: string;
  description: string;
  due_date: string;
  completed: boolean;
  category: string;
  priority: string;
  estimated_cost: number;
  actual_cost: number;
  notes: string;
}

export const WeddingPlanningDashboard: React.FC = () => {
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [selectedWedding, setSelectedWedding] = useState<Wedding | null>(null);
  const [tasks, setTasks] = useState<WeddingTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'guests' | 'budget'>('overview');
  const { toast } = useToast();

  useEffect(() => {
    loadWeddings();
  }, []);

  useEffect(() => {
    if (selectedWedding) {
      loadWeddingTasks(selectedWedding.id);
    }
  }, [selectedWedding]);

  const loadWeddings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('wedding_couples')
        .select('*')
        .order('wedding_date', { ascending: true });

      if (error) throw error;

      setWeddings(data || []);
      if (data && data.length > 0 && !selectedWedding) {
        setSelectedWedding(data[0]);
      }
    } catch (error) {
      console.error('Error loading weddings:', error);
      toast({
        title: "Error Loading Weddings",
        description: "Failed to load wedding data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadWeddingTasks = async (weddingId: string) => {
    try {
      const { data, error } = await supabase
        .from('wedding_tasks')
        .select('*')
        .eq('couple_id', weddingId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error loading wedding tasks:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const getUpcomingTasks = () => {
    const now = new Date();
    const upcoming = tasks
      .filter(task => !task.completed && new Date(task.due_date) >= now)
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
      .slice(0, 5);
    return upcoming;
  };

  const getDaysUntilWedding = () => {
    if (!selectedWedding?.wedding_date) return null;
    const weddingDate = new Date(selectedWedding.wedding_date);
    const today = new Date();
    const diffTime = weddingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
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
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="h-8 w-8 text-pink-600" />
            Wedding Planning
          </h1>
          <p className="text-muted-foreground">Manage wedding ceremonies and celebrations</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Wedding
        </Button>
      </div>

      {weddings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Weddings Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start planning your first wedding ceremony
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Wedding
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Wedding Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {weddings.map((wedding) => (
              <Button
                key={wedding.id}
                variant={selectedWedding?.id === wedding.id ? "default" : "outline"}
                onClick={() => setSelectedWedding(wedding)}
                className="flex-shrink-0"
              >
                {wedding.bride_name} & {wedding.groom_name}
              </Button>
            ))}
          </div>

          {selectedWedding && (
            <>
              {/* Wedding Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Days Until Wedding</p>
                        <p className="text-2xl font-bold">
                          {getDaysUntilWedding() !== null ? getDaysUntilWedding() : 'TBD'}
                        </p>
                      </div>
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Planning Progress</p>
                        <p className="text-2xl font-bold">{calculateProgress()}%</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Expected Guests</p>
                        <p className="text-2xl font-bold">{selectedWedding.estimated_guests || 0}</p>
                      </div>
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                        <p className="text-2xl font-bold">
                          ${((selectedWedding.budget_amount || 0) / 100).toLocaleString()}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Wedding Details */}
              <Card>
                <CardHeader>
                  <CardTitle>{selectedWedding.bride_name} & {selectedWedding.groom_name}</CardTitle>
                  <CardDescription>
                    <Badge className={getStatusColor(selectedWedding.planning_status)}>
                      {selectedWedding.planning_status.charAt(0).toUpperCase() + selectedWedding.planning_status.slice(1)}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Wedding Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Date:</strong> {selectedWedding.wedding_date ? new Date(selectedWedding.wedding_date).toLocaleDateString() : 'TBD'}</p>
                        <p><strong>Ceremony:</strong> {selectedWedding.venue_location || 'TBD'}</p>
                        <p><strong>Reception:</strong> {selectedWedding.reception_location || 'TBD'}</p>
                        <p><strong>Type:</strong> {selectedWedding.ceremony_type}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Planning Progress</h4>
                      <Progress value={calculateProgress()} className="mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
                {[
                  { key: 'overview', label: 'Overview', icon: Heart },
                  { key: 'timeline', label: 'Timeline', icon: Calendar },
                  { key: 'guests', label: 'Guests', icon: Users },
                  { key: 'budget', label: 'Budget', icon: DollarSign }
                ].map(({ key, label, icon: Icon }) => (
                  <Button
                    key={key}
                    variant={activeTab === key ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab(key as any)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Upcoming Tasks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {getUpcomingTasks().length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">No upcoming tasks</p>
                      ) : (
                        <div className="space-y-3">
                          {getUpcomingTasks().map((task) => (
                            <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <h4 className="font-medium">{task.task_name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Due: {new Date(task.due_date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Badge className={getPriorityColor(task.priority)}>
                                  {task.priority}
                                </Badge>
                                <Badge variant="outline">
                                  {task.category}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Vendor Meeting
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Users className="h-4 w-4 mr-2" />
                        Send Invitations
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Heart className="h-4 w-4 mr-2" />
                        Plan Rehearsal
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Update Wedding Details
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'timeline' && (
                <WeddingTimelineManager 
                  weddingId={selectedWedding.id} 
                  tasks={tasks}
                  onTasksUpdate={loadWeddingTasks}
                />
              )}

              {activeTab === 'guests' && (
                <WeddingGuestManager weddingId={selectedWedding.id} />
              )}

              {activeTab === 'budget' && (
                <WeddingBudgetTracker 
                  weddingId={selectedWedding.id}
                  totalBudget={selectedWedding.budget_amount || 0}
                />
              )}
            </>
          )}
        </>
      )}

      <CreateWeddingDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onWeddingCreated={loadWeddings}
      />
    </div>
  );
};