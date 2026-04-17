'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Users, Clock, TrendingUp, BarChart2, MessageSquare, Star } from 'lucide-react'
import type { Survey } from '@/types/survey'

interface QuestionStats { questionId:string; question:any; stats:any }
interface StatsProps { survey:Survey; stats:{ totalResponses:number; completionRate:number; avgDurationSeconds:number; questions:QuestionStats[] } }

function fmtDur(s:number){ if(s<60) return `${s}秒`; return `${Math.floor(s/60)}分${s%60}秒` }
function pct(n:number,t:number){ return t===0?0:Math.round(n/t*100) }

function RatingBar({label,count,total}:{label:string;count:number;total:number}){
  const w=pct(count,total);
  return <div className="flex items-center gap-3 text-sm"><span className="w-6 text-right text-gray-500">{label}</span><div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden"><div className="h-full bg-blue-500 rounded-full transition-all" style={{width:`${w}%`}}/></div><span className="w-10 text-right text-gray-500">{count}</span></div>
}

function ChoiceChart({options,counts,total}:{options:{id:string;text:string}[];counts:Record<string,number>;total:number}){
  return <div className="space-y-2.5">{options.map(o=>{ const c=counts[o.id]||0; const w=pct(c,total); return (<div key={o.id} className="space-y-1"><div className="flex justify-between text-sm"><span className="text-gray-700">{o.text}</span><span className="text-gray-500 font-medium">{c} ({w}%)</span></div><div className="bg-gray-100 rounded-full h-2 overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{width:`${w}%`}}/></div></div>)})}</div>
}

function QuestionCard({qs}:{qs:QuestionStats}){
  const {question:q,stats:s}=qs;
  const answered=s.totalAnswers||0;
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div><p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">{q.type?.replace('_',' ')}</p><h3 className="font-semibold text-gray-900">{q.title}</h3></div>
        <span className="text-sm text-gray-400 ml-4">{answered} 份回答</span>
      </div>
      {(q.type==='single_choice'||q.type==='multi_choice')&&s.optionCounts&&<ChoiceChart options={q.options||[]} counts={s.optionCounts} total={answered}/>}
      {q.type==='rating'&&s.distribution&&(<div className="space-y-3"><div className="flex items-center gap-4 mb-4"><div className="text-center"><p className="text-4xl font-bold text-gray-900">{s.average?.toFixed(1)}</p><p className="text-sm text-gray-500">平均</p></div>{q.style==='nps'&&(<><div className="text-center"><p className="text-2xl font-bold text-green-600">{s.nps}</p><p className="text-sm text-gray-500">NPS</p></div><div className="flex gap-4 text-sm text-gray-500"><span>推薦者 {s.promoters}</span><span>被動者 {s.passives}</span><span>批評者 {s.detractors}</span></div></>)}</div><div className="space-y-1.5">{Array.from({length:q.scale||5},(_,i)=>i+1).map(n=>(<RatingBar key={n} label={String(n)} count={s.distribution[n]||0} total={answered}/>))}</div></div>)}
      {(q.type==='text_short'||q.type==='text_long')&&s.answers&&(<div className="space-y-2 max-h-60 overflow-y-auto">{s.answers.length===0?<p className="text-sm text-gray-400">暫無文字回答</p>:s.answers.slice(0,20).map((a:any,i:number)=>(<div key={i} className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700">"{a.text}"</div>))}</div>)}
      {q.type==='ranking'&&s.averageRanks&&(<div className="space-y-2">{(q.items||[]).sort((a:any,b:any)=>(s.averageRanks[a.id]||99)-(s.averageRanks[b.id]||99)).map((item:any,i:number)=>(<div key={item.id} className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">{i+1}</span><span className="text-sm flex-1">{item.text}</span><span className="text-xs text-gray-400">avg {s.averageRanks[item.id]?.toFixed(1)}</span></div>))}</div>)}
    </div>
  )
}

export default function StatsDashboard({survey,stats}:StatsProps){
  const [exporting,setExporting]=useState(false)
  const handleExport=async()=>{
    setExporting(true)
    try{
      const API=process.env.NEXT_PUBLIC_API_URL||'https://ai-survey-api.onrender.com'
      const res=await fetch(`${API}/api/v1/surveys/${survey.id}/responses/export`)
      const blob=await res.blob()
      const url=URL.createObjectURL(blob)
      const a=document.createElement('a');a.href=url;a.download=`survey_${survey.id}.csv`;a.click();URL.revokeObjectURL(url)
    }catch(e:any){alert(e.message)}finally{setExporting(false)}
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/surveys" className="text-gray-500 hover:text-gray-700"><ArrowLeft className="h-5 w-5"/></Link>
            <div><h1 className="font-semibold text-gray-900 truncate max-w-xs">{survey.title}</h1><p className="text-xs text-gray-400">問卷統計</p></div>
          </div>
          <button onClick={handleExport} disabled={exporting} className="flex items-center gap-1.5 text-sm bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50">
            <Download className="h-4 w-4"/>{exporting?'匯出中...':'匯出 CSV'}
          </button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[{icon:Users,label:'總回覆數',value:stats.totalResponses},{icon:TrendingUp,label:'完成率',value:`${Math.round(stats.completionRate*100)}%`},{icon:Clock,label:'平均填答時間',value:fmtDur(stats.avgDurationSeconds)},{icon:BarChart2,label:'題目數',value:stats.questions.length}].map(item=>(<div key={item.label} className="bg-white rounded-xl border shadow-sm p-5"><item.icon className="h-5 w-5 text-blue-600 mb-2"/><p className="text-2xl font-bold text-gray-900">{item.value}</p><p className="text-sm text-gray-500 mt-0.5">{item.label}</p></div>))}
        </div>
        {stats.totalResponses===0?(<div className="text-center py-20 text-gray-400"><BarChart2 className="h-12 w-12 mx-auto mb-3 opacity-30"/><p className="text-lg font-medium">還沒有回覆</p><p className="text-sm mt-1">發布問卷後開始收集資料</p></div>):(
          <div className="space-y-5">{stats.questions.map(qs=>(<QuestionCard key={qs.questionId} qs={qs}/>))}</div>
        )}
      </main>
    </div>
  )
}
