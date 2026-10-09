'use client';

import { useEffect, useRef, useState } from 'react';

export function notifyToast(message: string) {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('whs:toast', { detail: message }));
}

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

export function Stat({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const run = () => {
      if (started.current) return;
      started.current = true;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setN(value);
        return;
      }
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / 1100);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (typeof IntersectionObserver === 'undefined') {
      run();
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          run();
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref}>
      <strong>
        {n}
        {suffix}
      </strong>
      <span>{label}</span>
    </div>
  );
}

export function ToastHost() {
  const [items, setItems] = useState<{ id: number; text: string; out: boolean }[]>([]);

  useEffect(() => {
    let id = 0;
    const onToast = (e: Event) => {
      const text = (e as CustomEvent<string>).detail;
      const cur = ++id;
      setItems((prev) => [...prev.slice(-2), { id: cur, text, out: false }]);
      setTimeout(() => {
        setItems((prev) => prev.map((t) => (t.id === cur ? { ...t, out: true } : t)));
        setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== cur)), 300);
      }, 2600);
    };
    window.addEventListener('whs:toast', onToast);
    return () => window.removeEventListener('whs:toast', onToast);
  }, []);

  return (
    <div className="toast-host" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`toast${t.out ? ' out' : ''}`}>
          {t.text}
        </div>
      ))}
    </div>
  );
}
