
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
