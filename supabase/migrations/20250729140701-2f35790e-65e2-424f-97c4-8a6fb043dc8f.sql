-- First, let's check if there are any users and create an admin role for the first user
-- If you don't have a user yet, you'll need to sign up first, then run this

-- You can manually insert an admin role once you have a user account
-- This query will help you see existing users (if any) so you can assign admin role
-- Run this in the SQL editor after you create your account

-- For now, let's make sure the member_roles table has proper constraints
-- and create a function to easily assign admin roles

CREATE OR REPLACE FUNCTION assign_admin_role(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_user_id uuid;
BEGIN
    -- Get user ID from email
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = user_email;
    
    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', user_email;
    END IF;
    
    -- Insert admin role
    INSERT INTO public.member_roles (user_id, role_name, role_description, assigned_by, active)
    VALUES (
        target_user_id,
        'admin',
        'System Administrator with full access',
        target_user_id, -- self-assigned
        true
    )
    ON CONFLICT (user_id, role_name) 
    DO UPDATE SET active = true;
    
END;
$$;