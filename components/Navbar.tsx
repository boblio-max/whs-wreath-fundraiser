'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { SITE } from '@/lib/site';
import CartDrawer from './CartDrawer';
import { Bag, ToastHost } from './Reveal';

export default function Navbar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <>
      <div className="announce">
        Order by {SITE.orderDeadlineLabel} — Pickup Nov 21 at Woodinville High School
      </div>
      <nav className="nav" aria-label="Main navigation">
        <div className="nav-inner">
          <Link href="/" className="wordmark" aria-label="WHS Music Boosters home">
            <strong>WHS Music Boosters</strong>
            <span>Woodinville High School</span>
          </Link>
          <button className="menu-btn" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen(!open)}>
            {open ? 'Close' : 'Menu'}
          </button>
          <div className={`nav-links${open ? ' open' : ''}`}>
            <Link href="/#collection" onClick={() => setOpen(false)}>Collection</Link>
            <Link href="/#story" onClick={() => setOpen(false)}>Our Story</Link>
            <Link href="/#pickup" onClick={() => setOpen(false)}>Pickup</Link>
            <Link href="/#collection" className="shop-link" onClick={() => setOpen(false)}>Shop Wreaths</Link>
            <button className="bag-btn" onClick={() => setCartOpen(true)} aria-label={`Open bag, ${count} items`}>
              <Bag /> Bag{count > 0 && <span className="bag-count" key={count}>{count}</span>}
            </button>
          </div>
        </div>
      </nav>
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
      <ToastHost />
    </>
  );
}
