-- Remove bio_room column from profiles table since it's no longer needed
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS bio_room;