-- Create wedding planning tables
CREATE TABLE public.wedding_couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bride_id UUID REFERENCES auth.users(id),
  groom_id UUID REFERENCES auth.users(id),
  relationship_status TEXT NOT NULL DEFAULT 'engaged',
  engagement_date DATE,
  wedding_date DATE,
  venue_location TEXT,
  estimated_guests INTEGER,
  budget_amount INTEGER, -- in cents
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  bride_name TEXT NOT NULL,
  groom_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  ceremony_type TEXT DEFAULT 'traditional',
  reception_location TEXT,
  special_requests TEXT,
  planning_status TEXT DEFAULT 'planning' -- planning, confirmed, completed, cancelled
);

-- Create wedding planning timeline/tasks
CREATE TABLE public.wedding_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES public.wedding_couples(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  assigned_to UUID REFERENCES auth.users(id),
  priority TEXT DEFAULT 'medium', -- low, medium, high, critical
  category TEXT NOT NULL, -- venue, catering, photography, music, flowers, etc.
  vendor_id UUID,
  estimated_cost INTEGER, -- in cents
  actual_cost INTEGER, -- in cents
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create wedding vendors (extends marketplace services)
CREATE TABLE public.wedding_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id),
  vendor_name TEXT NOT NULL,
  vendor_type TEXT NOT NULL, -- photographer, florist, caterer, musician, etc.
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  website_url TEXT,
  portfolio_images JSONB DEFAULT '[]',
  specialties TEXT[],
  pricing_info TEXT,
  availability_calendar JSONB DEFAULT '{}',
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_preferred BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create wedding guest management
CREATE TABLE public.wedding_guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES public.wedding_couples(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  plus_one_name TEXT,
  rsvp_status TEXT DEFAULT 'pending', -- pending, accepted, declined
  rsvp_date TIMESTAMP WITH TIME ZONE,
  dietary_restrictions TEXT,
  accommodation_needed BOOLEAN DEFAULT false,
  guest_type TEXT DEFAULT 'friend', -- family, friend, colleague, etc.
  invitation_sent BOOLEAN DEFAULT false,
  invitation_sent_at TIMESTAMP WITH TIME ZONE,
  thank_you_sent BOOLEAN DEFAULT false,
  gift_received TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create pre-marriage counseling sessions
CREATE TABLE public.premarriage_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES public.wedding_couples(id) ON DELETE CASCADE,
  counselor_id UUID REFERENCES auth.users(id),
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  session_type TEXT NOT NULL, -- individual, couple, group
  topics_covered TEXT[],
  homework_assigned TEXT,
  completion_status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled, rescheduled
  notes TEXT,
  next_session_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create wedding websites/invitations
CREATE TABLE public.wedding_websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES public.wedding_couples(id) ON DELETE CASCADE,
  website_url TEXT UNIQUE,
  template_id TEXT NOT NULL,
  custom_domain TEXT,
  website_data JSONB NOT NULL DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  password_protected BOOLEAN DEFAULT false,
  access_password TEXT,
  rsvp_enabled BOOLEAN DEFAULT true,
  gift_registry_links JSONB DEFAULT '[]',
  photo_gallery JSONB DEFAULT '[]',
  visitor_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create wedding ceremonies (detailed ceremony planning)
CREATE TABLE public.wedding_ceremonies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES public.wedding_couples(id) ON DELETE CASCADE,
  officiant_id UUID REFERENCES auth.users(id),
  ceremony_date TIMESTAMP WITH TIME ZONE NOT NULL,
  rehearsal_date TIMESTAMP WITH TIME ZONE,
  venue_location TEXT NOT NULL,
  ceremony_type TEXT DEFAULT 'traditional',
  custom_vows BOOLEAN DEFAULT false,
  bride_vows TEXT,
  groom_vows TEXT,
  music_selections JSONB DEFAULT '[]',
  order_of_service JSONB DEFAULT '[]',
  special_elements JSONB DEFAULT '[]', -- unity candle, sand ceremony, etc.
  photographer_id UUID,
  videographer_id UUID,
  florist_id UUID,
  estimated_duration_minutes INTEGER DEFAULT 30,
  special_instructions TEXT,
  livestream_enabled BOOLEAN DEFAULT false,
  livestream_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all wedding tables
ALTER TABLE public.wedding_couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premarriage_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_ceremonies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wedding_couples
CREATE POLICY "Couples can view and edit their own wedding plans" ON public.wedding_couples
FOR ALL USING (
  auth.uid() = bride_id OR 
  auth.uid() = groom_id OR
  EXISTS (
    SELECT 1 FROM member_roles mr
    WHERE mr.user_id = auth.uid()
    AND mr.role_name IN ('admin', 'pastor', 'wedding_coordinator')
    AND mr.active = true
  )
);

CREATE POLICY "Wedding coordinators can view all wedding plans" ON public.wedding_couples
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM member_roles mr
    WHERE mr.user_id = auth.uid()
    AND mr.role_name IN ('admin', 'pastor', 'wedding_coordinator', 'staff')
    AND mr.active = true
  )
);

