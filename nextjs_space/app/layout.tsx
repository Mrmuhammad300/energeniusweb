import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import SessionProvider from '@/components/session-provider'
import Header from '@/components/header'
import Footer from '@/components/footer'
import AssessmentChat from '@/components/assessment-chat'

export const metadata: Metadata = {
  title: 'EnerGenius - Commercial Backup Power Solutions',
  description: 'Keep your business running during power outages. Commercial-grade lithium backup systems sized, installed, and monitored for real-world use. 5-year warranty, 30% tax credit eligible.',
  keywords: ['commercial backup power', 'business backup generator', 'lithium generator', 'power outage solution', 'commercial solar generator', 'diesel generator alternative'],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'EnerGenius - Keep Your Business Running During Power Outages',
    description: 'Commercial-grade lithium backup systems. No fuel, no noise, no downtime.',
    images: ['/og-image.png'],
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
      <body className="font-sans antialiased">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
            <AssessmentChat />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
