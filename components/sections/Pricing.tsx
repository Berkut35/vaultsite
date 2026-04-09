'use client';

import { motion } from 'framer-motion';
import { Check }  from 'lucide-react';
import { useLang } from '@/lib/i18n';

export function Pricing() {
  const { t } = useLang();
  const p = t.pricing;
  const institutionPlans: any[] = (p as any).institutionPlans ?? [];

  function renderCard(plan: any, i: number, indexOffset = 0) {
    const isAcademicBadge =
      plan.badge === 'Academic' || plan.badge === 'Akademik';
    const badgeStyle = isAcademicBadge
      ? { background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.30)', color: 'rgba(168,85,247,0.9)' }
      : { background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.30)', color: 'var(--accent-gold)' };

    const priceDisplay = plan.priceLabel
      ? plan.priceLabel
      : plan.price === '0'
        ? plan.name
        : `₺${plan.price}`;
    const showPeriod = plan.price !== '0' && !plan.priceLabel;

    return (
      <motion.div
        key={plan.name}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, delay: (i + indexOffset) * 0.1, ease: 'easeOut' }}
        style={{ position: 'relative' }}
      >
        {plan.badge && (
          <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', padding: '3px 14px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: '"DM Sans", sans-serif', whiteSpace: 'nowrap', zIndex: 1, ...badgeStyle }}>
            {plan.badge}
          </div>
        )}

        {plan.discountBadge && (
          <div style={{ position: 'absolute', top: 12, right: -12, padding: '4px 12px', borderRadius: '4px 4px 4px 4px', background: '#F43F5E', color: '#fff', fontSize: 12, fontWeight: 800, transform: 'rotate(5deg)', boxShadow: '0 4px 12px rgba(244,63,94,0.35)', zIndex: 5, letterSpacing: '0.02em' }}>
            {plan.discountBadge}
          </div>
        )}

        <div style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: '32px 28px', ...(plan.highlighted ? { borderTopColor: 'rgba(251,191,36,0.35)', borderTopWidth: 2, boxShadow: 'inset 0 1px 0 rgba(251,191,36,0.18)' } : {}) }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: plan.highlighted ? 'var(--accent-purple)' : 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 16, fontFamily: '"DM Sans", sans-serif' }}>
            {plan.name}
          </div>

          <div style={{ marginBottom: 6, display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
            {plan.oldPrice && (
              <span style={{ fontSize: 18, color: 'var(--text-muted)', textDecoration: 'line-through', fontFamily: '"DM Sans", sans-serif' }}>
                ₺{plan.oldPrice}
              </span>
            )}
            <span style={{ fontSize: 'clamp(36px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--text-primary)', fontFamily: '"DM Sans", sans-serif', lineHeight: 1 }}>
              {priceDisplay}
            </span>
            {showPeriod && (
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: '"DM Sans", sans-serif' }}>
                /{plan.period.replace('TRY/mo', 'mo').replace('TRY/ay', 'ay')}
              </span>
            )}
          </div>

          {plan.subNote && (
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 4, fontFamily: '"DM Sans", sans-serif' }}>{plan.subNote}</div>
          )}

          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.5, fontFamily: '"DM Sans", sans-serif', marginTop: 8 }}>
            {plan.description}
          </p>

          <a
            href={plan.ctaHref ?? '#'}
            aria-label={plan.ctaHref?.startsWith('mailto:') ? `${plan.cta} via email` : undefined}
            style={{ display: 'block', width: '100%', padding: '12px 20px', borderRadius: 10, textAlign: 'center', fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s ease', fontFamily: '"DM Sans", sans-serif', marginBottom: 28,
              ...(plan.ctaVariant === 'filled'
                ? { background: '#A855F7', color: '#fff', border: '1px solid transparent' }
                : { background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' })
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; if (plan.ctaVariant === 'filled') el.style.opacity = '0.85'; else el.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.opacity = '1'; el.style.background = plan.ctaVariant === 'filled' ? '#A855F7' : 'transparent'; }}
          >
            {plan.cta}
          </a>

          <div style={{ height: 1, background: 'var(--border-subtle)', marginBottom: 24 }} />

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {plan.features.map((f: string) => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--text-primary)', fontFamily: '"DM Sans", sans-serif' }}>
                <Check size={13} color="var(--accent-purple)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    );
  }

  return (
    <section id="pricing" style={{ padding: 'clamp(64px, 10vw, 128px) 24px' }} aria-labelledby="pricing-heading">
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55, ease: 'easeOut' }} style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 id="pricing-heading" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.035em', color: 'var(--text-primary)', lineHeight: 1.1, fontFamily: '"DM Sans", sans-serif', marginBottom: 12 }}>
            {p.title}
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', fontFamily: '"DM Sans", sans-serif' }}>{p.subtitle}</p>
        </motion.div>

        <div style={{ display: 'grid', gap: 24, alignItems: 'start', maxWidth: '900px', margin: '0 auto' }} className="grid grid-cols-1 md:grid-cols-2">
          {p.plans.map((plan, i) => renderCard(plan, i))}

          {institutionPlans.length > 0 && (
            <div className="col-span-1 md:col-span-2" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 0', marginTop: 8 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: '"DM Sans", sans-serif', whiteSpace: 'nowrap' }}>
                {(p as any).institutionsDivider}
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            </div>
          )}

          {institutionPlans.map((plan, i) => renderCard(plan, i, p.plans.length + 1))}
        </div>
      </div>
    </section>
  );
}
