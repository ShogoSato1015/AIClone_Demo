import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/context/AppContext'
import Navigation from '@/components/ui/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Yoriai - Aiconが創作する世界',
  description: 'あなたのAiconが他のAiconとコラボして漫才やラブソングを創作するプラットフォーム',
  keywords: ['AI', 'Aicon', '漫才', 'ラブソング', '創作', 'コラボレーション', 'Yoriai'],
  authors: [{ name: 'Yoriai Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AppProvider>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
            <Navigation />
            <main className="relative pt-20">
              {children}
            </main>
          </div>
        </AppProvider>
      </body>
    </html>
  )
}