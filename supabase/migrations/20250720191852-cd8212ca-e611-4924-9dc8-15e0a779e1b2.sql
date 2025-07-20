-- Create memory books and comment collection tables

-- Memory books for creating printable scrapbooks
CREATE TABLE public.memory_books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  memorial_id UUID REFERENCES public.memorials(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  template_id TEXT NOT NULL,
  canvas_data JSONB NOT NULL DEFAULT '{}',
  settings JSONB DEFAULT '{"page_size": "A4", "orientation": "portrait", "margins": "normal"}',
  is_published BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT false,
  allow_comments BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Memory book pages for multi-page books
CREATE TABLE public.memory_book_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  memory_book_id UUID REFERENCES public.memory_books(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  template_id TEXT NOT NULL,
  canvas_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(memory_book_id, page_number)
);

-- Comments and memories that can be added to memory books
CREATE TABLE public.memory_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  memory_book_id UUID REFERENCES public.memory_books(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT,
  author_email TEXT,
  comment_text TEXT NOT NULL,
  memory_title TEXT,
  photo_url TEXT,
  is_approved BOOLEAN DEFAULT false,
  is_included BOOLEAN DEFAULT false,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id)
);

-- Memory book templates
CREATE TABLE public.memory_book_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'funeral_program', 'memory_page', 'tribute_book', 'celebration_of_life'
  template_data JSONB NOT NULL DEFAULT '{}',
  preview_image_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.memory_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_book_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_book_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for memory_books
CREATE POLICY "Anyone can view published memory books" 
ON public.memory_books FOR SELECT 
USING (is_published = true AND is_public = true);

CREATE POLICY "Creators can manage their memory books" 
ON public.memory_books FOR ALL 
USING (auth.uid() = creator_id);

CREATE POLICY "Leaders can view all memory books" 
ON public.memory_books FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'pastor', 'staff']) 
  AND mr.active = true
));

-- RLS Policies for memory_book_pages
CREATE POLICY "Users can manage pages of their memory books" 
ON public.memory_book_pages FOR ALL 
USING (EXISTS (
  SELECT 1 FROM memory_books mb 
  WHERE mb.id = memory_book_pages.memory_book_id 
  AND mb.creator_id = auth.uid()
));

CREATE POLICY "Anyone can view pages of published memory books" 
ON public.memory_book_pages FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM memory_books mb 
  WHERE mb.id = memory_book_pages.memory_book_id 
  AND mb.is_published = true 
  AND mb.is_public = true
));

-- RLS Policies for memory_comments
CREATE POLICY "Anyone can submit comments" 
ON public.memory_comments FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Book creators can manage comments on their books" 
ON public.memory_comments FOR ALL 
USING (EXISTS (
  SELECT 1 FROM memory_books mb 
  WHERE mb.id = memory_comments.memory_book_id 
  AND mb.creator_id = auth.uid()
));

CREATE POLICY "Anyone can view approved comments on public books" 
ON public.memory_comments FOR SELECT 
USING (is_approved = true AND EXISTS (
  SELECT 1 FROM memory_books mb 
  WHERE mb.id = memory_comments.memory_book_id 
  AND mb.is_published = true 
  AND mb.is_public = true
));

-- RLS Policies for memory_book_templates
CREATE POLICY "Anyone can view templates" 
ON public.memory_book_templates FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage templates" 
ON public.memory_book_templates FOR ALL 
USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'staff']) 
  AND mr.active = true
));

-- Triggers for updated_at
CREATE TRIGGER update_memory_books_updated_at
  BEFORE UPDATE ON public.memory_books
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_memory_book_pages_updated_at
  BEFORE UPDATE ON public.memory_book_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_memory_book_templates_updated_at
  BEFORE UPDATE ON public.memory_book_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default templates
INSERT INTO public.memory_book_templates (name, description, category, template_data) VALUES
('Simple Memorial Page', 'A clean, simple layout perfect for memorial pages', 'memory_page', '{"elements": [{"type": "title", "x": 50, "y": 50}, {"type": "photo", "x": 50, "y": 150}, {"type": "text", "x": 300, "y": 150}]}'),
('Funeral Program Cover', 'Traditional funeral program cover design', 'funeral_program', '{"elements": [{"type": "title", "x": 100, "y": 100}, {"type": "photo", "x": 100, "y": 200}, {"type": "dates", "x": 100, "y": 400}]}'),
('Celebration of Life', 'Vibrant design for celebrating a life well-lived', 'celebration_of_life', '{"elements": [{"type": "title", "x": 50, "y": 80}, {"type": "photo_collage", "x": 50, "y": 150}, {"type": "quote", "x": 50, "y": 350}]}'),
('Memory Tribute Book', 'Multi-page tribute book layout', 'tribute_book', '{"elements": [{"type": "cover_title", "x": 75, "y": 100}, {"type": "main_photo", "x": 75, "y": 200}, {"type": "subtitle", "x": 75, "y": 450}]}');