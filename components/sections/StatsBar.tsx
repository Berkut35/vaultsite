'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLang } from '@/lib/i18n';

const VALUES = [50, 10, 6, 100];

function CountUp({ end, suffix, inView }: { end: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    function tick(now: number) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, end]);
  return <span>{count}{suffix}</span>;
}

export function StatsBar() {
  const { t } = useLang();
  const items = t.stats.items;
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} aria-label="Platform statistics">
      <div style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '32px 24px' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'grid', gap: 0 }} className="grid grid-cols-2 md:grid-cols-4">
          {items.map((stat, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
              style={{ textAlign: 'center', padding: '16px 24px', borderRight: i < items.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
            >
              <div style={{ fontSize: 'clamp(28px, 3vw, 36px)', fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--accent-gold)', lineHeight: 1, marginBottom: 6, fontFamily: '"DM Sans", sans-serif' }}>
                <CountUp end={VALUES[i]} suffix={stat.suffix} inView={inView} />
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: '"DM Sans", sans-serif', fontWeight: 400 }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
