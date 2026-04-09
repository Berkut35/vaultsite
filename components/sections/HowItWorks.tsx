'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Upload, Highlighter, Network, Share2 } from 'lucide-react';
import { useLang } from '@/lib/i18n';

const ICONS = [Upload, Highlighter, Network, Share2];

export function HowItWorks() {
  const { t } = useLang();
  const h = t.howItWorks;

  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section ref={sectionRef} id="how-it-works" style={{ padding: 'clamp(64px, 10vw, 128px) 24px' }} aria-labelledby="how-it-works-heading">
      <style dangerouslySetInnerHTML={{ __html: `
  @keyframes badgePulse {
    0%   { box-shadow: 0 0 0 0 rgba(168,85,247,0.45); }
    70%  { box-shadow: 0 0 0 10px rgba(168,85,247,0); }
    100% { box-shadow: 0 0 0 0 rgba(168,85,247,0); }
  }
  @media (prefers-reduced-motion: reduce) {
    @keyframes badgePulse {
      0%, 100% { box-shadow: none; }
    }
  }
`}} />
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55, ease: 'easeOut' }} style={{ textAlign: 'center', marginBottom: 72 }}>
          <h2 id="how-it-works-heading" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.035em', color: 'var(--text-primary)', lineHeight: 1.1, fontFamily: '"DM Sans", sans-serif' }}>
            {h.title}
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gap: 0, position: 'relative' }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {/* Animasyonlu bağlantı çizgisi — yalnızca lg ekranlarda */}
          <motion.div
            className="hidden lg:block"
            style={{
              position: 'absolute',
              top: 22,
              left: '12.5%',
              right: '12.5%',
              height: 1,
              background: 'rgba(168,85,247,0.30)',
              transformOrigin: 'left',
              zIndex: 0,
            }}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
          />

          {h.steps.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div key={step.number}
                initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={`p-8 relative border-[var(--border-subtle)] ${i !== h.steps.length - 1 ? 'border-b lg:border-b-0 lg:border-r' : ''}`}
              >
                <div aria-hidden="true" style={{ position: 'absolute', top: 24, right: 24, fontSize: 80, fontWeight: 800, color: 'var(--accent-gold)', opacity: 0.07, lineHeight: 1, letterSpacing: '-0.06em', fontFamily: '"DM Sans", sans-serif', userSelect: 'none', pointerEvents: 'none' }}>
                  {step.number}
                </div>
                {/* Badge — pulse animasyonu ile */}
                <div style={{
                  width: 44, height: 44, borderRadius: 11,
                  background: 'rgba(168,85,247,0.08)',
                  border: '1px solid rgba(168,85,247,0.16)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                  animation: inView ? `badgePulse 0.6s ease-out ${0.4 + i * 0.15}s 1` : 'none',
                }}>
                  <Icon size={18} color="var(--accent-purple)" />
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, fontFamily: '"DM Sans", sans-serif' }}>
                  Step {step.number}
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: 12, fontFamily: '"DM Sans", sans-serif' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.65, fontFamily: '"DM Sans", sans-serif' }}>
                  {step.description}
                </p>
                {i < h.steps.length - 1 && (
                  <motion.div
                    className="hidden lg:flex"
                    aria-hidden="true"
                    style={{ position: 'absolute', right: -14, top: '50%', transform: 'translateY(-50%)', zIndex: 1, width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-surface)', border: '1px solid rgba(251,191,36,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(251,191,36,0.6)', fontSize: 12 }}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.35, delay: 0.5 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  >
                    →
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