-- RLS Policies for wedding_tasks
CREATE POLICY "Wedding task access" ON public.wedding_tasks
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM wedding_couples wc
    WHERE wc.id = wedding_tasks.couple_id
    AND (wc.bride_id = auth.uid() OR wc.groom_id = auth.uid())
  ) OR
  auth.uid() = assigned_to OR
  EXISTS (
    SELECT 1 FROM member_roles mr
    WHERE mr.user_id = auth.uid()
    AND mr.role_name IN ('admin', 'pastor', 'wedding_coordinator')
    AND mr.active = true
  )
);

-- RLS Policies for wedding_vendors
CREATE POLICY "Anyone can view wedding vendors" ON public.wedding_vendors
FOR SELECT USING (true);

CREATE POLICY "Vendors can manage their own profiles" ON public.wedding_vendors
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM services s
    WHERE s.id = wedding_vendors.service_id
    AND s.provider_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM member_roles mr
    WHERE mr.user_id = auth.uid()
    AND mr.role_name IN ('admin', 'wedding_coordinator')
    AND mr.active = true
  )
);

-- RLS Policies for wedding_guests
CREATE POLICY "Couples can manage their guest lists" ON public.wedding_guests
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM wedding_couples wc
    WHERE wc.id = wedding_guests.couple_id
    AND (wc.bride_id = auth.uid() OR wc.groom_id = auth.uid())
  ) OR
  EXISTS (
    SELECT 1 FROM member_roles mr
    WHERE mr.user_id = auth.uid()
    AND mr.role_name IN ('admin', 'pastor', 'wedding_coordinator')
    AND mr.active = true
  )
);

-- RLS Policies for premarriage_sessions
CREATE POLICY "Counseling session access" ON public.premarriage_sessions
FOR ALL USING (
  auth.uid() = counselor_id OR
  EXISTS (
    SELECT 1 FROM wedding_couples wc
    WHERE wc.id = premarriage_sessions.couple_id
    AND (wc.bride_id = auth.uid() OR wc.groom_id = auth.uid())
  ) OR
  EXISTS (
    SELECT 1 FROM member_roles mr
    WHERE mr.user_id = auth.uid()
    AND mr.role_name IN ('admin', 'pastor')
    AND mr.active = true
  )
);

-- RLS Policies for wedding_websites
CREATE POLICY "Couples can manage their wedding websites" ON public.wedding_websites
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM wedding_couples wc
    WHERE wc.id = wedding_websites.couple_id
    AND (wc.bride_id = auth.uid() OR wc.groom_id = auth.uid())
  ) OR
  EXISTS (
    SELECT 1 FROM member_roles mr
    WHERE mr.user_id = auth.uid()
    AND mr.role_name IN ('admin', 'wedding_coordinator')
    AND mr.active = true
  )
);

CREATE POLICY "Published wedding websites are publicly viewable" ON public.wedding_websites
FOR SELECT USING (is_published = true);

-- RLS Policies for wedding_ceremonies
CREATE POLICY "Wedding ceremony access" ON public.wedding_ceremonies
FOR ALL USING (
  auth.uid() = officiant_id OR
  EXISTS (
    SELECT 1 FROM wedding_couples wc
    WHERE wc.id = wedding_ceremonies.couple_id
    AND (wc.bride_id = auth.uid() OR wc.groom_id = auth.uid())
  ) OR
  EXISTS (
    SELECT 1 FROM member_roles mr
    WHERE mr.user_id = auth.uid()
    AND mr.role_name IN ('admin', 'pastor', 'wedding_coordinator')
    AND mr.active = true
  )
);

-- Create triggers for updated_at columns
CREATE TRIGGER update_wedding_couples_updated_at
  BEFORE UPDATE ON public.wedding_couples
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wedding_tasks_updated_at
  BEFORE UPDATE ON public.wedding_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wedding_vendors_updated_at
  BEFORE UPDATE ON public.wedding_vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_premarriage_sessions_updated_at
  BEFORE UPDATE ON public.premarriage_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wedding_websites_updated_at
  BEFORE UPDATE ON public.wedding_websites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wedding_ceremonies_updated_at
  BEFORE UPDATE ON public.wedding_ceremonies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();