-- Grant admin role to the specified user by email, idempotently
INSERT INTO public.member_roles (user_id, role_name, assigned_by, role_description)
SELECT u.id, 'admin', u.id, 'Admin access granted by system per user request'
FROM auth.users u
WHERE u.email = 'fhm44114@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM public.member_roles mr
    WHERE mr.user_id = u.id AND mr.role_name = 'admin'
  );