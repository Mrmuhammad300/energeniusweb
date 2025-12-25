import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import SessionProvider from '@/components/session-provider'
import Header from '@/components/header'
import Footer from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EnerGenius - Premium Solar Generator Solutions',
  description: 'Professional-grade solar generators from 400W to 30,000W. Honest pricing, superior support, and industry-leading 5-year warranty. Nationwide service across all 50 US states.',
  keywords: ['solar generator', 'backup power', 'emergency generator', 'off-grid power', 'portable solar', 'home backup', 'commercial solar'],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'EnerGenius - Power That Thinks Ahead',
    description: 'Premium solar generators with honest pricing and exceptional support',
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
      <body className={inter.className}>
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
          </ThemeProvider>
        </SessionProvider>
        
        {/* Tawk.to Live Chat Widget - Free tier */}
        <Script
          id="tawk-to-widget"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                // Skip in preview/test environments to avoid CORS errors
                if (window.location.hostname.includes('preview.abacusai.app')) {
                  console.log('Tawk.to chat widget disabled in preview environment');
                  return;
                }
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/67733df7af5bfec1dbe35b1e/1ig65gpef';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s1.onerror = function() {
                  console.log('Tawk.to chat widget failed to load (expected in preview)');
                };
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}
