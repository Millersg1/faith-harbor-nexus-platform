-- Add bio and admin notes fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN bio_name TEXT,
ADD COLUMN bio_room TEXT,
ADD COLUMN admin_notes TEXT;

-- Create index for better performance on admin notes queries
CREATE INDEX IF NOT EXISTS idx_profiles_admin_notes ON public.profiles(admin_notes) WHERE admin_notes IS NOT NULL;