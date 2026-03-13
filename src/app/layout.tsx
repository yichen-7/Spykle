import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import BottomNav from '@/components/BottomNav'
import TopBar from '@/components/TopBar'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: 'Spykle — Level Up Your Speaking',
  description: 'AI-powered speech analysis to help you speak with confidence',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} watercolor-bg`}>
        <TopBar />
        <main className="relative z-10 pb-24 pt-16 px-4 max-w-lg mx-auto">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  )
}
