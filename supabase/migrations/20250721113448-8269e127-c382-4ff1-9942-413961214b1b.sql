-- Create sermon transcriptions table
CREATE TABLE public.sermon_transcriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  audio_url TEXT,
  transcription_text TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  duration_seconds INTEGER,
  word_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sermon_transcriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for sermon transcriptions
CREATE POLICY "Users can view their own transcriptions" 
ON public.sermon_transcriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transcriptions" 
ON public.sermon_transcriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transcriptions" 
ON public.sermon_transcriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transcriptions" 
ON public.sermon_transcriptions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_sermon_transcriptions_updated_at
BEFORE UPDATE ON public.sermon_transcriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for sermon audio files
INSERT INTO storage.buckets (id, name, public) VALUES ('sermon-audio', 'sermon-audio', false);

-- Create policies for sermon audio storage
CREATE POLICY "Users can view their own sermon audio" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'sermon-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own sermon audio" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'sermon-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own sermon audio" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'sermon-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own sermon audio" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'sermon-audio' AND auth.uid()::text = (storage.foldername(name))[1]);