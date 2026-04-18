'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Users, Clock, TrendingUp, BarChart2, Sparkles, Star, RefreshCw, ChevronDown, ChevronUp, List } from 'lucide-react'
import type { Survey } from '@/types/survey'

interface QuestionStats { questionId: string; question: any; stats: any }
interface StatsData { surveyId: string; totalResponses: number; completionRate: number; avgDurationSeconds: number; questions: QuestionStats[] }
interface Props { survey: Survey; stats: StatsData }

const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com'
function fmtDur(s: number) { if (s < 60) return `${s}秒`; return `${Math.floor(s/60)}分${s%60}秒` }
function pct(n: number, t: number) { return t===0?0:Math.round(n/t*100) }

function ChoiceChart({ options, counts, total }: { options:{id:string;text:string}[];counts:Record<string,number>;total:number }) {
  return (
    <div className="space-y-3">
      {options.map(o=>{const c=counts[o.id]||0;const w=pct(c,total);return(
        <div key={o.id}>
          <div className="flex justify-between text-sm mb-1"><span className="text-gray-700">{o.text}</span><span className="text-gray-500 font-medium tabular-nums">{c} ({w}%)</span></div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{width:`${w}%`}}/></div>
        </div>
      )})}
    </div>
  )
}

function RatingDisplay({ stats, scale }: { stats:any;scale:number }) {
  return (
    <div>
      <div className="flex items-end gap-6 mb-4">
        <div className="text-center"><p className="text-5xl font-bold text-gray-900">{stats.average?.toFixed(1)}</p><p className="text-sm text-gray-500 mt-1">平均分</p></div>
        <div className="flex gap-1 pb-2">{Array.from({length:scale},(_,i)=>(<Star key={i} className={`h-6 w-6 ${i<Math.round(stats.average||0)?'fill-amber-400 text-amber-400':'text-gray-200'}`}/>))}</div>
        {stats.nps!=null&&(<div className="flex gap-4 text-sm pb-2">
          <div className="text-center"><p className="text-xl font-bold text-blue-600">{stats.nps}</p><p className="text-gray-500">NPS</p></div>
          <div className="text-center"><p className="text-lg font-semibold text-green-600">{stats.promoters}</p><p className="text-gray-500">推薦者</p></div>
          <div className="text-center"><p className="text-lg font-semibold text-gray-500">{stats.passives}</p><p className="text-gray-500">被動者</p></div>
          <div className="text-center"><p className="text-lg font-semibold text-red-500">{stats.detractors}</p><p className="text-gray-500">批評者</p></div>
        </div>)}
      </div>
      <div className="space-y-1.5">{Array.from({length:scale},(_,i)=>{const n=i+1;const c=stats.distribution?.[n]||0;const w=pct(c,stats.totalAnswers||1);return(
        <div key={n} className="flex items-center gap-3 text-sm"><span className="w-4 text-right text-gray-500">{n}</span><div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden"><div className="h-full bg-amber-400 rounded-full" style={{width:`${w}%`}}/></div><span className="w-8 text-right text-gray-400 tabular-nums">{c}</span></div>
      )})}
      </div>
    </div>
  )
}

