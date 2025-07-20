-- Add a function to create sample websites for authenticated users
CREATE OR REPLACE FUNCTION public.create_sample_websites_for_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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