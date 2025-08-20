-- Create baptism and sacraments tracking system

-- Enum for sacrament types
CREATE TYPE public.sacrament_type AS ENUM (
  'baptism',
  'confirmation',
  'communion',
  'dedication',
  'blessing'
);

-- Enum for baptism method
CREATE TYPE public.baptism_method AS ENUM (
  'immersion',
  'sprinkling',
  'pouring'
);

-- Main baptisms table
CREATE TABLE public.baptisms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT,
  candidate_phone TEXT,
  date_of_birth DATE,
  baptism_date TIMESTAMP WITH TIME ZONE NOT NULL,
  sacrament_type public.sacrament_type NOT NULL DEFAULT 'baptism',
  baptism_method public.baptism_method DEFAULT 'immersion',
  
  -- Family/Guardian information
  parent_guardian_name TEXT,
  parent_guardian_email TEXT,
  parent_guardian_phone TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  
  -- Church details
  officiant_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  location TEXT NOT NULL,
  witnesses JSONB DEFAULT '[]'::jsonb,
  
  -- Preparation and documentation
  preparation_completed BOOLEAN DEFAULT false,
  preparation_completion_date DATE,
  counseling_sessions_completed INTEGER DEFAULT 0,
  certificate_issued BOOLEAN DEFAULT false,
  certificate_number TEXT UNIQUE,
  
  -- Additional details
  special_requests TEXT,
  medical_considerations TEXT,
  notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'postponed')),
  
  -- Photos and media
  photos JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Baptism preparation classes/sessions
CREATE TABLE public.baptism_preparation_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  instructor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  location TEXT,
  max_participants INTEGER,
  cost INTEGER DEFAULT 0, -- in cents
  materials_provided JSONB DEFAULT '[]'::jsonb,
  requirements TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Track who attended which preparation sessions
CREATE TABLE public.baptism_preparation_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  baptism_id UUID REFERENCES public.baptisms(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.baptism_preparation_sessions(id) ON DELETE CASCADE,
  attended BOOLEAN DEFAULT false,
  notes TEXT,
  attendance_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(baptism_id, session_id)
);

-- Certificate templates and tracking
CREATE TABLE public.baptism_certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  baptism_id UUID REFERENCES public.baptisms(id) ON DELETE CASCADE,
  certificate_number TEXT NOT NULL UNIQUE,
  template_used TEXT,
  issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
  issued_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  recipient_name TEXT NOT NULL,
  certificate_url TEXT,
  printed BOOLEAN DEFAULT false,
  mailed BOOLEAN DEFAULT false,
  mailing_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.baptisms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.baptism_preparation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.baptism_preparation_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.baptism_certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for baptisms
CREATE POLICY "Church leaders can manage all baptisms"
ON public.baptisms
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM member_roles mr
    WHERE mr.user_id = auth.uid()
    AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff', 'baptism_coordinator'])
    AND mr.active = true
  )
);

CREATE POLICY "Candidates can view their own baptism records"
ON public.baptisms
FOR SELECT
USING (auth.uid() = candidate_id);

CREATE POLICY "Public can create baptism requests"
ON public.baptisms
FOR INSERT
WITH CHECK (true);

-- RLS Policies for preparation sessions
CREATE POLICY "Anyone can view scheduled preparation sessions"
ON public.baptism_preparation_sessions
FOR SELECT
USING (status = 'scheduled');

CREATE POLICY "Church leaders can manage preparation sessions"
ON public.baptism_preparation_sessions
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM member_roles mr
    WHERE mr.user_id = auth.uid()
    AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff', 'baptism_coordinator'])
    AND mr.active = true
  )
);

-- RLS Policies for attendance
CREATE POLICY "Church leaders can manage attendance"
ON public.baptism_preparation_attendance
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM member_roles mr
    WHERE mr.user_id = auth.uid()
    AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff', 'baptism_coordinator'])
    AND mr.active = true
  )
);

CREATE POLICY "Candidates can view their attendance"
ON public.baptism_preparation_attendance
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.baptisms b
    WHERE b.id = baptism_id
    AND b.candidate_id = auth.uid()
  )
);

-- RLS Policies for certificates
CREATE POLICY "Church leaders can manage certificates"
ON public.baptism_certificates
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM member_roles mr
    WHERE mr.user_id = auth.uid()
    AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff', 'baptism_coordinator'])
    AND mr.active = true
  )
);

CREATE POLICY "Recipients can view their certificates"
ON public.baptism_certificates
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.baptisms b
    WHERE b.id = baptism_id
    AND b.candidate_id = auth.uid()
  )
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_baptisms_updated_at
  BEFORE UPDATE ON public.baptisms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_baptism_preparation_sessions_updated_at
  BEFORE UPDATE ON public.baptism_preparation_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_baptisms_candidate_id ON public.baptisms(candidate_id);
CREATE INDEX idx_baptisms_officiant_id ON public.baptisms(officiant_id);
CREATE INDEX idx_baptisms_baptism_date ON public.baptisms(baptism_date);
CREATE INDEX idx_baptisms_status ON public.baptisms(status);
CREATE INDEX idx_baptism_preparation_sessions_date ON public.baptism_preparation_sessions(session_date);
CREATE INDEX idx_baptism_certificates_baptism_id ON public.baptism_certificates(baptism_id);