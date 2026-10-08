'use client';

import { useState } from 'react';
import type { Product } from '@/lib/products';
import { money } from '@/lib/products';
import { useCart } from '@/lib/cart';

export function ProductCard({ product, onDetails }: { product: Product; onDetails: (p: Product) => void }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <article className="card product-card">
      <img src={product.image} alt={`${product.name} — festive illustration (representative, not the actual handcrafted wreath)`} loading="lazy" />
      <div className="product-body">
        <h3 style={{ fontSize: 19 }}>{product.name}</h3>
        <div className="price">{money(product.price)}</div>
        <p style={{ fontSize: 14, color: 'var(--muted)', margin: 0 }}>{product.description}</p>
        <p className="photo-note">🎄 Representative illustration — your handcrafted noble fir wreath will vary naturally. Real photos coming soon.</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto', flexWrap: 'wrap' }}>
          <button className="btn btn-outline" style={{ padding: '10px 16px', fontSize: 14 }} onClick={() => onDetails(product)}>
            View Details
          </button>
          <button
            className="btn btn-pine"
            style={{ padding: '10px 16px', fontSize: 14 }}
            onClick={() => { add(product.id, 1); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
            aria-live="polite"
          >
            {added ? '✓ Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { add } = useCart();
  const [qty, setQtyLocal] = useState(1);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-label={product.name} onClick={(e) => e.stopPropagation()}>
        <img src={product.image} alt={`${product.name} illustration`} />
        <div className="modal-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <h2 style={{ margin: 0 }}>{product.name}</h2>
            <button onClick={onClose} aria-label="Close details" style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>✕</button>
          </div>
          <div className="price">{money(product.price)} <span style={{ fontSize: 14, color: 'var(--muted)', fontFamily: 'var(--sans)' }}>• {product.size}</span></div>
          <p>{product.description}</p>
          <ul>
            {product.details.map((d) => <li key={d}>{d}</li>)}
          </ul>
          <p className="photo-note">Handcrafted with fresh noble fir, incense cedar & juniper, finished with natural pine cones. Bows sold separately.</p>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginTop: 12 }}>
            <div className="qty">
              <button onClick={() => setQtyLocal(Math.max(1, qty - 1))} aria-label="Decrease quantity">−</button>
              <span>{qty}</span>
              <button onClick={() => setQtyLocal(Math.min(25, qty + 1))} aria-label="Increase quantity">+</button>
            </div>
            <button className="btn btn-gold" onClick={() => { add(product.id, qty); onClose(); }}>
              Add {qty} to Cart — {money(product.price * qty)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
