'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { money } from '@/lib/products';

interface Order {
  requestNumber: string; createdAt: string; total: number;
  customer: { name: string; email: string; phone?: string; notes?: string };
  items: { name: string; qty: number; lineTotal: number }[];
  paymentMethod: string; paymentStatus: 'awaited' | 'reported' | 'received';
  fulfillmentStatus: 'pending' | 'confirmed' | 'fulfilled';
}

type Filter = 'all' | 'awaited' | 'reported' | 'received';

const STATUS_LABEL: Record<string, string> = {
  awaited: 'Payment awaited',
  reported: 'Payment reported — verify',
  received: 'Payment received'
};

function Body() {
  const params = useSearchParams();
  const token = params.get('token') || '';
  const [orders, setOrders] = useState<Order[]>([]);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [busy, setBusy] = useState<string | null>(null);

  const load = () => {
    if (!token) return;
    fetch(`/api/orders?token=${encodeURIComponent(token)}`)
      .then(async (r) => {
        const d = await res_json(r);
        if (!r.ok) throw new Error(d.error || 'Unauthorized');
        setOrders(d.orders || []);
      })
      .catch((e: Error) => setErr(e.message));
  };

  useEffect(load, [token]);

  const counts = useMemo(() => {
    const by: Record<string, { n: number; sum: number }> = {
      awaited: { n: 0, sum: 0 }, reported: { n: 0, sum: 0 }, received: { n: 0, sum: 0 }
    };
    for (const o of orders) {
      const s = by[o.paymentStatus] || by.awaited;
      s.n += 1;
      s.sum += o.total;
    }
    return by;
  }, [orders]);

  const filtered = orders.filter(
    (o) =>
      (filter === 'all' || o.paymentStatus === filter) &&
      (!q || [o.requestNumber, o.customer.name, o.customer.email].join(' ').toLowerCase().includes(q.toLowerCase()))
  );

  async function patch(req: string, body: Record<string, string>) {
    setBusy(req);
    try {
      const r = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, requestNumber: req, ...body })
      });
      const d = await res_json(r);
      if (!r.ok) throw new Error(d.error || 'Update failed');
      setOrders((prev) => prev.map((o) => (o.requestNumber === req ? d.order : o)));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setBusy(null);
    }
  }

  function exportCsv() {
    const rows = [
      ['Request', 'Date', 'Name', 'Email', 'Phone', 'Items', 'Total', 'Pay method', 'Pay status', 'Fulfillment', 'Notes'],
      ...filtered.map((o) => [
        o.requestNumber,
        o.createdAt,
        o.customer.name,
        o.customer.email,
        o.customer.phone || '',
        o.items.map((l) => `${l.name} x${l.qty}`).join('; '),
        o.total.toFixed(2),
        o.paymentMethod,
        o.paymentStatus,
        o.fulfillmentStatus,
        (o.customer.notes || '').replace(/[\r\n]+/g, ' ')
      ])
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `whs-wreath-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section><div className="wrap">
      <p className="sec-index">Organizers only • WHS Music Boosters</p>
      <h1 className="serif" style={{ fontSize: 'clamp(36px,5vw,56px)' }}>Payment dashboard</h1>
      {!token && <div className="notice">Open this page with your organizer token: <code>/admin?token=YOUR_TOKEN</code> (set <code>ADMIN_TOKEN</code> in Vercel). No token, no customer data — by design.</div>}
      {err && <div className="error" role="alert">{err}</div>}
      {token && !err && (
        <>
          <div className="dash-cards">
            <div className="dash-card">
              <span>Requests</span>
              <strong>{orders.length}</strong>
              <em>{money(orders.reduce((n, o) => n + o.total, 0))} total due</em>
            </div>
            <div className="dash-card good">
              <span>Paid — verified</span>
              <strong>{counts.received.n}</strong>
              <em>{money(counts.received.sum)} received</em>
            </div>
            <div className="dash-card warn">
              <span>Reported — verify now</span>
              <strong>{counts.reported.n}</strong>
              <em>{money(counts.reported.sum)} claimed</em>
            </div>
            <div className="dash-card">
              <span>Awaiting payment</span>
              <strong>{counts.awaited.n}</strong>
              <em>{money(counts.awaited.sum)} outstanding</em>
            </div>
          </div>
          <div className="dash-toolbar">
            <div className="dash-tabs" role="tablist" aria-label="Filter by payment status">
              {(['all', 'awaited', 'reported', 'received'] as Filter[]).map((f) => (
                <button key={f} role="tab" aria-selected={filter === f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>
                  {f === 'all' ? `All (${orders.length})` : `${STATUS_LABEL[f]} (${counts[f].n})`}
                </button>
              ))}
            </div>
            <input aria-label="Search orders" placeholder="Search name, email, request #" value={q} onChange={(e) => setQ(e.target.value)} className="dash-search" />
            <button className="mini-btn" onClick={exportCsv} disabled={filtered.length === 0}>Export CSV</button>
          </div>
          {filtered.length === 0 && <div className="notice">Nothing here under this filter — share the storefront link by email and requests will appear.</div>}
          {filtered.map((o) => (
            <article key={o.requestNumber} className="dash-row">
              <div className="dash-main">
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <strong className="serif" style={{ fontSize: 19 }}>{o.requestNumber}</strong>
                  <span className={`pill p-${o.paymentStatus}`}>{STATUS_LABEL[o.paymentStatus]}</span>
                </div>
                <div style={{ fontSize: 14, marginTop: 4 }}>{o.customer.name} • {o.customer.email}{o.customer.phone ? ` • ${o.customer.phone}` : ''}</div>
                <div style={{ fontSize: 14 }}>{o.items.map((l) => `${l.name} × ${l.qty}`).join(' • ')} — <strong>{money(o.total)}</strong> <span style={{ color: 'var(--muted)' }}>via {o.paymentMethod === 'paypal' ? 'PayPal QR' : 'cash by mail'}</span></div>
                {o.customer.notes && <div style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--muted)' }}>“{o.customer.notes}”</div>}
                <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
                  {new Date(o.createdAt).toLocaleString()} • Fulfillment: <strong>{o.fulfillmentStatus}</strong>
                </div>
              </div>
              <div className="dash-actions">
                {o.paymentStatus !== 'received' ? (
                  <button className="mini-btn solid" disabled={busy === o.requestNumber} onClick={() => patch(o.requestNumber, { paymentStatus: 'received' })}>
                    {busy === o.requestNumber ? 'Saving…' : 'Mark paid ✓'}
                  </button>
                ) : (
                  <button className="mini-btn" disabled={busy === o.requestNumber} onClick={() => patch(o.requestNumber, { paymentStatus: 'reported' })}>
                    Unmark
                  </button>
                )}
                {o.fulfillmentStatus === 'pending' && (
                  <button className="mini-btn" disabled={busy === o.requestNumber} onClick={() => patch(o.requestNumber, { fulfillmentStatus: 'confirmed' })}>Confirm</button>
                )}
                {o.fulfillmentStatus === 'confirmed' && (
                  <button className="mini-btn" disabled={busy === o.requestNumber} onClick={() => patch(o.requestNumber, { fulfillmentStatus: 'fulfilled' })}>Fulfill</button>
                )}
              </div>
            </article>
          ))}
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            Only mark “paid” after you independently verify the money (PayPal activity or cash in hand).
            Status changes save to the order record. Customer data never appears without the token.
          </p>
        </>
      )}
    </div></section>
  );
}

async function res_json(r: Response) {
  try {
    return await r.json();
  } catch {
    return {};
  }
}

export default function AdminPage() {
  return (<div className="grain"><Navbar /><Suspense><Body /></Suspense></div>);
}
