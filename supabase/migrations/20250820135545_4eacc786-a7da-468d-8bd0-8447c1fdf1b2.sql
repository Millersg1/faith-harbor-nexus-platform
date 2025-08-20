-- Complete remaining security fixes with correct table structures

-- 1. Fix wedding_vendors table properly
CREATE TABLE IF NOT EXISTS public.wedding_vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name text NOT NULL,
  contact_email text,
  contact_phone text,
  business_type text,
  public_description text,
  website_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.wedding_vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vendor public info" 
ON public.wedding_vendors 
FOR SELECT 
USING (true);

CREATE POLICY "Staff can manage vendor information" 
ON public.wedding_vendors 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'wedding_coordinator', 'staff']) 
  AND mr.active = true
));

-- 2. Fix function search paths for security
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
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
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert/update profile
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
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  NEW.last_seen = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_course_progress(enrollment_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_sample_websites_for_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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