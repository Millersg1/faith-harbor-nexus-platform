import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, 
  Megaphone, 
  Send, 
  Clock, 
  Users, 
  MessageSquare,
  Shield,
  Zap,
  Check,
  X,
  Eye,
  Calendar
} from "lucide-react";

interface EmergencyBroadcast {
  id: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  channels: string[];
  target_groups: string[];
  sent_at?: string;
  scheduled_for?: string;
  sent_by: string;
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  recipient_count?: number;
  delivery_stats?: {
    sent: number;
    delivered: number;
    read: number;
    failed: number;
  };
}

const EmergencyBroadcastSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [broadcasts, setBroadcasts] = useState<EmergencyBroadcast[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    priority: 'medium' as EmergencyBroadcast['priority'],
    channels: [] as string[],
    target_groups: [] as string[],
    scheduled_for: '',
    send_immediately: true
  });

  const channels = [
    { id: 'push', label: 'Push Notifications', icon: '📱' },
    { id: 'email', label: 'Email', icon: '📧' },
    { id: 'sms', label: 'SMS', icon: '💬' },
    { id: 'app', label: 'In-App', icon: '🔔' },
    { id: 'website', label: 'Website Banner', icon: '🌐' }
  ];

  const targetGroups = [
    { id: 'all', label: 'All Members', count: 250 },
    { id: 'leaders', label: 'Church Leaders', count: 15 },
    { id: 'volunteers', label: 'Volunteers', count: 45 },
    { id: 'members', label: 'Active Members', count: 180 },
    { id: 'visitors', label: 'Visitors', count: 25 },
    { id: 'youth', label: 'Youth Group', count: 35 },
    { id: 'families', label: 'Families with Children', count: 85 }
  ];

  const priorityConfig = {
    low: { color: 'bg-blue-500', label: 'Low Priority', icon: '🔵' },
    medium: { color: 'bg-yellow-500', label: 'Medium Priority', icon: '🟡' },
    high: { color: 'bg-orange-500', label: 'High Priority', icon: '🟠' },
    critical: { color: 'bg-red-500', label: 'Critical Alert', icon: '🔴' }
  };

  useEffect(() => {
    if (user) {
      checkAuthorization();
      fetchBroadcasts();
    }
  }, [user]);

  const checkAuthorization = async () => {
    try {
      const { data, error } = await supabase
        .from('member_roles')
        .select('role_name')
        .eq('user_id', user?.id)
        .eq('active', true);

      if (error) throw error;

      const authorizedRoles = ['admin', 'pastor', 'staff', 'emergency_coordinator'];
      const hasPermission = data?.some(role => 
        authorizedRoles.includes(role.role_name)
      );

      setIsAuthorized(hasPermission || false);
    } catch (error) {
      console.error('Error checking authorization:', error);
      setIsAuthorized(false);
    }
  };

  const fetchBroadcasts = async () => {
    try {
      const { data, error } = await supabase
        .from('emergency_broadcasts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setBroadcasts(data || []);
    } catch (error) {
      console.error('Error fetching broadcasts:', error);
    }
  };

  const calculateRecipientCount = () => {
    if (formData.target_groups.includes('all')) {
      return targetGroups.find(g => g.id === 'all')?.count || 0;
    }
    
    return formData.target_groups.reduce((total, groupId) => {
      const group = targetGroups.find(g => g.id === groupId);
      return total + (group?.count || 0);
    }, 0);
  };

  const sendBroadcast = async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and message.",
        variant: "destructive",
      });
      return;
    }

    if (formData.channels.length === 0) {
      toast({
        title: "No Channels Selected",
        description: "Please select at least one communication channel.",
        variant: "destructive",
      });
      return;
    }

    if (formData.target_groups.length === 0) {
      toast({
        title: "No Target Groups",
        description: "Please select at least one target group.",
        variant: "destructive",
      });
      return;
    }

    try {
      const broadcastData = {
        title: formData.title,
        message: formData.message,
        priority: formData.priority,
        channels: formData.channels,
        target_groups: formData.target_groups,
        sent_by: user?.id,
        status: formData.send_immediately ? 'sent' : 'scheduled',
        scheduled_for: formData.send_immediately ? null : formData.scheduled_for,
        sent_at: formData.send_immediately ? new Date().toISOString() : null,
        recipient_count: calculateRecipientCount()
      };

      const { data, error } = await supabase
        .from('emergency_broadcasts')
        .insert([broadcastData])
        .select()
        .single();

      if (error) throw error;

      // Call edge function to send the broadcast
      const { error: broadcastError } = await supabase.functions.invoke('send-emergency-broadcast', {
        body: { broadcastId: data.id }
      });

      if (broadcastError) {
        console.error('Broadcast sending error:', broadcastError);
      }

      toast({
        title: formData.send_immediately ? "Broadcast Sent!" : "Broadcast Scheduled",
        description: `Your ${formData.priority} priority message has been ${formData.send_immediately ? 'sent' : 'scheduled'} to ${calculateRecipientCount()} recipients.`,
      });

      // Reset form
      setFormData({
        title: '',
        message: '',
        priority: 'medium',
        channels: [],
        target_groups: [],
        scheduled_for: '',
        send_immediately: true
      });
      setIsComposing(false);
      fetchBroadcasts();

    } catch (error) {
      console.error('Error sending broadcast:', error);
      toast({
        title: "Failed to Send",
        description: "There was an error sending your broadcast. Please try again.",
        variant: "destructive",
      });
    }
  };

  const cancelBroadcast = async (broadcastId: string) => {
    try {
      await supabase
        .from('emergency_broadcasts')
        .update({ status: 'cancelled' })
        .eq('id', broadcastId);

      fetchBroadcasts();
      toast({
        title: "Broadcast Cancelled",
        description: "The scheduled broadcast has been cancelled.",
      });
    } catch (error) {
      console.error('Error cancelling broadcast:', error);
    }
  };

  if (!user) return null;

  if (!isAuthorized) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-red-500" />
            <span>Access Denied</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You don't have permission to access the Emergency Broadcast System. 
            Please contact your church administrator.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <span>Emergency Broadcast System</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Send urgent communications to your church community
          </p>
        </div>
        <Button 
          onClick={() => setIsComposing(true)} 
          className="bg-red-600 hover:bg-red-700 text-white"
          size="lg"
        >
          <Megaphone className="h-5 w-5 mr-2" />
          New Broadcast
        </Button>
      </div>

      {/* Compose Broadcast Modal */}
      {isComposing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Megaphone className="h-5 w-5" />
                  <span>Compose Emergency Broadcast</span>
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsComposing(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Priority */}
              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => setFormData({...formData, priority: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <span className="flex items-center space-x-2">
                          <span>{config.icon}</span>
                          <span>{config.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Urgent: Church Service Cancelled"
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.title.length}/100 characters
                </p>
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Due to severe weather, tonight's service is cancelled. Please stay safe and join us online instead."
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.message.length}/500 characters
                </p>
              </div>

              {/* Channels */}
              <div>
                <Label>Communication Channels</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {channels.map((channel) => (
                    <div key={channel.id} className="flex items-center space-x-3">
                      <Switch
                        checked={formData.channels.includes(channel.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              channels: [...formData.channels, channel.id]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              channels: formData.channels.filter(c => c !== channel.id)
                            });
                          }
                        }}
                      />
                      <span className="text-sm">
                        {channel.icon} {channel.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Groups */}
              <div>
                <Label>Target Groups</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {targetGroups.map((group) => (
                    <div key={group.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={formData.target_groups.includes(group.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                target_groups: [...formData.target_groups, group.id]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                target_groups: formData.target_groups.filter(g => g !== group.id)
                              });
                            }
                          }}
                        />
                        <span className="text-sm">{group.label}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {group.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scheduling */}
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <Switch
                    checked={formData.send_immediately}
                    onCheckedChange={(checked) => setFormData({
                      ...formData, 
                      send_immediately: checked
                    })}
                  />
                  <span className="text-sm">Send immediately</span>
                </div>
                
                {!formData.send_immediately && (
                  <div>
                    <Label htmlFor="scheduled_for">Schedule for</Label>
                    <Input
                      id="scheduled_for"
                      type="datetime-local"
                      value={formData.scheduled_for}
                      onChange={(e) => setFormData({
                        ...formData, 
                        scheduled_for: e.target.value
                      })}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                )}
              </div>

              {/* Recipient Count */}
              <Alert>
                <Users className="h-4 w-4" />
                <AlertDescription>
                  This broadcast will be sent to <strong>{calculateRecipientCount()}</strong> recipients 
                  via <strong>{formData.channels.length}</strong> channel(s).
                </AlertDescription>
              </Alert>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsComposing(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={sendBroadcast} 
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {formData.send_immediately ? 'Send Now' : 'Schedule'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Broadcast History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Broadcasts</CardTitle>
          <CardDescription>
            History of emergency communications sent to your community
          </CardDescription>
        </CardHeader>
        <CardContent>
          {broadcasts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No broadcasts sent yet</p>
              <p className="text-sm">Your emergency communications will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {broadcasts.map((broadcast) => (
                <div key={broadcast.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge 
                          className={`${priorityConfig[broadcast.priority].color} text-white`}
                        >
                          {priorityConfig[broadcast.priority].icon} {priorityConfig[broadcast.priority].label}
                        </Badge>
                        <Badge variant={
                          broadcast.status === 'sent' ? 'default' :
                          broadcast.status === 'scheduled' ? 'secondary' :
                          broadcast.status === 'cancelled' ? 'destructive' : 'outline'
                        }>
                          {broadcast.status.charAt(0).toUpperCase() + broadcast.status.slice(1)}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg">{broadcast.title}</h3>
                      <p className="text-muted-foreground">{broadcast.message}</p>
                    </div>
                    
                    {broadcast.status === 'scheduled' && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => cancelBroadcast(broadcast.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{broadcast.recipient_count} recipients</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {broadcast.sent_at 
                            ? `Sent ${new Date(broadcast.sent_at).toLocaleString()}`
                            : broadcast.scheduled_for
                            ? `Scheduled for ${new Date(broadcast.scheduled_for).toLocaleString()}`
                            : 'Draft'
                          }
                        </span>
                      </span>
                    </div>
                    
                    {broadcast.delivery_stats && (
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">
                          ✓ {broadcast.delivery_stats.delivered}
                        </span>
                        <span className="text-blue-600">
                          👁 {broadcast.delivery_stats.read}
                        </span>
                        {broadcast.delivery_stats.failed > 0 && (
                          <span className="text-red-600">
                            ✗ {broadcast.delivery_stats.failed}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {broadcast.channels.map((channel) => {
                      const channelConfig = channels.find(c => c.id === channel);
                      return (
                        <Badge key={channel} variant="outline" className="text-xs">
                          {channelConfig?.icon} {channelConfig?.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyBroadcastSystem;