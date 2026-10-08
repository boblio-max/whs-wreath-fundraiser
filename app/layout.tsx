import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/lib/cart';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'WHS Music Boosters 2026 Wreath Fundraiser | Woodinville High School',
  description:
    'Support Woodinville High School musicians! Order fresh handcrafted noble fir wreaths, swags & bows. Pickup Nov 21 in the WHS upper lot. Every order helps our local music students.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'WHS Music Boosters 2026 Wreath Fundraiser',
    description:
      'Fresh noble fir wreaths from your Woodinville High School neighbors — supporting WHS music students. Order by Oct 30, pickup Nov 21.',
    url: siteUrl,
    siteName: 'WHS Music Boosters Wreath Fundraiser',
    type: 'website',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'WHS Music Boosters wreath fundraiser' }]
  },
  twitter: { card: 'summary_large_image', title: 'WHS Music Boosters 2026 Wreath Fundraiser', description: 'Fresh wreaths, local students, happy holidays. Woodinville HS — order by Oct 30.' },
  icons: { icon: '/favicon.svg' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
