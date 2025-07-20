-- Assign admin role to the user with email Fhm44114@gmail.com
INSERT INTO public.member_roles (user_id, role_name, role_description, assigned_by, active)
SELECT 
  id as user_id,
  'admin' as role_name,
  'Platform Administrator' as role_description,
  id as assigned_by,  -- self-assigned for initial setup
  true as active
FROM auth.users 
WHERE email = 'Fhm44114@gmail.com'
ON CONFLICT (user_id, role_name) DO NOTHING;