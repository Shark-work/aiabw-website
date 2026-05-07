import type { ToolRow } from "@/types/database";
import type { PublicTool } from "@/types/ui";

export function toPublicTool(row: ToolRow): PublicTool {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    url: row.url,
    category: row.category,
    tags: row.tags ?? [],
    isAgent: row.is_agent,
    clickCount: row.click_count,
    stars: row.stars,
    isFeatured: row.is_featured,
    isPinned: row.is_pinned,
    sortOrder: row.sort_order,
    logoUrl: row.logo_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
