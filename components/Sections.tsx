import { SITE } from '@/lib/site';
import { Arrow, Reveal } from './Reveal';

export function Hero() {
  return (
    <header className="hero" id="home">
      <div className="hero-bg">
        <img src="/photos/hero.jpg" alt="Lush fresh evergreen wreath hanging on a wooden front door" fetchPriority="high" />
      </div>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="wrap hero-inner">
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
          <div><dt>Order by</dt><dd>October 30</dd></div>
          <div><dt>Pickup</dt><dd>Sat, Nov 21 — WHS upper lot</dd></div>
          <div><dt>Wreaths from</dt><dd>$25</dd></div>
        </dl>
      </div>
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
              <img src="/photos/story.jpg" alt="Student violinists performing together" loading="lazy" />
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
                <div><strong>5</strong><span>Fresh offerings</span></div>
                <div><strong>100%</strong><span>Volunteer-run</span></div>
                <div><strong>1</strong><span>Pickup morning</span></div>
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

export function Pickup() {
  return (
    <section id="pickup" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head">
          <Reveal><p className="sec-index">04 — Pickup &amp; payment</p></Reveal>
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
              <p><strong>{SITE.pickupLabel}.</strong> {SITE.pickupTimeNote} Order deadline: <strong>{SITE.orderDeadlineLabel}</strong>.</p>
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
          <span>WHS Music Boosters · Woodinville, WA</span>
        </div>
      </div>
    </footer>
  );
}
