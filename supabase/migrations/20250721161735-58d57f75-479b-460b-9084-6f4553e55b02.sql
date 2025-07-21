-- Fix memory books policies to avoid member_roles dependency
DROP POLICY IF EXISTS "Leaders can view all memory books" ON public.memory_books;

-- Create a simpler policy that allows authenticated users to view all memory books
CREATE POLICY "Authenticated users can view memory books" 
ON public.memory_books 
FOR SELECT 
USING (
  (is_published = true AND is_public = true) 
  OR (auth.uid() = creator_id)
  OR (auth.uid() IS NOT NULL) -- Allow any authenticated user to view for now
);