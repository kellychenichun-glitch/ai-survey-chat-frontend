'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown, ChevronUp, Clock, User, Calendar, Download } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com'

function fmtDur(s: number) { if (!s) return '—'; if (s < 60) return `${s}秒`; return `${Math.floor(s/60)}分${s%60}秒` }
function fmtDate(d: string) { return new Date(d).toLocaleString('zh-TW',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}) }

function AnswerDisplay({question,answer}:{question:any;answer:any}) {
  if (!answer?.value && answer?.value !== 0) return <span className="text-gray-400 text-sm">未作答</span>
  const v = answer.value
  if (question.type==='single_choice') { const opt=question.options?.find((o:any)=>o.id===v.optionId); return <span className="text-sm bg-blue-50 text-blue-800 rounded-lg px-2 py-0.5">{opt?.text||v.optionId}</span> }
  if (question.type==='multi_choice') { const opts=question.options?.filter((o:any)=>v.optionIds?.includes(o.id)); return <div className="flex flex-wrap gap-1">{opts?.map((o:any)=><span key={o.id} className="text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-0.5">{o.text}</span>)}</div> }
  if (question.type==='rating') return <div className="flex items-center gap-2"><span className="text-2xl font-bold text-amber-500">{v.value}</span><span className="text-sm text-gray-400">/ {question.scale||5}</span></div>
  if (question.type==='text_short'||question.type==='text_long') return <p className="text-sm text-gray-800 bg-gray-50 rounded-lg px-3 py-2 border-l-2 border-blue-200">"{v.text}"</p>
  if (question.type==='ranking') {
    const order:string[]=v.orderedItemIds||[]; const map=Object.fromEntries((question.items||[]).map((i:any)=>[i.id,i.text]))
    return <div className="flex flex-col gap-1">{order.map((id,idx)=><div key={id} className="flex items-center gap-2 text-sm"><span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">{idx+1}</span>{map[id]}</div>)}</div>
  }
  if (question.type==='matrix') {
    const rows=v.rows||{}
    return <div className="text-sm space-y-1">{question.rows?.map((r:any)=>{const col=question.columns?.find((c:any)=>c.id===rows[r.id]);return<div key={r.id} className="flex gap-2"><span className="text-gray-500">{r.text}：</span><span className="font-medium">{col?.text||'—'}</span></div>})}</div>
  }
  return <span className="text-sm text-gray-500">{JSON.stringify(v)}</span>
}

function ResponseCard({response,survey,index}:{response:any;survey:any;index:number}) {
  const [open,setOpen]=useState(false)
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition" onClick={()=>setOpen(!open)}>
        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center flex-shrink-0">#{index+1}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap text-sm text-gray-500">
            <span className="flex items-center gap-1"><User className="h-3.5 w-3.5"/>{response.respondent_email||'匿名'}</span>
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5"/>{fmtDate(response.created_at)}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5"/>{fmtDur(response.duration_seconds)}</span>
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${response.status==='completed'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>{response.status==='completed'?'完成':'部分'}</span>
        {open?<ChevronUp className="h-4 w-4 text-gray-400"/>:<ChevronDown className="h-4 w-4 text-gray-400"/>}
      </div>
      {open&&(
        <div className="border-t bg-gray-50 px-5 py-4 space-y-4">
          {survey.questions.map((q:any,qi:number)=>{
            const ans=response.answers?.find((a:any)=>a.questionId===q.id)
            return(
              <div key={q.id} className="space-y-1.5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Q{qi+1} · {q.type.replace('_',' ')}</p>
                <p className="text-sm font-medium text-gray-800">{q.title}</p>
                <AnswerDisplay question={q} answer={ans}/>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function ResponsesPage({params}:{params:{id:string}}) {
  const [survey,setSurvey]=useState<any>(null)
  const [responses,setResponses]=useState<any[]>([])
  const [loading,setLoading]=useState(true)
  const [exporting,setExporting]=useState(false)

  useEffect(()=>{
    const load=async()=>{
      setLoading(true)
      try {
        const [sv,resp]=await Promise.all([
          fetch(`${API}/api/v1/surveys/${params.id}`).then(r=>r.json()),
          fetch(`${API}/api/v1/surveys/${params.id}/responses`).then(r=>r.json()),
        ])
        setSurvey(sv.survey||sv); setResponses(resp.responses||resp||[])
      }catch(e){console.error(e)}
      setLoading(false)
    }; load()
  },[params.id])

  const handleExport=async()=>{
    setExporting(true)
    try{const res=await fetch(`${API}/api/v1/surveys/${params.id}/responses/export`);const blob=await res.blob();const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`responses_${params.id}.csv`;a.click();URL.revokeObjectURL(url)}
    catch(e:any){alert(e.message)}
    setExporting(false)
  }

  return(
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/admin/surveys/${params.id}/stats`} className="text-gray-400 hover:text-gray-600"><ArrowLeft className="h-5 w-5"/></Link>
            <div><h1 className="font-semibold text-gray-900">{survey?.title||'回覆列表'}</h1><p className="text-xs text-gray-400">{responses.length} 份回覆</p></div>
          </div>
          <button onClick={handleExport} disabled={exporting} className="flex items-center gap-1.5 text-sm bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50">
            <Download className="h-4 w-4"/>{exporting?'匯出中...':'匯出 CSV'}
          </button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        {loading?(
          <div className="flex justify-center py-20"><div className="h-8 w-8 rounded-full border-2 border-gray-900 border-t-transparent animate-spin"/></div>
        ):responses.length===0?(
          <div className="text-center py-20 text-gray-400"><User className="h-12 w-12 mx-auto mb-3 opacity-30"/><p className="text-lg font-medium">還沒有回覆</p></div>
        ):(
          <div className="space-y-3">{responses.map((r,i)=>survey&&<ResponseCard key={r.id} response={r} survey={survey} index={i}/>)}</div>
        )}
      </main>
    </div>
  )
}
