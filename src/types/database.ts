/** Supabase 表行类型（与 `supabase/migrations/001_init.sql` 对齐） */

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
};

export type ToolRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  is_agent: boolean;
  click_count: number;
  stars: number;
  is_featured: boolean;
  is_pinned: boolean;
  sort_order: number;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
};
