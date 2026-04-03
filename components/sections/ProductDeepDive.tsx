'use client';

import { motion } from 'framer-motion';
import { Highlighter, Network, BookOpen } from 'lucide-react';
import { AppMockup } from '@/components/AppMockup';
import { useLang }     from '@/lib/i18n';

const ICONS = [Highlighter, Network, BookOpen];

export function ProductDeepDive() {
  const { t } = useLang();
  const p = t.productDeepDive;

  return (
    <section id="product" style={{ padding: 'clamp(64px, 10vw, 128px) 24px' }} aria-labelledby="product-heading">
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55, ease: 'easeOut' }} style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14, fontFamily: '"DM Sans", sans-serif' }}>
            {p.sectionBadge}
          </p>
          <h2 id="product-heading" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.035em', color: 'var(--text-primary)', lineHeight: 1.1, fontFamily: '"DM Sans", sans-serif' }}>
            {p.title}
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} style={{ marginBottom: 56 }}>
          <AppMockup />
        </motion.div>

        <div style={{ display: 'grid', gap: 16 }} className="grid grid-cols-1 md:grid-cols-3">
          {p.callouts.map((c, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
                style={{ padding: '28px 24px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}
              >
                <div style={{ width: 38, height: 38, borderRadius: 9, background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={16} color="var(--accent-purple)" />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 8, fontFamily: '"DM Sans", sans-serif' }}>{c.title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65, fontFamily: '"DM Sans", sans-serif' }}>{c.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
