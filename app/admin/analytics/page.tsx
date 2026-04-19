'use client'
import Link from 'next/link'
import { ArrowLeft, BarChart2, ExternalLink, TrendingUp, FileText, MessageCircle, Ticket } from 'lucide-react'
export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="h-5 w-5"/></Link>
            <div className="flex items-center gap-2"><BarChart2 className="h-5 w-5 text-purple-600"/><h1 className="font-semibold text-gray-900">分析儀表板</h1></div>
          </div>
          <a href="https://app.posthog.com" target="_blank" className="flex items-center gap-1.5 text-sm border px-3 py-1.5 rounded-lg text-gray-700 hover:bg-gray-50">
            <ExternalLink className="h-3.5 w-3.5"/>PostHog 後台
          </a>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: FileText, label: '問卷分析', desc: '每份問卷有完整統計、趨勢圖、AI 分析', href: '/admin/surveys', color: 'blue', ext: false },
            { icon: MessageCircle, label: '客服對話', desc: '在 PostHog 查看 session 記錄與事件', href: 'https://app.posthog.com', color: 'orange', ext: true },
            { icon: Ticket, label: '工單追蹤', desc: '在 Linear 查看工單進度與統計', href: '/admin/tickets', color: 'purple', ext: false },
          ].map(card => (
            <Link key={card.label} href={card.href} target={card.ext?'_blank':undefined}
              className="bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition">
              <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center bg-${card.color}-50`}>
                <card.icon className={`h-5 w-5 text-${card.color}-600`}/>
              </div>
              <h3 className="font-semibold text-gray-900">{card.label}</h3>
              <p className="text-sm text-gray-500 mt-1">{card.desc}</p>
              {card.ext && <span className="text-xs text-blue-500 mt-2 block">開啟外部連結 →</span>}
            </Link>
          ))}
        </div>
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">PostHog 分析設定</h2>
          <div className="space-y-3">
            {[
              { step:'1', text:'前往 app.posthog.com 建立免費帳號' },
              { step:'2', text:'取得 Project API Key（格式：phc_xxxxxxxxxx）' },
              { step:'3', text:'在 Vercel 加入環境變數 NEXT_PUBLIC_POSTHOG_KEY' },
              { step:'4', text:'自動追蹤頁面瀏覽、問卷提交、客服對話等所有事件' },
            ].map(item => (
              <div key={item.step} className="flex items-start gap-3 text-sm">
                <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{item.step}</span>
                <span className="text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-3 flex-wrap">
            <a href="https://app.posthog.com/signup" target="_blank" className="flex items-center gap-1.5 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700">
              <ExternalLink className="h-4 w-4"/>建立 PostHog 帳號（免費）
            </a>
            <a href="https://posthog.com/docs/libraries/next-js" target="_blank" className="flex items-center gap-1.5 border px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              查看 Next.js 文件
            </a>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
          <h2 className="font-bold text-gray-900 mb-2">問卷內建分析</h2>
          <p className="text-sm text-gray-600 mb-4">每份問卷都有完整統計頁面，包含回覆趨勢圖、各題分析、AI 摘要、CSV 匯出。</p>
          <Link href="/admin/surveys" className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            查看問卷統計 →
          </Link>
        </div>
      </main>
    </div>
  )
}
