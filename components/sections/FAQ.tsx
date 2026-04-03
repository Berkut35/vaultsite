'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export function FAQ() {
  const { t } = useLang();
  const f = t.faq;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" style={{ padding: 'clamp(64px, 10vw, 128px) 24px' }} aria-labelledby="faq-heading" itemScope itemType="https://schema.org/FAQPage">
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55, ease: 'easeOut' }} style={{ marginBottom: 48 }}>
          <h2 id="faq-heading" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.035em', color: 'var(--text-primary)', lineHeight: 1.1, fontFamily: '"DM Sans", sans-serif', marginBottom: 12 }}>
            {f.title}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', fontFamily: '"DM Sans", sans-serif' }}>{f.subtitle}</p>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {f.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: 'easeOut' }}
                itemScope itemType="https://schema.org/Question"
                style={{ borderRadius: 10, borderLeft: isOpen ? '2px solid var(--accent-purple)' : '2px solid transparent', transition: 'border-color 0.3s ease', overflow: 'hidden' }}
              >
                <button onClick={() => setOpenIndex(isOpen ? null : i)} aria-expanded={isOpen}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 20px', background: isOpen ? 'rgba(168,85,247,0.04)' : 'rgba(255,255,255,0.02)', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s ease' }}
                  onMouseEnter={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}
                >
                  <span itemProp="name" style={{ fontSize: 15, fontWeight: isOpen ? 600 : 400, color: isOpen ? 'var(--text-primary)' : 'rgba(240,240,240,0.85)', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.5, transition: 'font-weight 0.2s ease, color 0.2s ease' }}>
                    {item.q}
                  </span>
                  <span style={{ flexShrink: 0, color: isOpen ? 'var(--accent-purple)' : 'var(--text-muted)', transition: 'color 0.2s ease' }}>
                    {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }} itemScope itemType="https://schema.org/Answer"
                    >
                      <div itemProp="text" style={{ padding: '0 20px 20px 20px', background: 'rgba(168,85,247,0.04)' }}>
                        <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.7, fontFamily: '"DM Sans", sans-serif' }}>
                          {item.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
