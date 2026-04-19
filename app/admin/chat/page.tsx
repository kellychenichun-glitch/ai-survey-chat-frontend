'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, MessageCircle, Copy, Check } from 'lucide-react'

export default function AdminChatPage() {
  const [copied, setCopied] = useState(false)
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ai-survey-chat-2026.vercel.app'
  const embedCode = `<iframe src="${origin}/chat" width="420" height="620" frameborder="0" style="border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.12)"></iframe>`
  const copy = () => { navigator.clipboard.writeText(embedCode); setCopied(true); setTimeout(()=>setCopied(false),2000) }
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="h-5 w-5"/></Link>
            <div className="flex items-center gap-2"><MessageCircle className="h-5 w-5 text-orange-500"/><h1 className="font-semibold text-gray-900">AI 客服</h1></div>
          </div>
          <Link href="/chat" target="_blank" className="flex items-center gap-1.5 text-sm border px-3 py-1.5 rounded-lg text-gray-700 hover:bg-gray-50">
            <ExternalLink className="h-3.5 w-3.5"/>開啟客服頁面
          </Link>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">客服 Widget 預覽</h2>
          <div className="bg-gray-50 rounded-xl p-6 flex justify-center">
            <iframe src="/chat" className="rounded-2xl shadow-lg" style={{width:'420px',height:'560px',border:'none'}}/>
          </div>
        </div>
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-2">嵌入你的網站</h2>
          <p className="text-sm text-gray-500 mb-4">複製以下 HTML 貼到你網站的任何位置</p>
          <div className="relative">
            <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-x-auto whitespace-pre-wrap">{embedCode}</pre>
            <button onClick={copy} className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs">
              {copied?<Check className="h-3.5 w-3.5"/>:<Copy className="h-3.5 w-3.5"/>}{copied?'已複製':'複製'}
            </button>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200 p-6">
          <h2 className="font-bold text-gray-900 mb-3">運作方式</h2>
          <div className="space-y-2 text-sm text-gray-700">
            {['用戶輸入問題','系統搜尋知識庫（你在知識庫管理裡設定的 FAQ）','AI 根據知識庫內容生成回覆（不亂編）','找不到答案時，建議聯繫人工客服'].map((s,i)=>(
              <div key={i} className="flex items-start gap-2"><span className="text-orange-500 font-bold">{i+1}.</span><span>{s}</span></div>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/admin/knowledge" className="inline-flex items-center gap-1.5 text-sm bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">管理知識庫內容 →</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
