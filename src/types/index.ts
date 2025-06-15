
export type User = {
  id: string;
  email: string;
  username?: string;
  created_at: string;
};

export type ContentType = "link" | "text" | "image" | "video" | "file";

export type Content = {
  id: string;
  user_id: string;
  type: ContentType;
  content: string;
  title?: string;
  description?: string;
  tags?: string[];
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
  // Enhanced fields from user_materials
  data?: string;
  ai_summary?: string;
  ai_keywords?: string[];
  metadata?: Record<string, any>;
  view_count?: number;
  last_accessed_at?: string;
  is_archived?: boolean;
  priority_score?: number;
};

export type Collection = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color?: string;
  is_public?: boolean;
  is_ai_generated?: boolean;
  created_at: string;
  updated_at: string;
};

export type CollectionItem = {
  id: string;
  collection_id: string;
  content_id: string;
  added_at: string;
};

export type ContentAnnotation = {
  id: string;
  content_id: string;
  user_id: string;
  annotation_text: string;
  annotation_type?: string;
  position_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type ContentAnalytics = {
  id: string;
  content_id: string;
  user_id: string;
  action_type: string;
  metadata?: Record<string, any>;
  created_at: string;
};

export type AIProcessingQueue = {
  id: string;
  content_id: string;
  user_id: string;
  processing_type: string;
  status?: string;
  result?: Record<string, any>;
  error_message?: string;
  created_at: string;
  updated_at: string;
};

export type SearchResult = {
  content: Content;
  relevance: number;
};

export type AuthFormData = {
  email: string;
  password: string;
  username?: string;
};
