import Link from 'next/link'
import ChatWidget from '@/components/ChatWidget'
import { BarChart2, ClipboardList, Plus, MessageSquare, Users, CheckCircle } from 'lucide-react'

async function getStats() {
  try {
    const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com'
    const res = await fetch(`${API}/api/v1/surveys/summary`, { cache: 'no-store' })
    const data = await res.json()
    const surveys = data.surveys || []
    return {
      total: surveys.length,
      published: surveys.filter((s: any) => s.status === 'published').length,
      responses: surveys.reduce((n: number, s: any) => n + (s.responseCount || 0), 0)
    }
  } catch {
    return { total: 0, published: 0, responses: 0 }
  }
}

export default async function HomePage() {
  const stats = await getStats()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="border-b bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ClipboardList className="h-5 w-5 text-white"/>
            </div>
            <span className="font-bold text-gray-900 text-lg">AI Survey</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900 transition">ç®¡çå¾å°</Link>
            <Link href="/admin/surveys/new" className="flex items-center gap-1.5 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              <Plus className="h-4 w-4"/>å»ºç«åå·
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"/>AI é©åçæºè½åå·ç³»çµ±
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
            ç¨ AI å»ºç«åå·<br/><span className="text-blue-600">10 ç§å®æè¨­è¨</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            è¼¸å¥ä¸»é¡ï¼AI èªåçæå®æ´åå·ãæ¶éåé¥ãåææ¸æãç²å¾æ´å¯ââä¸ç«æå®ã
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/admin/surveys/new" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              <Plus className="h-5 w-5"/>ç«å³å»ºç«åå·
            </Link>
            <Link href="/admin/surveys" className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition border shadow-sm">
              <ClipboardList className="h-5 w-5"/>æ¥çåå·åè¡¨
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-16">
          {[
            { icon: ClipboardList, label: 'åå·ç¸½æ¸', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: CheckCircle, label: 'å·²ç¼å¸', value: stats.published, color: 'text-green-600', bg: 'bg-green-50' },
            { icon: Users, label: 'ç´¯ç©åè¦', value: stats.responses, color: 'text-purple-600', bg: 'bg-purple-50' }
          ].map(item => (
            <div key={item.label} className="bg-white rounded-2xl border shadow-sm p-6 text-center">
              <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <item.icon className={`h-6 w-6 ${item.color}`}/>
              </div>
              <p className="text-3xl font-bold text-gray-900">{item.value}</p>
              <p className="text-sm text-gray-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: 'â¨', title: 'AI æºè½çæ', desc: 'è¼¸å¥åå·ä¸»é¡ï¼Claude AI èªåè¨­è¨é¡ç®ãé¸é ï¼10 ç§çæå®æ´åå·ã', link: '/admin/surveys/new', cta: 'ç«å³è©¦ç¨' },
            { icon: 'ð', title: 'å³ææ¸æåæ', desc: 'åè¦å³æåç¾ï¼é·æ¢åãè©åè¶¨å¢ä¸è¦½ç¡éºï¼éæ AI æ´å¯å ±åã', link: '/admin/surveys', cta: 'æ¥ççµ±è¨' },
            { icon: 'ð', title: 'å¤ååäº«æ¹å¼', desc: 'è¤è£½é£çµãQR Codeãç¤¾ç¾¤åäº«ââè®æ´å¤äººå¡«ç­$½ çåå·ã', link: '/admin/surveys', cta: 'éå§åäº«' }
          ].map(f => (
            <div key={f.title} className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{f.desc}</p>
              <Link href={f.link} className="text-blue-600 text-sm font-medium hover:underline">{f.cta} â</Link>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-8">
          <h2 className="font-bold text-gray-900 text-xl mb-6">å¿«éå¥å£</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Plus, label: 'å»ºç«æ°åå·', href: '/admin/surveys/new', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: ClipboardList, label: 'åå·ç®¡ç', href: '/admin/surveys', color: 'text-green-600', bg: 'bg-green-50' },
              { icon: BarChart2, label: 'ç®¡çå¾å°', href: '/admin', color: 'text-purple-600', bg: 'bg-purple-50' },
              { icon: MessageSquare, label: 'AI å®¢æ', href: '/chat', color: 'text-orange-600', bg: 'bg-orange-50' }
            ].map(item => (
              <Link key={item.label} href={item.href} className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-200">
                <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center`}>
                  <item.icon className={`h-6 w-6 ${item.color}`}/>
                </div>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-sm text-gray-400 border-t bg-white/50">
        AI Survey Chat Â· Powered by Claude Â· {new Date().getFullYear()}
      </footer>

      {/* æµ®å AI å®¢ææé â å¨æå¤å±¤ div å§ï¼JSX æ­£ç¢ºä½ç½® */}
      <ChatWidget />
    </div>
  )
}
