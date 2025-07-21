-- Create bereavement care table for tracking care coordination
CREATE TABLE public.bereavement_care (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  memorial_id UUID REFERENCES public.memorials(id) ON DELETE SET NULL,
  care_type TEXT NOT NULL,
  description TEXT,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  assigned_to UUID, -- References auth.users but don't create foreign key constraint
  created_by UUID, -- References auth.users but don't create foreign key constraint
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Constraints
  CONSTRAINT bereavement_care_status_check CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  CONSTRAINT bereavement_care_priority_check CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  CONSTRAINT bereavement_care_type_check CHECK (care_type IN ('pastoral_visit', 'meal_train', 'transportation', 'childcare', 'household_help', 'funeral_support', 'follow_up_call', 'prayer_support', 'other'))
);

-- Enable Row Level Security
ALTER TABLE public.bereavement_care ENABLE ROW LEVEL SECURITY;

-- Create policies for bereavement care
CREATE POLICY "Anyone can view bereavement care items" 
ON public.bereavement_care 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage bereavement care" 
ON public.bereavement_care 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_bereavement_care_updated_at
BEFORE UPDATE ON public.bereavement_care
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create some sample bereavement care data
INSERT INTO public.bereavement_care (care_type, description, status, scheduled_date, priority) VALUES
('pastoral_visit', 'Schedule pastoral visit to comfort the Johnson family', 'pending', (now() + INTERVAL '2 days')::timestamp, 'high'),
('meal_train', 'Organize meal delivery for the Smith family for next week', 'in_progress', (now() + INTERVAL '1 day')::timestamp, 'medium'),
('transportation', 'Provide transportation assistance for funeral arrangements', 'pending', (now() + INTERVAL '3 days')::timestamp, 'medium'),
('follow_up_call', 'Follow-up call to check on family wellbeing', 'pending', (now() + INTERVAL '1 week')::timestamp, 'low');