'use client';

import { useState } from 'react';
import type { Product } from '@/lib/products';
import { money } from '@/lib/products';
import { useCart } from '@/lib/cart';
import { Arrow, Reveal } from './Reveal';

export function ProductRow({
  product,
  index,
  onDetails
}: {
  product: Product;
  index: number;
  onDetails: (p: Product) => void;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const num = String(index + 1).padStart(2, '0');
  return (
    <Reveal>
      <article className="prow">
        <div className="pnum" aria-hidden="true">{num}</div>
        <button
          className="pimg"
          onClick={() => onDetails(product)}
          aria-label={`View details for ${product.name}`}
          style={{ border: 'none', padding: 0, cursor: 'pointer', background: 'none' }}
        >
          <img src={product.image} alt={product.alt} loading="lazy" />
        </button>
        <div className="pinfo">
          <p className="psize">{product.size}</p>
          <h3>
            <button onClick={() => onDetails(product)}>{product.name.replace(/ — .*$/, '')}</button>
          </h3>
          <p className="pdesc">{product.description}</p>
          <p className="pcap">Representative photo — each piece is handcrafted fresh and varies naturally.</p>
        </div>
        <div className="pbuy">
          <div className="price">{money(product.price)}</div>
          <div className="pactions">
            <button className="mini-btn" onClick={() => onDetails(product)}>Details</button>
            <button
              className="mini-btn solid"
              aria-live="polite"
              onClick={() => {
                add(product.id, 1);
                setAdded(true);
                setTimeout(() => setAdded(false), 1600);
              }}
            >
              {added ? 'Added ✓' : 'Add to bag'}
            </button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { add } = useCart();
  const [qty, setQtyLocal] = useState(1);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={product.name} onClick={(e) => e.stopPropagation()}>
        <img className="top" src={product.image} alt={product.alt} />
        <div className="modal-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'flex-start' }}>
            <div>
              <p className="psize" style={{ marginBottom: 6 }}>{product.size}</p>
              <h2 style={{ fontSize: 'clamp(28px,4vw,40px)' }}>{product.name}</h2>
            </div>
            <button onClick={onClose} aria-label="Close details" style={{ background: 'none', border: '1px solid var(--hair)', borderRadius: 2, width: 40, height: 40, cursor: 'pointer', fontSize: 17 }}>✕</button>
          </div>
          <div className="price" style={{ margin: '6px 0 12px' }}>{money(product.price)}</div>
          <p style={{ color: 'var(--muted)' }}>{product.description}</p>
          <ul style={{ paddingLeft: 20, margin: '0 0 8px', color: 'var(--muted)', fontSize: 15 }}>
            {product.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className="pcap">Handcrafted with fresh noble fir, incense cedar and juniper, finished with natural pine cones. Bows sold separately.</p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginTop: 18 }}>
            <div className="qty">
              <button onClick={() => setQtyLocal(Math.max(1, qty - 1))} aria-label="Decrease quantity">−</button>
              <span aria-live="polite">{qty}</span>
              <button onClick={() => setQtyLocal(Math.min(25, qty + 1))} aria-label="Increase quantity">+</button>
            </div>
            <button className="btn btn-pine" style={{ padding: '15px 24px' }} onClick={() => { add(product.id, qty); onClose(); }}>
              Add {qty} to bag — {money(product.price * qty)} <Arrow />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
