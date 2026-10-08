'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { PRODUCTS, money } from '@/lib/products';
import { useRouter } from 'next/navigation';

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
      <aside className="drawer" role="dialog" aria-label="Shopping cart">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Your Cart</h2>
          <button onClick={onClose} aria-label="Close cart" style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>✕</button>
        </div>
        {detailed.length === 0 ? (
          <div style={{ marginTop: 20 }}>
            <p>Your cart is empty — but our Woodinville students have fresh wreaths waiting!</p>
            <Link href="/#shop" className="btn btn-pine" onClick={onClose}>Browse the wreaths</Link>
          </div>
        ) : (
          <>
            <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0' }}>
              {detailed.map((l) => (
                <li key={l.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
                  <img src={l.p!.image} alt="" width={64} height={64} style={{ borderRadius: 10, objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <strong>{l.p!.name}</strong>
                    <div style={{ fontSize: 14, color: 'var(--muted)' }}>{money(l.p!.price)} each</div>
                    <div className="qty" style={{ marginTop: 6 }}>
                      <button onClick={() => setQty(l.id, l.qty - 1)} aria-label={`Decrease ${l.p!.name}`}>−</button>
                      <span aria-live="polite">{l.qty}</span>
                      <button onClick={() => setQty(l.id, l.qty + 1)} aria-label={`Increase ${l.p!.name}`}>+</button>
                      <button onClick={() => remove(l.id)} style={{ width: 'auto', padding: '0 10px' }} aria-label={`Remove ${l.p!.name}`}>Remove</button>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>{money(l.p!.price * l.qty)}</div>
                </li>
              ))}
            </ul>
            <p style={{ textAlign: 'right', fontSize: 18 }}><strong>Subtotal: {money(subtotal)}</strong></p>
            <p className="photo-note">No taxes or delivery fees — pickup only at Woodinville HS. Payment instructions come at checkout.</p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn btn-gold" onClick={() => { onClose(); router.push('/checkout'); }}>Proceed to checkout →</button>
              <button className="btn btn-outline" onClick={clear}>Clear cart</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
