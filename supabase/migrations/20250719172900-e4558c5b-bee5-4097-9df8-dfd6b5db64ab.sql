-- Phase 4: Advanced Features Database Schema

-- Email campaigns and newsletters
CREATE TABLE public.email_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  template_type TEXT DEFAULT 'newsletter',
  status TEXT DEFAULT 'draft', -- draft, scheduled, sent, cancelled
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  recipient_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sermon/Content Management
CREATE TABLE public.sermons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  scripture_reference TEXT,
  speaker_name TEXT NOT NULL,
  sermon_date DATE NOT NULL,
  description TEXT,
  audio_url TEXT,
  video_url TEXT,
  notes_url TEXT,
  series_name TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'published',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Real-time notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- info, success, warning, error
  category TEXT DEFAULT 'general', -- general, event, donation, announcement
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Analytics tracking
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL, -- page_view, donation, registration, login
  user_id UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email tracking
CREATE TABLE public.email_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES public.email_campaigns(id),
  recipient_email TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  bounced_at TIMESTAMP WITH TIME ZONE,
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Advanced search/filtering saved searches
CREATE TABLE public.saved_searches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  search_type TEXT NOT NULL, -- members, events, donations, etc
  filters JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_campaigns
CREATE POLICY "Admins can manage email campaigns" ON public.email_campaigns
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM member_roles mr 
    WHERE mr.user_id = auth.uid() 
    AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
    AND mr.active = true
  )
);

-- RLS Policies for sermons
CREATE POLICY "Everyone can view published sermons" ON public.sermons
FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage sermons" ON public.sermons
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM member_roles mr 
    WHERE mr.user_id = auth.uid() 
    AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
    AND mr.active = true
  )
);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can create notifications" ON public.notifications
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM member_roles mr 
    WHERE mr.user_id = auth.uid() 
    AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
    AND mr.active = true
  )
);

CREATE POLICY "Users can update their own notifications" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for analytics_events
CREATE POLICY "Admins can view analytics" ON public.analytics_events
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM member_roles mr 
    WHERE mr.user_id = auth.uid() 
    AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'treasurer']) 
    AND mr.active = true
  )
);

CREATE POLICY "Anyone can insert analytics events" ON public.analytics_events
FOR INSERT WITH CHECK (true);

-- RLS Policies for email_tracking
CREATE POLICY "Admins can view email tracking" ON public.email_tracking
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM member_roles mr 
    WHERE mr.user_id = auth.uid() 
    AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
    AND mr.active = true
  )
);

CREATE POLICY "System can insert email tracking" ON public.email_tracking
FOR INSERT WITH CHECK (true);

-- RLS Policies for saved_searches
CREATE POLICY "Users can manage their own searches" ON public.saved_searches
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view public searches" ON public.saved_searches
FOR SELECT USING (is_public = true);

-- Add update triggers
CREATE TRIGGER update_email_campaigns_updated_at
  BEFORE UPDATE ON public.email_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sermons_updated_at
  BEFORE UPDATE ON public.sermons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_date ON public.analytics_events(created_at);
CREATE INDEX idx_sermons_date ON public.sermons(sermon_date);
CREATE INDEX idx_email_tracking_campaign ON public.email_tracking(campaign_id);