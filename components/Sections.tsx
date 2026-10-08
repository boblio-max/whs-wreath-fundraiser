import { SITE } from '@/lib/site';

export function Hero() {
  return (
    <header className="hero" id="home">
      <div className="wrap hero-grid">
        <div>
          <p className="eyebrow" style={{ color: 'var(--gold-soft)' }}>Woodinville High School • WHS Music Boosters</p>
          <h1>Bring Home the Holidays. Help Our Orchestra &amp; Band Shine.</h1>
          <p className="lead">
            Celebrate the season with a beautiful fresh wreath from your Woodinville neighbors — while helping
            our local high school musicians fund instruments, uniforms, festival travel, and scholarships.
          </p>
          <div className="hero-badges">
            <span className="badge">🌲 Fresh noble fir</span>
            <span className="badge">📍 Pickup Nov 21 @ WHS upper lot</span>
            <span className="badge">⏰ Order by Oct 30</span>
          </div>
          <div className="hero-ctas">
            <a href="#shop" className="btn btn-gold">Shop the Collection</a>
            <a href="#mission" className="btn btn-outline">Our Fundraiser Story</a>
          </div>
          <p style={{ fontSize: 13, color: '#cbbf9d', marginTop: 14 }}>
            From our neighborhood to your front door — thank you for supporting Woodinville’s young musicians.
          </p>
        </div>
        <div className="hero-art">
          <img src="/products/wreath-24.svg" alt="Festive noble fir wreath with red bow — representative illustration" style={{ borderRadius: 12, width: '100%' }} />
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '8px 4px 2px' }}>
            Representative illustration — real handcrafted wreaths vary naturally. {SITE.craftNote}
          </p>
        </div>
      </div>
    </header>
  );
}

export function Mission() {
  return (
    <section className="mission" id="mission">
      <div className="wrap mission-grid">
        <div>
          <p className="eyebrow">Our Mission • Right Here in Woodinville</p>
          <h2>Every Wreath Helps Make the Music Go Further.</h2>
          <p>
            We’re your neighbors — the <strong>WHS Music Boosters</strong>, the parent volunteers behind
            Woodinville High School’s band, orchestra, and choir. Funds raised help with instruments,
            equipment, uniforms, festival travel, competitions, scholarships for graduating seniors, and
            everyday music-department needs that aren’t funded by NSD.
          </p>
          <p>
            When you hang one of our fresh noble fir wreaths, you’re not just decorating — you’re keeping
            music alive for local kids, one doorstep at a time. From all of our student musicians:{' '}
            <em>thank you for showing up for us, Woodinville.</em>
          </p>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginTop: 0 }}>Where your support goes</h3>
          <ul style={{ paddingLeft: 20, margin: '0 0 12px' }}>
            <li>Instruments, equipment &amp; uniforms</li>
            <li>Festival travel, competitions &amp; trips</li>
            <li>Scholarships for graduating seniors</li>
            <li>Music department student activities</li>
          </ul>
          <p style={{ fontSize: 14, color: 'var(--muted)' }}>
            WHS Music Boosters supports the WHS Music Department and its students. We don’t claim every
            dollar goes to one trip — it goes where our local students need it most.
          </p>
        </div>
      </div>
    </section>
  );
}

export function OrderingInfo() {
  return (
    <section id="ordering">
      <div className="wrap">
        <p className="eyebrow">Ordering Information</p>
        <h2>Easy ordering, neighborly pickup.</h2>
        <div className="info-grid" style={{ marginTop: 20 }}>
          <div className="card info-card">
            <h3>1. Shop &amp; check out</h3>
            <p>Add wreaths to your cart and check out online — no account needed. You’ll get a request number instantly.</p>
          </div>
          <div className="card info-card">
            <h3>2. Pay your way</h3>
            <p><strong>PayPal:</strong> scan our official QR code at checkout. <strong>Cash by mail:</strong> follow the mailed instructions in your confirmation email. {SITE.paymentPolicy}</p>
          </div>
          <div className="card info-card">
            <h3>3. Pick up Nov 21</h3>
            <p><strong>{SITE.pickupLabel}.</strong> {SITE.pickupTimeNote}</p>
            <p style={{ fontSize: 14 }}>Order deadline: <strong>{SITE.orderDeadlineLabel}</strong></p>
          </div>
        </div>
        <div className="notice" style={{ marginTop: 20 }}>
          <strong>Questions?</strong> Email your Woodinville booster team at{' '}
          <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> — a real local parent will reply.
          Pickup-only; we don’t ship or deliver. Checks payable to “WHS Music Boosters”.
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap" style={{ display: 'grid', gap: 20 }}>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div>
            <strong style={{ color: '#fff', fontFamily: 'var(--serif)', fontSize: 18 }}>WHS Music Boosters</strong>
            <p style={{ margin: '6px 0', fontSize: 14 }}>Supporting Woodinville High School’s music students — our neighbors, our kids, our pride.</p>
            <p style={{ margin: 0, fontSize: 14 }}>Contact: <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></p>
          </div>
          <div style={{ fontSize: 14 }}>
            <a href="/#shop">Shop Wreaths</a> • <a href="/#mission">Our Mission</a> • <a href="/#ordering">Ordering Info</a> • <a href="/checkout">Checkout</a>
          </div>
        </div>
        <p style={{ fontSize: 13, margin: 0 }}>
          Thank you, Woodinville, for keeping the music playing. Pickup {SITE.pickupLabel} • Order by {SITE.orderDeadlineLabel}.
        </p>
      </div>
    </footer>
  );
}
