-- Create marketplace system for member services

-- Service categories for organization
CREATE TABLE public.service_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Services that members can offer
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.service_categories(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  price_type TEXT NOT NULL, -- 'fixed', 'hourly', 'quote', 'donation'
  price_amount INTEGER, -- in cents
  hourly_rate INTEGER, -- in cents for hourly services
  duration_minutes INTEGER, -- estimated duration
  location_type TEXT NOT NULL, -- 'online', 'in_person', 'both'
  location_details TEXT,
  images JSONB DEFAULT '[]',
  tags TEXT[],
  requirements TEXT,
  cancellation_policy TEXT,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  available_days TEXT[], -- ['monday', 'tuesday', etc.]
  available_hours JSONB DEFAULT '{"start": "09:00", "end": "17:00"}',
  max_advance_booking_days INTEGER DEFAULT 30,
  min_advance_booking_hours INTEGER DEFAULT 24,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Service bookings and orders
CREATE TABLE public.service_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_date TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  total_amount INTEGER NOT NULL, -- in cents
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  payment_status TEXT DEFAULT 'unpaid', -- 'unpaid', 'paid', 'refunded'
  payment_intent_id TEXT,
  customer_notes TEXT,
  provider_notes TEXT,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancelled_by UUID REFERENCES auth.users(id),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Service reviews and ratings
CREATE TABLE public.service_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.service_bookings(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Provider profiles for service providers
CREATE TABLE public.provider_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  business_name TEXT,
  bio TEXT,
  specialties TEXT[],
  certifications TEXT[],
  years_experience INTEGER,
  portfolio_images JSONB DEFAULT '[]',
  contact_phone TEXT,
  contact_email TEXT,
  website_url TEXT,
  social_links JSONB DEFAULT '{}',
  service_area TEXT,
  is_verified BOOLEAN DEFAULT false,
  verification_documents JSONB DEFAULT '[]',
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for service_categories
CREATE POLICY "Anyone can view active categories" 
ON public.service_categories FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage categories" 
ON public.service_categories FOR ALL 
USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'staff']) 
  AND mr.active = true
));

-- RLS Policies for services
CREATE POLICY "Anyone can view active services" 
ON public.services FOR SELECT 
USING (is_active = true);

CREATE POLICY "Providers can manage their services" 
ON public.services FOR ALL 
USING (auth.uid() = provider_id);

-- RLS Policies for service_bookings
CREATE POLICY "Users can view their own bookings" 
ON public.service_bookings FOR SELECT 
USING (auth.uid() = customer_id OR auth.uid() = provider_id);

CREATE POLICY "Users can create bookings" 
ON public.service_bookings FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Providers can update their bookings" 
ON public.service_bookings FOR UPDATE 
USING (auth.uid() = provider_id OR auth.uid() = customer_id);

-- RLS Policies for service_reviews
CREATE POLICY "Anyone can view public reviews" 
ON public.service_reviews FOR SELECT 
USING (is_public = true);

CREATE POLICY "Users can create reviews for their bookings" 
ON public.service_reviews FOR INSERT 
WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Reviewers can update their own reviews" 
ON public.service_reviews FOR UPDATE 
USING (auth.uid() = reviewer_id);

-- RLS Policies for provider_profiles
CREATE POLICY "Anyone can view provider profiles" 
ON public.provider_profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their provider profile" 
ON public.provider_profiles FOR ALL 
USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_bookings_updated_at
  BEFORE UPDATE ON public.service_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_provider_profiles_updated_at
  BEFORE UPDATE ON public.provider_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default service categories
INSERT INTO public.service_categories (name, description, icon_name, sort_order) VALUES
('Pastoral Care', 'Counseling, spiritual guidance, and pastoral services', 'Heart', 1),
('Music & Worship', 'Music lessons, worship leading, and audio/visual services', 'Music', 2),
('Event Planning', 'Wedding planning, event coordination, and venue services', 'Calendar', 3),
('Home Services', 'Cleaning, maintenance, landscaping, and repairs', 'Home', 4),
('Professional Services', 'Legal, financial, accounting, and business consulting', 'Briefcase', 5),
('Technology', 'Web design, IT support, and digital services', 'Monitor', 6),
('Education & Tutoring', 'Teaching, tutoring, and educational services', 'GraduationCap', 7),
('Health & Wellness', 'Fitness training, nutrition, and wellness coaching', 'Heart', 8),
('Transportation', 'Moving services, delivery, and transportation', 'Truck', 9),
('Childcare & Elder Care', 'Babysitting, elder care, and companion services', 'Users', 10);