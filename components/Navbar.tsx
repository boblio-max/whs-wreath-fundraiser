'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <nav className="nav" aria-label="Main navigation">
      <div className="nav-inner">
        <Link href="/" className="brand" aria-label="WHS Music Boosters home">
          <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="15" fill="none" stroke="#1d3a28" strokeWidth="5" />
            <circle cx="20" cy="20" r="15" fill="none" stroke="#2f5d3a" strokeWidth="2" strokeDasharray="4 3" />
            <circle cx="20" cy="5.5" r="3.4" fill="#8c2f2f" />
            <path d="M20 8.9l-2.4 4.6 4.8 1z" fill="#b98a2f" />
          </svg>
          <span>
            WHS Music Boosters
            <span style={{ display: 'block', fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: '#8a6d2b' }}>
              WOODINVILLE HIGH SCHOOL
            </span>
          </span>
        </Link>
        <button className="menu-btn" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          ☰
        </button>
        <div className={`nav-links${open ? ' open' : ''}`}>
          <Link href="/" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/#shop" onClick={() => setOpen(false)}>Shop Wreaths</Link>
          <Link href="/#mission" onClick={() => setOpen(false)}>Our Mission</Link>
          <Link href="/#ordering" onClick={() => setOpen(false)}>Ordering Info</Link>
          <Link href="/#shop" className="btn btn-gold" style={{ padding: '10px 20px', fontSize: 15 }} onClick={() => setOpen(false)}>
            Shop Wreaths
          </Link>
          <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${count} items`}>
            🧺 Cart{count > 0 && <span className="cart-count">{count}</span>}
          </button>
        </div>
      </div>
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </nav>
  );
}
