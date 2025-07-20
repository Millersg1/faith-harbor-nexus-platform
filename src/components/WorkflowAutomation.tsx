import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Workflow, Play, Pause, Edit, Trash2, Plus, Clock, Mail, Users, Gift, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay';
  name: string;
  config: any;
  position: { x: number; y: number };
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: WorkflowStep[];
  isActive: boolean;
  triggerCount: number;
  successRate: number;
}

const WorkflowAutomation = () => {
  const [workflows, setWorkflows] = useState<WorkflowTemplate[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTemplate | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [draggedStep, setDraggedStep] = useState<string | null>(null);
  const { toast } = useToast();

  const predefinedWorkflows = [
    {
      id: '1',
      name: 'New Member Welcome Series',
      description: 'Automated welcome emails and onboarding tasks for new members',
      category: 'Member Management',
      steps: [
        { id: 'trigger-1', type: 'trigger', name: 'New Member Registration', config: { event: 'member_signup' }, position: { x: 50, y: 50 } },
        { id: 'delay-1', type: 'delay', name: 'Wait 1 Hour', config: { duration: '1h' }, position: { x: 200, y: 50 } },
        { id: 'action-1', type: 'action', name: 'Send Welcome Email', config: { template: 'welcome' }, position: { x: 350, y: 50 } },
        { id: 'delay-2', type: 'delay', name: 'Wait 3 Days', config: { duration: '3d' }, position: { x: 500, y: 50 } },
        { id: 'action-2', type: 'action', name: 'Schedule Pastor Meeting', config: { type: 'meeting' }, position: { x: 650, y: 50 } }
      ],
      isActive: true,
      triggerCount: 23,
      successRate: 94
    },
    {
      id: '2',
      name: 'Event Registration Follow-up',
      description: 'Automated reminders and check-ins for event attendees',
      category: 'Events',
      steps: [
        { id: 'trigger-2', type: 'trigger', name: 'Event Registration', config: { event: 'event_signup' }, position: { x: 50, y: 50 } },
        { id: 'action-3', type: 'action', name: 'Send Confirmation', config: { template: 'event_confirmation' }, position: { x: 200, y: 50 } },
        { id: 'delay-3', type: 'delay', name: 'Wait Until 1 Day Before', config: { duration: 'event_minus_1d' }, position: { x: 350, y: 50 } },
        { id: 'action-4', type: 'action', name: 'Send Reminder', config: { template: 'event_reminder' }, position: { x: 500, y: 50 } }
      ],
      isActive: true,
      triggerCount: 156,
      successRate: 87
    },
    {
      id: '3',
      name: 'Donation Thank You Sequence',
      description: 'Personalized thank you messages and follow-up for donors',
      category: 'Fundraising',
      steps: [
        { id: 'trigger-3', type: 'trigger', name: 'Donation Received', config: { event: 'donation_completed' }, position: { x: 50, y: 50 } },
        { id: 'condition-1', type: 'condition', name: 'Check Amount > $100', config: { field: 'amount', operator: '>', value: 100 }, position: { x: 200, y: 50 } },
        { id: 'action-5', type: 'action', name: 'Send Personal Thank You', config: { template: 'personal_thanks' }, position: { x: 350, y: 30 } },
        { id: 'action-6', type: 'action', name: 'Send Standard Thank You', config: { template: 'standard_thanks' }, position: { x: 350, y: 90 } }
      ],
      isActive: false,
      triggerCount: 89,
      successRate: 96
    }
  ];

  const stepTypes = [
    { type: 'trigger', name: 'Trigger', icon: Play, color: 'bg-green-500' },
    { type: 'action', name: 'Action', icon: Mail, color: 'bg-blue-500' },
    { type: 'condition', name: 'Condition', icon: Users, color: 'bg-yellow-500' },
    { type: 'delay', name: 'Delay', icon: Clock, color: 'bg-purple-500' }
  ];

  useEffect(() => {
    setWorkflows(predefinedWorkflows);
  }, []);

  const toggleWorkflow = async (workflowId: string) => {
    setWorkflows(prev => prev.map(w => 
      w.id === workflowId ? { ...w, isActive: !w.isActive } : w
    ));
    
    toast({
      title: "Workflow Updated",
      description: "Workflow status has been changed successfully.",
    });
  };

  const createNewWorkflow = () => {
    const newWorkflow: WorkflowTemplate = {
      id: Date.now().toString(),
      name: 'New Workflow',
      description: 'Custom workflow',
      category: 'Custom',
      steps: [],
      isActive: false,
      triggerCount: 0,
      successRate: 0
    };
    
    setSelectedWorkflow(newWorkflow);
    setIsBuilderOpen(true);
  };

  const getStepIcon = (type: string) => {
    const stepType = stepTypes.find(s => s.type === type);
    return stepType ? stepType.icon : Play;
  };

  const getStepColor = (type: string) => {
    const stepType = stepTypes.find(s => s.type === type);
    return stepType ? stepType.color : 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Workflow className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Workflow Automation</h1>
            <p className="text-muted-foreground">Automate your church processes and communications</p>
          </div>
        </div>
        <Button onClick={createNewWorkflow}>
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {!isBuilderOpen ? (
        <Tabs defaultValue="workflows" className="space-y-6">
          <TabsList>
            <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="workflows" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map((workflow) => (
                <Card key={workflow.id} className="hover-scale">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{workflow.name}</CardTitle>
                      <Switch
                        checked={workflow.isActive}
                        onCheckedChange={() => toggleWorkflow(workflow.id)}
                      />
                    </div>
                    <Badge variant="outline">{workflow.category}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{workflow.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Triggered:</span>
                        <span className="font-medium">{workflow.triggerCount} times</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Success Rate:</span>
                        <span className="font-medium text-green-600">{workflow.successRate}%</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedWorkflow(workflow);
                          setIsBuilderOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Member Lifecycle</h3>
                    <p className="text-sm text-muted-foreground mt-1">Complete member journey from signup to discipleship</p>
                    <Button size="sm" className="mt-3">Use Template</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Event Management</h3>
                    <p className="text-sm text-muted-foreground mt-1">End-to-end event planning and follow-up automation</p>
                    <Button size="sm" className="mt-3">Use Template</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Workflows</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{workflows.length}</div>
                  <p className="text-sm text-muted-foreground">
                    {workflows.filter(w => w.isActive).length} active
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Total Executions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {workflows.reduce((sum, w) => sum + w.triggerCount, 0)}
                  </div>
                  <p className="text-sm text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Average Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Across all workflows</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Workflow Builder</CardTitle>
              <Button variant="outline" onClick={() => setIsBuilderOpen(false)}>
                Close Builder
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-6">
              {/* Step Palette */}
              <div className="space-y-4">
                <h3 className="font-semibold">Step Types</h3>
                {stepTypes.map((stepType) => {
                  const Icon = stepType.icon;
                  return (
                    <div
                      key={stepType.type}
                      className={`p-3 rounded-lg cursor-pointer hover:opacity-80 ${stepType.color} text-white`}
                      draggable
                      onDragStart={() => setDraggedStep(stepType.type)}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{stepType.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Canvas */}
              <div className="col-span-3">
                <div className="h-96 border-2 border-dashed border-gray-300 rounded-lg p-4 relative overflow-auto">
                  {selectedWorkflow?.steps.map((step) => {
                    const Icon = getStepIcon(step.type);
                    return (
                      <div
                        key={step.id}
                        className={`absolute w-32 h-20 rounded-lg p-2 text-white text-sm ${getStepColor(step.type)}`}
                        style={{ left: step.position.x, top: step.position.y }}
                      >
                        <div className="flex items-center space-x-1 mb-1">
                          <Icon className="h-3 w-3" />
                          <span className="text-xs font-medium">{step.type}</span>
                        </div>
                        <div className="text-xs">{step.name}</div>
                      </div>
                    );
                  })}
                  
                  {selectedWorkflow?.steps.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                      Drag steps here to build your workflow
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkflowAutomation;