'use client';

import { useEffect, useRef, useState } from 'react';

export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`rv${inView ? ' in' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export function Arrow() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
      <path d="M0 6h14M10 1.5L14.5 6 10 10.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function Bag() {
  return (
    <svg width="15" height="17" viewBox="0 0 15 17" fill="none" aria-hidden="true">
      <path d="M2.5 5.5h10l-.8 10H3.3l-.8-10z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 5.5V4a2.5 2.5 0 015 0v1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
