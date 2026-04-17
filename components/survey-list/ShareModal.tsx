'use client'
import { useState, useMemo, useEffect } from 'react'
import { X, Copy, Check, Link2, QrCode, Share2, Code2, Mail, Facebook, Twitter, MessageCircle } from 'lucide-react'
import type { SurveySummary } from '@/lib/api/surveys-list'

type Tab = 'link' | 'qr' | 'social' | 'embed'
interface ShareModalProps { survey: SurveySummary; onClose: () => void }

export default function ShareModal({ survey, onClose }: ShareModalProps) {
  const [tab, setTab] = useState<Tab>('link')
  const [copied, setCopied] = useState<string | null>(null)
  const shareUrl = useMemo(() => typeof window==='undefined' ? '' : `${window.location.origin}/survey/${survey.id}`, [survey.id])

  const copy = async (text: string, key: string) => {
    try { await navigator.clipboard.writeText(text) } catch { const t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();document.execCommand('copy');document.body.removeChild(t) }
    setCopied(key); setTimeout(()=>setCopied(null), 1500)
  }
  useEffect(() => { const h=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose()}; document.addEventListener('keydown',h); return ()=>document.removeEventListener('keydown',h) }, [onClose])

  const tabs: {id:Tab;label:string;icon:any}[] = [
    {id:'link',label:'連結',icon:Link2},{id:'qr',label:'QR Code',icon:QrCode},
    {id:'social',label:'社群',icon:Share2},{id:'embed',label:'嵌入',icon:Code2}
  ]

  const embedCode = `<iframe src="${shareUrl}" width="100%" height="600" frameborder="0"></iframe>`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl overflow-hidden" onClick={e=>e.stopPropagation()}>
        <header className="border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2"><Share2 className="h-4 w-4 text-blue-600"/><h2 className="font-semibold text-lg">分享問卷</h2></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5"/></button>
        </header>
        <div className="border-b flex">
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium border-b-2 transition ${tab===t.id?'border-blue-600 text-blue-600':'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <t.icon className="h-4 w-4"/>{t.label}
            </button>
          ))}
        </div>
        <div className="p-6 min-h-[200px]">
          {tab==='link' && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">問卷填答連結</label>
              <div className="flex gap-2">
                <input readOnly value={shareUrl} className="flex-1 rounded-lg border px-3 py-2 text-sm bg-gray-50"/>
                <button onClick={()=>copy(shareUrl,'link')} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
                  {copied==='link'?<Check className="h-4 w-4"/>:<Copy className="h-4 w-4"/>}{copied==='link'?'已複製':'複製'}
                </button>
              </div>
            </div>
          )}
          {tab==='qr' && (
            <div className="flex flex-col items-center gap-4">
              <img src={qrUrl} alt="QR Code" className="rounded-lg border p-2"/>
              <p className="text-sm text-gray-500">掃描 QR Code 開啟問卷</p>
              <a href={qrUrl} download="qrcode.png" className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">下載 QR Code</a>
            </div>
          )}
          {tab==='social' && (
            <div className="grid grid-cols-2 gap-3">
              {[
                {icon:Facebook,label:'Facebook',color:'bg-blue-600',href:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`},
                {icon:Twitter,label:'X (Twitter)',color:'bg-black',href:`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(survey.title)}`},
                {icon:MessageCircle,label:'LINE',color:'bg-green-500',href:`https://line.me/R/msg/text/?${encodeURIComponent(shareUrl)}`},
                {icon:Mail,label:'Email',color:'bg-gray-600',href:`mailto:?subject=${encodeURIComponent(survey.title)}&body=${encodeURIComponent(shareUrl)}`},
              ].map(s=>(
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 rounded-lg ${s.color} px-4 py-3 text-white text-sm font-medium hover:opacity-90`}>
                  <s.icon className="h-4 w-4"/>{s.label}
                </a>
              ))}
            </div>
          )}
          {tab==='embed' && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">嵌入代碼 (iframe)</label>
              <textarea readOnly value={embedCode} rows={3} className="w-full rounded-lg border px-3 py-2 text-xs bg-gray-50 font-mono"/>
              <button onClick={()=>copy(embedCode,'embed')} className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-sm text-white hover:bg-gray-800">
                {copied==='embed'?<Check className="h-4 w-4"/>:<Copy className="h-4 w-4"/>}{copied==='embed'?'已複製':'複製代碼'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
