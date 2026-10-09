'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { SiteFooter } from '@/components/Sections';
import { useCart } from '@/lib/cart';
import { PRODUCTS, money } from '@/lib/products';
import { SITE } from '@/lib/site';
import { validateCustomer, validateItems } from '@/lib/validation';

export default function CheckoutPage() {
  const { lines, setQty, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '', paymentMethod: 'paypal' as 'paypal' | 'cash', paid: false });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const detailed = useMemo(
    () => lines.map((l) => ({ ...l, p: PRODUCTS.find((p) => p.id === l.id)! })).filter((l) => l.p),
    [lines]
  );
  const total = detailed.reduce((n, l) => n + l.p.price * l.qty, 0);
  const set = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = [
      ...validateItems(lines.map((l) => ({ id: l.id, qty: l.qty }))),
      ...validateCustomer({ ...form, paymentReported: form.paid })
    ];
    if (form.paymentMethod === 'cash' && !SITE.cashByMail.enabled)
      errs.push('Cash-by-mail isn’t enabled yet — the boosters are finalizing mailing instructions. Please choose PayPal, or email us for help.');
    setErrors(errs);
    if (errs.length) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), notes: form.notes.trim() },
          items: lines,
          paymentMethod: form.paymentMethod,
          paymentReported: form.paid
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');
      try { localStorage.setItem('whs-last-order', JSON.stringify(data.order)); } catch {}
      clear();
      router.push(`/confirmation?req=${encodeURIComponent(data.order.requestNumber)}`);
    } catch (err: unknown) {
      setErrors([err instanceof Error ? err.message : 'Something went wrong. Please try again or email us.']);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grain">
      <Navbar />
      <section>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 36 }} id="checkout-grid">
          <div>
            <p className="sec-index">Checkout — no account needed</p>
            <h1 className="serif" style={{ fontSize: 'clamp(38px,5vw,60px)' }}>Your wreath request</h1>
            {detailed.length === 0 ? (
              <div className="notice">Your bag is empty. <a href="/#collection">Browse the collection</a> first — our Woodinville students thank you.</div>
            ) : (
              <form onSubmit={submit} noValidate>
                {errors.length > 0 && (
                  <div className="error" role="alert">
                    <strong>Please fix the following:</strong>
                    <ul style={{ margin: '6px 0 0', paddingLeft: 20 }}>{errors.map((e) => <li key={e}>{e}</li>)}</ul>
                  </div>
                )}
                <div className="field"><label htmlFor="name">Full name *</label><input id="name" value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" required /></div>
                <div className="field"><label htmlFor="email">Email address *</label><input id="email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" required /><small style={{ color: 'var(--muted)' }}>Your confirmation + pickup details go here.</small></div>
                <div className="field"><label htmlFor="phone">Phone (optional)</label><input id="phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" /></div>
                <div className="field"><label htmlFor="notes">Notes (optional)</label><textarea id="notes" rows={3} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="e.g. neighbor pickup, ribbon preference…" /></div>
                <fieldset style={{ border: '1px solid var(--hair)', borderRadius: 2, padding: 20, margin: '0 0 18px' }}>
                  <legend style={{ fontWeight: 700, padding: '0 8px', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Payment method *</legend>
                  <label style={{ display: 'block', marginBottom: 10 }}>
                    <input type="radio" name="pay" checked={form.paymentMethod === 'paypal'} onChange={() => set('paymentMethod', 'paypal')} /> <strong>Pay with PayPal</strong> — scan our official QR code
                  </label>
                  <label style={{ display: 'block' }}>
                    <input type="radio" name="pay" checked={form.paymentMethod === 'cash'} onChange={() => set('paymentMethod', 'cash')} /> <strong>Pay with cash by mail</strong>
                  </label>
                  {form.paymentMethod === 'paypal' ? (
                    <div className="notice" style={{ marginTop: 12 }}>
                      <p style={{ margin: '0 0 8px' }}>After submitting, you’ll see our official PayPal QR. Scan it with your phone, pay <strong>{money(total)}</strong>, and include your request number in the note if possible.</p>
                      <img src={SITE.paypal.qrImage} alt="WHS Music Boosters official PayPal QR code — scan to pay" width={180} height={180} style={{ borderRadius: 2, border: '1px solid var(--hair)', background: '#fff' }} />
                      {!SITE.paypal.configured && <p style={{ fontSize: 13 }}>Organizer setup: replace <code>public/paypal-qr.svg</code> with the official QR scan before emailing this link.</p>}
                      <label style={{ display: 'block', marginTop: 10 }}>
                        <input type="checkbox" checked={!!form.paid} onChange={(e) => set('paid', e.target.checked)} /> I’ve completed the PayPal payment <span style={{ color: 'var(--muted)' }}>(recorded as “Payment Reported” — boosters verify before marking received)</span>
                      </label>
                    </div>
                  ) : (
                    <div className="notice" style={{ marginTop: 12 }}>
                      <p style={{ margin: 0 }}>{SITE.cashByMail.instructions}</p>
                    </div>
                  )}
                </fieldset>
                <button className="btn btn-gold" disabled={submitting} type="submit">
                  {submitting ? 'Submitting…' : `Submit request — ${money(total)}`}
                </button>
                <p style={{ fontSize: 13, color: 'var(--muted)' }}>Submitting creates a real request for our booster volunteers. Payment is confirmed only after a booster verifies it — never automatically.</p>
              </form>
            )}
          </div>
          <aside style={{ borderTop: '2px solid var(--ink)', paddingTop: 20, height: 'fit-content' }}>
            <h2 className="serif" style={{ marginTop: 0, fontSize: 30 }}>Order summary</h2>
            {detailed.map((l) => (
              <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--hair)', fontSize: 14.5 }}>
                <span>{l.p.name} × {l.qty}</span>
                <strong>{money(l.p.price * l.qty)}</strong>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 14 }}>
              <span style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700 }}>Total due</span>
              <span className="serif" style={{ fontSize: 34, fontWeight: 600 }}>{money(total)}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>Pickup: {SITE.pickupLabel}. Deadline {SITE.orderDeadlineLabel}. {SITE.paymentPolicy}</p>
            {detailed.map((l) => (
              <div key={l.id} className="qty" style={{ marginBottom: 6 }}>
                <button type="button" onClick={() => setQty(l.id, l.qty - 1)} aria-label="decrease">−</button>
                <span>{l.qty}</span>
                <button type="button" onClick={() => setQty(l.id, l.qty + 1)} aria-label="increase">+</button>
              </div>
            ))}
          </aside>
        </div>
      </section>
      <SiteFooter />
      <style>{`@media (max-width:900px){#checkout-grid{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}
