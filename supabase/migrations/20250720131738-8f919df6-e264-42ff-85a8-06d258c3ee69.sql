-- Create chatbot knowledge base table
CREATE TABLE public.chatbot_knowledge (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  chunk_index INTEGER DEFAULT 0,
  total_chunks INTEGER DEFAULT 1,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chatbot conversations table for learning
CREATE TABLE public.chatbot_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  context_used TEXT,
  user_id UUID,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chatbot_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chatbot_knowledge
CREATE POLICY "Admins can manage chatbot knowledge" 
ON public.chatbot_knowledge 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM member_roles mr 
  WHERE mr.user_id = auth.uid() 
  AND mr.role_name = ANY(ARRAY['admin', 'staff']) 
  AND mr.active = true
));

CREATE POLICY "Everyone can view active knowledge" 
ON public.chatbot_knowledge 
FOR SELECT 
USING (active = true);

-- RLS Policies for chatbot_conversations  
CREATE POLICY "Users can view their conversations" 
ON public.chatbot_conversations 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can insert conversations" 
ON public.chatbot_conversations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their conversation ratings" 
ON public.chatbot_conversations 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create indexes for better performance
CREATE INDEX idx_chatbot_knowledge_category ON public.chatbot_knowledge(category);
CREATE INDEX idx_chatbot_knowledge_active ON public.chatbot_knowledge(active);
CREATE INDEX idx_chatbot_conversations_user_id ON public.chatbot_conversations(user_id);
CREATE INDEX idx_chatbot_conversations_created_at ON public.chatbot_conversations(created_at);

-- Create trigger for updated_at
CREATE TRIGGER update_chatbot_knowledge_updated_at
  BEFORE UPDATE ON public.chatbot_knowledge
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();