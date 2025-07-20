-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES auth.users(id) NOT NULL,
  thumbnail_url TEXT,
  duration_hours INTEGER DEFAULT 0,
  difficulty_level TEXT CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Beginner',
  price DECIMAL(10,2) DEFAULT 0.00,
  is_published BOOLEAN DEFAULT false,
  category TEXT,
  learning_objectives TEXT[],
  prerequisites TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course modules table
CREATE TABLE public.course_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  video_url TEXT,
  content TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id, order_index)
);

-- Create course enrollments table
CREATE TABLE public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  current_module_id UUID REFERENCES public.course_modules(id),
  UNIQUE(course_id, student_id)
);

-- Create module progress table
CREATE TABLE public.module_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enrollment_id UUID REFERENCES public.course_enrollments(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_minutes INTEGER DEFAULT 0,
  notes TEXT,
  UNIQUE(enrollment_id, module_id)
);

-- Create course reviews table
CREATE TABLE public.course_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id, student_id)
);

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses
CREATE POLICY "Anyone can view published courses" 
ON public.courses 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Instructors can manage their own courses" 
ON public.courses 
FOR ALL 
USING (auth.uid() = instructor_id);

-- RLS Policies for course modules
CREATE POLICY "Anyone can view modules of published courses" 
ON public.course_modules 
FOR SELECT 
USING (
  is_published = true AND 
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND is_published = true)
);

CREATE POLICY "Instructors can manage modules of their courses" 
ON public.course_modules 
FOR ALL 
USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND instructor_id = auth.uid())
);

-- RLS Policies for enrollments
CREATE POLICY "Students can view their own enrollments" 
ON public.course_enrollments 
FOR SELECT 
USING (auth.uid() = student_id);

CREATE POLICY "Students can create their own enrollments" 
ON public.course_enrollments 
FOR INSERT 
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own enrollments" 
ON public.course_enrollments 
FOR UPDATE 
USING (auth.uid() = student_id);

CREATE POLICY "Instructors can view enrollments for their courses" 
ON public.course_enrollments 
FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND instructor_id = auth.uid())
);

-- RLS Policies for module progress
CREATE POLICY "Students can manage their own progress" 
ON public.module_progress 
FOR ALL 
USING (
  EXISTS (SELECT 1 FROM public.course_enrollments WHERE id = enrollment_id AND student_id = auth.uid())
);

CREATE POLICY "Instructors can view progress for their courses" 
ON public.module_progress 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.course_enrollments ce
    JOIN public.courses c ON ce.course_id = c.id
    WHERE ce.id = enrollment_id AND c.instructor_id = auth.uid()
  )
);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews" 
ON public.course_reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Students can create reviews for enrolled courses" 
ON public.course_reviews 
FOR INSERT 
WITH CHECK (
  auth.uid() = student_id AND
  EXISTS (SELECT 1 FROM public.course_enrollments WHERE course_id = course_reviews.course_id AND student_id = auth.uid())
);

CREATE POLICY "Students can update their own reviews" 
ON public.course_reviews 
FOR UPDATE 
USING (auth.uid() = student_id);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at
  BEFORE UPDATE ON public.course_modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate course progress
CREATE OR REPLACE FUNCTION public.calculate_course_progress(enrollment_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  total_modules INTEGER;
  completed_modules INTEGER;
  progress INTEGER;
BEGIN
  -- Get total modules for the course
  SELECT COUNT(*) INTO total_modules
  FROM public.course_modules cm
  JOIN public.course_enrollments ce ON cm.course_id = ce.course_id
  WHERE ce.id = enrollment_uuid AND cm.is_published = true;
  
  -- Get completed modules
  SELECT COUNT(*) INTO completed_modules
  FROM public.module_progress mp
  WHERE mp.enrollment_id = enrollment_uuid AND mp.completed_at IS NOT NULL;
  
  -- Calculate progress percentage
  IF total_modules = 0 THEN
    progress := 0;
  ELSE
    progress := ROUND((completed_modules::DECIMAL / total_modules) * 100);
  END IF;
  
  -- Update enrollment progress
  UPDATE public.course_enrollments 
  SET progress_percentage = progress
  WHERE id = enrollment_uuid;
  
  RETURN progress;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX idx_courses_published ON public.courses(is_published);
CREATE INDEX idx_course_modules_course ON public.course_modules(course_id);
CREATE INDEX idx_course_enrollments_student ON public.course_enrollments(student_id);
CREATE INDEX idx_course_enrollments_course ON public.course_enrollments(course_id);
CREATE INDEX idx_module_progress_enrollment ON public.module_progress(enrollment_id);