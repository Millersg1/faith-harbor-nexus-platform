-- Complete all remaining critical security fixes - Part 2

-- Fix wedding_vendors table RLS (table already exists with different structure)
ALTER TABLE public.wedding_vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vendor public info" 
ON public.wedding_vendors 
FOR SELECT 
USING (true);

CREATE POLICY "Vendors and staff can manage vendor information" 
ON public.wedding_vendors 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'wedding_coordinator', 'staff', 'vendor']) 
  AND mr.active = true
));

-- Fix wedding_guests table RLS (table already exists)
ALTER TABLE public.wedding_guests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Couples and coordinators can manage wedding guests" 
ON public.wedding_guests 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM wedding_couples wc 
  WHERE wc.id = wedding_guests.couple_id 
  AND (
    wc.bride_id = auth.uid() OR 
    wc.groom_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM member_roles mr 
      WHERE mr.user_id = auth.uid() 
      AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'wedding_coordinator']) 
      AND mr.active = true
    )
  )
));

-- Fix function search paths for security
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND active = true
  )
$$;

DROP FUNCTION IF EXISTS public.handle_new_user();
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

DROP FUNCTION IF EXISTS public.update_user_presence();
CREATE OR REPLACE FUNCTION public.update_user_presence()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  NEW.last_seen = now();
  RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.calculate_course_progress(uuid);
CREATE OR REPLACE FUNCTION public.calculate_course_progress(enrollment_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

DROP FUNCTION IF EXISTS public.update_updated_at_column();
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.create_sample_websites_for_user();
CREATE OR REPLACE FUNCTION public.create_sample_websites_for_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only create if user doesn't already have websites
  IF NOT EXISTS (SELECT 1 FROM public.user_websites WHERE user_id = auth.uid()) THEN
    INSERT INTO public.user_websites (name, content_data, domain, user_id, is_published) VALUES
    ('Faith Harbor Community Church', '{"title": "Welcome to Faith Harbor", "description": "Join our community of faith"}', 'faithharbor.lovable.app', auth.uid(), true),
    ('Grace Fellowship Website', '{"title": "Grace Fellowship", "description": "Experience Gods grace with us"}', 'grace.lovable.app', auth.uid(), true),
    ('Ministry Outreach Site', '{"title": "Ministry Outreach", "description": "Reaching hearts and souls"}', 'ministry.lovable.app', auth.uid(), false);
  END IF;
END;
$$;