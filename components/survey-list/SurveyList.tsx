'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { BarChart2, Edit, Eye, Share2, Trash2, Copy, CheckCircle } from 'lucide-react'
const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com'

interface Survey { id: number; title: string; description: string; status: string; created_at: string; response_count?: number }

const STATUS_BADGE: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  published: 'bg-green-100 text-green-700',
  closed: 'bg-red-100 text-red-600',
}

export default function SurveyList() {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const load = useCallback(() => {
    fetch(`${API}/api/surveys`)
      .then(r => r.json())
      .then(d => { setSurveys(Array.isArray(d) ? d : d.surveys || []); setLoading(false); })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const deleteSurvey = async (id: number) => {
    if (!confirm('確定要刪除這份問卷嗎？')) return
    await fetch(`${API}/api/surveys/${id}`, { method: 'DELETE' })
    load()
  }

  const copyLink = (id: number) => {
    const url = `${window.location.origin}/survey/${id}`
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) return <div className="py-12 text-center text-gray-400">Loading...</div>

  if (surveys.length === 0) return (
    <div className="py-16 text-center text-gray-400">
      <p className="text-4xl mb-3">📋</p>
      <p className="font-medium text-gray-500">尚無問卷</p>
      <p className="text-sm mt-1">點擊右上角「+ New Survey」開始建立</p>
    </div>
  )

  return (
    <div className="space-y-3">
      {surveys.map(s => (
        <div key={s.id} className="bg-white rounded-xl border shadow-sm hover:shadow-md transition p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[s.status] || STATUS_BADGE.draft}`}>{s.status}</span>
                {s.response_count !== undefined && (
                  <span className="text-xs text-gray-400">{s.response_count} 份回覆</span>
                )}
              </div>
              <h3 className="font-semibold text-gray-800 truncate">{s.title}</h3>
              {s.description && <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{s.description}</p>}
              <p className="text-xs text-gray-400 mt-1">{new Date(s.created_at).toLocaleDateString('zh-TW')}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Link href={`/admin/surveys/${s.id}/stats`} title="Statistics"
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                <BarChart2 className="h-4 w-4"/>
              </Link>
              <Link href={`/admin/surveys/${s.id}/responses`} title="Responses"
                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition">
                <Eye className="h-4 w-4"/>
              </Link>
              <Link href={`/admin/surveys/${s.id}/edit`} title="Edit"
                className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition">
                <Edit className="h-4 w-4"/>
              </Link>
              {s.status === 'published' && (
                <button onClick={() => copyLink(s.id)} title="Copy link"
                  className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition">
                  {copiedId === s.id ? <CheckCircle className="h-4 w-4 text-green-500"/> : <Copy className="h-4 w-4"/>}
                </button>
              )}
              <button onClick={() => deleteSurvey(s.id)} title="Delete"
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                <Trash2 className="h-4 w-4"/>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
