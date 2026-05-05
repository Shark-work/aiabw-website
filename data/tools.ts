// src/data/tools.ts
export interface Tool {
  id: number;
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  isAgent: boolean;
}

export const tools: Tool[] = [
  {
    id: 1,
    name: "Cursor",
    description: "与AI配对编程的代码编辑器，你正在用的就是它",
    url: "https://cursor.sh",
    category: "开发工具",
    tags: ["编程", "免费"],
    isAgent: false,
  },
  {
    id: 2,
    name: "Manus",
    description: "一句话生成网站，AI建站助手",
    url: "https://manus.im",
    category: "AI建站",
    tags: ["建站", "效率"],
    isAgent: true,
  },
  {
    id: 3,
    name: "OpenClaw",
    description: "开源AI Agent，7x24小时自动化执行任务",
    url: "https://openclaw.ai",
    category: "Agent工具",
    tags: ["开源", "自动化"],
    isAgent: true,
  }
];