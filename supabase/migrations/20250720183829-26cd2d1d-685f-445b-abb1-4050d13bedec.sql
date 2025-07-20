-- Create member directory table for enhanced member connections
CREATE TABLE public.member_directory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  show_email BOOLEAN DEFAULT false,
  show_phone BOOLEAN DEFAULT false,
  show_address BOOLEAN DEFAULT false,
  show_birthday BOOLEAN DEFAULT true,
  show_ministry_interests BOOLEAN DEFAULT true,
  show_skills BOOLEAN DEFAULT true,
  directory_bio TEXT,
  contact_preferences JSONB DEFAULT '{"email": true, "phone": false, "in_person": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on member directory
ALTER TABLE public.member_directory ENABLE ROW LEVEL SECURITY;

-- Create policies for member directory
CREATE POLICY "Users can manage their own directory settings" 
ON public.member_directory 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Members can view visible directory entries" 
ON public.member_directory 
FOR SELECT 
USING (is_visible = true AND auth.uid() IS NOT NULL);

-- Create member connections table for tracking connections
CREATE TABLE public.member_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  requested_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(requester_id, requested_id)
);

-- Enable RLS on member connections
ALTER TABLE public.member_connections ENABLE ROW LEVEL SECURITY;

-- Create policies for member connections
CREATE POLICY "Users can view their connections" 
ON public.member_connections 
FOR SELECT 
USING (auth.uid() = requester_id OR auth.uid() = requested_id);

CREATE POLICY "Users can create connection requests" 
ON public.member_connections 
FOR INSERT 
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update their connection responses" 
ON public.member_connections 
FOR UPDATE 
USING (auth.uid() = requested_id OR auth.uid() = requester_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_member_directory_updated_at
  BEFORE UPDATE ON public.member_directory
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_member_connections_updated_at
  BEFORE UPDATE ON public.member_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_member_directory_visible ON public.member_directory(is_visible);
CREATE INDEX idx_member_connections_status ON public.member_connections(status);
CREATE INDEX idx_member_connections_requester ON public.member_connections(requester_id);
CREATE INDEX idx_member_connections_requested ON public.member_connections(requested_id);