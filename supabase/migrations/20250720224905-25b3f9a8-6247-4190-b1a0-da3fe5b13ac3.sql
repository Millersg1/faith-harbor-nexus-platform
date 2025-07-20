-- Insert sample websites for testing custom domains
INSERT INTO public.user_websites (name, content_data, domain, user_id, is_published) VALUES
('Faith Harbor Community Church', '{"title": "Welcome to Faith Harbor", "description": "Join our community of faith"}', 'faithharbor.lovable.app', '00000000-0000-0000-0000-000000000000', true),
('Grace Fellowship Website', '{"title": "Grace Fellowship", "description": "Experience Gods grace with us"}', 'grace.lovable.app', '00000000-0000-0000-0000-000000000000', true),
('Ministry Outreach Site', '{"title": "Ministry Outreach", "description": "Reaching hearts and souls"}', 'ministry.lovable.app', '00000000-0000-0000-0000-000000000000', false)
ON CONFLICT DO NOTHING;