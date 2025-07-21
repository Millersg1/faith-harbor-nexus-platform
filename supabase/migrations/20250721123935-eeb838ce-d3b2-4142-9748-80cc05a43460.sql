-- Create emergency_broadcasts table
CREATE TABLE public.emergency_broadcasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  channels JSONB NOT NULL DEFAULT '[]'::jsonb,
  target_groups JSONB NOT NULL DEFAULT '[]'::jsonb,
  sent_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_by UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'cancelled')),
  recipient_count INTEGER DEFAULT 0,
  delivery_stats JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.emergency_broadcasts ENABLE ROW LEVEL SECURITY;

-- Create policies for emergency broadcasts
CREATE POLICY "Authorized users can manage emergency broadcasts"
ON public.emergency_broadcasts
FOR ALL
USING (
  EXISTS (
    SELECT 1 
    FROM member_roles mr 
    WHERE mr.user_id = auth.uid() 
    AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff', 'emergency_coordinator']) 
    AND mr.active = true
  )
);

-- Create user_notification_preferences table
CREATE TABLE public.user_notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for notification preferences
CREATE POLICY "Users can manage their own notification preferences"
ON public.user_notification_preferences
FOR ALL
USING (auth.uid() = user_id);

-- Add missing columns to notifications table if they don't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'action_text') THEN
    ALTER TABLE public.notifications ADD COLUMN action_text TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'priority') THEN
    ALTER TABLE public.notifications ADD COLUMN priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'notifications' AND column_name = 'scheduled_for') THEN
    ALTER TABLE public.notifications ADD COLUMN scheduled_for TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Create trigger for updating timestamps
CREATE TRIGGER update_emergency_broadcasts_updated_at
BEFORE UPDATE ON public.emergency_broadcasts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_notification_preferences_updated_at
BEFORE UPDATE ON public.user_notification_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();