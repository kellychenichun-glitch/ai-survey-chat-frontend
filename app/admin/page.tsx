'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, Users, Plus, MessageSquare } from 'lucide-react'
export default function AdminPage() {
  const [stats, setStats] = useState({ surveys: 0, published: 0, responses: 0 })
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com'
    fetch(`${API}/api/v1/surveys/summary`).then(r=>r.json()).then(d=>{
      const s = d.surveys || []
      setStats({ surveys: s.length, published: s.filter((v:any)=>v.status==='published').length, responses: s.reduce((n:number,v:any)=>n+(v.responseCount||0),0) })
    }).catch(()=>{})
  }, [])
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"><ArrowLeft className="h-4 w-4"/>返回首頁</Link>
            <h1 className="text-xl font-bold text-gray-900">管理後台</h1>
          </div>
          <Link href="/admin/surveys/new" className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800"><Plus className="h-4 w-4"/>建立新問卷</Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border"><p className="text-sm text-gray-500">問卷總數</p><p className="text-3xl font-bold mt-1">{stats.surveys}</p></div>
          <div className="bg-white rounded-xl p-5 shadow-sm border"><p className="text-sm text-gray-500">已發布</p><p className="text-3xl font-bold mt-1">{stats.published}</p></div>
          <div className="bg-white rounded-xl p-5 shadow-sm border"><p className="text-sm text-gray-500">總填答數</p><p className="text-3xl font-bold mt-1">{stats.responses}</p></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/surveys" className="bg-white rounded-xl p-6 shadow-sm border hover:border-gray-400 transition"><FileText className="h-8 w-8 text-blue-600 mb-3"/><h3 className="font-semibold">所有問卷</h3><p className="text-sm text-gray-500 mt-1">查看、編輯、發布問卷</p></Link>
          <Link href="/admin/surveys/new" className="bg-white rounded-xl p-6 shadow-sm border hover:border-gray-400 transition"><Plus className="h-8 w-8 text-green-600 mb-3"/><h3 className="font-semibold">建立新問卷</h3><p className="text-sm text-gray-500 mt-1">AI 輔助或手動建立</p></Link>
          <Link href="/chat" className="bg-white rounded-xl p-6 shadow-sm border hover:border-gray-400 transition"><MessageSquare className="h-8 w-8 text-purple-600 mb-3"/><h3 className="font-semibold">文字客服</h3><p className="text-sm text-gray-500 mt-1">查看對話記錄</p></Link>
        </div>
      </main>
    </div>
  )
}
