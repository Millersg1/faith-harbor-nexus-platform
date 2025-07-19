-- Phase 3: Core Features Database Migration

-- Enhanced member management
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS member_status TEXT DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS membership_type TEXT DEFAULT 'member';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_joined DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS zip_code TEXT;

-- Member roles table
CREATE TABLE public.member_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_name TEXT NOT NULL,
  role_description TEXT,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Donations table for online giving
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  donor_email TEXT NOT NULL,
  donor_name TEXT NOT NULL,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  donation_type TEXT NOT NULL, -- 'one-time', 'recurring'
  category TEXT DEFAULT 'general', -- 'general', 'tithe', 'missions', 'building-fund'
  stripe_payment_intent_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  message TEXT,
  anonymous BOOLEAN DEFAULT false,
  recurring_frequency TEXT, -- 'weekly', 'monthly', 'yearly'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  max_capacity INTEGER,
  registration_required BOOLEAN DEFAULT false,
  registration_deadline TIMESTAMPTZ,
  cost INTEGER DEFAULT 0, -- in cents
  category TEXT DEFAULT 'general',
  image_url TEXT,
  organizer_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'published', -- 'draft', 'published', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Event registrations table
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  attendee_name TEXT NOT NULL,
  attendee_email TEXT NOT NULL,
  attendee_phone TEXT,
  number_of_guests INTEGER DEFAULT 0,
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'free'
  special_requests TEXT,
  registered_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id),
  priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  category TEXT DEFAULT 'general',
  target_audience TEXT DEFAULT 'all', -- 'all', 'members', 'staff', 'volunteers'
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Newsletter subscriptions
CREATE TABLE public.newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscribed BOOLEAN DEFAULT true,
  preferences JSONB DEFAULT '{"weekly": true, "monthly": true, "events": true}'::jsonb,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  confirmation_token UUID DEFAULT gen_random_uuid(),
  confirmed BOOLEAN DEFAULT false
);

-- Enable RLS on all tables
ALTER TABLE public.member_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for member_roles
CREATE POLICY "Users can view their own roles" ON public.member_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.member_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.member_roles mr 
      WHERE mr.user_id = auth.uid() 
      AND mr.role_name IN ('admin', 'pastor', 'staff')
      AND mr.active = true
    )
  );

-- RLS Policies for donations
CREATE POLICY "Users can view their own donations" ON public.donations
  FOR SELECT USING (auth.uid() = donor_id);

CREATE POLICY "Users can create donations" ON public.donations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all donations" ON public.donations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.member_roles mr 
      WHERE mr.user_id = auth.uid() 
      AND mr.role_name IN ('admin', 'pastor', 'treasurer')
      AND mr.active = true
    )
  );

-- RLS Policies for events
CREATE POLICY "Everyone can view published events" ON public.events
  FOR SELECT USING (status = 'published');

CREATE POLICY "Event organizers can manage their events" ON public.events
  FOR ALL USING (auth.uid() = organizer_id);

CREATE POLICY "Admins can manage all events" ON public.events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.member_roles mr 
      WHERE mr.user_id = auth.uid() 
      AND mr.role_name IN ('admin', 'pastor', 'staff')
      AND mr.active = true
    )
  );

-- RLS Policies for event_registrations
CREATE POLICY "Users can view their own registrations" ON public.event_registrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own registrations" ON public.event_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Event organizers can view registrations for their events" ON public.event_registrations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.events e 
      WHERE e.id = event_id AND e.organizer_id = auth.uid()
    )
  );

-- RLS Policies for announcements
CREATE POLICY "Everyone can view published announcements" ON public.announcements
  FOR SELECT USING (status = 'published' AND published_at <= now());

CREATE POLICY "Authors can manage their announcements" ON public.announcements
  FOR ALL USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all announcements" ON public.announcements
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.member_roles mr 
      WHERE mr.user_id = auth.uid() 
      AND mr.role_name IN ('admin', 'pastor', 'staff')
      AND mr.active = true
    )
  );

-- RLS Policies for newsletter_subscriptions
CREATE POLICY "Users can manage their own subscription" ON public.newsletter_subscriptions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public can insert subscriptions" ON public.newsletter_subscriptions
  FOR INSERT WITH CHECK (true);

-- Triggers for updated_at timestamps
CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON public.donations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();