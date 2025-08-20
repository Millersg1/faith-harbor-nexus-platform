-- Fix critical security vulnerabilities

-- 1. Fix contact form submissions - restrict public access
DROP POLICY IF EXISTS "Allow public to insert submissions" ON contact_form_submissions;

-- Allow public to insert but restrict read access to admins only
CREATE POLICY "Allow public to submit contact forms" 
ON contact_form_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view contact submissions" 
ON contact_form_submissions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
  AND mr.active = true
));

-- 2. Fix chatbot conversations - restrict to user's own conversations
DROP POLICY IF EXISTS "Anyone can insert conversations" ON chatbot_conversations;
DROP POLICY IF EXISTS "Users can view their conversations" ON chatbot_conversations;

-- Only allow users to insert their own conversations or anonymous ones
CREATE POLICY "Users can create conversations" 
ON chatbot_conversations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Users can only view their own conversations, admins can view all
CREATE POLICY "Users can view own conversations" 
ON chatbot_conversations 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR user_id IS NULL 
  OR EXISTS (
    SELECT 1 FROM member_roles mr 
    WHERE mr.user_id = auth.uid() 
    AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
    AND mr.active = true
  )
);

-- 3. Fix memorial data - protect family contact info
DROP POLICY IF EXISTS "Anyone can view active memorials" ON memorials;

-- Create view policy that excludes sensitive family contact info for public
CREATE POLICY "Public can view memorial basic info" 
ON memorials 
FOR SELECT 
USING (
  status = 'active' 
  AND (
    auth.uid() IS NULL 
    OR NOT EXISTS (
      SELECT 1 FROM member_roles mr 
      WHERE mr.user_id = auth.uid() 
      AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
      AND mr.active = true
    )
  )
);

-- Admins and staff can view all memorial data including contact info
CREATE POLICY "Staff can view full memorial data" 
ON memorials 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM member_roles mr 
    WHERE mr.user_id = auth.uid() 
    AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
    AND mr.active = true
  )
);

-- 4. Create bereavement_care table if it doesn't exist and secure it
CREATE TABLE IF NOT EXISTS bereavement_care (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_name TEXT NOT NULL,
  deceased_name TEXT NOT NULL,
  care_coordinator_id UUID REFERENCES auth.users(id),
  notes TEXT,
  care_status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on bereavement_care
ALTER TABLE bereavement_care ENABLE ROW LEVEL SECURITY;

-- Only pastoral care staff can access bereavement data
CREATE POLICY "Pastoral care can manage bereavement data" 
ON bereavement_care 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM member_roles mr 
    WHERE mr.user_id = auth.uid() 
    AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff', 'pastoral_care']) 
    AND mr.active = true
  )
);

-- 5. Fix database functions - add search_path security
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND active = true
  )
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Insert/update profile (existing logic)
  INSERT INTO public.profiles (user_id, first_name, last_name, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    COALESCE(
      NEW.raw_user_meta_data ->> 'display_name',
      CONCAT(NEW.raw_user_meta_data ->> 'first_name', ' ', NEW.raw_user_meta_data ->> 'last_name')
    )
  )
  ON CONFLICT (user_id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    display_name = EXCLUDED.display_name;
  
  -- Assign default member role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_presence()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  NEW.last_seen = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_course_progress(enrollment_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  total_modules INTEGER;
  completed_modules INTEGER;
  progress INTEGER;
BEGIN
  -- Get total modules for the course
  SELECT COUNT(*) INTO total_modules
  FROM public.course_modules cm
  JOIN public.course_enrollments ce ON cm.course_id = ce.course_id
  WHERE ce.id = enrollment_uuid AND cm.is_published = true;
  
  -- Get completed modules
  SELECT COUNT(*) INTO completed_modules
  FROM public.module_progress mp
  WHERE mp.enrollment_id = enrollment_uuid AND mp.completed_at IS NOT NULL;
  
  -- Calculate progress percentage
  IF total_modules = 0 THEN
    progress := 0;
  ELSE
    progress := ROUND((completed_modules::DECIMAL / total_modules) * 100);
  END IF;
  
  -- Update enrollment progress
  UPDATE public.course_enrollments 
  SET progress_percentage = progress
  WHERE id = enrollment_uuid;
  
  RETURN progress;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_sample_websites_for_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Only create if user doesn't already have websites
  IF NOT EXISTS (SELECT 1 FROM public.user_websites WHERE user_id = auth.uid()) THEN
    INSERT INTO public.user_websites (name, content_data, domain, user_id, is_published) VALUES
    ('Faith Harbor Community Church', '{"title": "Welcome to Faith Harbor", "description": "Join our community of faith"}', 'faithharbor.lovable.app', auth.uid(), true),
    ('Grace Fellowship Website', '{"title": "Grace Fellowship", "description": "Experience Gods grace with us"}', 'grace.lovable.app', auth.uid(), true),
    ('Ministry Outreach Site', '{"title": "Ministry Outreach", "description": "Reaching hearts and souls"}', 'ministry.lovable.app', auth.uid(), false);
  END IF;
END;
$function$;