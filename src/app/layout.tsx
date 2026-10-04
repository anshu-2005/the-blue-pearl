import type { Metadata } from 'next'
import { Playfair_Display, Cormorant_Garamond, Inter } from 'next/font/google'
import '@/styles/globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/hooks/useAuth'
import ProductComparisonDrawer from '@/components/common/ProductComparisonDrawer'
import AIJewelleryStylist from '@/components/common/AIJewelleryStylist'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: {
    default: 'The Blue Pearl — Elegance in Every Detail',
    template: '%s | The Blue Pearl',
  },
  description:
    'Timeless Beauty. Crafted to Perfection. Discover our collection of handcrafted antique jewellery — oxidised silver bangles, temple ornaments, gold filigree necklaces, and bridal sets.',
  keywords: [
    'antique jewellery', 'oxidised silver', 'temple jewellery', 'bangles',
    'gold filigree', 'bridal jewellery', 'handcrafted jewellery', 'the blue pearl',
  ],
  openGraph: {
    title: 'The Blue Pearl — Elegance in Every Detail',
    description: 'Antique Charm. Modern Grace. Jewellery that speaks your story.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'The Blue Pearl',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Blue Pearl — Elegance in Every Detail',
    description: 'Antique Charm. Modern Grace. Jewellery that speaks your story.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-brand-black text-white antialiased" suppressHydrationWarning>
        <AuthProvider>
          {children}
          {/* Global Comparison Dock & AI Stylist Chatbot */}
          <ProductComparisonDrawer />
          <AIJewelleryStylist />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#2A0A14',
                color: '#C9A66B',
                border: '1px solid #C9A66B44',
                fontFamily: 'Inter, sans-serif',
              },
              success: {
                iconTheme: { primary: '#C9A66B', secondary: '#2A0A14' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
