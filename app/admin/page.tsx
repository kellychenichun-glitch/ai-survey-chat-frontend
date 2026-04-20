'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BarChart2, ClipboardList, Settings, Users, MessageSquare, BookOpen, Plus, Ticket } from 'lucide-react'

export default function AdminPage() {
  const [stats, setStats] = useState({ surveys: 0, published: 0, responses: 0 })
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com'
    fetch(API + '/api/v1/surveys/summary', { cache: 'no-store' })
      .then(r=>r.json()).then(d=>{
        const s = d.surveys || []
        setStats({ surveys: s.length, published: s.filter((x: any) => x.status==='published').length, responses: s.reduce((n: number, x: any) => n+(x.responseCount||0), 0) })
      }).catch(()=>{})
  }, [])

  const cards = [
    { icon: ClipboardList, label: '問卷管理', href: '/admin/surveys', value: stats.surveys, sub: '個問卷', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: BarChart2, label: '已發布', href: '/admin/surveys', value: stats.published, sub: '份已發布', color: 'text-green-600', bg: 'bg-green-50' },
    { icon: Users, label: '累積回覆', href: '/admin/surveys', value: stats.responses, sub: '份回覆', color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  const quickLinks = [
    { icon: Plus, label: '建立新問卷', href: '/admin/surveys/new', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: ClipboardList, label: '問卷管理', href: '/admin/surveys', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { icon: BookOpen, label: '知識庫', href: '/admin/knowledge', color: 'text-teal-600', bg: 'bg-teal-50' },
    { icon: MessageSquare, label: 'AI 客服', href: '/admin/chat', color: 'text-orange-600', bg: 'bg-orange-50' },
    { icon: Ticket, label: '工單管理', href: '/admin/tickets', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: BarChart2, label: '分析儀表板', href: '/admin/analytics', color: 'text-pink-600', bg: 'bg-pink-50' },
    { icon: Settings, label: '後台設定', href: '/admin/settings', color: 'text-gray-600', bg: 'bg-gray-100' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">管理後台</h1>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition">返回首頁</Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-3 gap-6">
          {cards.map(item => (
            <Link key={item.label} href={item.href} className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition">
              <div className={"w-12 h-12 " + item.bg + " rounded-xl flex items-center justify-center mb-4"}>
                <item.icon className={"h-6 w-6 " + item.color}/>
              </div>
              <p className="text-3xl font-bold text-gray-900">{item.value}</p>
              <p className="text-sm text-gray-500 mt-1">{item.label} · {item.sub}</p>
            </Link>
          ))}
        </div>
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-5">快速入口</h2>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
            {quickLinks.map(item => (
              <Link key={item.label} href={item.href} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-200">
                <div className={"w-11 h-11 " + item.bg + " rounded-xl flex items-center justify-center"}>
                  <item.icon className={"h-5 w-5 " + item.color}/>
                </div>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
