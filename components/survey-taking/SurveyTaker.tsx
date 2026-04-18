'use client'
import { useState, useCallback } from 'react'
import { ChevronRight, ChevronLeft, Check, Star, Send, GripVertical } from 'lucide-react'
import { submitResponse } from '@/lib/api/responses'
import type { Survey, Question } from '@/types/survey'

interface Props { survey: Survey }

export default function SurveyTaker({ survey }: Props) {
  const questions = survey.questions || []
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [startTime] = useState(Date.now())
  const settings = (survey as any).settings || {}
  const totalQ = questions.length
  const progress = totalQ > 0 ? Math.round((current / totalQ) * 100) : 0
  const q: Question | undefined = questions[current]
  const setAnswer = (qId: string, value: any) => setAnswers(prev => ({ ...prev, [qId]: value }))
  const canNext = useCallback(() => {
    if (!q) return false
    if (!q.required) return true
    const a = answers[q.id]
    if (q.type === 'single_choice') return !!a?.optionId
    if (q.type === 'multi_choice') return (a?.optionIds?.length || 0) > 0
    if (q.type === 'text_short' || q.type === 'text_long') return !!(a?.text?.trim())
    if (q.type === 'rating') return a?.value != null
    if (q.type === 'matrix') return ((q as any).rows||[]).every((r:any)=>a?.rows?.[r.id]!=null)
    return true
  }, [q, answers])
  const handleSubmit = async () => {
    setSubmitting(true); setError('')
    try {
      const dur = Math.round((Date.now() - startTime) / 1000)
      await submitResponse(String(survey.id), { answers: Object.entries(answers).map(([questionId,value])=>({questionId,value})), durationSeconds: dur })
      setSubmitted(true)
    } catch (e: any) { setError(e.message) }
    finally { setSubmitting(false) }
  }
  if (submitted) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><Check className="h-8 w-8 text-green-600"/></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">感謝您的填答！</h1>
        <p className="text-gray-500">{settings.thankYouMessage || '您的回覆已成功送出。'}</p>
      </div>
    </div>
  )
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm px-4 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-bold text-gray-900 text-lg">{survey.title}</h1>
          {(survey as any).description && <p className="text-sm text-gray-500 mt-0.5">{(survey as any).description}</p>}
          {settings.showProgressBar !== false && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1"><span>題目 {current+1} / {totalQ}</span><span>{progress}%</span></div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{width:`${progress}%`}}/></div>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">
        {q ? (
          <div className="bg-white rounded-xl border shadow-sm p-6 md:p-8">
            <div className="mb-6">
              <p className="text-xs font-medium text-blue-600 mb-1">{current+1} / {totalQ}</p>
              <h2 className="text-xl font-semibold text-gray-900">{q.title}{q.required&&<span className="text-red-500 ml-1">*</span>}</h2>
              {(q as any).description&&<p className="text-sm text-gray-500 mt-1">{(q as any).description}</p>}
            </div>
            <QuestionInput q={q} value={answers[q.id]} onChange={v=>setAnswer(q.id,v)}/>
            {error&&<p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
              <button onClick={()=>setCurrent(c=>c-1)} disabled={current===0} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition"><ChevronLeft className="h-4 w-4"/>上一題</button>
              {current<totalQ-1?(
                <button onClick={()=>setCurrent(c=>c+1)} disabled={!canNext()} className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-40 transition">下一題<ChevronRight className="h-4 w-4"/></button>
              ):(
                <button onClick={handleSubmit} disabled={submitting||!canNext()} className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-40 transition"><Send className="h-4 w-4"/>{submitting?'送出中...':'送出'}</button>
              )}
            </div>
          </div>
        ):(
          <div className="text-center text-gray-400 py-20">問卷沒有題目</div>
        )}
      </main>
    </div>
  )
}

