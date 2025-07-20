-- Create grief and bereavement support tables

-- Memorial tributes for departed members
CREATE TABLE public.memorials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deceased_name TEXT NOT NULL,
  date_of_birth DATE,
  date_of_passing DATE NOT NULL,
  biography TEXT,
  photo_url TEXT,
  service_date TIMESTAMP WITH TIME ZONE,
  service_location TEXT,
  family_contact_info TEXT,
  memorial_fund_info TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active'
);

-- Bereavement care coordination
CREATE TABLE public.bereavement_care (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  memorial_id UUID REFERENCES public.memorials(id) ON DELETE CASCADE,
  family_member_id UUID REFERENCES auth.users(id),
  care_coordinator_id UUID REFERENCES auth.users(id),
  care_type TEXT NOT NULL, -- 'pastoral_visit', 'meal_train', 'transportation', 'childcare', 'other'
  description TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Grief support groups and counseling sessions
CREATE TABLE public.grief_support_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  session_type TEXT NOT NULL, -- 'support_group', 'individual_counseling', 'workshop', 'retreat'
  facilitator_id UUID REFERENCES auth.users(id),
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  max_participants INTEGER,
  registration_required BOOLEAN DEFAULT true,
  cost INTEGER DEFAULT 0,
  resources TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'scheduled'
);

-- Session registrations
CREATE TABLE public.grief_session_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.grief_support_sessions(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  registration_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  attendance_status TEXT DEFAULT 'registered', -- 'registered', 'attended', 'missed', 'cancelled'
  notes TEXT,
  UNIQUE(session_id, participant_id)
);

-- Memorial tributes and condolences
CREATE TABLE public.memorial_tributes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  memorial_id UUID REFERENCES public.memorials(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT,
  tribute_text TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.memorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bereavement_care ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grief_support_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grief_session_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memorial_tributes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for memorials
CREATE POLICY "Anyone can view active memorials" 
ON public.memorials FOR SELECT 
USING (status = 'active');

CREATE POLICY "Leaders can manage memorials" 
ON public.memorials FOR ALL 
USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
  AND mr.active = true
));

-- RLS Policies for bereavement care
CREATE POLICY "Leaders can manage bereavement care" 
ON public.bereavement_care FOR ALL 
USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
  AND mr.active = true
));

CREATE POLICY "Family members can view their care records" 
ON public.bereavement_care FOR SELECT 
USING (auth.uid() = family_member_id);

-- RLS Policies for grief support sessions
CREATE POLICY "Anyone can view scheduled sessions" 
ON public.grief_support_sessions FOR SELECT 
USING (status = 'scheduled');

CREATE POLICY "Leaders can manage grief sessions" 
ON public.grief_support_sessions FOR ALL 
USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
  AND mr.active = true
));

-- RLS Policies for session registrations
CREATE POLICY "Users can manage their own registrations" 
ON public.grief_session_registrations FOR ALL 
USING (auth.uid() = participant_id);

CREATE POLICY "Leaders can view all registrations" 
ON public.grief_session_registrations FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
  AND mr.active = true
));

-- RLS Policies for memorial tributes
CREATE POLICY "Anyone can view public tributes" 
ON public.memorial_tributes FOR SELECT 
USING (is_public = true);

CREATE POLICY "Users can create tributes" 
ON public.memorial_tributes FOR INSERT 
WITH CHECK (auth.uid() = author_id OR author_id IS NULL);

CREATE POLICY "Leaders can manage all tributes" 
ON public.memorial_tributes FOR ALL 
USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
  AND mr.active = true
));

-- Triggers for updated_at
CREATE TRIGGER update_memorials_updated_at
  BEFORE UPDATE ON public.memorials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bereavement_care_updated_at
  BEFORE UPDATE ON public.bereavement_care
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_grief_support_sessions_updated_at
  BEFORE UPDATE ON public.grief_support_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();