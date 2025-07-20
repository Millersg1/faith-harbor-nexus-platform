import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ActivityLog {
  activity_type: string;
  activity_description: string;
  page_url?: string;
  metadata?: any;
}

export const useActivityTracker = () => {
  const { user } = useAuth();
  const sessionId = useRef<string>();
  const presenceChannel = useRef<any>();

  useEffect(() => {
    if (!user) return;

    // Generate session ID
    sessionId.current = `${user.id}-${Date.now()}`;

    // Set up presence tracking
    const channel = supabase.channel('user-presence');
    presenceChannel.current = channel;

    const userPresence = {
      user_id: user.id,
      session_id: sessionId.current,
      status: 'online',
      current_page: window.location.pathname,
      last_seen: new Date().toISOString(),
    };

    // Track presence in database
    const trackPresence = async () => {
      try {
        await supabase
          .from('user_presence')
          .upsert({
            user_id: user.id,
            session_id: sessionId.current,
            status: 'online',
            current_page: window.location.pathname,
          });
      } catch (error) {
        console.error('Error tracking presence:', error);
      }
    };

    // Subscribe to presence channel
    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        console.log('Presence sync:', presenceState);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('User left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track(userPresence);
          await trackPresence();
        }
      });

    // Track page visibility changes
    const handleVisibilityChange = async () => {
      const status = document.hidden ? 'away' : 'online';
      await supabase
        .from('user_presence')
        .upsert({
          user_id: user.id,
          session_id: sessionId.current,
          status,
          current_page: window.location.pathname,
        });
    };

    // Track page navigation
    const handlePageChange = async () => {
      await supabase
        .from('user_presence')
        .upsert({
          user_id: user.id,
          session_id: sessionId.current,
          status: 'online',
          current_page: window.location.pathname,
        });
      
      // Log page visit
      logActivity({
        activity_type: 'page_visit',
        activity_description: `Visited page: ${window.location.pathname}`,
        page_url: window.location.pathname,
      });
    };

    // Set up event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', () => {
      // Mark as offline before leaving
      supabase
        .from('user_presence')
        .upsert({
          user_id: user.id,
          session_id: sessionId.current,
          status: 'offline',
          current_page: window.location.pathname,
        });
    });

    // Track initial page load
    handlePageChange();

    // Set up periodic presence updates
    const presenceInterval = setInterval(async () => {
      if (!document.hidden) {
        await supabase
          .from('user_presence')
          .upsert({
            user_id: user.id,
            session_id: sessionId.current,
            status: 'online',
            current_page: window.location.pathname,
          });
      }
    }, 30000); // Update every 30 seconds

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(presenceInterval);
      if (presenceChannel.current) {
        supabase.removeChannel(presenceChannel.current);
      }
      // Mark as offline when component unmounts
      supabase
        .from('user_presence')
        .upsert({
          user_id: user.id,
          session_id: sessionId.current,
          status: 'offline',
          current_page: window.location.pathname,
        });
    };
  }, [user]);

  const logActivity = async (activity: ActivityLog) => {
    if (!user) return;

    try {
      await supabase
        .from('user_activity_logs')
        .insert({
          user_id: user.id,
          activity_type: activity.activity_type,
          activity_description: activity.activity_description,
          page_url: activity.page_url || window.location.pathname,
          ip_address: '', // Could be populated by edge function if needed
          user_agent: navigator.userAgent,
          metadata: activity.metadata || {},
        });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  return { logActivity };
};