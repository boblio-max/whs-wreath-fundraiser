'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { money } from '@/lib/products';

interface Order {
  requestNumber: string; createdAt: string; total: number;
  customer: { name: string; email: string; phone?: string; notes?: string };
  items: { name: string; qty: number; lineTotal: number }[];
  paymentMethod: string; paymentStatus: string; fulfillmentStatus: string;
}

function Body() {
  const params = useSearchParams();
  const token = params.get('token') || '';
  const [orders, setOrders] = useState<Order[]>([]);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch(`/api/orders?token=${encodeURIComponent(token)}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || 'Unauthorized');
        setOrders(d.orders || []);
      })
      .catch((e: Error) => setErr(e.message));
  }, [token]);

  const filtered = orders.filter((o) =>
    !q || [o.requestNumber, o.customer.name, o.customer.email].join(' ').toLowerCase().includes(q.toLowerCase())
  );
  const total = filtered.reduce((n, o) => n + o.total, 0);

  return (
    <section><div className="wrap">
      <p className="eyebrow">Organizers only • WHS Music Boosters</p>
      <h1>Order dashboard</h1>
      {!token && <div className="notice">Open this page with your organizer token: <code>/admin?token=YOUR_TOKEN</code> (set <code>ADMIN_TOKEN</code> in Vercel). No token, no customer data — by design.</div>}
      {err && <div className="error" role="alert">{err}</div>}
      {token && !err && (
        <>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
            <input aria-label="Search orders" placeholder="Search name, email, request #" value={q} onChange={(e) => setQ(e.target.value)} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid var(--line)', minWidth: 260 }} />
            <strong>{filtered.length} requests • {money(total)}</strong>
          </div>
          {filtered.length === 0 && <div className="notice">No requests yet — share the storefront link by email and they’ll appear here.</div>}
          {filtered.map((o) => (
            <div key={o.requestNumber} className="card" style={{ padding: 18, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <strong>{o.requestNumber}</strong>
                <span style={{ fontSize: 13 }}>{new Date(o.createdAt).toLocaleString()}</span>
              </div>
              <div style={{ fontSize: 14 }}>{o.customer.name} • {o.customer.email}{o.customer.phone ? ` • ${o.customer.phone}` : ''}</div>
              <div style={{ fontSize: 14 }}>{o.items.map((l) => `${l.name} × ${l.qty}`).join(' • ')} — <strong>{money(o.total)}</strong></div>
              <div style={{ fontSize: 13, marginTop: 6 }}>
                Payment: <strong>{o.paymentMethod === 'paypal' ? 'PayPal QR' : 'Cash by mail'}</strong> • status <strong>{o.paymentStatus}</strong> (verify independently before marking received) • fulfillment <strong>{o.fulfillmentStatus}</strong>
              </div>
              {o.customer.notes && <div style={{ fontSize: 13, fontStyle: 'italic' }}>“{o.customer.notes}”</div>}
            </div>
          ))}
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>To mark a payment received / update fulfillment, edit <code>data/orders.json</code> locally or connect Vercel KV/Postgres (see DEPLOY.md). Customer data never appears without the token.</p>
        </>
      )}
    </div></section>
  );
}

export default function AdminPage() {
  return (<><Navbar /><Suspense><Body /></Suspense></>);
}
