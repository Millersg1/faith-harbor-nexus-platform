-- Drop the function that has permission issues
DROP FUNCTION IF EXISTS assign_admin_role(text);

-- Create a simpler approach - we'll insert admin role directly after user signup
-- First let's check if there are unique constraints to prevent duplicate roles
ALTER TABLE member_roles ADD CONSTRAINT unique_user_role 
UNIQUE (user_id, role_name);