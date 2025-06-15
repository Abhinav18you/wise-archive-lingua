
-- Create collections table for organizing content
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#8B5CF6',
  is_public BOOLEAN DEFAULT false,
  is_ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create collection_items table for many-to-many relationship
CREATE TABLE IF NOT EXISTS public.collection_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE NOT NULL,
  content_id UUID REFERENCES public.user_materials(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(collection_id, content_id)
);

-- Create content_annotations table for comments and notes
CREATE TABLE IF NOT EXISTS public.content_annotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES public.user_materials(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  annotation_text TEXT NOT NULL,
  annotation_type TEXT DEFAULT 'note',
  position_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content_analytics table for tracking usage
CREATE TABLE IF NOT EXISTS public.content_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES public.user_materials(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  action_type TEXT NOT NULL, -- 'view', 'search', 'share', etc.
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ai_processing_queue table for background AI tasks
CREATE TABLE IF NOT EXISTS public.ai_processing_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES public.user_materials(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  processing_type TEXT NOT NULL, -- 'summarize', 'extract_keywords', 'generate_tags', etc.
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  result JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add new columns to user_materials for enhanced features (only if they don't exist)
DO $$ 
BEGIN
  -- Add columns one by one with IF NOT EXISTS checks
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_materials' AND column_name = 'tags') THEN
    ALTER TABLE public.user_materials ADD COLUMN tags TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_materials' AND column_name = 'ai_summary') THEN
    ALTER TABLE public.user_materials ADD COLUMN ai_summary TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_materials' AND column_name = 'ai_keywords') THEN
    ALTER TABLE public.user_materials ADD COLUMN ai_keywords TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_materials' AND column_name = 'metadata') THEN
    ALTER TABLE public.user_materials ADD COLUMN metadata JSONB DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_materials' AND column_name = 'view_count') THEN
    ALTER TABLE public.user_materials ADD COLUMN view_count INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_materials' AND column_name = 'last_accessed_at') THEN
    ALTER TABLE public.user_materials ADD COLUMN last_accessed_at TIMESTAMP WITH TIME ZONE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_materials' AND column_name = 'is_archived') THEN
    ALTER TABLE public.user_materials ADD COLUMN is_archived BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_materials' AND column_name = 'priority_score') THEN
    ALTER TABLE public.user_materials ADD COLUMN priority_score INTEGER DEFAULT 0;
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_processing_queue ENABLE ROW LEVEL SECURITY;

-- RLS policies for collections
DROP POLICY IF EXISTS "Users can view their own collections" ON public.collections;
CREATE POLICY "Users can view their own collections" ON public.collections
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

DROP POLICY IF EXISTS "Users can create their own collections" ON public.collections;
CREATE POLICY "Users can create their own collections" ON public.collections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own collections" ON public.collections;
CREATE POLICY "Users can update their own collections" ON public.collections
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own collections" ON public.collections;
CREATE POLICY "Users can delete their own collections" ON public.collections
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for collection_items
DROP POLICY IF EXISTS "Users can view collection items they have access to" ON public.collection_items;
CREATE POLICY "Users can view collection items they have access to" ON public.collection_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.collections c 
      WHERE c.id = collection_id AND (c.user_id = auth.uid() OR c.is_public = true)
    )
  );

DROP POLICY IF EXISTS "Users can manage items in their own collections" ON public.collection_items;
CREATE POLICY "Users can manage items in their own collections" ON public.collection_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.collections c 
      WHERE c.id = collection_id AND c.user_id = auth.uid()
    )
  );

-- RLS policies for content_annotations
DROP POLICY IF EXISTS "Users can view annotations on accessible content" ON public.content_annotations;
CREATE POLICY "Users can view annotations on accessible content" ON public.content_annotations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create annotations on accessible content" ON public.content_annotations;
CREATE POLICY "Users can create annotations on accessible content" ON public.content_annotations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own annotations" ON public.content_annotations;
CREATE POLICY "Users can update their own annotations" ON public.content_annotations
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own annotations" ON public.content_annotations;
CREATE POLICY "Users can delete their own annotations" ON public.content_annotations
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for content_analytics
DROP POLICY IF EXISTS "Users can view their own analytics" ON public.content_analytics;
CREATE POLICY "Users can view their own analytics" ON public.content_analytics
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create analytics for their content" ON public.content_analytics;
CREATE POLICY "Users can create analytics for their content" ON public.content_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for ai_processing_queue
DROP POLICY IF EXISTS "Users can view their own AI processing tasks" ON public.ai_processing_queue;
CREATE POLICY "Users can view their own AI processing tasks" ON public.ai_processing_queue
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create AI processing tasks for their content" ON public.ai_processing_queue;
CREATE POLICY "Users can create AI processing tasks for their content" ON public.ai_processing_queue
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own AI processing tasks" ON public.ai_processing_queue;
CREATE POLICY "Users can update their own AI processing tasks" ON public.ai_processing_queue
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON public.collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection_id ON public.collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_content_id ON public.collection_items(content_id);
CREATE INDEX IF NOT EXISTS idx_content_annotations_content_id ON public.content_annotations(content_id);
CREATE INDEX IF NOT EXISTS idx_content_analytics_content_id ON public.content_analytics(content_id);
CREATE INDEX IF NOT EXISTS idx_content_analytics_user_id ON public.content_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_processing_queue_status ON public.ai_processing_queue(status);
CREATE INDEX IF NOT EXISTS idx_user_materials_user_id ON public.user_materials(user_id);
CREATE INDEX IF NOT EXISTS idx_user_materials_tags ON public.user_materials USING GIN(tags);
