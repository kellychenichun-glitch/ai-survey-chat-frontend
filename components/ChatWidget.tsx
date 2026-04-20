'use client'
import { useState } from 'react'
import { MessageSquare, X } from 'lucide-react'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 shadow-2xl rounded-2xl overflow-hidden animate-in slide-in-from-bottom-4"
          style={{width:'400px', height:'580px'}}>
          <iframe src="/chat" className="w-full h-full" style={{border:'none'}} title="AI 客服"/>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-200"
        aria-label={open ? '關閉客服' : '開啟 AI 客服'}
      >
        {open ? <X className="h-6 w-6"/> : <MessageSquare className="h-6 w-6"/>}
      </button>
    </>
  )
}
