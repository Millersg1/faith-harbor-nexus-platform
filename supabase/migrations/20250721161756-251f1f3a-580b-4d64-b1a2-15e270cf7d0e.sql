-- Fix other policies that reference member_roles to avoid circular dependencies
-- Update policies that were using the old member_roles pattern

-- Fix grief support sessions
DROP POLICY IF EXISTS "Leaders can manage grief sessions" ON public.grief_support_sessions;
CREATE POLICY "Authenticated users can manage grief sessions" 
ON public.grief_support_sessions 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Fix memory book templates  
DROP POLICY IF EXISTS "Admins can manage templates" ON public.memory_book_templates;
CREATE POLICY "Authenticated users can manage templates" 
ON public.memory_book_templates 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Fix memorials
DROP POLICY IF EXISTS "Leaders can manage memorials" ON public.memorials;
CREATE POLICY "Authenticated users can manage memorials" 
ON public.memorials 
FOR ALL 
USING (auth.uid() IS NOT NULL);