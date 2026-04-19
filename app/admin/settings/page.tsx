'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Settings, Check, ExternalLink, Key, BarChart2 } from 'lucide-react'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [linearKey, setLinearKey] = useState('')
  const [linearTeam, setLinearTeam] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    setLinearKey(localStorage.getItem('linear_api_key') || '')
    setLinearTeam(localStorage.getItem('linear_team_id') || '')
  }, [])

  const save = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('linear_api_key', linearKey)
      localStorage.setItem('linear_team_id', linearTeam)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="h-5 w-5"/></Link>
            <div className="flex items-center gap-2"><Settings className="h-5 w-5 text-gray-600"/><h1 className="font-semibold text-gray-900">後台設定</h1></div>
          </div>
          <button onClick={save} className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
            {saved ? <Check className="h-4 w-4"/> : <Settings className="h-4 w-4"/>}
            {saved ? '已儲存' : '儲存設定'}
          </button>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-5">

        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Key className="h-5 w-5 text-purple-500"/><h2 className="font-bold text-gray-900">Linear 工單整合</h2></div>
            <a href="https://linear.app/settings/api" target="_blank" className="text-xs text-blue-500 hover:underline flex items-center gap-1"><ExternalLink className="h-3 w-3"/>取得 API Key</a>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Linear API Key</label>
              <input value={linearKey} onChange={e=>setLinearKey(e.target.value)} placeholder="lin_api_xxxxxxxxxx"
                className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"/>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Team ID</label>
              <input value={linearTeam} onChange={e=>setLinearTeam(e.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"/>
            </div>
          </div>
          <p className="text-xs text-gray-400">設定後可在工單管理頁面直接建立和查看 Linear 工單</p>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><BarChart2 className="h-5 w-5 text-orange-500"/><h2 className="font-bold text-gray-900">PostHog 分析</h2></div>
            <a href="https://app.posthog.com" target="_blank" className="text-xs text-blue-500 hover:underline flex items-center gap-1"><ExternalLink className="h-3 w-3"/>PostHog 後台</a>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Project API Key</label>
            <input readOnly value="在 Vercel 環境變數設定 NEXT_PUBLIC_POSTHOG_KEY"
              className="w-full border rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-400 font-mono cursor-not-allowed"/>
            <p className="text-xs text-gray-400 mt-1">到 Vercel Dashboard → Settings → Environment Variables 加入此 key</p>
          </div>
          <a href="https://app.posthog.com/signup" target="_blank"
            className="inline-flex items-center gap-1.5 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600">
            <ExternalLink className="h-4 w-4"/>建立 PostHog 帳號（免費）
          </a>
        </div>

        <div className="bg-gray-100 rounded-2xl p-5 text-xs text-gray-500 space-y-1.5">
          <p className="font-medium text-gray-700 mb-2">系統資訊</p>
          <p>前端：Vercel (Next.js 14) — ai-survey-chat-2026.vercel.app</p>
          <p>後端：Render (Express + PostgreSQL) — ai-survey-api.onrender.com</p>
          <p>工單：Linear API（第三方，免費 tier）</p>
          <p>分析：PostHog（第三方，免費 tier）</p>
          <p>AI：Anthropic Claude claude-haiku-4-5-20251001</p>
        </div>
      </main>
    </div>
  )
}
