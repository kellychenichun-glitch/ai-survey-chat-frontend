'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Search, Edit2, Check, X, RefreshCw, ExternalLink, ChevronDown, ChevronUp, Sparkles, BookOpen } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com'

interface Item { id: number; kb_id: number; question: string; answer: string; source: string; tags: string[]; enabled: boolean; created_at: string }
interface KB { id: number; name: string; description: string; item_count: number }

function ItemCard({ item, kbId, onUpdate, onDelete }: { item: Item; kbId: string; onUpdate: (i: Item) => void; onDelete: (id: number) => void }) {
  const [editing, setEditing] = useState(false)
  const [q, setQ] = useState(item.question)
  const [a, setA] = useState(item.answer)
  const [src, setSrc] = useState(item.source)
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch(`${API}/api/v1/kb/${kbId}/items/${item.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, answer: a, source: src })
      })
      const d = await res.json()
      if (d.item) { onUpdate(d.item); setEditing(false) }
    } catch {}
    setSaving(false)
  }

  const toggle = async () => {
    try {
      const res = await fetch(`${API}/api/v1/kb/${kbId}/items/${item.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !item.enabled })
      })
      const d = await res.json()
      if (d.item) onUpdate(d.item)
    } catch {}
  }

  if (editing) return (
    <div className="bg-white rounded-xl border-2 border-blue-200 shadow-sm p-5 space-y-3">
      <div><label className="text-xs font-medium text-gray-600 mb-1 block">問題</label><input value={q} onChange={e=>setQ(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
      <div><label className="text-xs font-medium text-gray-600 mb-1 block">答案</label><textarea value={a} onChange={e=>setA(e.target.value)} rows={4} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/></div>
      <div><label className="text-xs font-medium text-gray-600 mb-1 block">來源（選填）</label><input value={src} onChange={e=>setSrc(e.target.value)} placeholder="例如：官網FAQ" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"/></div>
      <div className="flex gap-2">
        <button onClick={save} disabled={saving||!q.trim()||!a.trim()} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"><Check className="h-3.5 w-3.5"/>{saving?'儲存中...':'儲存'}</button>
        <button onClick={()=>{ setEditing(false); setQ(item.question); setA(item.answer); setSrc(item.source) }} className="flex items-center gap-1.5 border px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50"><X className="h-3.5 w-3.5"/>取消</button>
      </div>
    </div>
  )

  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden transition ${!item.enabled?'opacity-50':''}`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button onClick={toggle} className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition ${item.enabled?'border-blue-500 bg-blue-500':'border-gray-300'}`}>
            {item.enabled && <Check className="h-3 w-3 text-white"/>}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-gray-900 text-sm">{item.question}</p>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={()=>setEditing(true)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit2 className="h-3.5 w-3.5"/></button>
                <button onClick={()=>onDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="h-3.5 w-3.5"/></button>
                <button onClick={()=>setExpanded(!expanded)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition">
                  {expanded ? <ChevronUp className="h-3.5 w-3.5"/> : <ChevronDown className="h-3.5 w-3.5"/>}
                </button>
              </div>
            </div>
            {(expanded || item.answer.length < 100) && <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{item.answer}</p>}
            {!expanded && item.answer.length >= 100 && <p className="text-sm text-gray-400 mt-1">{item.answer.slice(0,80)}... <button onClick={()=>setExpanded(true)} className="text-blue-500 hover:underline">展開</button></p>}
            {item.source && <div className="flex items-center gap-1 mt-2 text-xs text-gray-400"><ExternalLink className="h-3 w-3"/>{item.source}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function KBDetailPage({ params }: { params: { id: string } }) {
  const [kb, setKb] = useState<KB | null>(null)
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [adding, setAdding] = useState(false)
  const [newQ, setNewQ] = useState('')
  const [newA, setNewA] = useState('')
  const [newSrc, setNewSrc] = useState('')
  const [saving, setSaving] = useState(false)
  const [searchResults, setSearchResults] = useState<Item[] | null>(null)
  const [searching, setSearching] = useState(false)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [aiTopic, setAiTopic] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [kbRes, itemsRes] = await Promise.all([
        fetch(`${API}/api/v1/kb`).then(r=>r.json()),
        fetch(`${API}/api/v1/kb/${params.id}/items`).then(r=>r.json()),
      ])
      setKb((kbRes.kbs||[]).find((k: KB) => String(k.id) === params.id) || null)
      setItems(itemsRes.items || [])
    } catch {}
    setLoading(false)
  }, [params.id])

  useEffect(() => { load() }, [load])

  const handleSearch = async () => {
    if (!search.trim()) { setSearchResults(null); return }
    setSearching(true)
    try {
      const res = await fetch(`${API}/api/v1/kb/${params.id}/search`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: search, limit: 10 })
      })
      const d = await res.json()
      setSearchResults(d.results || [])
    } catch {}
    setSearching(false)
  }

  const handleAdd = async () => {
    if (!newQ.trim() || !newA.trim()) return
    setSaving(true)
    try {
      const res = await fetch(`${API}/api/v1/kb/${params.id}/items`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: newQ.trim(), answer: newA.trim(), source: newSrc.trim() })
      })
      const d = await res.json()
      if (d.item) { setItems(prev => [d.item, ...prev]); setAdding(false); setNewQ(''); setNewA(''); setNewSrc('') }
    } catch {}
    setSaving(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('確定刪除此條目？')) return
    await fetch(`${API}/api/v1/kb/${params.id}/items/${id}`, { method: 'DELETE' })
    setItems(prev => prev.filter(i => i.id !== id))
    if (searchResults) setSearchResults(prev => prev ? prev.filter(i => i.id !== id) : null)
  }

  const handleUpdate = (updated: Item) => {
    setItems(prev => prev.map(i => i.id === updated.id ? updated : i))
    if (searchResults) setSearchResults(prev => prev ? prev.map(i => i.id === updated.id ? updated : i) : null)
  }

  const handleAiGenerate = async () => {
    if (!aiTopic.trim()) return
    setAiGenerating(true)
    try {
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `請針對「${aiTopic}」這個主題，生成 5 個常見問答（FAQ）。只輸出 JSON 陣列，每個元素包含 question 和 answer 兩個欄位，格式：[{"question":"...","answer":"..."}]` })
      })
      const data = await res.json()
      const match = (data.message || '').match(/\[[\s\S]*\]/)
      if (match) {
        const faqs: {question: string; answer: string}[] = JSON.parse(match[0])
        for (const faq of faqs) {
          const r = await fetch(`${API}/api/v1/kb/${params.id}/items`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: faq.question, answer: faq.answer, source: 'AI 生成' })
          })
          const d = await r.json()
          if (d.item) setItems(prev => [d.item, ...prev])
        }
        setAiTopic('')
      }
    } catch {}
    setAiGenerating(false)
  }

  const displayItems = searchResults !== null ? searchResults : items

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/knowledge" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="h-5 w-5"/></Link>
            <div><div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-blue-600"/><h1 className="font-semibold text-gray-900">{kb?.name || '知識庫'}</h1></div><p className="text-xs text-gray-400">{items.length} 個條目</p></div>
          </div>
          <button onClick={()=>setAdding(true)} className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"><Plus className="h-4 w-4"/>新增條目</button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        <div className="flex gap-2">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSearch()} placeholder="搜尋問答..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
          <button onClick={handleSearch} disabled={searching} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border bg-white text-sm hover:bg-gray-50 disabled:opacity-50">{searching?<RefreshCw className="h-4 w-4 animate-spin"/>:<Search className="h-4 w-4"/>}搜尋</button>
          {searchResults !== null && <button onClick={()=>{setSearch('');setSearchResults(null)}} className="px-3 py-2.5 rounded-xl border bg-white text-sm text-gray-500 hover:bg-gray-50">清除</button>}
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-4">
          <div className="flex items-center gap-2 mb-3"><Sparkles className="h-4 w-4 text-purple-600"/><span className="font-medium text-purple-800 text-sm">AI 批量生成 FAQ</span></div>
          <div className="flex gap-2">
            <input value={aiTopic} onChange={e=>setAiTopic(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAiGenerate()} placeholder="輸入主題，例如：退換貨政策、帳號問題..." className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"/>
            <button onClick={handleAiGenerate} disabled={aiGenerating||!aiTopic.trim()} className="flex items-center gap-1.5 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50 transition">{aiGenerating?<RefreshCw className="h-4 w-4 animate-spin"/>:<Sparkles className="h-4 w-4"/>}{aiGenerating?'生成中...':'生成 5 條'}</button>
          </div>
        </div>
        {adding && (
          <div className="bg-white rounded-xl border-2 border-blue-200 shadow-sm p-5 space-y-3">
            <h3 className="font-semibold text-gray-800">新增問答條目</h3>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">問題 *</label><input value={newQ} onChange={e=>setNewQ(e.target.value)} placeholder="常見問題..." className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">答案 *</label><textarea value={newA} onChange={e=>setNewA(e.target.value)} placeholder="標準答案..." rows={4} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/></div>
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">來源（選填）</label><input value={newSrc} onChange={e=>setNewSrc(e.target.value)} placeholder="例如：官網FAQ、SOP文件" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"/></div>
            <div className="flex gap-2">
              <button onClick={handleAdd} disabled={saving||!newQ.trim()||!newA.trim()} className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"><Check className="h-4 w-4"/>{saving?'新增中...':'新增'}</button>
              <button onClick={()=>{setAdding(false);setNewQ('');setNewA('');setNewSrc('')}} className="flex items-center gap-1.5 border px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"><X className="h-4 w-4"/>取消</button>
            </div>
          </div>
        )}
        {searchResults !== null && <div className="flex items-center gap-2 text-sm text-gray-500"><Search className="h-4 w-4"/>搜尋「{search}」找到 {searchResults.length} 個結果</div>}
        {loading ? (
          <div className="flex justify-center py-20"><RefreshCw className="h-8 w-8 animate-spin text-gray-300"/></div>
        ) : displayItems.length === 0 ? (
          <div className="text-center py-20 text-gray-400"><BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30"/><p className="text-lg font-medium">{searchResults !== null ? '找不到相關條目' : '還沒有任何條目'}</p><p className="text-sm mt-1">{searchResults !== null ? '試試其他關鍵字' : '點擊「新增條目」或使用 AI 批量生成'}</p></div>
        ) : (
          <div className="space-y-3">{displayItems.map(item => <ItemCard key={item.id} item={item} kbId={params.id} onUpdate={handleUpdate} onDelete={handleDelete}/>)}</div>
        )}
      </main>
    </div>
  )
}
