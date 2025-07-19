-- Phase 6: Comprehensive Church Management System Tables

-- Communication & Engagement Tables
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users(id),
  recipient_id UUID REFERENCES auth.users(id),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  thread_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.message_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  participants UUID[] NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Financial Management Tables
CREATE TABLE public.budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  fiscal_year INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  allocated_amount INTEGER DEFAULT 0,
  spent_amount INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'active', 'closed')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.budget_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  budget_id UUID REFERENCES public.budgets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  allocated_amount INTEGER NOT NULL,
  spent_amount INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  budget_category_id UUID REFERENCES public.budget_categories(id),
  amount INTEGER NOT NULL,
  description TEXT NOT NULL,
  vendor TEXT,
  expense_date DATE NOT NULL,
  receipt_url TEXT,
  approved_by UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.pledges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pledger_id UUID REFERENCES auth.users(id),
  amount INTEGER NOT NULL,
  frequency TEXT DEFAULT 'monthly' CHECK (frequency IN ('weekly', 'monthly', 'quarterly', 'annually')),
  start_date DATE NOT NULL,
  end_date DATE,
  category TEXT DEFAULT 'general',
  fulfilled_amount INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Worship & Ministry Tables
CREATE TABLE public.service_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_date TIMESTAMP WITH TIME ZONE NOT NULL,
  service_type TEXT DEFAULT 'sunday_morning',
  theme TEXT,
  scripture_reading TEXT,
  sermon_title TEXT,
  sermon_speaker TEXT,
  worship_leader UUID REFERENCES auth.users(id),
  tech_lead UUID REFERENCES auth.users(id),
  notes TEXT,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'ready', 'completed')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.service_elements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_plan_id UUID REFERENCES public.service_plans(id) ON DELETE CASCADE,
  element_type TEXT NOT NULL, -- 'song', 'prayer', 'reading', 'announcement', 'offering'
  title TEXT NOT NULL,
  duration_minutes INTEGER,
  order_index INTEGER NOT NULL,
  notes TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  team_type TEXT NOT NULL, -- 'worship', 'tech', 'ministry', 'administrative'
  leader_id UUID REFERENCES auth.users(id),
  meeting_schedule TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  UNIQUE(team_id, user_id)
);

CREATE TABLE public.ministry_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL, -- 'document', 'video', 'audio', 'link', 'template'
  file_url TEXT,
  external_url TEXT,
  ministry_area TEXT,
  tags TEXT[],
  access_level TEXT DEFAULT 'members' CHECK (access_level IN ('public', 'members', 'leaders', 'admin')),
  uploaded_by UUID REFERENCES auth.users(id),
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Analytics & Insights Tables
CREATE TABLE public.attendance_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id),
  service_plan_id UUID REFERENCES public.service_plans(id),
  attendance_date DATE NOT NULL,
  total_count INTEGER NOT NULL,
  adult_count INTEGER DEFAULT 0,
  child_count INTEGER DEFAULT 0,
  visitor_count INTEGER DEFAULT 0,
  service_type TEXT,
  weather_conditions TEXT,
  special_events TEXT,
  recorded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.member_engagement (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  activity_type TEXT NOT NULL, -- 'login', 'event_registration', 'donation', 'volunteer_signup', 'prayer_request'
  activity_details JSONB,
  engagement_score INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Administrative Tables
CREATE TABLE public.rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  capacity INTEGER,
  equipment TEXT[],
  location TEXT,
  amenities TEXT[],
  booking_rules TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'maintenance', 'unavailable')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.room_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.rooms(id),
  booked_by UUID REFERENCES auth.users(id),
  event_title TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  purpose TEXT,
  attendee_count INTEGER,
  setup_requirements TEXT,
  equipment_needed TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.check_ins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id),
  user_id UUID REFERENCES auth.users(id),
  check_in_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  check_in_method TEXT DEFAULT 'manual', -- 'manual', 'qr_code', 'nfc'
  checked_in_by UUID REFERENCES auth.users(id),
  notes TEXT
);

CREATE TABLE public.onboarding_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  workflow_type TEXT NOT NULL, -- 'new_member', 'new_visitor', 'volunteer'
  steps JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.member_onboarding_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  workflow_id UUID REFERENCES public.onboarding_workflows(id),
  current_step INTEGER DEFAULT 0,
  completed_steps INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped'))
);

-- Enable RLS on all tables
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pledges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_onboarding_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Messages
CREATE POLICY "Users can view their own messages" ON public.messages
FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" ON public.messages
FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received messages" ON public.messages
FOR UPDATE USING (auth.uid() = recipient_id);

-- RLS Policies for Message Threads
CREATE POLICY "Users can view threads they participate in" ON public.message_threads
FOR SELECT USING (auth.uid() = ANY(participants));

CREATE POLICY "Users can create message threads" ON public.message_threads
FOR INSERT WITH CHECK (auth.uid() = created_by);

-- RLS Policies for Financial Management
CREATE POLICY "Admins can manage budgets" ON public.budgets
FOR ALL USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'treasurer', 'staff']) 
  AND mr.active = true
));

CREATE POLICY "Admins can manage budget categories" ON public.budget_categories
FOR ALL USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'treasurer', 'staff']) 
  AND mr.active = true
));

CREATE POLICY "Users can submit expenses" ON public.expenses
FOR INSERT WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Admins can manage expenses" ON public.expenses
FOR ALL USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'treasurer']) 
  AND mr.active = true
));

