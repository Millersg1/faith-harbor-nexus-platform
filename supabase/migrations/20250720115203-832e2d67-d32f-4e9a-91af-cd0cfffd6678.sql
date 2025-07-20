-- Enable RLS on existing tables for real-time analytics
ALTER TABLE public.donations REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.events REPLICA IDENTITY FULL;

-- Add the tables to the realtime publication for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.donations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;

-- Create member_engagement table for engagement tracking
CREATE TABLE IF NOT EXISTS public.member_engagement (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  activity_type VARCHAR(50) NOT NULL,
  engagement_score INTEGER NOT NULL DEFAULT 0,
  activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on member_engagement
ALTER TABLE public.member_engagement ENABLE ROW LEVEL SECURITY;

-- Create policies for member_engagement
CREATE POLICY "Users can view their own engagement" 
ON public.member_engagement 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own engagement records" 
ON public.member_engagement 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view all engagement for analytics" 
ON public.member_engagement 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Add real-time capabilities to existing attendance_records and event_registrations tables
ALTER TABLE public.attendance_records REPLICA IDENTITY FULL;
ALTER TABLE public.event_registrations REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance_records;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_registrations;

-- Add real-time capabilities to new member_engagement table
ALTER TABLE public.member_engagement REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.member_engagement;

-- Create trigger for updated_at column on member_engagement
CREATE TRIGGER update_member_engagement_updated_at
BEFORE UPDATE ON public.member_engagement
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();