import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PostHogProvider } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Survey Chat - 智能問卷客服系統',
  description: '智能問卷與 AI 客服整合系統',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}
