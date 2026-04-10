'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import type { TestimonialItem } from '@/lib/i18n';

export function Testimonials() {
  const { t } = useLang();
  const items = t.testimonials.items as unknown as TestimonialItem[];

  return (
    <section id="testimonials" style={{ padding: 'clamp(64px, 10vw, 128px) 24px' }} aria-labelledby="testimonials-heading">
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55, ease: 'easeOut' }} style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 id="testimonials-heading" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.035em', color: 'var(--text-primary)', lineHeight: 1.1, fontFamily: '"DM Sans", sans-serif' }}>
            {t.testimonials.title}
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gap: 16 }} className="grid grid-cols-1 md:grid-cols-3">
          {items.map((item, i) => {
            const isFeatured = item.featured === true;
            return (
              <motion.article
                key={item.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: 'easeOut' }}
                className={isFeatured ? 'col-span-1 md:col-span-3' : undefined}
                style={{
                  background:          isFeatured ? 'rgba(168,85,247,0.05)' : 'rgba(255,255,255,0.02)',
                  backdropFilter:      'blur(20px)',
                  WebkitBackdropFilter:'blur(20px)',
                  borderTop:           '1px solid var(--border-subtle)',
                  borderRight:         '1px solid var(--border-subtle)',
                  borderBottom:        '1px solid var(--border-subtle)',
                  borderLeft:          isFeatured ? '3px solid rgba(168,85,247,0.45)' : '1px solid var(--border-subtle)',
                  borderRadius:        16,
                  padding:             '32px 28px',
                  display:             'flex',
                  flexDirection:       'column',
                  gap:                 24,
                }}
              >
                <div style={{ color: 'var(--accent-gold)', fontSize: 13, letterSpacing: '0.05em' }} aria-label="5 stars">★★★★★</div>
                <blockquote style={{ fontSize: isFeatured ? 16.5 : 15.5, lineHeight: 1.72, color: 'rgba(240,240,240,0.82)', flex: 1, fontFamily: '"DM Serif Display", serif', fontStyle: 'italic', margin: 0 }}>
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div aria-hidden="true" style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'rgba(168,85,247,0.9)', fontFamily: '"DM Sans", sans-serif', flexShrink: 0, overflow: 'hidden' }}>
                    {item.avatar ? (
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        width={38}
                        height={38}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      item.initials
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', fontFamily: '"DM Sans", sans-serif', marginBottom: 2 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.4 }}>
                      {item.role}<br />{item.institution}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
