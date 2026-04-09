'use client';

import { useState, useEffect } from 'react';

export function AmbientBackground() {
  const [scrollY, setScrollY] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const motionHandler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', motionHandler);
    let rafId = 0;
    const scrollHandler = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      mq.removeEventListener('change', motionHandler);
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  const orb1Y = reducedMotion ? 0 : scrollY * -0.10;
  const orb2Y = reducedMotion ? 0 : scrollY * 0.08;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Orb 1 — mor, sol üst (hero arkası) */}
      <div style={{
        position: 'absolute',
        width: 700,
        height: 700,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.10), transparent 70%)',
        filter: 'blur(80px)',
        left: '-15%',
        top: '-10%',
        transform: `translateY(${orb1Y}px)`,
        willChange: reducedMotion ? 'auto' : 'transform',
      }} />
      {/* Orb 2 — altın, sağ orta (features arkası) */}
      <div style={{
        position: 'absolute',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(251,191,36,0.07), transparent 70%)',
        filter: 'blur(80px)',
        right: '-5%',
        top: '40%',
        transform: `translateY(${orb2Y}px)`,
        willChange: reducedMotion ? 'auto' : 'transform',
      }} />
      {/* Orb 3 — indigo, orta-alt (CTA arkası), sabit */}
      <div style={{
        position: 'absolute',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)',
        filter: 'blur(80px)',
        left: '30%',
        bottom: '-5%',
      }} />
    </div>
  );
}
