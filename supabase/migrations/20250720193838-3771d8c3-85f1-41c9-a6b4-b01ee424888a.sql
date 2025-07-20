-- Create SEO management tables
CREATE TABLE public.seo_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_url TEXT NOT NULL UNIQUE,
  page_title TEXT NOT NULL,
  meta_description TEXT,
  meta_keywords TEXT[] DEFAULT '{}',
  focus_keyword TEXT,
  seo_score INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create SEO analytics table for tracking performance
CREATE TABLE public.seo_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES public.seo_pages(id) ON DELETE CASCADE,
  date_recorded DATE NOT NULL DEFAULT CURRENT_DATE,
  organic_traffic INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0,
  keyword_rankings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sitemap configuration table
CREATE TABLE public.sitemap_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_url TEXT NOT NULL,
  update_frequency TEXT DEFAULT 'weekly',
  priority_pages JSONB DEFAULT '[]',
  excluded_pages JSONB DEFAULT '[]',
  last_generated TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.seo_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sitemap_config ENABLE ROW LEVEL SECURITY;

-- SEO Pages policies
CREATE POLICY "Admins can manage SEO pages" ON public.seo_pages
FOR ALL USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'staff', 'pastor']) 
  AND mr.active = true
));

CREATE POLICY "Members can view SEO pages" ON public.seo_pages
FOR SELECT USING (auth.uid() IS NOT NULL);

-- SEO Analytics policies
CREATE POLICY "Admins can manage SEO analytics" ON public.seo_analytics
FOR ALL USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'staff', 'pastor']) 
  AND mr.active = true
));

-- Sitemap Config policies
CREATE POLICY "Admins can manage sitemap config" ON public.sitemap_config
FOR ALL USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'staff', 'pastor']) 
  AND mr.active = true
));

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_sitemap_config_updated_at
BEFORE UPDATE ON public.sitemap_config
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample SEO pages
INSERT INTO public.seo_pages (page_url, page_title, meta_description, meta_keywords, focus_keyword, seo_score) VALUES
('/', 'Faith Harbor Church - Inspiring Faith, Building Community', 'Join Faith Harbor Church for worship services, community events, and spiritual growth. Experience God''s love in a welcoming environment.', ARRAY['church', 'faith', 'worship', 'community', 'spiritual growth', 'God'], 'church community', 85),
('/sermons', 'Inspiring Sermons | Faith Harbor Church', 'Listen to powerful sermons that will strengthen your faith and guide your spiritual journey. New messages every week.', ARRAY['sermons', 'messages', 'preaching', 'spiritual growth', 'bible study'], 'church sermons', 78),
('/events', 'Church Events & Activities | Faith Harbor', 'Discover upcoming church events, community gatherings, and special services. Join us for fellowship and spiritual growth.', ARRAY['church events', 'activities', 'fellowship', 'community', 'services'], 'church events', 72),
('/about', 'About Faith Harbor Church - Our Mission & Values', 'Learn about our church history, mission, values, and leadership team. Discover how we serve our community with God''s love.', ARRAY['about church', 'mission', 'values', 'leadership', 'history'], 'church mission', 68);

-- Insert sitemap configuration
INSERT INTO public.sitemap_config (site_url, update_frequency, priority_pages) VALUES
('https://faithharbor.church', 'weekly', '["/" , "/sermons", "/events", "/about"]');