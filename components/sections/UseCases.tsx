'use client';

import { motion } from 'framer-motion';
import { FlaskConical, GraduationCap, Building2, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { useLang }   from '@/lib/i18n';

const ICONS = [FlaskConical, GraduationCap, Building2];

export function UseCases() {
  const { t } = useLang();
  const u = t.useCases;

  return (
    <section id="use-cases" style={{ padding: 'clamp(64px, 10vw, 128px) 24px' }} aria-labelledby="use-cases-heading">
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55, ease: 'easeOut' }} style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14, fontFamily: '"DM Sans", sans-serif' }}>
            {u.sectionBadge}
          </p>
          <h2 id="use-cases-heading" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.035em', color: 'var(--text-primary)', lineHeight: 1.1, fontFamily: '"DM Sans", sans-serif' }}>
            {u.title}
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gap: 16 }} className="grid grid-cols-1 md:grid-cols-3">
          {u.items.map((c, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div key={c.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55, delay: i * 0.1, ease: 'easeOut' }}>
                <GlassCard as="article"
                  style={{ padding: '32px 28px', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s ease, border-color 0.3s ease' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,85,247,0.20)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)'; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <Icon size={18} color="var(--accent-purple)" />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: 12, fontFamily: '"DM Sans", sans-serif' }}>
                    {c.title}
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, flex: 1, fontFamily: '"DM Sans", sans-serif', marginBottom: 20 }}>
                    {c.description}
                  </p>
                  <a href="#pricing"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s ease', fontFamily: '"DM Sans", sans-serif' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-primary)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)')}
                  >
                    {u.learnMore} <ArrowRight size={12} />
                  </a>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
