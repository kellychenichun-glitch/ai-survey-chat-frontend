import Link from 'next/link'
import { BarChart2, ClipboardList, Plus, MessageSquare, Users, CheckCircle } from 'lucide-react'

async function getStats() {
  try {
    const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com'
    const res = await fetch(`${API}/api/v1/surveys/summary`, { next: { revalidate: 60 } })
    const data = await res.json()
    const surveys = data.surveys || []
    return { total: surveys.length, published: surveys.filter((s: any) => s.status === 'published').length, responses: surveys.reduce((n: number, s: any) => n + (s.responseCount || 0), 0) }
  } catch { return { total: 0, published: 0, responses: 0 } }
}

export default async function HomePage() {
  const stats = await getStats()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="border-b bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><ClipboardList className="h-5 w-5 text-white"/></div>
            <span className="font-bold text-gray-900 text-lg">AI Survey</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900 transition">管理後台</Link>
            <Link href="/admin/surveys/new" className="flex items-center gap-1.5 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"><Plus className="h-4 w-4"/>建立問卷</Link>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"/>AI 驅動的智能問卷系統
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">用 AI 建立問卷<br/><span className="text-blue-600">10 秒完成設計</span></h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">輸入主題，AI 自動生成完整問卷。收集回饋、分析數據、獲得洞察——一站搞定。</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/admin/surveys/new" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"><Plus className="h-5 w-5"/>立即建立問卷</Link>
            <Link href="/admin/surveys" className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition border shadow-sm"><ClipboardList className="h-5 w-5"/>查看問卷列表</Link>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 mb-16">
          {[{icon:ClipboardList,label:'問卷總數',value:stats.total,color:'text-blue-600',bg:'bg-blue-50'},{icon:CheckCircle,label:'已發布',value:stats.published,color:'text-green-600',bg:'bg-green-50'},{icon:Users,label:'累積回覆',value:stats.responses,color:'text-purple-600',bg:'bg-purple-50'}].map(item=>(
            <div key={item.label} className="bg-white rounded-2xl border shadow-sm p-6 text-center">
              <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}><item.icon className={`h-6 w-6 ${item.color}`}/></div>
              <p className="text-3xl font-bold text-gray-900">{item.value}</p>
              <p className="text-sm text-gray-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[{icon:'✨',title:'AI 智能生成',desc:'輸入問卷主題，Claude AI 自動設計題目、選項，10 秒生成完整問卷。',link:'/admin/surveys/new',cta:'立即試用'},{icon:'📊',title:'即時數據分析',desc:'回覆即時呈現，長條圖、評分趨勢一覽無遺，還有 AI 洞察報告。',link:'/admin/surveys',cta:'查看統計'},{icon:'🔗',title:'多元分享方式',desc:'複製連結、QR Code、社群分享——讓更多人填答你的問卷。',link:'/admin/surveys',cta:'開始分享'}].map(f=>(
            <div key={f.title} className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{f.desc}</p>
              <Link href={f.link} className="text-blue-600 text-sm font-medium hover:underline">{f.cta} →</Link>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border shadow-sm p-8">
          <h2 className="font-bold text-gray-900 text-xl mb-6">快速入口</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{icon:Plus,label:'建立新問卷',href:'/admin/surveys/new',color:'text-blue-600',bg:'bg-blue-50'},{icon:ClipboardList,label:'問卷管理',href:'/admin/surveys',color:'text-green-600',bg:'bg-green-50'},{icon:BarChart2,label:'管理後台',href:'/admin',color:'text-purple-600',bg:'bg-purple-50'},{icon:MessageSquare,label:'AI 客服',href:'/chat',color:'text-orange-600',bg:'bg-orange-50'}].map(item=>(
              <Link key={item.label} href={item.href} className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-200">
                <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center`}><item.icon className={`h-6 w-6 ${item.color}`}/></div>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <footer className="text-center py-8 text-sm text-gray-400 border-t bg-white/50">AI Survey Chat · Powered by Claude · {new Date().getFullYear()}</footer>
    </div>
  )
}
