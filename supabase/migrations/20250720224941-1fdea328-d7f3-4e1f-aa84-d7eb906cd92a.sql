-- Create a domain verification table to track custom domain setup
CREATE TABLE IF NOT EXISTS public.domain_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  verification_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'failed')),
  ssl_status TEXT NOT NULL DEFAULT 'pending' CHECK (ssl_status IN ('pending', 'active', 'failed')),
  dns_records JSONB DEFAULT '[]'::jsonb,
  last_checked TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.domain_verifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own domain verifications" 
ON public.domain_verifications 
FOR ALL 
USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_domain_verifications_user_id ON public.domain_verifications(user_id);
CREATE INDEX idx_domain_verifications_domain ON public.domain_verifications(domain);

-- Add trigger for updated_at
CREATE TRIGGER update_domain_verifications_updated_at
  BEFORE UPDATE ON public.domain_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();