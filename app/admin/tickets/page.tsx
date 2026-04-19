'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, ExternalLink, Ticket, RefreshCw } from 'lucide-react'
const LINEAR_API = 'https://api.linear.app/graphql'
const PRIORITY = ['','緊急','高','中','低']
const P_COLOR = ['','text-red-600','text-orange-500','text-yellow-500','text-gray-400']
interface Issue { id:string; title:string; state:{name:string;color:string}; priority:number; createdAt:string; url:string; assignee?:{name:string} }
export default function TicketsPage() {
  const [issues,setIssues] = useState<Issue[]>([])
  const [loading,setLoading] = useState(false)
  const [apiKey,setApiKey] = useState('')
  const [teamId,setTeamId] = useState('')
  const [configured,setConfigured] = useState(false)
  const [creating,setCreating] = useState(false)
  const [newTitle,setNewTitle] = useState('')
  const [newDesc,setNewDesc] = useState('')
  const [saving,setSaving] = useState(false)
  const [error,setError] = useState('')
  useEffect(() => {
    if (typeof window === 'undefined') return
    const k = localStorage.getItem('linear_api_key')||''; const t = localStorage.getItem('linear_team_id')||''
    if (k&&t) { setApiKey(k); setTeamId(t); setConfigured(true); load(k,t) }
  }, [])
  const load = async (k:string,t:string) => {
    setLoading(true); setError('')
    try {
      const r = await fetch(LINEAR_API,{method:'POST',headers:{'Content-Type':'application/json','Authorization':k},body:JSON.stringify({query:`query{team(id:"${t}"){issues(first:30,orderBy:createdAt){nodes{id title state{name color} priority createdAt url assignee{name}}}}}`})})
      const d = await r.json(); setIssues(d.data?.team?.issues?.nodes||[])
    } catch(e:any){setError(e.message)}
    setLoading(false)
  }
  const saveConfig = () => { localStorage.setItem('linear_api_key',apiKey); localStorage.setItem('linear_team_id',teamId); setConfigured(true); load(apiKey,teamId) }
  const createIssue = async () => {
    if (!newTitle.trim()) return; setSaving(true)
    try {
      const r = await fetch(LINEAR_API,{method:'POST',headers:{'Content-Type':'application/json','Authorization':apiKey},body:JSON.stringify({query:`mutation{issueCreate(input:{teamId:"${teamId}",title:${JSON.stringify(newTitle)},description:${JSON.stringify(newDesc)}}){success issue{id title state{name color} priority createdAt url}}}`})})
      const d = await r.json()
      if (d.data?.issueCreate?.success) { setIssues(p=>[d.data.issueCreate.issue,...p]); setCreating(false); setNewTitle(''); setNewDesc('') }
    } catch(e:any){setError(e.message)}
    setSaving(false)
  }
  if (!configured) return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm"><div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-4"><Link href="/admin" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="h-5 w-5"/></Link><h1 className="font-semibold">工單管理（Linear）</h1></div></header>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border shadow-sm p-8 space-y-5">
          <div><h2 className="font-bold text-lg mb-1">連接 Linear</h2><p className="text-sm text-gray-500">前往 <a href="https://linear.app/settings/api" target="_blank" className="text-blue-500 underline">linear.app/settings/api</a> 取得 API Key</p></div>
          <div className="space-y-3">
            <div><label className="text-sm font-medium text-gray-700 block mb-1">API Key</label><input value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="lin_api_..." className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
            <div><label className="text-sm font-medium text-gray-700 block mb-1">Team ID</label><input value={teamId} onChange={e=>setTeamId(e.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
          </div>
          <button onClick={saveConfig} disabled={!apiKey||!teamId} className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50">連接 Linear</button>
        </div>
      </main>
    </div>
  )
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4"><Link href="/admin" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="h-5 w-5"/></Link><div className="flex items-center gap-2"><Ticket className="h-5 w-5 text-purple-500"/><h1 className="font-semibold">工單管理</h1></div></div>
          <div className="flex items-center gap-2">
            <button onClick={()=>load(apiKey,teamId)} disabled={loading} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><RefreshCw className={`h-4 w-4 ${loading?'animate-spin':''}`}/></button>
            <button onClick={()=>setCreating(true)} className="flex items-center gap-1.5 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700"><Plus className="h-4 w-4"/>新增工單</button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>}
        {creating && (
          <div className="bg-white rounded-xl border shadow-sm p-5 space-y-3">
            <h3 className="font-semibold">新增工單</h3>
            <input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="標題 *" className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"/>
            <textarea value={newDesc} onChange={e=>setNewDesc(e.target.value)} placeholder="說明（選填）" rows={3} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"/>
            <div className="flex gap-2">
              <button onClick={createIssue} disabled={saving||!newTitle.trim()} className="flex items-center gap-1.5 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50">{saving?<RefreshCw className="h-4 w-4 animate-spin"/>:<Plus className="h-4 w-4"/>}{saving?'建立中...':'建立'}</button>
              <button onClick={()=>setCreating(false)} className="border px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">取消</button>
            </div>
          </div>
        )}
        {loading?<div className="flex justify-center py-20"><RefreshCw className="h-8 w-8 animate-spin text-gray-300"/></div>
        :issues.length===0?<div className="text-center py-20 text-gray-400"><Ticket className="h-12 w-12 mx-auto mb-3 opacity-30"/><p className="text-lg font-medium">還沒有工單</p></div>
        :issues.map(issue=>(
          <div key={issue.id} className="bg-white rounded-xl border shadow-sm p-4 flex items-start gap-4 hover:shadow-md transition">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900 text-sm">{issue.title}</span>
                <span className={`text-xs font-medium ${P_COLOR[issue.priority]}`}>{PRIORITY[issue.priority]}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{background:issue.state.color}}/>{issue.state.name}</span>
                {issue.assignee&&<span>{issue.assignee.name}</span>}
                <span>{new Date(issue.createdAt).toLocaleDateString('zh-TW')}</span>
              </div>
            </div>
            <a href={issue.url} target="_blank" className="p-2 text-gray-300 hover:text-blue-500"><ExternalLink className="h-4 w-4"/></a>
          </div>
        ))}
      </main>
    </div>
  )
}
