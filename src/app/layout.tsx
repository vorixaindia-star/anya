import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { Navbar } from '@/components/layout/navbar'
import { MusicPlayer } from '@/components/ui/music-player'
import { ChatbotWidget } from '@/components/chatbot/chatbot-widget'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Anya — AI-Powered Spiritual Learning Platform',
  description: 'Learn Vastu, Astrology, Numerology, Tarot, Reiki & more with personalized AI guidance. India\'s premier spiritual learning ecosystem.',
  keywords: 'occult, astrology, vastu, numerology, tarot, reiki, healing, online courses, spiritual learning',
  authors: [{ name: 'Anya Academy' }],
  openGraph: {
    title: 'Anya — AI-Powered Spiritual Learning Platform',
    description: 'Learn Vastu, Astrology, Numerology, Tarot & more with personalized AI guidance.',
    url: 'https://anya-sooty.vercel.app',
    siteName: 'Anya',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
          <ChatbotWidget />
          <MusicPlayer />
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}