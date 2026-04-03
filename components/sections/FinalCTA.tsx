'use client';

import { motion } from 'framer-motion';
import { MagneticButton }  from '@/components/ui/MagneticButton';
import { DownloadButton }  from '@/components/ui/DownloadButton';
import { useLang }         from '@/lib/i18n';

export function FinalCTA() {
  const { t } = useLang();
  const c = t.finalCta;

  return (
    <section id="cta" style={{ padding: 'clamp(80px, 12vw, 160px) 24px', background: '#0d0d0d', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', position: 'relative', overflow: 'hidden' }} aria-labelledby="cta-heading">
      <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 24, fontFamily: '"DM Sans", sans-serif' }}
        >
          {c.eyebrow}
        </motion.p>

        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ width: 40, height: 1, background: 'rgba(251,191,36,0.5)', margin: '0 auto 28px', transformOrigin: 'center' }} aria-hidden="true"
        />

        <motion.h2 id="cta-heading" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55, delay: 0.08, ease: 'easeOut' }}
          style={{ fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--text-primary)', lineHeight: 1.06, marginBottom: 20, fontFamily: '"DM Sans", sans-serif', whiteSpace: 'pre-line' }}
        >
          {c.title}
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, delay: 0.16, ease: 'easeOut' }}
          style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 40, fontFamily: '"DM Sans", sans-serif' }}
        >
          {c.subtitle}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, delay: 0.22, ease: 'easeOut' }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}
        >
          <DownloadButton
            style={{ padding: '14px 32px', borderRadius: 999, background: '#A855F7', color: '#fff', fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', fontFamily: '"DM Sans", sans-serif', boxShadow: '0 4px 24px rgba(168,85,247,0.20)' }}
          >
            {c.primaryBtn}
          </DownloadButton>

          <a href={process.env.NEXT_PUBLIC_DOWNLOAD_URL ?? '#'}
            style={{ padding: '14px 28px', borderRadius: 999, color: 'var(--text-secondary)', fontSize: 15, fontWeight: 400, textDecoration: 'none', border: '1px solid var(--border-subtle)', fontFamily: '"DM Sans", sans-serif', transition: 'color 0.2s ease, border-color 0.2s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)'; }}
          >
            {c.secondaryBtn}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
