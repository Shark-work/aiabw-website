// src/app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          AI Agent 导航站
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
          发现改变世界的AI与Agent工具，开启你的财富之旅
        </p>
        <Link 
          href="/tools" 
          className="inline-block bg-blue-600 text-white text-lg px-8 py-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
        >
          开始探索 →
        </Link>
      </div>
    </div>
  );
}