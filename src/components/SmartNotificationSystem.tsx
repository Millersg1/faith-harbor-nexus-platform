import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  X, 
  Calendar, 
  Heart, 
  MessageSquare, 
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle,
  Info,
  BellRing,
  Settings,
  Zap,
  Clock,
  Star
} from "lucide-react";

interface SmartNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'prayer' | 'event' | 'donation' | 'message' | 'urgent';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  created_at: string;
  action_url?: string;
  action_text?: string;
  scheduled_for?: string;
  user_preferences?: any;
  engagement_score?: number;
}

interface NotificationPreferences {
  prayer_requests: boolean;
  events: boolean;
  announcements: boolean;
  donations: boolean;
  emergency: boolean;
  daily_digest: boolean;
  push_notifications: boolean;
  email_notifications: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
}

const SmartNotificationSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    prayer_requests: true,
    events: true,
    announcements: true,
    donations: false,
    emergency: true,
    daily_digest: true,
    push_notifications: true,
    email_notifications: true,
    quiet_hours_start: "22:00",
    quiet_hours_end: "07:00"
  });
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (user) {
      fetchNotifications();
      loadUserPreferences();
      setupRealtimeSubscription();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const smartNotifications: SmartNotification[] = data?.map(notif => ({
        id: notif.id,
        title: notif.title,
        message: notif.message,
        type: notif.type as SmartNotification['type'],
        priority: determinePriority(notif),
        read: notif.read || false,
        created_at: notif.created_at,
        action_url: notif.action_url,
        action_text: notif.action_text,
        engagement_score: calculateEngagementScore(notif)
      })) || [];

      // Sort by priority and engagement score
      smartNotifications.sort((a, b) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return (b.engagement_score || 0) - (a.engagement_score || 0);
      });

      setNotifications(smartNotifications);
      setUnreadCount(smartNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const determinePriority = (notification: any): SmartNotification['priority'] => {
    if (notification.type === 'urgent' || notification.type === 'emergency') return 'urgent';
    if (notification.type === 'prayer' && notification.created_at) {
      const timeDiff = Date.now() - new Date(notification.created_at).getTime();
      if (timeDiff < 24 * 60 * 60 * 1000) return 'high'; // Less than 24 hours
    }
    if (notification.type === 'event') return 'medium';
    return 'low';
  };

  const calculateEngagementScore = (notification: any): number => {
    let score = 0;
    
    // Recency boost
    const timeDiff = Date.now() - new Date(notification.created_at).getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    if (hoursDiff < 1) score += 10;
    else if (hoursDiff < 24) score += 5;
    
    // Type-based scoring
    const typeScores = {
      urgent: 15,
      prayer: 8,
      event: 6,
      donation: 4,
      message: 5,
      info: 2
    };
    score += typeScores[notification.type as keyof typeof typeScores] || 0;
    
    // Personal relevance (would be enhanced with ML in production)
    if (notification.title.includes(user?.user_metadata?.display_name)) score += 5;
    
    return score;
  };

  const loadUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (data && !error) {
        setPreferences({ ...preferences, ...data.preferences });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const saveUserPreferences = async (newPreferences: NotificationPreferences) => {
    try {
      await supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: user?.id,
          preferences: newPreferences,
          updated_at: new Date().toISOString()
        });
      
      setPreferences(newPreferences);
      toast({
        title: "Preferences Saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('smart_notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user?.id}`
        },
        (payload) => {
          const newNotification = payload.new as any;
          
          // Check if notification should be shown based on preferences
          if (shouldShowNotification(newNotification)) {
            const smartNotif: SmartNotification = {
              id: newNotification.id,
              title: newNotification.title,
              message: newNotification.message,
              type: newNotification.type,
              priority: determinePriority(newNotification),
              read: false,
              created_at: newNotification.created_at,
              action_url: newNotification.action_url,
              action_text: newNotification.action_text,
              engagement_score: calculateEngagementScore(newNotification)
            };

            setNotifications(prev => [smartNotif, ...prev].slice(0, 50));
            setUnreadCount(prev => prev + 1);
            
            // Smart notification display
            showSmartNotification(smartNotif);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const shouldShowNotification = (notification: any): boolean => {
    // Check quiet hours
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    if (currentTime >= preferences.quiet_hours_start || currentTime <= preferences.quiet_hours_end) {
      // Only urgent notifications during quiet hours
      return notification.type === 'urgent' || notification.type === 'emergency';
    }

    // Check type preferences
    const typePreferenceMap = {
      prayer: preferences.prayer_requests,
      event: preferences.events,
      message: preferences.announcements,
      donation: preferences.donations,
      urgent: preferences.emergency,
      emergency: preferences.emergency
    };

    return typePreferenceMap[notification.type as keyof typeof typePreferenceMap] ?? true;
  };

  const showSmartNotification = (notification: SmartNotification) => {
    // Toast notification
    toast({
      title: notification.title,
      description: notification.message,
      duration: notification.priority === 'urgent' ? 10000 : 5000,
    });

    // Browser notification with smart timing
    if (preferences.push_notifications && Notification.permission === 'granted') {
      const notif = new Notification(notification.title, {
        body: notification.message,
        icon: '/faith-harbor-logo.png',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent'
      });

      // Auto-close non-urgent notifications
      if (notification.priority !== 'urgent') {
        setTimeout(() => notif.close(), 5000);
      }
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'urgent':
        return notifications.filter(n => n.priority === 'urgent');
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'prayer':
        return notifications.filter(n => n.type === 'prayer');
      case 'events':
        return notifications.filter(n => n.type === 'event');
      default:
        return notifications;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'high': return <Star className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!user) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Smart Notification Bell */}
      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="h-12 w-12 rounded-full bg-background shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <div className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <>
                <Badge 
                  variant="destructive" 
                  className="absolute -top-3 -right-3 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
              </>
            )}
          </div>
        </Button>
      </div>

      {/* Smart Notifications Panel */}
      {isOpen && (
        <Card className="absolute top-16 right-0 w-96 max-w-[90vw] shadow-2xl border-2 bg-background/98 backdrop-blur-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Smart Notifications</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="h-7 w-7"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-4">
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                <TabsTrigger value="urgent" className="text-xs">Urgent</TabsTrigger>
                <TabsTrigger value="unread" className="text-xs">Unread</TabsTrigger>
                <TabsTrigger value="prayer" className="text-xs">Prayer</TabsTrigger>
                <TabsTrigger value="settings" className="text-xs">
                  <Settings className="h-3 w-3" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="settings" className="p-4">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Notification Preferences</h4>
                  <div className="space-y-3">
                    {Object.entries(preferences).map(([key, value]) => {
                      if (key.includes('hours')) return null;
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm capitalize">
                            {key.replace(/_/g, ' ')}
                          </span>
                          <Switch
                            checked={value as boolean}
                            onCheckedChange={(checked) => {
                              const newPrefs = { ...preferences, [key]: checked };
                              saveUserPreferences(newPrefs);
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              {(['all', 'urgent', 'unread', 'prayer'] as const).map(tabValue => (
                <TabsContent key={tabValue} value={tabValue} className="mt-0">
                  <ScrollArea className="h-[400px]">
                    {getFilteredNotifications().length === 0 ? (
                      <div className="p-6 text-center text-muted-foreground">
                        <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No notifications</p>
                        <p className="text-sm">You're all caught up!</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {getFilteredNotifications().map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer ${
                              !notification.read ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                            }`}
                            onClick={() => !notification.read && markAsRead(notification.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex flex-col items-center space-y-1">
                                {getPriorityIcon(notification.priority)}
                                {notification.engagement_score && (
                                  <span className="text-xs text-muted-foreground">
                                    {notification.engagement_score}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <p className={`font-medium text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {notification.title}
                                  </p>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {new Date(notification.created_at).toLocaleTimeString([], { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                {notification.action_url && (
                                  <Button 
                                    variant="link" 
                                    size="sm" 
                                    className="p-0 h-auto text-xs text-primary mt-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.location.href = notification.action_url!;
                                    }}
                                  >
                                    {notification.action_text || "View Details"}
                                  </Button>
                                )}
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartNotificationSystem;