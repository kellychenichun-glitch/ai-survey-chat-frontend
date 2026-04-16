import Link from 'next/link'
import { MessageCircle, ClipboardList, BarChart3 } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI Survey Chat
          </h1>
          <p className="text-xl text-gray-600">
            智能問卷客服系統 - 讓對話更智能,讓問卷更簡單
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* 文字客服 */}
          <Link href="/chat" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-primary-500">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors">
                <MessageCircle className="w-8 h-8 text-primary-600 group-hover:text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                文字客服
              </h2>
              <p className="text-gray-600">
                即時AI對話,智能回答您的問題
              </p>
            </div>
          </Link>

          {/* 問卷系統 */}
          <Link href="/survey" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-primary-500">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                <ClipboardList className="w-8 h-8 text-blue-600 group-hover:text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                問卷系統
              </h2>
              <p className="text-gray-600">
                AI生成問卷,輕鬆收集反饋
              </p>
            </div>
          </Link>

          {/* 管理後台 */}
          <Link href="/admin" className="group">
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-primary-500">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
                <BarChart3 className="w-8 h-8 text-purple-600 group-hover:text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                管理後台
              </h2>
              <p className="text-gray-600">
                查看對話記錄與問卷分析
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Demo Version 1.0 - 本週五交付</p>
        </div>
      </div>
    </main>
  )
}
