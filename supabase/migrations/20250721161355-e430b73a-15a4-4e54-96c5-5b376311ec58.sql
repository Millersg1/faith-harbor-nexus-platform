-- Fix the infinite recursion in member_roles policies
-- Drop the existing problematic policies
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.member_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.member_roles;

-- Create new policies without circular references
-- Allow users to view their own roles
CREATE POLICY "Users can view their own roles" 
ON public.member_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow direct admin access without checking member_roles table
CREATE POLICY "Admins can manage all roles" 
ON public.member_roles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (
      auth.users.raw_user_meta_data->>'role' = 'admin' 
      OR auth.users.email = 'admin@faithharbor.com'
    )
  )
);

-- Allow users to be assigned roles by admins
CREATE POLICY "Allow role assignment" 
ON public.member_roles 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND (
      auth.users.raw_user_meta_data->>'role' = 'admin' 
      OR auth.users.email = 'admin@faithharbor.com'
    )
  )
);