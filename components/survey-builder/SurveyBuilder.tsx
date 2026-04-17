'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Sparkles, Save, Send, ArrowLeft, Settings, Eye } from 'lucide-react'
import { createSurvey, updateSurvey, publishSurvey, aiGenerateSurvey } from '@/lib/api/surveys'
import { createQuestion, createEmptySurvey, QUESTION_TYPE_LABELS, type Survey, type Question, type QuestionType } from '@/types/survey'

interface Props { mode: 'create' | 'edit'; initialSurvey?: Survey }

const QUESTION_TYPES: QuestionType[] = ['single_choice','multi_choice','text_short','text_long','rating','matrix','ranking']

export default function SurveyBuilder({ mode, initialSurvey }: Props) {
  const router = useRouter()
  const [survey, setSurvey] = useState<Survey>(initialSurvey || createEmptySurvey())
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiTopic, setAiTopic] = useState('')
  const [showAi, setShowAi] = useState(false)
  const [expandedQ, setExpandedQ] = useState<string | null>(null)
  const [error, setError] = useState('')

  const update = (patch: Partial<Survey>) => setSurvey(s => ({ ...s, ...patch }))
  const updateQ = (id: string, patch: Partial<Question>) => setSurvey(s => ({ ...s, questions: s.questions.map(q => q.id === id ? { ...q, ...patch } as Question : q) }))
  const removeQ = (id: string) => setSurvey(s => ({ ...s, questions: s.questions.filter(q => q.id !== id) }))
  const addQ = (type: QuestionType) => {
    const q = createQuestion(type, survey.questions.length)
    setSurvey(s => ({ ...s, questions: [...s.questions, q] }))
    setExpandedQ(q.id)
  }
  const moveQ = (idx: number, dir: -1 | 1) => {
    const qs = [...survey.questions]
    const target = idx + dir
    if (target < 0 || target >= qs.length) return
    ;[qs[idx], qs[target]] = [qs[target], qs[idx]]
    setSurvey(s => ({ ...s, questions: qs }))
  }

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      if (mode === 'create') {
        const created = await createSurvey(survey)
        router.push(`/admin/surveys/${created.id}/edit`)
      } else {
        await updateSurvey(String(survey.id), survey)
      }
    } catch(e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  const handlePublish = async () => {
    setPublishing(true); setError('')
    try {
      let id = survey.id
      if (mode === 'create' || !id) {
        const created = await createSurvey(survey)
        id = created.id
      } else {
        await updateSurvey(String(id), survey)
      }
      await publishSurvey(String(id))
      router.push('/admin/surveys')
    } catch(e: any) { setError(e.message) }
    finally { setPublishing(false) }
  }

  const handleAiGenerate = async () => {
    if (!aiTopic.trim()) return
    setAiLoading(true); setError('')
    try {
      const result = await aiGenerateSurvey({ topic: aiTopic, targetCount: 8, language: 'zh-TW' })
      setSurvey(s => ({ ...s, title: result.title || s.title, description: result.description || s.description, questions: result.questions || s.questions }))
      setShowAi(false); setAiTopic('')
    } catch(e: any) { setError(e.message) }
    finally { setAiLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={()=>router.push('/admin/surveys')} className="text-gray-400 hover:text-gray-600"><ArrowLeft className="h-5 w-5"/></button>
            <span className="font-semibold text-gray-800 truncate max-w-xs">{survey.title || '未命名問卷'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setShowAi(v=>!v)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm text-purple-600 border-purple-200 hover:bg-purple-50">
              <Sparkles className="h-4 w-4"/>AI 生成
            </button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              <Save className="h-4 w-4"/>{saving?'儲存中...':'儲存草稿'}
            </button>
            <button onClick={handlePublish} disabled={publishing} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50">
              <Send className="h-4 w-4"/>{publishing?'發布中...':'發布'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {error && <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

        {/* AI 面板 */}
        {showAi && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-5">
            <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4"/>AI 自動生成問卷</h3>
            <div className="flex gap-3">
              <input value={aiTopic} onChange={e=>setAiTopic(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAiGenerate()} placeholder="輸入問卷主題，例如：員工滿意度調查" className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"/>
              <button onClick={handleAiGenerate} disabled={aiLoading||!aiTopic.trim()} className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 disabled:opacity-50 flex items-center gap-1.5">
                {aiLoading?'生成中...':'生成'}
              </button>
            </div>
          </div>
        )}

        {/* 基本資訊 */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">基本資訊</h2>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">問卷標題 *</label>
            <input value={survey.title} onChange={e=>update({title:e.target.value})} placeholder="問卷標題" className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">說明（選填）</label>
            <textarea value={survey.description} onChange={e=>update({description:e.target.value})} placeholder="向受訪者說明此問卷的目的" rows={2} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
          </div>
        </div>

        {/* 題目列表 */}
        <div className="space-y-3">
          {survey.questions.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50" onClick={()=>setExpandedQ(expandedQ===q.id?null:q.id)}>
                <GripVertical className="h-4 w-4 text-gray-300 flex-shrink-0"/>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 rounded px-1.5 py-0.5 flex-shrink-0">{QUESTION_TYPE_LABELS[q.type]}</span>
                <span className="text-sm text-gray-700 flex-1 truncate">{q.title || '（未填題目）'}</span>
                {q.required && <span className="text-xs text-red-500 flex-shrink-0">必填</span>}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={e=>{e.stopPropagation();moveQ(idx,-1)}} disabled={idx===0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20"><ChevronUp className="h-4 w-4"/></button>
                  <button onClick={e=>{e.stopPropagation();moveQ(idx,1)}} disabled={idx===survey.questions.length-1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20"><ChevronDown className="h-4 w-4"/></button>
                  <button onClick={e=>{e.stopPropagation();removeQ(q.id)}} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4"/></button>
                </div>
              </div>
              {expandedQ===q.id && (
                <div className="border-t bg-gray-50 px-4 py-4 space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">題目文字</label>
                    <input value={q.title} onChange={e=>updateQ(q.id,{title:e.target.value})} placeholder="輸入題目" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={q.required} onChange={e=>updateQ(q.id,{required:e.target.checked})} className="rounded"/>
                    <span>必填</span>
                  </label>
                  {(q.type==='single_choice'||q.type==='multi_choice') && (
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-600 block">選項</label>
                      {((q as any).options||[]).map((opt: any, oi: number) => (
                        <div key={opt.id} className="flex gap-2">
                          <input value={opt.text} onChange={e=>{ const ops=[...(q as any).options]; ops[oi]={...ops[oi],text:e.target.value}; updateQ(q.id,{options:ops} as any) }} placeholder={`選項 ${oi+1}`} className="flex-1 rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"/>
                          <button onClick={()=>{ const ops=(q as any).options.filter((_:any,i:number)=>i!==oi); updateQ(q.id,{options:ops} as any) }} className="text-red-400 hover:text-red-600 px-2"><Trash2 className="h-3.5 w-3.5"/></button>
                        </div>
                      ))}
                      <button onClick={()=>{ const ops=[...(q as any).options,{id:crypto.randomUUID(),text:''}]; updateQ(q.id,{options:ops} as any) }} className="text-sm text-blue-600 hover:underline flex items-center gap-1"><Plus className="h-3.5 w-3.5"/>新增選項</button>
                    </div>
                  )}
                  {q.type==='rating' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-xs font-medium text-gray-600 mb-1 block">量表</label>
                        <select value={(q as any).scale} onChange={e=>updateQ(q.id,{scale:Number(e.target.value)} as any)} className="w-full rounded-lg border px-3 py-2 text-sm">
                          <option value={5}>5 分</option><option value={10}>10 分</option>
                        </select>
                      </div>
                      <div><label className="text-xs font-medium text-gray-600 mb-1 block">樣式</label>
                        <select value={(q as any).style} onChange={e=>updateQ(q.id,{style:e.target.value} as any)} className="w-full rounded-lg border px-3 py-2 text-sm">
                          <option value="stars">星星</option><option value="numbers">數字</option><option value="nps">NPS</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 新增題目 */}
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">新增題目</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {QUESTION_TYPES.map(type => (
              <button key={type} onClick={()=>addQ(type)} className="flex flex-col items-center gap-1 p-3 rounded-lg border hover:border-blue-400 hover:bg-blue-50 transition text-xs text-gray-600 hover:text-blue-700">
                <Plus className="h-4 w-4"/>
                {QUESTION_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        {survey.questions.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Plus className="h-10 w-10 mx-auto mb-2 opacity-30"/>
            <p>點擊上方按鈕新增第一個題目</p>
          </div>
        )}
      </main>
    </div>
  )
}
