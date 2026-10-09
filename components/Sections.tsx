'use client';

import { useEffect, useRef, useState } from 'react';
import { SITE } from '@/lib/site';
import { Arrow, Reveal, Stat } from './Reveal';

const DEADLINE_ISO = '2026-10-30T23:59:00-07:00';

function daysLeft(): number | null {
  const ms = new Date(DEADLINE_ISO).getTime() - Date.now();
  return Math.ceil(ms / 86400000);
}

export function Hero() {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (innerRef.current && y < window.innerHeight) {
          innerRef.current.style.transform = `translateY(${y * 0.22}px)`;
          innerRef.current.style.opacity = `${Math.max(0, 1 - y / (window.innerHeight * 0.85))}`;
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const left = daysLeft();

  return (
    <header className="hero" id="home">
      <div className="hero-bg">
        <img src="/photos/hero.jpg" alt="Lush fresh evergreen wreath hanging on a wooden front door" fetchPriority="high" />
      </div>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="wrap hero-inner" ref={innerRef}>
        <p className="hero-kicker">Woodinville High School — Music Boosters Fundraiser</p>
        <h1>
          Bring home <em>the holidays.</em>
        </h1>
        <p className="hero-sub">
          Fresh-cut noble fir wreaths, swags and bows — handcrafted for the season,
          sold by the families behind Woodinville High&apos;s band, orchestra and choir.
        </p>
        <div className="hero-ctas">
          <a href="#collection" className="btn btn-gold">Shop the collection <Arrow /></a>
          <a href="#story" className="btn btn-ghost">Why it matters</a>
        </div>
        <dl className="hero-meta">
          <div>
            <dt>Order by</dt>
            <dd>October 30{left !== null && left > 0 ? ` · ${left} days left` : ''}</dd>
          </div>
          <div><dt>Pickup</dt><dd>Sat, Nov 21 — WHS upper lot</dd></div>
          <div><dt>Wreaths from</dt><dd>$25</dd></div>
        </dl>
      </div>
      <div className="scroll-cue" aria-hidden="true">Scroll</div>
    </header>
  );
}

export function Marquee() {
  const items = ['Fresh noble fir', 'Woodinville High School', 'Order by Oct 30', 'Pickup Nov 21', 'Bows $3', 'Supports student musicians'];
  const row = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((half) => (
          <span key={half}>
            {row.map((t, i) => (
              <span key={i}>{t} <i>✦</i></span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Story() {
  return (
    <section className="dark" id="story">
      <div className="wrap">
        <div className="sec-head">
          <Reveal><p className="sec-index">02 — Our story</p></Reveal>
          <Reveal><h2>Every wreath keeps the music playing.</h2></Reveal>
        </div>
        <div className="story-grid">
          <Reveal>
            <div className="story-photo">
              <div className="photo-soon" role="img" aria-label="Student orchestra photo coming soon">
                <svg width="54" height="54" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M9 18V6l10-2v11.5" stroke="#62d94f" strokeWidth="1.6" strokeLinejoin="round" />
                  <circle cx="6.5" cy="18" r="2.5" stroke="#62d94f" strokeWidth="1.6" />
                  <circle cx="16.5" cy="15.5" r="2.5" stroke="#62d94f" strokeWidth="1.6" />
                </svg>
                <p className="serif" style={{ fontSize: 26, margin: 0, color: '#fff' }}>Our musicians,<br />on stage soon.</p>
                <p style={{ fontSize: 12, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', margin: 0 }}>
                  Student photo arriving from the boosters
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div>
              <p className="dropcap">
                We are the WHS Music Boosters — the parents and neighbors behind Woodinville High
                School&apos;s band, orchestra and choir. Each December we sell fresh noble fir
                greenery so our students can afford the things school budgets don&apos;t cover:
                instruments, uniforms, festival travel and scholarships for graduating seniors.
              </p>
              <p style={{ color: 'rgba(255,255,255,.8)' }}>
                When you hang one of our wreaths, a local kid takes the stage a little more
                confidently. That is the whole exchange — and Woodinville has honored it for years.
              </p>
              <ul className="uses">
                <li>Instruments, equipment &amp; uniforms</li>
                <li>Festival travel, competitions &amp; trips</li>
                <li>Scholarships for graduating seniors</li>
                <li>Day-to-day music department needs</li>
              </ul>
              <div className="facts">
                <Stat value={5} label="Fresh offerings" />
                <Stat value={100} suffix="%" label="Volunteer-run" />
                <Stat value={1} label="Pickup morning" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function QuoteBand() {
  return (
    <div className="band">
      <img className="bg" src="/photos/pine-detail.jpg" alt="" aria-hidden="true" loading="lazy" />
      <div className="wrap band-inner">
        <Reveal>
          <blockquote>
            “Noble fir, incense cedar and juniper — finished with natural pine cones, the way a
            Northwest December should smell.”
          </blockquote>
          <cite>From the 2026 booster flyer</cite>
        </Reveal>
      </div>
    </div>
  );
}

export function Gallery() {
  return (
    <section style={{ paddingTop: 'clamp(48px,6vw,80px)' }} aria-label="Seasonal scenes">
      <div className="wrap">
        <Reveal><p className="micro">The season, up close</p></Reveal>
        <div className="gstrip">
          <Reveal>
            <figure>
              <img src="/photos/ornaments.jpg" alt="Holiday ornaments glowing in warm light" loading="lazy" />
              <figcaption>Trimmed &amp; ready</figcaption>
            </figure>
          </Reveal>
          <Reveal delay={100}>
            <figure>
              <img src="/photos/flatlay.jpg" alt="Holiday greenery and gifts arranged for the season" loading="lazy" />
              <figcaption>From our tables to yours</figcaption>
            </figure>
          </Reveal>
          <Reveal delay={200}>
            <figure>
              <img src="/photos/pine-detail.jpg" alt="Snow-dusted pine branches" loading="lazy" />
              <figcaption>Fresh-cut fir</figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Countdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = new Date(DEADLINE_ISO).getTime() - now;
  if (diff <= 0) {
    return (
      <p className="notice" style={{ marginTop: 26 }}>
        The order window has closed. Missed it? Email <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> — if greenery remains, a booster will help.
      </p>
    );
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const cells: [number, string][] = [
    [d, 'Days'],
    [h, 'Hours'],
    [m, 'Minutes'],
    [s, 'Seconds']
  ];
  return (
    <div>
      <div className="countdown" role="timer" aria-label="Time left to order">
        {cells.map(([v, label]) => (
          <div key={label}>
            <strong>{String(v).padStart(label === 'Days' ? 1 : 2, '0')}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 13, color: 'var(--muted)', margin: '8px 0 0' }}>Left to order for November 21 pickup.</p>
    </div>
  );
}

const FAQS = [
  {
    q: 'When and where do I pick up my wreaths?',
    a: 'Saturday, November 21st in the Woodinville High School upper parking lot. The exact pickup time window is still being confirmed by the boosters — it will be posted here and in your confirmation email before pickup day.'
  },
  {
    q: 'How do I pay?',
    a: 'Payment is due at time of order. Scan our official PayPal QR code at checkout, or mail cash following the instructions in your confirmation email. Paying by check? Make it payable to “WHS Music Boosters”.'
  },
  {
    q: 'Does my wreath come with a bow?',
    a: 'Bows are sold separately for $3 — add a red velvet bow to any wreath, swag or candy cane when you order.'
  },
  {
    q: 'What are the wreaths made of?',
    a: 'Fresh noble fir, incense cedar and juniper, finished with natural pine cones for a classic holiday look — handcrafted by booster volunteers. No two pieces are exactly alike.'
  },
  {
    q: 'When is the order deadline?',
    a: 'October 30. After that the boosters place the greenery order, so late requests can’t be guaranteed — order early.'
  }
];

export function Pickup() {
  return (
    <section id="pickup" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <Reveal><p className="sec-index">03 — Pickup &amp; payment</p></Reveal>
          <Reveal><h2>Simple as a Saturday morning.</h2></Reveal>
          <Reveal>
            <p>
              This is a neighborhood fundraiser, not a warehouse store. You order online, pay by
              PayPal QR or mailed cash, and collect your greenery at the high school. {SITE.paymentPolicy}
            </p>
          </Reveal>
        </div>
        <div className="steps">
          <Reveal>
            <div className="step">
              <b className="num">No. 1</b>
              <h3>Reserve your greenery</h3>
              <p>Browse the collection, add to your bag and check out online — no account needed. You&apos;ll receive a request number on the spot.</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="step">
              <b className="num">No. 2</b>
              <h3>Pay your way</h3>
              <p>Scan our official PayPal QR at checkout, or mail cash per the instructions in your confirmation email. Checks payable to “WHS Music Boosters”.</p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="step">
              <b className="num">No. 3</b>
              <h3>Collect Nov 21</h3>
              <p><strong>{SITE.pickupLabel}.</strong> Order deadline: <strong>{SITE.orderDeadlineLabel}</strong>.</p>
              <div className="org-note">
                <strong>Organizer note</strong>
                Pickup time window still to be confirmed — check back before Nov 21.
              </div>
            </div>
          </Reveal>
        </div>
        <div style={{ marginTop: 40 }}>
          <Reveal><p className="micro">Good to know</p></Reveal>
          <Reveal>
            <div className="faq">
              {FAQS.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}<span className="pm" aria-hidden="true">+</span></summary>
                  <p className="answer">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal>
          <div className="notice" style={{ marginTop: 34 }}>
            Questions? Write to a real booster parent at <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>. Pickup only — we don&apos;t ship or deliver.
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section style={{ paddingTop: 0 }} aria-label="Order before the deadline">
      <div className="wrap" style={{ textAlign: 'center', maxWidth: 760 }}>
        <Reveal>
          <p className="sec-index" style={{ justifyContent: 'center' }}>Order by October 30</p>
          <h2 className="serif" style={{ fontSize: 'clamp(38px,5.6vw,66px)' }}>
            See you <em style={{ color: 'var(--gold)' }}>November 21st.</em>
          </h2>
          <p style={{ color: 'var(--muted)', maxWidth: 520, margin: '0 auto' }}>
            Order this week, collect your greenery in the WHS upper lot — and know exactly
            which neighborhood kids you helped.
          </p>
        </Reveal>
        <Reveal>
          <Countdown />
        </Reveal>
        <Reveal>
          <p style={{ marginTop: 26 }}>
            <a href="#collection" className="btn btn-pine">Shop the collection <Arrow /></a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap">
        <Reveal>
          <p className="footer-giant">Thank you,<br /><em>Woodinville.</em></p>
        </Reveal>
        <div className="footer-grid">
          <div>
            <h4>The fundraiser</h4>
            <p style={{ margin: 0 }}>WHS Music Boosters 2026 Wreath Fundraiser — fresh noble fir greenery supporting Woodinville High School&apos;s music students.</p>
          </div>
          <div>
            <h4>Visit</h4>
            <p style={{ margin: 0 }}>
              <a href="/#collection">The collection</a><br />
              <a href="/#story">Our story</a><br />
              <a href="/#pickup">Pickup &amp; payment</a><br />
              <a href="/checkout">Checkout</a>
            </p>
          </div>
          <div>
            <h4>Contact</h4>
            <p style={{ margin: 0 }}>
              <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a><br />
              Pickup {SITE.pickupLabel}<br />
              Order by {SITE.orderDeadlineLabel}
            </p>
          </div>
        </div>
        <div className="footer-fine">
          <span>Representative photography via Unsplash — actual handcrafted pieces vary naturally.</span>
          <span style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <span>WHS Music Boosters · Woodinville, WA</span>
            <button className="to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top ↑</button>
          </span>
        </div>
      </div>
    </footer>
  );
}