function TextAnswers({ answers }: { answers:any[] }) {
  const [expanded,setExpanded]=useState(false)
  if (!answers.length) return <p className="text-sm text-gray-400">暫無文字回答</p>
  const visible=expanded?answers:answers.slice(0,3)
  return (
    <div className="space-y-2">
      {visible.map((a,i)=>(<div key={i} className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 border-l-2 border-blue-200">"{a.text}"</div>))}
      {answers.length>3&&(<button onClick={()=>setExpanded(!expanded)} className="text-sm text-blue-600 hover:underline flex items-center gap-1">{expanded?<><ChevronUp className="h-3.5 w-3.5"/>收起</>:<><ChevronDown className="h-3.5 w-3.5"/>查看全部 {answers.length} 份回答</>}</button>)}
    </div>
  )
}

function TrendChart({ surveyId }: { surveyId: string | number }) {
  const [trend, setTrend] = useState<{date:string;count:number}[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    fetch(`${API}/api/v1/surveys/${surveyId}/responses/trend`)
      .then(r=>r.json()).then(d=>{ setTrend(d.trend||[]); setLoading(false) })
      .catch(()=>setLoading(false))
  },[surveyId])
  if (loading) return <div className="h-32 flex items-center justify-center"><RefreshCw className="h-5 w-5 animate-spin text-gray-300"/></div>
  if (!trend.length) return <p className="text-sm text-gray-400 text-center py-6">近 30 天無回覆數據</p>
  const max = Math.max(...trend.map(t=>t.count), 1)
  return (
    <div>
      <div className="flex items-end gap-1 h-24">
        {trend.map((t,i)=>(
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
              {t.date.slice(5)}: {t.count} 份
            </div>
            <div className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition" style={{height:`${Math.max((t.count/max)*100,4)}%`}}/>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{trend[0]?.date.slice(5)}</span>
        <span>{trend[trend.length-1]?.date.slice(5)}</span>
      </div>
    </div>
  )
}

function QuestionCard({ qs }: { qs:QuestionStats }) {
  const {question:q,stats:s}=qs
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div><p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">{q.type?.replace('_',' ')}</p><h3 className="font-semibold text-gray-900">{q.title}</h3></div>
        <span className="text-sm text-gray-400 ml-4 flex-shrink-0">{s.totalAnswers||0} 份回答</span>
      </div>
      {(q.type==='single_choice'||q.type==='multi_choice')&&s.optionCounts&&<ChoiceChart options={q.options||[]} counts={s.optionCounts} total={s.totalAnswers||0}/>}
      {q.type==='rating'&&s.distribution&&<RatingDisplay stats={s} scale={q.scale||5}/>}
      {(q.type==='text_short'||q.type==='text_long')&&s.answers&&<TextAnswers answers={s.answers}/>}
      {q.type==='ranking'&&s.averageRanks&&(<div className="space-y-2">{(q.items||[]).sort((a:any,b:any)=>(s.averageRanks[a.id]||99)-(s.averageRanks[b.id]||99)).map((item:any,i:number)=>(<div key={item.id} className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">{i+1}</span><span className="text-sm flex-1">{item.text}</span><span className="text-xs text-gray-400">平均 {s.averageRanks[item.id]?.toFixed(1)}</span></div>))}</div>)}
      {q.type==='matrix'&&s.cellCounts&&(<div className="overflow-x-auto"><table className="text-sm w-full"><thead><tr><th className="text-left py-1 pr-3 text-gray-500 font-medium min-w-[100px]"></th>{(q.columns||[]).map((c:any)=><th key={c.id} className="text-center px-2 py-1 text-gray-600 font-medium">{c.text}</th>)}</tr></thead><tbody>{(q.rows||[]).map((r:any)=>(<tr key={r.id} className="border-t border-gray-100"><td className="py-2 pr-3 text-gray-700">{r.text}</td>{(q.columns||[]).map((c:any)=>{const count=s.cellCounts[r.id]?.[c.id]||0;return<td key={c.id} className="text-center px-2 py-2">{count>0?<span className="bg-blue-100 text-blue-700 rounded px-1.5">{count}</span>:<span className="text-gray-300">0</span>}</td>})}</tr>))}</tbody></table></div>)}
    </div>
  )
}

function AIAnalysis({ survey, stats }: { survey:Survey;stats:StatsData }) {
  const [analysis,setAnalysis]=useState('');const [loading,setLoading]=useState(false);const [done,setDone]=useState(false)
  const run=async()=>{
    setLoading(true);setAnalysis('');setDone(false)
    try{
      const summary={title:survey.title,totalResponses:stats.totalResponses,avgDuration:fmtDur(stats.avgDurationSeconds),questions:stats.questions.map(qs=>({title:qs.question.title,type:qs.question.type,stats:qs.stats}))}
      const res=await fetch(`${API}/api/chat`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:`你是專業問卷數據分析師，請用繁體中文分析以下問卷結果：
1. 整體概況（2-3句）
2. 主要發現（3-5個重點）
3. 值得關注的問題
4. 具體改善建議（3-5條）

問卷數據：${JSON.stringify(summary,null,2)}

請用清晰結構回覆，使用 emoji 讓報告易讀。`})})
      const data=await res.json();setAnalysis(data.message||'分析失敗')
    }catch(e:any){setAnalysis(`分析失敗：${e.message}`)}
    setLoading(false);setDone(true)
  }
  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-purple-600"/><h3 className="font-semibold text-purple-900">AI 智能分析</h3><span className="text-xs text-purple-500 bg-purple-100 px-2 py-0.5 rounded-full">Claude Powered</span></div>
        <button onClick={run} disabled={loading} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 disabled:opacity-50 transition">
          {loading?<RefreshCw className="h-4 w-4 animate-spin"/>:<Sparkles className="h-4 w-4"/>}{loading?'分析中...':done?'重新分析':'開始分析'}
        </button>
      </div>
      {loading&&<div className="flex items-center gap-2 text-purple-600 text-sm"><RefreshCw className="h-4 w-4 animate-spin"/>Claude 正在分析問卷數據...</div>}
      {analysis&&<div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">{analysis}</div>}
      {!analysis&&!loading&&<p className="text-sm text-purple-400">點擊「開始分析」，Claude 將分析問卷數據並給出洞察與建議</p>}
    </div>
  )
}

export default function StatsDashboard({ survey, stats }: Props) {
  const [exporting,setExporting]=useState(false)
  const [currentStats,setCurrentStats]=useState(stats)
  const refresh=async()=>{try{const res=await fetch(`${API}/api/v1/surveys/${survey.id}/stats`,{cache:'no-store'});const d=await res.json();setCurrentStats(d)}catch{}}
  const handleExport=async()=>{setExporting(true);try{const res=await fetch(`${API}/api/v1/surveys/${survey.id}/responses/export`);const blob=await res.blob();const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`survey_${survey.id}.csv`;a.click();URL.revokeObjectURL(url)}catch(e:any){alert(e.message)}setExporting(false)}
  const cards=[
    {icon:Users,label:'總回覆數',value:currentStats.totalResponses,color:'text-blue-600'},
    {icon:TrendingUp,label:'完成率',value:`${Math.round(currentStats.completionRate*100)}%`,color:'text-green-600'},
    {icon:Clock,label:'平均填答時間',value:fmtDur(currentStats.avgDurationSeconds),color:'text-amber-600'},
    {icon:BarChart2,label:'題目數',value:currentStats.questions.length,color:'text-purple-600'},
  ]
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/surveys" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="h-5 w-5"/></Link>
            <div><h1 className="font-semibold text-gray-900 truncate max-w-sm">{survey.title}</h1><p className="text-xs text-gray-400">問卷統計</p></div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/admin/surveys/${survey.id}/responses`} className="flex items-center gap-1.5 text-sm border px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition">
              <List className="h-4 w-4"/>查看回覆
            </Link>
            <button onClick={refresh} className="p-2 rounded-lg border hover:bg-gray-50 text-gray-500"><RefreshCw className="h-4 w-4"/></button>
            <button onClick={handleExport} disabled={exporting} className="flex items-center gap-1.5 text-sm bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"><Download className="h-4 w-4"/>{exporting?'匯出中...':'匯出 CSV'}</button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map(item=>(<div key={item.label} className="bg-white rounded-xl border shadow-sm p-5"><item.icon className={`h-5 w-5 ${item.color} mb-2`}/><p className="text-2xl font-bold text-gray-900">{item.value}</p><p className="text-sm text-gray-500 mt-0.5">{item.label}</p></div>))}
        </div>
        {currentStats.totalResponses>0&&(
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-blue-500"/>回覆趨勢（近 30 天）</h3>
            <TrendChart surveyId={survey.id}/>
          </div>
        )}
        {currentStats.totalResponses>0&&<AIAnalysis survey={survey} stats={currentStats}/>}
        {currentStats.totalResponses===0?(
          <div className="text-center py-20 text-gray-400"><BarChart2 className="h-12 w-12 mx-auto mb-3 opacity-30"/><p className="text-lg font-medium">還沒有回覆</p><p className="text-sm mt-1">發布問卷後開始收集資料</p></div>
        ):(
          <div className="space-y-5">{currentStats.questions.map(qs=><QuestionCard key={qs.questionId} qs={qs}/>)}</div>
        )}
      </main>
    </div>
  )
      }
