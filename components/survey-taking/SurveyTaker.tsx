'use client'
import { useState, useEffect, useRef } from 'react'
import { ChevronRight, ChevronLeft, Check, Mic, MicOff, Star, Send } from 'lucide-react'
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

  const settings = survey.settings || {}
  const totalQ = questions.length
  const progress = totalQ > 0 ? Math.round((current / totalQ) * 100) : 0
  const q: Question | undefined = questions[current]

  const setAnswer = (qId: string, value: any) => setAnswers(prev => ({ ...prev, [qId]: value }))

  const canNext = () => {
    if (!q) return false
    if (!q.required) return true
    const a = answers[q.id]
    if (q.type === 'single_choice') return !!a?.optionId
    if (q.type === 'multi_choice') return (a?.optionIds?.length || 0) > 0
    if (q.type === 'text_short' || q.type === 'text_long') return !!(a?.text?.trim())
    if (q.type === 'rating') return a?.value != null
    return true
  }

  const handleSubmit = async () => {
    setSubmitting(true); setError('')
    try {
      const dur = Math.round((Date.now() - startTime) / 1000)
      const payloadAnswers = Object.entries(answers).map(([questionId, value]) => ({ questionId, value }))
      await submitResponse(String(survey.id), { answers: payloadAnswers, durationSeconds: dur })
      setSubmitted(true)
    } catch(e: any) { setError(e.message) }
    finally { setSubmitting(false) }
  }

  if (submitted) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><Check className="h-8 w-8 text-green-600"/></div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">感謝填答！</h1>
        <p className="text-gray-500">{settings.thankYouMessage || '您的回覆已成功送出。'}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-bold text-gray-900 text-lg">{survey.title}</h1>
          {survey.description && <p className="text-sm text-gray-500 mt-0.5">{survey.description}</p>}
          {settings.showProgressBar !== false && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1"><span>題目 {current + 1} / {totalQ}</span><span>{progress}%</span></div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}/></div>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8">
        {q ? (
          <div className="bg-white rounded-xl border shadow-sm p-6 md:p-8">
            <div className="mb-6">
              <p className="text-xs font-medium text-blue-600 mb-1">{current + 1} / {totalQ}</p>
              <h2 className="text-xl font-semibold text-gray-900">{q.title}{q.required && <span className="text-red-500 ml-1">*</span>}</h2>
              {(q as any).description && <p className="text-sm text-gray-500 mt-1">{(q as any).description}</p>}
            </div>
            <QuestionInput q={q} value={answers[q.id]} onChange={v => setAnswer(q.id, v)} />
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            <div className="flex justify-between mt-8">
              <button onClick={() => setCurrent(c => c - 1)} disabled={current === 0} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30">
                <ChevronLeft className="h-4 w-4"/>上一題
              </button>
              {current < totalQ - 1 ? (
                <button onClick={() => setCurrent(c => c + 1)} disabled={!canNext()} className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-40">
                  下一題<ChevronRight className="h-4 w-4"/>
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={submitting || !canNext()} className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-40">
                  <Send className="h-4 w-4"/>{submitting ? '送出中...' : '送出'}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-20">問卷沒有題目</div>
        )}
      </main>
    </div>
  )
}

function QuestionInput({ q, value, onChange }: { q: Question; value: any; onChange: (v: any) => void }) {
  if (q.type === 'single_choice') {
    const opts = (q as any).options || []
    return <div className="space-y-2">{opts.map((o: any) => (<label key={o.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${value?.optionId === o.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}`}><input type="radio" name={q.id} value={o.id} checked={value?.optionId === o.id} onChange={() => onChange({ optionId: o.id })} className="sr-only"/><div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${value?.optionId === o.id ? 'border-blue-500' : 'border-gray-300'}`}>{value?.optionId === o.id && <div className="w-2 h-2 rounded-full bg-blue-500"/>}</div><span className="text-sm">{o.text}</span></label>))}</div>
  }
  if (q.type === 'multi_choice') {
    const opts = (q as any).options || []
    const sel: string[] = value?.optionIds || []
    const toggle = (id: string) => { const n = sel.includes(id) ? sel.filter(s => s !== id) : [...sel, id]; onChange({ optionIds: n }) }
    return <div className="space-y-2">{opts.map((o: any) => (<label key={o.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${sel.includes(o.id) ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'}`}><input type="checkbox" checked={sel.includes(o.id)} onChange={() => toggle(o.id)} className="sr-only"/><div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${sel.includes(o.id) ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>{sel.includes(o.id) && <Check className="h-3 w-3 text-white"/>}</div><span className="text-sm">{o.text}</span></label>))}</div>
  }
  if (q.type === 'text_short') return <input type="text" value={value?.text || ''} onChange={e => onChange({ text: e.target.value })} placeholder={(q as any).placeholder || '請輸入'} className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
  if (q.type === 'text_long') return <textarea value={value?.text || ''} onChange={e => onChange({ text: e.target.value })} placeholder={(q as any).placeholder || '請輸入'} rows={5} className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"/>
  if (q.type === 'rating') {
    const scale = (q as any).scale || 5
    const style = (q as any).style || 'stars'
    const val = value?.value
    if (style === 'stars') return (
      <div className="flex gap-2">{Array.from({ length: scale }, (_, i) => i + 1).map(n => (
        <button key={n} onClick={() => onChange({ value: n })} className="transition hover:scale-110">
          <Star className={`h-8 w-8 ${val >= n ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}/>
        </button>
      ))}</div>
    )
    return (
      <div>
        <div className="flex gap-2">{Array.from({ length: scale }, (_, i) => i + 1).map(n => (
          <button key={n} onClick={() => onChange({ value: n })} className={`w-10 h-10 rounded-lg text-sm font-medium border-2 transition ${val === n ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-200 hover:border-blue-300'}`}>{n}</button>
        ))}</div>
        <div className="flex justify-between mt-2 text-xs text-gray-400"><span>{(q as any).minLabel}</span><span>{(q as any).maxLabel}</span></div>
      </div>
    )
  }
  return <p className="text-sm text-gray-400">（不支援的題型：{q.type}）</p>
}
