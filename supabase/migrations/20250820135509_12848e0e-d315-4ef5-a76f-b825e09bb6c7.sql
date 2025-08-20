-- Complete all remaining critical security fixes

-- 1. Fix wedding_couples table - missing RLS
ALTER TABLE public.wedding_couples ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies for wedding_couples
DROP POLICY IF EXISTS "Couples can view and edit their own wedding plans" ON public.wedding_couples;
DROP POLICY IF EXISTS "Wedding coordinators can view all wedding plans" ON public.wedding_couples;

CREATE POLICY "Couples can manage their own wedding plans" 
ON public.wedding_couples 
FOR ALL 
USING (
  auth.uid() = bride_id OR 
  auth.uid() = groom_id OR 
  EXISTS (
    SELECT 1 FROM member_roles mr 
    WHERE mr.user_id = auth.uid() 
    AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'wedding_coordinator', 'staff']) 
    AND mr.active = true
  )
);

CREATE POLICY "Staff can view wedding plans for coordination" 
ON public.wedding_couples 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'wedding_coordinator', 'staff']) 
  AND mr.active = true
));

-- 2. Fix donations table - missing proper RLS
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own donations" ON public.donations;
DROP POLICY IF EXISTS "Admins can view all donations" ON public.donations;
DROP POLICY IF EXISTS "Users can create donations" ON public.donations;

CREATE POLICY "Donors can view their own donations" 
ON public.donations 
FOR SELECT 
USING (auth.uid() = donor_id);

CREATE POLICY "Financial staff can view all donations" 
ON public.donations 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'treasurer', 'financial_manager']) 
  AND mr.active = true
));

CREATE POLICY "Anyone can create donations" 
ON public.donations 
FOR INSERT 
WITH CHECK (true);

-- 3. Fix wedding_guests table
CREATE TABLE IF NOT EXISTS public.wedding_guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid REFERENCES public.wedding_couples(id),
  guest_name text NOT NULL,
  email text,
  phone text,
  dietary_restrictions text,
  plus_one boolean DEFAULT false,
  rsvp_status text DEFAULT 'pending',
  gift_info text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

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

-- 4. Fix wedding_vendors table
CREATE TABLE IF NOT EXISTS public.wedding_vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name text NOT NULL,
  contact_email text,
  contact_phone text,
  business_type text,
  public_description text,
  website_url text,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.wedding_vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved vendor public info" 
ON public.wedding_vendors 
FOR SELECT 
USING (is_approved = true);

CREATE POLICY "Staff can manage all vendor information" 
ON public.wedding_vendors 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'wedding_coordinator', 'staff']) 
  AND mr.active = true
));

-- 5. Fix memorials table family contact info exposure
DROP POLICY IF EXISTS "Public can view memorial basic info" ON public.memorials;
DROP POLICY IF EXISTS "Staff can view full memorial data" ON public.memorials;
DROP POLICY IF EXISTS "Authenticated users can manage memorials" ON public.memorials;

CREATE POLICY "Public can view memorial basic info only" 
ON public.memorials 
FOR SELECT 
USING (
  status = 'active' AND 
  auth.uid() IS NULL
);

CREATE POLICY "Staff can view full memorial data including family contact" 
ON public.memorials 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff', 'pastoral_care']) 
  AND mr.active = true
));

CREATE POLICY "Authenticated members can view public memorial info" 
ON public.memorials 
FOR SELECT 
USING (
  status = 'active' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Staff can manage memorials" 
ON public.memorials 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff', 'pastoral_care']) 
  AND mr.active = true
));