-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'pastor', 'staff', 'member', 'volunteer', 'guest');

-- Create user roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    assigned_by UUID REFERENCES auth.users(id),
    active BOOLEAN DEFAULT true,
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND active = true
  )
$$;

-- Create RLS policies
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Update profiles table with additional fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS church_role TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ministry_interests TEXT[];

-- Create upgrade system tracking table
CREATE TABLE public.system_upgrades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_from TEXT NOT NULL,
    version_to TEXT NOT NULL,
    upgrade_type TEXT NOT NULL DEFAULT 'minor',
    status TEXT NOT NULL DEFAULT 'pending',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    rollback_data JSONB,
    notes TEXT,
    performed_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on system_upgrades
ALTER TABLE public.system_upgrades ENABLE ROW LEVEL SECURITY;

-- Only admins can manage system upgrades
CREATE POLICY "Only admins can manage system upgrades"
ON public.system_upgrades
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));