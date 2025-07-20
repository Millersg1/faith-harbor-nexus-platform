import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Activity, 
  Users, 
  Eye, 
  Clock, 
  Search, 
  Filter,
  Circle,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: string;
  activity_description: string;
  page_url: string;
  created_at: string;
  profiles?: {
    display_name?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  } | null;
}

interface UserPresence {
  id: string;
  user_id: string;
  status: string;
  current_page: string;
  last_seen: string;
  profiles?: {
    display_name?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  } | null;
}

const AdminActivityMonitor = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [userPresence, setUserPresence] = useState<UserPresence[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityLogs();
    fetchUserPresence();
    
    // Set up real-time subscriptions
    const activitySubscription = supabase
      .channel('activity-logs')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'user_activity_logs'
      }, (payload) => {
        fetchActivityLogs(); // Refresh the list
      })
      .subscribe();

    const presenceSubscription = supabase
      .channel('user-presence-admin')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_presence'
      }, (payload) => {
        fetchUserPresence(); // Refresh the presence list
      })
      .subscribe();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchUserPresence();
    }, 30000);

    return () => {
      supabase.removeChannel(activitySubscription);
      supabase.removeChannel(presenceSubscription);
      clearInterval(interval);
    };
  }, []);

  const fetchActivityLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('user_activity_logs')
        .select(`
          id,
          user_id,
          activity_type,
          activity_description,
          page_url,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      // Fetch profiles separately to avoid foreign key issues
      const logsWithProfiles = await Promise.all(
        (data || []).map(async (log) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, first_name, last_name, avatar_url')
            .eq('user_id', log.user_id)
            .single();
          
          return {
            ...log,
            profiles: profile
          };
        })
      );
      
      setActivityLogs(logsWithProfiles);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch activity logs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPresence = async () => {
    try {
      const { data, error } = await supabase
        .from('user_presence')
        .select(`
          id,
          user_id,
          status,
          current_page,
          last_seen
        `)
        .order('last_seen', { ascending: false });

      if (error) throw error;
      
      // Fetch profiles separately and filter to latest presence per user
      const presenceWithProfiles = await Promise.all(
        (data || []).map(async (presence) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, first_name, last_name, avatar_url')
            .eq('user_id', presence.user_id)
            .single();
          
          return {
            ...presence,
            profiles: profile
          };
        })
      );
      
      // Filter to show only the latest presence for each user
      const latestPresence = presenceWithProfiles.reduce((acc, current) => {
        const existing = acc.find(item => item.user_id === current.user_id);
        if (!existing || new Date(current.last_seen) > new Date(existing.last_seen)) {
          const index = acc.findIndex(item => item.user_id === current.user_id);
          if (index >= 0) {
            acc[index] = current;
          } else {
            acc.push(current);
          }
        }
        return acc;
      }, [] as UserPresence[]);

      setUserPresence(latestPresence);
    } catch (error) {
      console.error('Error fetching user presence:', error);
    }
  };

  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = 
      log.activity_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.profiles?.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' || log.activity_type === filterType;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'away': return 'text-yellow-500';
      case 'offline': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getDisplayName = (profiles: any) => {
    if (!profiles) return 'Unknown User';
    return profiles.display_name || `${profiles.first_name} ${profiles.last_name}` || 'Unknown User';
  };

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading activity data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            {t('admin.activityMonitor')}
          </h1>
          <p className="text-muted-foreground">{t('admin.monitorDescription')}</p>
        </div>
        <Button onClick={() => { fetchActivityLogs(); fetchUserPresence(); }} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('admin.refresh')}
        </Button>
      </div>

      <Tabs defaultValue="presence" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="presence">{t('admin.livePresence')}</TabsTrigger>
          <TabsTrigger value="activity">{t('admin.activityLogs')}</TabsTrigger>
        </TabsList>

        <TabsContent value="presence" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Presence
                <Badge variant="secondary">{userPresence.length} members tracked</Badge>
              </CardTitle>
              <CardDescription>
                Real-time view of member presence and current activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userPresence.map((presence) => (
                  <Card key={presence.id} className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={presence.profiles?.avatar_url} />
                          <AvatarFallback>
                            {presence.profiles?.first_name?.[0]}{presence.profiles?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <Circle className={`absolute -bottom-1 -right-1 h-4 w-4 ${getStatusColor(presence.status)} fill-current`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {getDisplayName(presence.profiles)}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {presence.current_page || 'Unknown page'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {timeAgo(presence.last_seen)}
                        </p>
                      </div>
                      <Badge variant={presence.status === 'online' ? 'default' : 'secondary'}>
                        {presence.status}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Activity Logs
                <Badge variant="secondary">{filteredLogs.length} activities</Badge>
              </CardTitle>
              <CardDescription>
                Detailed log of all member activities and interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="all">All Activities</option>
                  <option value="page_visit">Page Visits</option>
                  <option value="login">Logins</option>
                  <option value="profile_update">Profile Updates</option>
                  <option value="form_submission">Form Submissions</option>
                </select>
              </div>

              {/* Activity List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={log.profiles?.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {log.profiles?.first_name?.[0]}{log.profiles?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">
                          {getDisplayName(log.profiles)}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {log.activity_type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {log.activity_description}
                      </p>
                      {log.page_url && (
                        <p className="text-xs text-muted-foreground">
                          Page: {log.page_url}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {timeAgo(log.created_at)}
                    </div>
                  </div>
                ))}
              </div>

              {filteredLogs.length === 0 && (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No activities found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm || filterType !== 'all' 
                      ? "Try adjusting your search or filter" 
                      : "Activities will appear here as members use the platform"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminActivityMonitor;