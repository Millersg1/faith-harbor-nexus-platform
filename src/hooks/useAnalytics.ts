import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsEvent {
  event_type: string;
  metadata?: Record<string, any>;
}

export const useAnalytics = () => {
  const trackEvent = async (event: AnalyticsEvent) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const eventData = {
        event_type: event.event_type,
        user_id: user?.id || null,
        metadata: event.metadata || {},
        ip_address: null, // Would need server-side tracking for real IP
        user_agent: navigator.userAgent,
      };

      await supabase
        .from('analytics_events')
        .insert([eventData]);
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  const trackPageView = (pageName: string) => {
    trackEvent({
      event_type: 'page_view',
      metadata: { page: pageName }
    });
  };

  const trackDonation = (amount: number, type: string) => {
    trackEvent({
      event_type: 'donation',
      metadata: { amount, type }
    });
  };

  const trackEventRegistration = (eventId: string, eventTitle: string) => {
    trackEvent({
      event_type: 'event_registration',
      metadata: { eventId, eventTitle }
    });
  };

  const trackLogin = () => {
    trackEvent({
      event_type: 'login'
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackDonation,
    trackEventRegistration,
    trackLogin,
  };
};

// Hook for automatic page view tracking
export const usePageViewTracking = (pageName: string) => {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView(pageName);
  }, [pageName, trackPageView]);
};