function QuestionInput({q,value,onChange}:{q:Question;value:any;onChange:(v:any)=>void}) {
  if(q.type==='single_choice'){const opts=(q as any).options||[];return(
    <div className="space-y-2">{opts.map((o:any)=>(<label key={o.id} className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition ${value?.optionId===o.id?'border-blue-500 bg-blue-50':'border-gray-200 hover:border-gray-300'}`}><input type="radio" name={q.id} checked={value?.optionId===o.id} onChange={()=>onChange({optionId:o.id})} className="sr-only"/><div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${value?.optionId===o.id?'border-blue-500':'border-gray-300'}`}>{value?.optionId===o.id&&<div className="w-2 h-2 rounded-full bg-blue-500"/>}</div><span className="text-sm text-gray-700">{o.text}</span></label>))}</div>
  )}
  if(q.type==='multi_choice'){const opts=(q as any).options||[];const sel:string[]=value?.optionIds||[];const toggle=(id:string)=>{const n=sel.includes(id)?sel.filter(s=>s!==id):[...sel,id];onChange({optionIds:n})};return(
    <div className="space-y-2">{opts.map((o:any)=>(<label key={o.id} className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition ${sel.includes(o.id)?'border-blue-500 bg-blue-50':'border-gray-200 hover:border-gray-300'}`}><input type="checkbox" checked={sel.includes(o.id)} onChange={()=>toggle(o.id)} className="sr-only"/><div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${sel.includes(o.id)?'border-blue-500 bg-blue-500':'border-gray-300'}`}>{sel.includes(o.id)&&<Check className="h-3 w-3 text-white"/>}</div><span className="text-sm text-gray-700">{o.text}</span></label>))}</div>
  )}
  if(q.type==='text_short') return <input type="text" value={value?.text||''} onChange={e=>onChange({text:e.target.value})} placeholder={(q as any).placeholder||'請輸入您的回答'} className="w-full rounded-xl border-2 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"/>
  if(q.type==='text_long') return <textarea value={value?.text||''} onChange={e=>onChange({text:e.target.value})} placeholder={(q as any).placeholder||'請詳細描述您的想法...'} rows={5} className="w-full rounded-xl border-2 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition resize-none"/>
  if(q.type==='rating'){const scale=(q as any).scale||5;const style=(q as any).style||'stars';const val=value?.value;
    if(style==='stars') return(<div><div className="flex gap-2">{Array.from({length:scale},(_,i)=>i+1).map(n=>(<button key={n} onClick={()=>onChange({value:n})} className="transition hover:scale-110"><Star className={`h-9 w-9 transition ${val>=n?'fill-amber-400 text-amber-400':'text-gray-200 hover:text-amber-300'}`}/></button>))}</div><div className="flex justify-between mt-2 text-xs text-gray-400 px-1"><span>{(q as any).minLabel}</span><span>{(q as any).maxLabel}</span></div></div>)
    return(<div><div className="flex gap-2 flex-wrap">{Array.from({length:scale},(_,i)=>i+1).map(n=>(<button key={n} onClick={()=>onChange({value:n})} className={`w-11 h-11 rounded-xl text-sm font-medium border-2 transition ${val===n?'border-blue-500 bg-blue-500 text-white':'border-gray-200 hover:border-blue-300 text-gray-600'}`}>{n}</button>))}</div><div className="flex justify-between mt-2 text-xs text-gray-400"><span>{(q as any).minLabel}</span><span>{(q as any).maxLabel}</span></div></div>)
  }
  if(q.type==='matrix'){const rows=(q as any).rows||[];const cols=(q as any).columns||[];const inputType=(q as any).inputType||'radio';const curRows=value?.rows||{};
    const toggle=(rowId:string,colId:string)=>{if(inputType==='radio'){onChange({rows:{...curRows,[rowId]:colId}})}else{const cur:string[]=Array.isArray(curRows[rowId])?curRows[rowId]:[];const next=cur.includes(colId)?cur.filter(c=>c!==colId):[...cur,colId];onChange({rows:{...curRows,[rowId]:next}})}};
    const isChecked=(rowId:string,colId:string)=>{if(inputType==='radio')return curRows[rowId]===colId;return Array.isArray(curRows[rowId])&&curRows[rowId].includes(colId)};
    return(<div className="overflow-x-auto -mx-2"><table className="w-full text-sm"><thead><tr><th className="text-left py-2 px-3 text-gray-500 font-medium min-w-[120px]"></th>{cols.map((c:any)=>(<th key={c.id} className="text-center px-3 py-2 text-gray-600 font-medium min-w-[80px]">{c.text}</th>))}</tr></thead><tbody>{rows.map((r:any)=>(<tr key={r.id} className="border-t border-gray-100"><td className="py-3 px-3 text-gray-700 font-medium">{r.text}</td>{cols.map((c:any)=>(<td key={c.id} className="text-center px-3 py-3"><button onClick={()=>toggle(r.id,c.id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mx-auto transition ${isChecked(r.id,c.id)?'border-blue-500 bg-blue-500':'border-gray-300 hover:border-blue-300'}`}>{isChecked(r.id,c.id)&&<div className="w-2.5 h-2.5 rounded-full bg-white"/>}</td>))}</tr>))}</tbody></table></div>)
  }
  if(q.type==='ranking'){const items=(q as any).items||[];const order:string[]=value?.orderedItemIds||items.map((i:any)=>i.id);const itemMap=Object.fromEntries(items.map((i:any)=>[i.id,i.text]));
    const move=(idx:number,dir:-1|1)=>{const next=[...order];const target=idx+dir;if(target<0||target>=next.length)return;[next[idx],next[target]]=[next[target],next[idx]];onChange({orderedItemIds:next})};
    return(<div className="space-y-2"><p className="text-xs text-gray-400 mb-3">使用箭頭按鈕調整排序</p>{order.map((id,idx)=>(<div key={id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200"><span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{idx+1}</span><GripVertical className="h-4 w-4 text-gray-300 flex-shrink-0"/><span className="text-sm text-gray-700 flex-1">{itemMap[id]}</span><div className="flex flex-col gap-0.5"><button onClick={()=>move(idx,-1)} disabled={idx===0} className="p-0.5 rounded hover:bg-gray-200 disabled:opacity-30"><ChevronLeft className="h-3.5 w-3.5 rotate-90 text-gray-500"/></button><button onClick={()=>move(idx,1)} disabled={idx===order.length-1} className="p-0.5 rounded hover:bg-gray-200 disabled:opacity-30"><ChevronRight className="h-3.5 w-3.5 rotate-90 text-gray-500"/></button></div></div>))}</div>)
  }
  return <p className="text-sm text-gray-400">（不支援的題型：{q.type}）</p>
                                                                                                                                                                                                                                                                                                                                          }
