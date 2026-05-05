// src/app/tools/page.tsx
import { tools } from '@/data/tools';

export default function ToolsPage() {
  // 按分类分组
  const categories = [...new Set(tools.map(tool => tool.category))];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🛠️ AI Agent 工具箱
          </h1>
          <p className="text-lg text-gray-600">
            发现最好用的AI与Agent工具，助力你的财富之路
          </p>
        </div>
      </div>

      {/* 工具列表 */}
      <div className="container mx-auto px-4 py-8">
        {categories.map(category => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
              {category}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.filter(tool => tool.category === category).map(tool => (
                <div key={tool.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">{tool.name}</h3>
                    {tool.isAgent && (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        Agent
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-4">{tool.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    去使用 →
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}