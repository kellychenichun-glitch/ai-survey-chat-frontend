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
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, FileText, Users, BarChart } from 'lucide-react'

export default function AdminPage() {
  const [stats] = useState({
    totalChats: 156,
    totalSurveys: 23,
    totalResponses: 489,
    activeUsers: 45
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">管理後台</h1>
          </div>
          <div className="text-sm text-gray-600">
            Demo Version
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalChats}</h3>
            <p className="text-sm text-gray-600">總對話數</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalSurveys}</h3>
            <p className="text-sm text-gray-600">問卷數量</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalResponses}</h3>
            <p className="text-sm text-gray-600">問卷回覆</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stats.activeUsers}</h3>
            <p className="text-sm text-gray-600">活躍用戶</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">快速操作</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left">
              <h3 className="font-semibold text-gray-900 mb-1">查看對話記錄</h3>
              <p className="text-sm text-gray-600">瀏覽所有客服對話</p>
            </button>
            
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left">
              <h3 className="font-semibold text-gray-900 mb-1">問卷分析</h3>
              <p className="text-sm text-gray-600">查看問卷統計結果</p>
            </button>
            
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left">
              <h3 className="font-semibold text-gray-900 mb-1">匯出報表</h3>
              <p className="text-sm text-gray-600">下載數據報表</p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">最近活動</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">新對話: 用戶詢問產品資訊</p>
                <p className="text-xs text-gray-500">5 分鐘前</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">問卷完成: 客戶滿意度調查</p>
                <p className="text-xs text-gray-500">12 分鐘前</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">新用戶註冊</p>
                <p className="text-xs text-gray-500">25 分鐘前</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
