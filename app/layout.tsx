import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap'
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
  display: 'swap'
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Fresh Holiday Wreaths — WHS Music Boosters | Woodinville High School',
  description:
    'Fresh handcrafted noble fir wreaths, swags and bows from Woodinville High School Music Boosters. Order by October 30, pickup November 21. Supporting local student musicians.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Fresh Holiday Wreaths — WHS Music Boosters',
    description:
      'Handcrafted noble fir wreaths from your Woodinville High School neighbors. Order by Oct 30, pickup Nov 21 at WHS.',
    url: siteUrl,
    siteName: 'WHS Music Boosters Wreath Fundraiser',
    type: 'website',
    images: [{ url: '/photos/hero.jpg', width: 1600, height: 1067, alt: 'Fresh evergreen wreath on a wooden door' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fresh Holiday Wreaths — WHS Music Boosters',
    description: 'Supporting Woodinville High School musicians, one front door at a time.'
  },
  icons: { icon: '/favicon.svg' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
