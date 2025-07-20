-- Assign admin role to the user with email Fhm44114@gmail.com
-- First check if the role already exists, then insert if it doesn't
DO $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Get the user ID
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = 'Fhm44114@gmail.com';
    
    -- Insert admin role if it doesn't exist
    IF target_user_id IS NOT NULL THEN
        INSERT INTO public.member_roles (user_id, role_name, role_description, assigned_by, active)
        SELECT 
            target_user_id,
            'admin',
            'Platform Administrator',
            target_user_id,
            true
        WHERE NOT EXISTS (
            SELECT 1 FROM public.member_roles 
            WHERE user_id = target_user_id AND role_name = 'admin'
        );
    END IF;
END $$;