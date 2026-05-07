/** 前端 / API 返回使用的工具视图模型 */

export type PublicTool = {
  id: string;
  slug: string;
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  isAgent: boolean;
  clickCount: number;
  stars: number;
  isFeatured: boolean;
  isPinned: boolean;
  sortOrder: number;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
};
