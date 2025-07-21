-- Create table for storing user API keys
CREATE TABLE public.user_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL, -- e.g., 'openai', 'stripe', 'twilio', 'sendgrid'
  api_key_encrypted TEXT NOT NULL, -- encrypted API key
  service_label TEXT, -- user-friendly label
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, service_name)
);

-- Enable RLS
ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

-- Users can manage their own API keys (only if they have business/church subscription)
CREATE POLICY "users_manage_own_api_keys" ON public.user_api_keys
FOR ALL
USING (
  auth.uid() = user_id AND 
  EXISTS (
    SELECT 1 FROM public.subscriptions s 
    WHERE s.user_id = auth.uid() 
    AND s.status = 'active'
    AND s.stripe_subscription_id IS NOT NULL
  )
)
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.subscriptions s 
    WHERE s.user_id = auth.uid() 
    AND s.status = 'active'
    AND s.stripe_subscription_id IS NOT NULL
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_user_api_keys_updated_at
  BEFORE UPDATE ON public.user_api_keys
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();