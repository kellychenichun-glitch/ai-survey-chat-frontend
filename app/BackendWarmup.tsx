'use client'
import { useEffect } from 'react'

// 靜默 warm-up：頁面載入後立刻 ping 後端，避免 cold start 延遲
export default function BackendWarmup() {
    useEffect(() => {
          const API = process.env.NEXT_PUBLIC_API_URL || 'https://ai-survey-api.onrender.com'
          fetch(`${API}/api/v1/surveys/summary`, { cache: 'no-store' }).catch(() => {})
    }, [])
    return null
}
