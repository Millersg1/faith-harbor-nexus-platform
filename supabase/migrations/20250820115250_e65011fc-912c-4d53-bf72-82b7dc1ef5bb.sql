-- Create comprehensive audit logging system
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for audit log access
CREATE POLICY "Admins and auditors can view audit logs" ON public.audit_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM member_roles mr
    WHERE mr.user_id = auth.uid()
    AND mr.role_name IN ('admin', 'auditor', 'pastor')
    AND mr.active = true
  )
);

-- Create two-factor authentication table
CREATE TABLE public.user_two_factor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  secret TEXT NOT NULL,
  backup_codes TEXT[],
  is_enabled BOOLEAN DEFAULT false,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_two_factor ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own 2FA" ON public.user_two_factor
FOR ALL USING (auth.uid() = user_id);

-- Create notification settings table
CREATE TABLE public.push_notification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL, -- 'web', 'ios', 'android'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.push_notification_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notification tokens" ON public.push_notification_tokens
FOR ALL USING (auth.uid() = user_id);

-- Create advanced permissions table
CREATE TABLE public.advanced_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  permission_level TEXT NOT NULL, -- 'read', 'write', 'admin', 'owner'
  granted_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.advanced_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own permissions" ON public.advanced_permissions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all permissions" ON public.advanced_permissions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM member_roles mr
    WHERE mr.user_id = auth.uid()
    AND mr.role_name IN ('admin', 'pastor')
    AND mr.active = true
  )
);

-- Create system health metrics table
CREATE TABLE public.system_health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metadata JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.system_health_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view system metrics" ON public.system_health_metrics
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM member_roles mr
    WHERE mr.user_id = auth.uid()
    AND mr.role_name IN ('admin', 'pastor', 'staff')
    AND mr.active = true
  )
);

-- Create backup status table
CREATE TABLE public.backup_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_type TEXT NOT NULL,
  status TEXT NOT NULL, -- 'running', 'completed', 'failed'
  file_size BIGINT,
  backup_url TEXT,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.backup_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view backup status" ON public.backup_status
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM member_roles mr
    WHERE mr.user_id = auth.uid()
    AND mr.role_name IN ('admin', 'pastor')
    AND mr.active = true
  )
);

-- Create advanced analytics tables
CREATE TABLE public.analytics_dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  configuration JSONB NOT NULL DEFAULT '{}',
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.analytics_dashboards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own dashboards" ON public.analytics_dashboards
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view shared dashboards" ON public.analytics_dashboards
FOR SELECT USING (is_shared = true);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_push_notification_tokens_updated_at
  BEFORE UPDATE ON public.push_notification_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_dashboards_updated_at
  BEFORE UPDATE ON public.analytics_dashboards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();