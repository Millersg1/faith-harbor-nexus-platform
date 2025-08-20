-- Add read-only analytics role access without exposing donations or payment data

-- Allow users with member_roles.role_name = 'analytics_viewer' to SELECT seo analytics
CREATE POLICY "Analytics viewers can view SEO analytics"
ON public.seo_analytics
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.member_roles mr
    WHERE mr.user_id = auth.uid()
      AND mr.role_name = 'analytics_viewer'
      AND mr.active = true
  )
);

-- Allow users with analytics_viewer to SELECT activity logs (non-PII operational logs)
CREATE POLICY "Analytics viewers can view activity logs"
ON public.user_activity_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.member_roles mr
    WHERE mr.user_id = auth.uid()
      AND mr.role_name = 'analytics_viewer'
      AND mr.active = true
  )
);

-- NOTE: No changes to donations table policies to avoid exposing donor PII