CREATE POLICY "Users can manage their pledges" ON public.pledges
FOR ALL USING (auth.uid() = pledger_id);

CREATE POLICY "Admins can view all pledges" ON public.pledges
FOR SELECT USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'treasurer']) 
  AND mr.active = true
));

-- RLS Policies for Worship & Ministry
CREATE POLICY "Leaders can manage service plans" ON public.service_plans
FOR ALL USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'worship_leader', 'staff']) 
  AND mr.active = true
));

CREATE POLICY "Members can view service plans" ON public.service_plans
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Leaders can manage service elements" ON public.service_elements
FOR ALL USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'worship_leader', 'staff']) 
  AND mr.active = true
));

CREATE POLICY "Leaders can manage teams" ON public.teams
FOR ALL USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
  AND mr.active = true
));

CREATE POLICY "Members can view active teams" ON public.teams
FOR SELECT USING (status = 'active' AND auth.uid() IS NOT NULL);

CREATE POLICY "Team leaders can manage their team members" ON public.team_members
FOR ALL USING (
  EXISTS (SELECT 1 FROM teams t WHERE t.id = team_id AND t.leader_id = auth.uid())
  OR EXISTS (
    SELECT 1 FROM member_roles mr 
    WHERE mr.user_id = auth.uid() 
    AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
    AND mr.active = true
  )
);

CREATE POLICY "Users can view team memberships" ON public.team_members
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can view ministry resources based on access level" ON public.ministry_resources
FOR SELECT USING (
  CASE
    WHEN access_level = 'public' THEN true
    WHEN access_level = 'members' THEN auth.uid() IS NOT NULL
    WHEN access_level = 'leaders' THEN EXISTS (
      SELECT 1 FROM member_roles mr 
      WHERE mr.user_id = auth.uid() 
      AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff', 'worship_leader', 'small_group_leader']) 
      AND mr.active = true
    )
    WHEN access_level = 'admin' THEN EXISTS (
      SELECT 1 FROM member_roles mr 
      WHERE mr.user_id = auth.uid() 
      AND mr.role_name = ANY(ARRAY['admin', 'pastor']) 
      AND mr.active = true
    )
    ELSE false
  END
);

CREATE POLICY "Leaders can manage ministry resources" ON public.ministry_resources
FOR ALL USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
  AND mr.active = true
));

-- RLS Policies for Analytics
CREATE POLICY "Admins can manage attendance records" ON public.attendance_records
FOR ALL USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
  AND mr.active = true
));

CREATE POLICY "System can track member engagement" ON public.member_engagement
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own engagement" ON public.member_engagement
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all engagement" ON public.member_engagement
FOR SELECT USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor']) 
  AND mr.active = true
));

-- RLS Policies for Administrative
CREATE POLICY "Admins can manage rooms" ON public.rooms
FOR ALL USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
  AND mr.active = true
));

CREATE POLICY "Members can view available rooms" ON public.rooms
FOR SELECT USING (status = 'available' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can create room bookings" ON public.room_bookings
FOR INSERT WITH CHECK (auth.uid() = booked_by);

CREATE POLICY "Users can view their own bookings" ON public.room_bookings
FOR SELECT USING (auth.uid() = booked_by);

CREATE POLICY "Admins can manage all room bookings" ON public.room_bookings
FOR ALL USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
  AND mr.active = true
));

CREATE POLICY "Event organizers can check in attendees" ON public.check_ins
FOR INSERT WITH CHECK (EXISTS (
  SELECT 1 FROM events e 
  WHERE e.id = event_id AND e.organizer_id = auth.uid()
) OR EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
  AND mr.active = true
));

CREATE POLICY "Users can view check-ins for events they can access" ON public.check_ins
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage onboarding workflows" ON public.onboarding_workflows
FOR ALL USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
  AND mr.active = true
));

CREATE POLICY "Members can view active workflows" ON public.onboarding_workflows
FOR SELECT USING (is_active = true AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own onboarding progress" ON public.member_onboarding_progress
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage member onboarding progress" ON public.member_onboarding_progress
FOR ALL USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
  AND mr.active = true
));

-- Create indexes for performance
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient ON public.messages(recipient_id);
CREATE INDEX idx_messages_thread ON public.messages(thread_id);
CREATE INDEX idx_expenses_category ON public.expenses(budget_category_id);
CREATE INDEX idx_expenses_date ON public.expenses(expense_date);
CREATE INDEX idx_service_plans_date ON public.service_plans(service_date);
CREATE INDEX idx_attendance_date ON public.attendance_records(attendance_date);
CREATE INDEX idx_engagement_user ON public.member_engagement(user_id);
CREATE INDEX idx_engagement_activity ON public.member_engagement(activity_type);
CREATE INDEX idx_room_bookings_room ON public.room_bookings(room_id);
CREATE INDEX idx_room_bookings_time ON public.room_bookings(start_time, end_time);

-- Add triggers for updated_at columns
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON public.budgets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pledges_updated_at BEFORE UPDATE ON public.pledges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_service_plans_updated_at BEFORE UPDATE ON public.service_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ministry_resources_updated_at BEFORE UPDATE ON public.ministry_resources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_room_bookings_updated_at BEFORE UPDATE ON public.room_bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_onboarding_workflows_updated_at BEFORE UPDATE ON public.onboarding_workflows FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();