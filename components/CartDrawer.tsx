'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { PRODUCTS, money } from '@/lib/products';
import { Arrow } from './Reveal';

export default function CartDrawer({ onClose }: { onClose: () => void }) {
  const { lines, setQty, remove, clear } = useCart();
  const router = useRouter();
  const detailed = lines
    .map((l) => ({ ...l, p: PRODUCTS.find((p) => p.id === l.id) }))
    .filter((l) => l.p);
  const subtotal = detailed.reduce((n, l) => n + l.p!.price * l.qty, 0);

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} aria-hidden="true" />
      <aside className="drawer" role="dialog" aria-label="Shopping bag">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--ink)', paddingBottom: 14 }}>
          <h2 className="serif" style={{ margin: 0, fontSize: 30 }}>Your bag</h2>
          <button onClick={onClose} aria-label="Close bag" style={{ background: 'none', border: '1px solid var(--hair)', borderRadius: 2, width: 38, height: 38, cursor: 'pointer', fontSize: 16 }}>✕</button>
        </div>
        {detailed.length === 0 ? (
          <div style={{ marginTop: 26 }}>
            <p style={{ fontSize: 17 }}>Your bag is empty — the collection is waiting.</p>
            <Link href="/#collection" className="btn btn-pine" onClick={onClose}>Browse the collection <Arrow /></Link>
          </div>
        ) : (
          <>
            <ul style={{ listStyle: 'none', padding: 0, margin: '6px 0 0' }}>
              {detailed.map((l) => (
                <li key={l.id} style={{ display: 'flex', gap: 14, padding: '18px 0', borderBottom: '1px solid var(--hair)' }}>
                  <img src={l.p!.image} alt="" width={76} height={76} style={{ borderRadius: 2, objectFit: 'cover', width: 76, height: 76 }} />
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600 }}>{l.p!.name}</strong>
                    <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>{money(l.p!.price)} each</div>
                    <div className="qty" style={{ marginTop: 8 }}>
                      <button onClick={() => setQty(l.id, l.qty - 1)} aria-label={`Decrease ${l.p!.name}`}>−</button>
                      <span aria-live="polite">{l.qty}</span>
                      <button onClick={() => setQty(l.id, l.qty + 1)} aria-label={`Increase ${l.p!.name}`}>+</button>
                      <button onClick={() => remove(l.id)} style={{ width: 'auto', padding: '0 12px', fontSize: 12 }} aria-label={`Remove ${l.p!.name}`}>Remove</button>
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18 }}>{money(l.p!.price * l.qty)}</div>
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 18 }}>
              <span style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700 }}>Subtotal</span>
              <span className="serif" style={{ fontSize: 32, fontWeight: 600 }}>{money(subtotal)}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>Pickup only at Woodinville HS — no taxes, no shipping. Payment details at checkout.</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
              <button className="btn btn-gold" style={{ padding: '15px 24px' }} onClick={() => { onClose(); router.push('/checkout'); }}>Checkout <Arrow /></button>
              <button className="mini-btn" onClick={clear}>Clear</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
