'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, BarChart2, Edit2, Trash2, Share2, Copy, Eye, CheckCircle, Clock, XCircle, RefreshCw, List } from 'lucide-react'
import { listSurveysSummary, closeSurvey, reopenSurvey, duplicateSurvey, type SurveySummary } from '@/lib/api/surveys-list'
import { deleteSurvey, publishSurvey } from '@/lib/api/surveys'
import ShareModal from './ShareModal'

type StatusFilter = 'all' | 'draft' | 'published' | 'closed'

export default function SurveyList() {
  const [surveys, setSurveys] = useState<SurveySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [shareTarget, setShareTarget] = useState<SurveySummary | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try { setSurveys(await listSurveysSummary({ status, search: search || undefined })) }
    catch(e:any) { setError(e.message) }
    finally { setLoading(false) }
  }, [status, search])

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t) }, [load])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`確定要刪除「${title}」？`)) return
    try { await deleteSurvey(id); load() } catch(e:any) { alert(e.message) }
  }
  const handlePublish = async (id: string) => {
    try { await publishSurvey(id); load() } catch(e:any) { alert(e.message) }
  }
  const handleClose = async (id: string) => {
    try { await closeSurvey(id); load() } catch(e:any) { alert(e.message) }
  }
  const handleReopen = async (id: string) => {
    try { await reopenSurvey(id); load() } catch(e:any) { alert(e.message) }
  }
  const handleDuplicate = async (id: string) => {
    try { await duplicateSurvey(id); load() } catch(e:any) { alert(e.message) }
  }

  const statusBadge = (s: string) => {
    if (s==='published') return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"><CheckCircle className="h-3 w-3"/>已發布</span>
    if (s==='closed') return <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"><XCircle className="h-3 w-3"/>已關閉</span>
    return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"><Clock className="h-3 w-3"/>草稿</span>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">問卷管理</h1>
          <Link href="/admin/surveys/new" className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800">
            <Plus className="h-4 w-4"/>建立新問卷
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 搜尋 + 篩選 */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜尋問卷..." className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"/>
          </div>
          <div className="flex gap-2">
            {(['all','draft','published','closed'] as StatusFilter[]).map(s=>(
              <button key={s} onClick={()=>setStatus(s)} className={`px-3 py-2 rounded-lg text-sm font-medium transition ${status===s?'bg-gray-900 text-white':'bg-white border text-gray-600 hover:border-gray-400'}`}>
                {{all:'全部',draft:'草稿',published:'已發布',closed:'已關閉'}[s]}
              </button>
            ))}
          </div>
          <button onClick={load} className="p-2.5 rounded-lg border bg-white hover:border-gray-400"><RefreshCw className="h-4 w-4 text-gray-500"/></button>
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

        {loading ? (
          <div className="flex justify-center py-20"><div className="h-8 w-8 rounded-full border-2 border-gray-900 border-t-transparent animate-spin"/></div>
        ) : surveys.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Filter className="h-12 w-12 mx-auto mb-3 opacity-30"/>
            <p className="text-lg font-medium">沒有找到問卷</p>
            <p className="text-sm mt-1">試試調整篩選條件，或<Link href="/admin/surveys/new" className="text-blue-600 hover:underline ml-1">建立一份新問卷</Link></p>
          </div>
        ) : (
          <div className="grid gap-4">
            {surveys.map(sv=>(
              <div key={sv.id} className="bg-white rounded-xl border shadow-sm hover:shadow-md transition p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {statusBadge(sv.status)}
                      <span className="text-xs text-gray-400">{sv.questionCount} 題 · {sv.responseCount} 份回覆</span>
                    </div>
                    <h2 className="font-semibold text-gray-900 truncate">{sv.title}</h2>
                    {sv.description && <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{sv.description}</p>}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {sv.status==='draft' && <button onClick={()=>handlePublish(sv.id)} className="flex items-center gap-1 text-xs bg-green-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-green-700"><CheckCircle className="h-3.5 w-3.5"/>發布</button>}
                    {sv.status==='published' && <>
                      <Link href={`/survey/${sv.id}`} target="_blank" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"><Eye className="h-4 w-4"/></Link>
                      <button onClick={()=>setShareTarget(sv)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"><Share2 className="h-4 w-4"/></button>
                      <Link href={`/admin/surveys/${sv.id}/stats`} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"><BarChart2 className="h-4 w-4"/></Link>
                      <Link href={`/admin/surveys/${sv.id}/responses`} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100" title="查看回覆"><List className="h-4 w-4"/></Link>
                      <button onClick={()=>handleClose(sv.id)} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2.5 py-1.5 rounded-lg hover:bg-gray-200"><XCircle className="h-3.5 w-3.5"/>關閉</button>
                    </>}
                    {sv.status==='closed' && <button onClick={()=>handleReopen(sv.id)} className="flex items-center gap-1 text-xs bg-blue-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-blue-700"><RefreshCw className="h-3.5 w-3.5"/>重開</button>}
                    <Link href={`/admin/surveys/${sv.id}/edit`} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"><Edit2 className="h-4 w-4"/></Link>
                    <button onClick={()=>handleDuplicate(sv.id)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"><Copy className="h-4 w-4"/></button>
                    <button onClick={()=>handleDelete(sv.id, sv.title)} className="p-2 rounded-lg text-red-400 hover:bg-red-50"><Trash2 className="h-4 w-4"/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {shareTarget && <ShareModal survey={shareTarget} onClose={()=>setShareTarget(null)}/>}
    </div>
  )
}
