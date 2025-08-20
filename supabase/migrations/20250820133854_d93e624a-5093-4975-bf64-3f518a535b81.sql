-- Fix critical security vulnerabilities identified in security scan

-- 1. Fix baptisms table - missing RLS and public access
ALTER TABLE public.baptisms ENABLE ROW LEVEL SECURITY;

-- Create policies for baptisms table
CREATE POLICY "Candidates can view their own baptism records" 
ON public.baptisms 
FOR SELECT 
USING (
  auth.uid() = candidate_id OR 
  auth.uid()::text = candidate_email OR 
  auth.uid()::text = parent_guardian_email
);

CREATE POLICY "Church staff can manage all baptisms" 
ON public.baptisms 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff', 'baptism_coordinator']) 
  AND mr.active = true
));

CREATE POLICY "Candidates can update their own baptism records" 
ON public.baptisms 
FOR UPDATE 
USING (
  auth.uid() = candidate_id OR 
  auth.uid()::text = candidate_email OR 
  auth.uid()::text = parent_guardian_email
);

-- 2. Secure the contact_form_submissions table better
DROP POLICY IF EXISTS "Allow public to submit contact forms" ON public.contact_form_submissions;
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_form_submissions;

CREATE POLICY "Allow public to submit contact forms" 
ON public.contact_form_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only staff can view contact submissions" 
ON public.contact_form_submissions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
  AND mr.active = true
));

CREATE POLICY "Only admins can manage contact submissions" 
ON public.contact_form_submissions 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = 'admin' 
  AND mr.active = true
));

-- 3. Improve prayer requests privacy
DROP POLICY IF EXISTS "Users can view prayer requests based on privacy level" ON public.prayer_requests;

CREATE POLICY "Users can view prayer requests based on privacy level" 
ON public.prayer_requests 
FOR SELECT 
USING (
  CASE privacy_level
    WHEN 'public' THEN true
    WHEN 'members' THEN auth.uid() IS NOT NULL
    WHEN 'private' THEN (
      auth.uid() = requester_id OR 
      EXISTS (
        SELECT 1 FROM member_roles mr 
        WHERE mr.user_id = auth.uid() 
        AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'prayer_team']) 
        AND mr.active = true
      )
    )
    ELSE false
  END
);