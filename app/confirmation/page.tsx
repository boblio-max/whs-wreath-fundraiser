'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { SiteFooter } from '@/components/Sections';
import { money } from '@/lib/products';
import { SITE } from '@/lib/site';

interface LastOrder {
  requestNumber: string; createdAt: string; total: number;
  customer: { name: string; email: string };
  items: { name: string; qty: number; lineTotal: number }[];
  paymentMethod: string; paymentStatus: string;
  emailStatus: { organizer: string; customer: string };
}

function Body() {
  const params = useSearchParams();
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('whs-last-order');
      if (raw) {
        const o = JSON.parse(raw);
        if (!params.get('req') || o.requestNumber === params.get('req')) setOrder(o);
      }
    } catch {}
  }, [params]);

  if (!order)
    return (
      <section><div className="wrap"><h1>Confirmation</h1><div className="notice">No recent request found on this device. <a href="/#collection">Browse the wreaths</a> or check your email for your request number.</div></div></section>
    );

  const mailto = `mailto:${SITE.organizerEmail}?subject=${encodeURIComponent(`Wreath request ${order.requestNumber} — ${order.customer.name}`)}&body=${encodeURIComponent(`Hi boosters! I just submitted request ${order.requestNumber} for ${money(order.total)}. My email is ${order.customer.email}. Thank you!`)}`;

  return (
    <section>
      <div className="wrap" style={{ maxWidth: 760 }}>
        <p className="sec-index">Request received — thank you, neighbor</p>
        <h1 className="serif" style={{ fontSize: 'clamp(38px,5vw,60px)' }}>Thank you, {order.customer.name.split(' ')[0]}.</h1>
        <div style={{ borderTop: '2px solid var(--ink)', paddingTop: 22 }}>
          <p>Your wreath request <strong>{order.requestNumber}</strong> was received on {new Date(order.createdAt).toLocaleString()}. A booster volunteer will follow up at <strong>{order.customer.email}</strong>.</p>
          <table className="summary">
            <tbody>
              {order.items.map((l) => <tr key={l.name}><td>{l.name} × {l.qty}</td><td align="right">{money(l.lineTotal)}</td></tr>)}
              <tr><td><strong>Total due</strong></td><td align="right"><strong>{money(order.total)}</strong></td></tr>
            </tbody>
          </table>
          {order.paymentMethod === 'paypal' ? (
            <div className="notice" style={{ marginTop: 16 }}>
              <strong>Pay with PayPal:</strong> scan the code below for <strong>{money(order.total)}</strong> and include <strong>{order.requestNumber}</strong> in the payment note if possible.
              <div><img src={SITE.paypal.qrImage} alt="Official PayPal QR code" width={220} height={220} style={{ borderRadius: 2, background: '#fff', border: '1px solid var(--hair)', marginTop: 10 }} /></div>
              <p style={{ fontSize: 13 }}>Payment status: <strong>{order.paymentStatus === 'reported' ? 'Payment Reported (awaiting booster verification)' : 'Payment Awaited'}</strong> — showing this code does not mark you paid; a booster verifies every payment.</p>
              <p>{SITE.paypal.link && (<><a href={SITE.paypal.link}>Open PayPal link</a> • </>)}<a href={SITE.paypal.qrImage} target="_blank" rel="noreferrer">Enlarge QR for scanning</a></p>
            </div>
          ) : (
            <div className="notice" style={{ marginTop: 16 }}><strong>Cash by mail:</strong> {SITE.cashByMail.instructions} Amount due: <strong>{money(order.total)}</strong>. Include <strong>{order.requestNumber}</strong> with your payment.</div>
          )}
          <p><strong>Pickup:</strong> {SITE.pickupLabel}. {SITE.pickupTimeNote}</p>
          {order.emailStatus.organizer === 'sent' || order.emailStatus.customer === 'sent' ? (
            <p>Confirmation emails were sent. If yours hasn’t arrived, check spam or email <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>.</p>
          ) : (
            <p>Email service isn’t configured yet, so no automatic emails went out — but your request <strong>is saved</strong>. Please use the button below to notify the boosters:</p>
          )}
          {(order.emailStatus.organizer !== 'sent') && (
            <p><a className="btn btn-pine" href={mailto}>Email the boosters about {order.requestNumber}</a></p>
          )}
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>Payment is confirmed only after a booster verifies it. Questions? <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></p>
        </div>
      </div>
    </section>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="grain">
      <Navbar />
      <Suspense><Body /></Suspense>
      <SiteFooter />
    </div>
  );
}

