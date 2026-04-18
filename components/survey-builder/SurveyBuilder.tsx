'use client'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Save, Send, ArrowLeft, GripVertical, RefreshCw } from 'lucide-react'
import { createSurvey, updateSurvey, publishSurvey, aiGenerateSurvey } from '@/lib/api/surveys'
import { createQuestion, createEmptySurvey, QUESTION_TYPE_LABELS, type Survey, type Question, type QuestionType } from '@/types/survey'

interface Props { mode: 'create' | 'edit'; initialSurvey?: Survey }

const Q_TYPES: { type: QuestionType; emoji: string }[] = [
  {type:'single_choice',emoji:'🔘'},{type:'multi_choice',emoji:'☑️'},{type:'text_short',emoji:'✏️'},
  {type:'text_long',emoji:'📝'},{type:'rating',emoji:'⭐'},{type:'matrix',emoji:'📊'},{type:'ranking',emoji:'🏆'},
]

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
  const updateQ = useCallback((id: string, patch: Partial<Question>) => setSurvey(s => ({ ...s, questions: s.questions.map(q => q.id === id ? { ...q, ...patch } as Question : q) })), [])
  const removeQ = (id: string) => setSurvey(s => ({ ...s, questions: s.questions.filter(q => q.id !== id) }))
  const addQ = (type: QuestionType) => { const q = createQuestion(type, survey.questions.length); setSurvey(s => ({ ...s, questions: [...s.questions, q] })); setExpandedQ(q.id) }
  const moveQ = (idx: number, dir: -1 | 1) => { const qs = [...survey.questions]; const t = idx + dir; if (t < 0 || t >= qs.length) return; [qs[idx], qs[t]] = [qs[t], qs[idx]]; setSurvey(s => ({ ...s, questions: qs })) }
  const handleSave = async () => {
    if (!survey.title.trim()) { setError('請填寫問卷標題'); return }
    setSaving(true); setError('')
    try { if (mode === 'create') { const c = await createSurvey(survey); router.push(`/admin/surveys/${c.id}/edit`) } else { await updateSurvey(String(survey.id), survey) } }
    catch (e: any) { setError(e.message) } finally { setSaving(false) }
  }
  const handlePublish = async () => {
    if (!survey.title.trim()) { setError('請填寫問卷標題'); return }
    if (survey.questions.length === 0) { setError('請至少新增一個題目'); return }
    setPublishing(true); setError('')
    try {
      let id = survey.id
      if (mode === 'create' || !id) { const c = await createSurvey(survey); id = c.id } else { await updateSurvey(String(id), survey) }
      await publishSurvey(String(id)); router.push('/admin/surveys')
    } catch (e: any) { setError(e.message) } finally { setPublishing(false) }
  }
  const handleAi = async () => {
    if (!aiTopic.trim()) return
    setAiLoading(true); setError('')
    try { const r = await aiGenerateSurvey({ topic: aiTopic, targetCount: 8, language: 'zh-TW' }); setSurvey(s => ({ ...s, title: r.title || s.title, description: r.description || s.description, questions: r.questions || s.questions })); setShowAi(false); setAiTopic('') }
    catch (e: any) { setError(e.message) } finally { setAiLoading(false) }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => router.push('/admin/surveys')} className="text-gray-400 hover:text-gray-600 flex-shrink-0"><ArrowLeft className="h-5 w-5"/></button>
            <span className="font-semibold text-gray-800 truncate">{survey.title || '未命名問卷'}</span>
            <span className="text-xs text-gray-400 flex-shrink-0">{survey.questions.length} 題</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => setShowAi(v => !v)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm transition ${showAi?'bg-purple-100 text-purple-700 border-purple-200':'text-purple-600 border-purple-200 hover:bg-purple-50'}`}><Sparkles className="h-4 w-4"/>AI 生成</button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"><Save className="h-4 w-4"/>{saving?'儲存中...':'儲存草稿'}</button>
            <button onClick={handlePublish} disabled={publishing} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-50 transition"><Send className="h-4 w-4"/>{publishing?'發布中...':'發布'}</button>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
        {showAi && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-5">
            <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4"/>AI 自動生成問卷</h3>
            <div className="flex gap-3">
              <input value={aiTopic} onChange={e => setAiTopic(e.target.value)} onKeyDown={e => e.key==='Enter'&&handleAi()} placeholder="輸入問卷主題，例如：員工滿意度調查..." className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"/>
              <button onClick={handleAi} disabled={aiLoading || !aiTopic.trim()} className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 disabled:opacity-50 flex items-center gap-1.5 transition">
                {aiLoading?<RefreshCw className="h-4 w-4 animate-spin"/>:<Sparkles className="h-4 w-4"/>}{aiLoading?'生成中...':'生成'}
              </button>
            </div>
          </div>
        )}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">基本資訊</h2>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">問卷標題 <span className="text-red-500">*</span></label><input value={survey.title} onChange={e => update({title:e.target.value})} placeholder="問卷標題" className="w-full rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"/></div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">說明（選填）</label><textarea value={survey.description} onChange={e => update({description:e.target.value})} placeholder="向受訪者說明此問卷的目的" rows={2} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"/></div>
          <div><label className="text-sm font-medium text-gray-700 mb-1 block">感謝語</label><input value={(survey as any).settings?.thankYouMessage||''} onChange={e => update({settings:{...(survey as any).settings,thankYouMessage:e.target.value}} as any)} placeholder="謝謝你的填答！" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"/></div>
        </div>
        <div className="space-y-3">
          {survey.questions.map((q, idx) => (
            <QEditor key={q.id} q={q} idx={idx} total={survey.questions.length} expanded={expandedQ===q.id} onToggle={()=>setExpandedQ(expandedQ===q.id?null:q.id)} onUpdate={p=>updateQ(q.id,p)} onRemove={()=>removeQ(q.id)} onMove={d=>moveQ(idx,d)}/>
          ))}
        </div>
        <div className="bg-white rounded-xl border shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">新增題目</h3>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
            {Q_TYPES.map(({type,emoji})=>(<button key={type} onClick={()=>addQ(type)} className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-dashed hover:border-blue-400 hover:bg-blue-50 transition text-xs text-gray-500 hover:text-blue-700"><span className="text-lg">{emoji}</span>{QUESTION_TYPE_LABELS[type]}</button>))}
          </div>
        </div>
        {survey.questions.length===0&&<div className="text-center py-12 text-gray-300"><Plus className="h-12 w-12 mx-auto mb-3 opacity-50"/><p className="text-lg">點擊上方按鈕新增題目，或使用 AI 生成</p></div>}
      </main>
    </div>
  )
}

function QEditor({q,idx,total,expanded,onToggle,onUpdate,onRemove,onMove}:{q:Question;idx:number;total:number;expanded:boolean;onToggle:()=>void;onUpdate:(p:Partial<Question>)=>void;onRemove:()=>void;onMove:(d:-1|1)=>void}) {
  const addOpt = () => { const opts=[...((q as any).options||[])]; opts.push({id:crypto.randomUUID(),text:''}); onUpdate({options:opts} as any) }
  const updOpt = (oi:number,text:string) => { const opts=[...((q as any).options||[])]; opts[oi]={...opts[oi],text}; onUpdate({options:opts} as any) }
  const delOpt = (oi:number) => { const opts=((q as any).options||[]).filter((_:any,i:number)=>i!==oi); onUpdate({options:opts} as any) }
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition" onClick={onToggle}>
        <GripVertical className="h-4 w-4 text-gray-300 flex-shrink-0"/>
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 rounded px-1.5 py-0.5 flex-shrink-0">{QUESTION_TYPE_LABELS[q.type]}</span>
        <span className="text-sm text-gray-700 flex-1 truncate">{q.title||'（未填題目）'}</span>
        {q.required&&<span className="text-xs text-red-500 flex-shrink-0">必填</span>}
        <div className="flex items-center gap-1 flex-shrink-0" onClick={e=>e.stopPropagation()}>
          <button onClick={()=>onMove(-1)} disabled={idx===0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20"><ChevronUp className="h-4 w-4"/></button>
          <button onClick={()=>onMove(1)} disabled={idx===total-1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20"><ChevronDown className="h-4 w-4"/></button>
          <button onClick={onRemove} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4"/></button>
        </div>
      </div>
      {expanded && (
        <div className="border-t bg-gray-50 px-4 py-4 space-y-4">
          <div><label className="text-xs font-medium text-gray-600 mb-1 block">題目文字</label><input value={q.title} onChange={e=>onUpdate({title:e.target.value})} placeholder="輸入題目文字" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"/></div>
          <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={q.required} onChange={e=>onUpdate({required:e.target.checked})} className="rounded"/><span>必填</span></label>
          {(q.type==='single_choice'||q.type==='multi_choice')&&(
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600 block">選項</label>
              {((q as any).options||[]).map((opt:any,oi:number)=>(
                <div key={opt.id} className="flex gap-2 items-center">
                  <div className={`w-4 h-4 flex-shrink-0 border-2 border-gray-300 ${q.type==='single_choice'?'rounded-full':'rounded'}`}/>
                  <input value={opt.text} onChange={e=>updOpt(oi,e.target.value)} placeholder={`選項 ${oi+1}`} className="flex-1 rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"/>
                  <button onClick={()=>delOpt(oi)} disabled={((q as any).options||[]).length<=1} className="text-red-400 hover:text-red-600 disabled:opacity-20 flex-shrink-0"><Trash2 className="h-3.5 w-3.5"/></button>
                </div>
              ))}
              <button onClick={addOpt} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"><Plus className="h-3.5 w-3.5"/>新增選項</button>
            </div>
          )}
          {q.type==='rating'&&(
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">量表</label><select value={(q as any).scale} onChange={e=>onUpdate({scale:Number(e.target.value)} as any)} className="w-full rounded-lg border px-3 py-2 text-sm bg-white"><option value={5}>1–5 分</option><option value={10}>1–10 分</option></select></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">樣式</label><select value={(q as any).style} onChange={e=>onUpdate({style:e.target.value} as any)} className="w-full rounded-lg border px-3 py-2 text-sm bg-white"><option value="stars">⭐ 星星</option><option value="numbers">🔢 數字</option><option value="nps">📊 NPS</option></select></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">最低標籤</label><input value={(q as any).minLabel||''} onChange={e=>onUpdate({minLabel:e.target.value} as any)} placeholder="很不滿意" className="w-full rounded-lg border px-3 py-1.5 text-sm bg-white"/></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">最高標籤</label><input value={(q as any).maxLabel||''} onChange={e=>onUpdate({maxLabel:e.target.value} as any)} placeholder="非常滿意" className="w-full rounded-lg border px-3 py-1.5 text-sm bg-white"/></div>
            </div>
          )}
          {q.type==='matrix'&&(
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">行（問題）</label><div className="space-y-1.5">{((q as any).rows||[]).map((r:any,ri:number)=>(<div key={r.id} className="flex gap-2"><input value={r.text} onChange={e=>{const rows=[...(q as any).rows];rows[ri]={...rows[ri],text:e.target.value};onUpdate({rows} as any)}} placeholder={`行 ${ri+1}`} className="flex-1 rounded-lg border px-2 py-1 text-sm bg-white"/><button onClick={()=>{const rows=(q as any).rows.filter((_:any,i:number)=>i!==ri);onUpdate({rows} as any)}} className="text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div>))}<button onClick={()=>onUpdate({rows:[...(q as any).rows,{id:crypto.randomUUID(),text:''}]} as any)} className="text-xs text-blue-600 flex items-center gap-1"><Plus className="h-3 w-3"/>新增行</button></div></div>
              <div><label className="text-xs font-medium text-gray-600 mb-1 block">列（選項）</label><div className="space-y-1.5">{((q as any).columns||[]).map((c:any,ci:number)=>(<div key={c.id} className="flex gap-2"><input value={c.text} onChange={e=>{const cols=[...(q as any).columns];cols[ci]={...cols[ci],text:e.target.value};onUpdate({columns:cols} as any)}} placeholder={`選項 ${ci+1}`} className="flex-1 rounded-lg border px-2 py-1 text-sm bg-white"/><button onClick={()=>{const cols=(q as any).columns.filter((_:any,i:number)=>i!==ci);onUpdate({columns:cols} as any)}} className="text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div>))}<button onClick={()=>onUpdate({columns:[...(q as any).columns,{id:crypto.randomUUID(),text:''}]} as any)} className="text-xs text-blue-600 flex items-center gap-1"><Plus className="h-3 w-3"/>新增列</button></div></div>
            </div>
          )}
          {q.type==='ranking'&&(
            <div><label className="text-xs font-medium text-gray-600 mb-1 block">排序項目</label><div className="space-y-1.5">{((q as any).items||[]).map((item:any,ii:number)=>(<div key={item.id} className="flex gap-2"><input value={item.text} onChange={e=>{const items=[...(q as any).items];items[ii]={...items[ii],text:e.target.value};onUpdate({items} as any)}} placeholder={`項目 ${ii+1}`} className="flex-1 rounded-lg border px-3 py-1.5 text-sm bg-white"/><button onClick={()=>{const items=(q as any).items.filter((_:any,i:number)=>i!==ii);onUpdate({items} as any)}} className="text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div>))}<button onClick={()=>onUpdate({items:[...(q as any).items,{id:crypto.randomUUID(),text:''}]} as any)} className="text-sm text-blue-600 flex items-center gap-1"><Plus className="h-3.5 w-3.5"/>新增項目</button></div></div>
          )}
        </div>
      )}
    </div>
  )
                                            }
