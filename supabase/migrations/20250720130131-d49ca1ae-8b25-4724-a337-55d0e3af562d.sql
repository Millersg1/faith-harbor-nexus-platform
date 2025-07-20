-- Create website builder tables
CREATE TABLE public.website_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  niche TEXT NOT NULL,
  preview_image TEXT,
  template_data JSONB NOT NULL DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.funnel_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  funnel_type TEXT NOT NULL, -- landing, sales, lead-magnet, webinar, etc
  niche TEXT NOT NULL,
  steps INTEGER DEFAULT 1,
  conversion_rate DECIMAL(5,2), -- estimated conversion rate
  template_data JSONB NOT NULL DEFAULT '{}',
  preview_images TEXT[] DEFAULT '{}',
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.user_websites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES website_templates(id),
  name TEXT NOT NULL,
  domain TEXT,
  custom_domain TEXT,
  content_data JSONB NOT NULL DEFAULT '{}',
  seo_settings JSONB DEFAULT '{}',
  analytics_data JSONB DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.user_funnels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES funnel_templates(id),
  name TEXT NOT NULL,
  funnel_type TEXT NOT NULL,
  steps_data JSONB NOT NULL DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  analytics_data JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.funnel_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funnel_id UUID REFERENCES user_funnels(id) ON DELETE CASCADE,
  step_index INTEGER NOT NULL,
  visitor_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  date_recorded DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.website_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for website_templates
CREATE POLICY "Anyone can view website templates" 
ON public.website_templates 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage website templates" 
ON public.website_templates 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'staff']) 
  AND mr.active = true
));

-- RLS Policies for funnel_templates
CREATE POLICY "Anyone can view funnel templates" 
ON public.funnel_templates 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage funnel templates" 
ON public.funnel_templates 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'staff']) 
  AND mr.active = true
));

-- RLS Policies for user_websites
CREATE POLICY "Users can manage their own websites" 
ON public.user_websites 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published websites" 
ON public.user_websites 
FOR SELECT 
USING (is_published = true);

-- RLS Policies for user_funnels
CREATE POLICY "Users can manage their own funnels" 
ON public.user_funnels 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for funnel_analytics
CREATE POLICY "Users can view analytics for their funnels" 
ON public.funnel_analytics 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_funnels uf 
  WHERE uf.id = funnel_analytics.funnel_id 
  AND uf.user_id = auth.uid()
));

CREATE POLICY "System can insert analytics" 
ON public.funnel_analytics 
FOR INSERT 
WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_website_templates_updated_at
BEFORE UPDATE ON public.website_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_funnel_templates_updated_at
BEFORE UPDATE ON public.funnel_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_websites_updated_at
BEFORE UPDATE ON public.user_websites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_funnels_updated_at
BEFORE UPDATE ON public.user_funnels
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();