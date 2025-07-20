-- Create service bookings table
CREATE TABLE public.service_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL,
  booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_hours INTEGER NOT NULL DEFAULT 1,
  total_amount INTEGER NOT NULL, -- in cents
  commission_amount INTEGER NOT NULL, -- in cents (12%)
  upfront_amount INTEGER NOT NULL, -- in cents (50%)
  completion_amount INTEGER NOT NULL, -- in cents (50%)
  booking_type TEXT NOT NULL CHECK (booking_type IN ('one_time', 'recurring')),
  recurring_frequency TEXT CHECK (recurring_frequency IN ('weekly', 'monthly', 'quarterly')),
  status TEXT NOT NULL DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'approved', 'payment_pending', 'upfront_paid', 'in_progress', 'completed', 'cancelled', 'refunded')),
  provider_notes TEXT,
  customer_notes TEXT,
  location_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create payment transactions table
CREATE TABLE public.payment_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.service_bookings(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  stripe_subscription_id TEXT,
  amount INTEGER NOT NULL, -- in cents
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('upfront', 'completion', 'commission', 'refund')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe_card', 'stripe_subscription')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded')),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  stripe_webhook_data JSONB
);

-- Create provider profiles table for payment info
CREATE TABLE public.provider_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  business_name TEXT,
  business_description TEXT,
  stripe_account_id TEXT,
  average_rating DECIMAL(2,1) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  total_earnings INTEGER DEFAULT 0, -- in cents
  commission_rate DECIMAL(4,2) DEFAULT 12.00, -- percentage
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create service categories table
CREATE TABLE public.service_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default service categories
INSERT INTO public.service_categories (name, description, icon_name, sort_order) VALUES
('Home & Garden', 'Home maintenance, gardening, cleaning services', 'Home', 1),
('Professional Services', 'Legal, accounting, consulting, business services', 'Briefcase', 2),
('Health & Wellness', 'Fitness training, nutrition counseling, therapy', 'Heart', 3),
('Education & Tutoring', 'Academic tutoring, music lessons, skill training', 'BookOpen', 4),
('Technology', 'Computer repair, web design, tech support', 'Monitor', 5),
('Transportation', 'Moving services, delivery, ride sharing', 'Car', 6),
('Creative Services', 'Photography, design, writing, art', 'Palette', 7),
('Childcare & Elder Care', 'Babysitting, elderly care, pet sitting', 'Users', 8);

-- Enable Row Level Security
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

-- Service bookings policies
CREATE POLICY "Customers can view their bookings" ON public.service_bookings
FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Providers can view their bookings" ON public.service_bookings
FOR SELECT USING (auth.uid() = provider_id);

CREATE POLICY "Customers can create bookings" ON public.service_bookings
FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Providers can update their bookings" ON public.service_bookings
FOR UPDATE USING (auth.uid() = provider_id);

CREATE POLICY "Customers can update their bookings" ON public.service_bookings
FOR UPDATE USING (auth.uid() = customer_id);

CREATE POLICY "Admins can manage all bookings" ON public.service_bookings
FOR ALL USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'staff']) 
  AND mr.active = true
));

-- Payment transactions policies
CREATE POLICY "Users can view transactions for their bookings" ON public.payment_transactions
FOR SELECT USING (EXISTS (
  SELECT 1 FROM service_bookings sb 
  WHERE sb.id = payment_transactions.booking_id 
  AND (sb.customer_id = auth.uid() OR sb.provider_id = auth.uid())
));

CREATE POLICY "System can insert transactions" ON public.payment_transactions
FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update transactions" ON public.payment_transactions
FOR UPDATE USING (true);

-- Provider profiles policies
CREATE POLICY "Anyone can view approved provider profiles" ON public.provider_profiles
FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can manage their provider profile" ON public.provider_profiles
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage provider profiles" ON public.provider_profiles
FOR ALL USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'staff']) 
  AND mr.active = true
));

-- Service categories policies
CREATE POLICY "Anyone can view active categories" ON public.service_categories
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON public.service_categories
FOR ALL USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'staff']) 
  AND mr.active = true
));

-- Add foreign key constraints
ALTER TABLE public.services ADD CONSTRAINT fk_services_provider 
FOREIGN KEY (provider_id) REFERENCES public.provider_profiles(user_id);

ALTER TABLE public.services ADD CONSTRAINT fk_services_category 
FOREIGN KEY (category_id) REFERENCES public.service_categories(id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_service_bookings_updated_at
BEFORE UPDATE ON public.service_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_provider_profiles_updated_at
BEFORE UPDATE ON public.provider_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate booking amounts
CREATE OR REPLACE FUNCTION calculate_booking_amounts()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate commission (12% of total)
  NEW.commission_amount := ROUND(NEW.total_amount * 0.12);
  
  -- Calculate 50/50 split for customer payments
  NEW.upfront_amount := ROUND(NEW.total_amount * 0.5);
  NEW.completion_amount := NEW.total_amount - NEW.upfront_amount;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic amount calculations
CREATE TRIGGER calculate_booking_amounts_trigger
BEFORE INSERT OR UPDATE ON public.service_bookings
FOR EACH ROW
EXECUTE FUNCTION calculate_booking_amounts();