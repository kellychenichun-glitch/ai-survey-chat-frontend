'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Search, BookOpen, Edit2, Check, X, RefreshCw, Database } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com'

interface KB { id: number; name: string; description: string; status: string; item_count: number; created_at: string }

export default function KnowledgePage() {
  const [kbs, setKbs] = useState<KB[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/v1/kb`)
      const d = await res.json()
      setKbs(d.kbs || [])
    } catch (e: any) { setError(e.message) }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreate = async () => {
    if (!newName.trim()) return
    setSaving(true)
    try {
      const res = await fetch(`${API}/api/v1/kb`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), description: newDesc.trim() })
      })
      const d = await res.json()
      if (d.kb) { setKbs(prev => [d.kb, ...prev]); setCreating(false); setNewName(''); setNewDesc('') }
    } catch (e: any) { setError(e.message) }
    setSaving(false)
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`確定刪除「${name}」知識庫？此操作無法復原。`)) return
    try {
      await fetch(`${API}/api/v1/kb/${id}`, { method: 'DELETE' })
      setKbs(prev => prev.filter(k => k.id !== id))
    } catch (e: any) { setError(e.message) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="h-5 w-5"/></Link>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600"/>
              <h1 className="font-semibold text-gray-900">知識庫管理</h1>
            </div>
          </div>
          <button onClick={() => setCreating(true)} className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
            <Plus className="h-4 w-4"/>新增知識庫
          </button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-4">
        {error && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>}
        {creating && (
          <div className="bg-white rounded-xl border shadow-sm p-6 space-y-3">
            <h3 className="font-semibold text-gray-800">新增知識庫</h3>
            <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="知識庫名稱（必填）" className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <textarea value={newDesc} onChange={e=>setNewDesc(e.target.value)} placeholder="說明（選填）" rows={2} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
            <div className="flex gap-2">
              <button onClick={handleCreate} disabled={saving||!newName.trim()} className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
                <Check className="h-4 w-4"/>{saving?'建立中...':'建立'}
              </button>
              <button onClick={()=>{setCreating(false);setNewName('');setNewDesc('')}} className="flex items-center gap-1.5 border px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                <X className="h-4 w-4"/>取消
              </button>
            </div>
          </div>
        )}
        {loading ? (
          <div className="flex justify-center py-20"><RefreshCw className="h-8 w-8 animate-spin text-gray-300"/></div>
        ) : kbs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Database className="h-12 w-12 mx-auto mb-3 opacity-30"/>
            <p className="text-lg font-medium">還沒有知識庫</p>
            <p className="text-sm mt-1">建立知識庫讓 AI 客服有據可查</p>
          </div>
        ) : kbs.map(kb => (
          <div key={kb.id} className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{kb.name}</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">{kb.item_count} 條</span>
                  <span className={`text-xs rounded-full px-2 py-0.5 ${kb.status==='active'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{kb.status==='active'?'啟用':'停用'}</span>
                </div>
                {kb.description && <p className="text-sm text-gray-500">{kb.description}</p>}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Link href={`/admin/knowledge/${kb.id}`} className="flex items-center gap-1.5 text-sm border px-3 py-1.5 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                  <Edit2 className="h-3.5 w-3.5"/>管理條目
                </Link>
                <button onClick={()=>handleDelete(kb.id, kb.name)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                  <Trash2 className="h-4 w-4"/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
