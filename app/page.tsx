'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Hero, Mission, OrderingInfo, SiteFooter } from '@/components/Sections';
import { ProductCard, ProductModal } from '@/components/Product';
import { PRODUCTS, type Product } from '@/lib/products';
import { SITE } from '@/lib/site';

export default function HomePage() {
  const [selected, setSelected] = useState<Product | null>(null);
  return (
    <>
      <Navbar />
      <Hero />
      <section id="shop">
        <div className="wrap">
          <p className="eyebrow">The 2026 Collection • From the Flyer, Priced as Printed</p>
          <h2>Fresh wreaths, honest prices, local kids.</h2>
          <p style={{ maxWidth: 640, color: 'var(--muted)' }}>
            Everything below is the real WHS Music Boosters lineup — same items and prices as the paper flyer
            your neighbors brought home. Handcrafted noble fir, cedar &amp; juniper with pine cones. Bows sold separately.
          </p>
          <div className="product-grid" style={{ marginTop: 24 }}>
            {PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} onDetails={setSelected} />
            ))}
          </div>
        </div>
      </section>
      <Mission />
      <section aria-label="Fundraiser progress">
        <div className="wrap">
          <div className="card" style={{ padding: 28, textAlign: 'center' }}>
            <p className="eyebrow">Fundraiser Progress</p>
            <h2>We’re just getting started — and every order counts.</h2>
            <p style={{ color: 'var(--muted)', maxWidth: 560, margin: '0 auto' }}>
              We’ll share our goal and wreaths-sold tally here once the boosters confirm real numbers.
              We never invent sales figures — check back after the fundraiser kicks off!
            </p>
          </div>
        </div>
      </section>
      <OrderingInfo />
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="notice">
            <strong>Before you share this link:</strong> product photos are still representative illustrations.
            Swap in real wreath photos under <code>/public/products/</code>, install the official PayPal QR at{' '}
            <code>/public/paypal-qr.svg</code>, and confirm the {SITE.pickupTimeNote}
          </div>
        </div>
      </section>
      <SiteFooter />
      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
