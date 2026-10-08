'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Gallery, Hero, Marquee, Pickup, QuoteBand, SiteFooter, Story } from '@/components/Sections';
import { ProductModal, ProductRow } from '@/components/Product';
import { Arrow, Reveal } from '@/components/Reveal';
import { PRODUCTS, type Product } from '@/lib/products';

export default function HomePage() {
  const [selected, setSelected] = useState<Product | null>(null);
  return (
    <div className="grain">
      <Navbar />
      <Hero />
      <Marquee />
      <section id="collection">
        <div className="wrap">
          <div className="sec-head">
            <Reveal><p className="sec-index">01 — The 2026 collection</p></Reveal>
            <Reveal>
              <h2>Cut fresh. Priced honest.</h2>
            </Reveal>
            <Reveal>
              <p>
                The full WHS Music Boosters lineup — the same five offerings as the paper flyer,
                handcrafted from noble fir, incense cedar and juniper, finished with natural pine
                cones. Bows sold separately.
              </p>
            </Reveal>
          </div>
          <div className="plist">
            {PRODUCTS.map((p, i) => (
              <ProductRow key={p.id} product={p} index={i} onDetails={setSelected} />
            ))}
          </div>
          <Reveal>
            <p style={{ marginTop: 26, fontSize: 14, color: 'var(--muted)', maxWidth: 640 }}>
              Photography is representative — your wreath is assembled fresh by booster volunteers,
              so no two are exactly alike. Real product photos arrive before launch; prices and
              sizes above are final per the printed flyer.
            </p>
          </Reveal>
        </div>
      </section>
      <Story />
      <QuoteBand />
      <Gallery />
      <section aria-label="Fundraiser progress" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <div className="notice">
              <strong>An honest tally, coming soon.</strong> We&apos;ll publish our fundraising goal
              and wreaths sold here once the boosters confirm real numbers — never before.
            </div>
          </Reveal>
        </div>
      </section>
      <Pickup />
      <section style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ textAlign: 'center' }}>
          <Reveal>
            <h2 className="serif" style={{ fontSize: 'clamp(34px,5vw,60px)' }}>Your door called.<br />It wants <em style={{ color: 'var(--rust)' }}>a wreath.</em></h2>
            <p style={{ marginTop: 22 }}>
              <a href="#collection" className="btn btn-pine">Shop the collection <Arrow /></a>
            </p>
          </Reveal>
        </div>
      </section>
      <SiteFooter />
      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
