import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CartProvider } from '@/contexts/CartContext'

export const metadata: Metadata = {
  title: 'Universal Online Store - Shop Digital & Physical Products',
  description: 'Free e-commerce platform for selling digital and physical products. No login required. Install as app on your phone or browser.',
  keywords: 'ecommerce, online store, digital products, shopping',
  openGraph: {
    title: 'Universal Online Store',
    description: 'Shop the best products online',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'Universal Online Store',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#FF6B35" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Facebook Pixel */}
        <script
          async
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>
      <body className="bg-gray-50">
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
