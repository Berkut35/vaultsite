'use client';

import { motion } from 'framer-motion';
import { Network, FileText, Link2, Quote, Users, WifiOff } from 'lucide-react';
import { BentoCard } from '@/components/ui/BentoCard';
import { useLang }   from '@/lib/i18n';

const ICONS = [Network, FileText, Link2, Quote, Users, WifiOff];

function KnowledgeGraph() {
  return (
    <svg viewBox="0 0 320 140" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', maxWidth: 320, display: 'block' }}
      aria-label="Knowledge graph visualization"
    >
      <line x1="90" y1="70" x2="160" y2="38" stroke="rgba(168,85,247,0.28)" strokeWidth="1" strokeDasharray="4 4"><animate attributeName="stroke-dashoffset" values="8;0" dur="1.8s" repeatCount="indefinite" /></line>
      <line x1="160" y1="38" x2="230" y2="70" stroke="rgba(168,85,247,0.28)" strokeWidth="1" strokeDasharray="4 4"><animate attributeName="stroke-dashoffset" values="8;0" dur="1.8s" repeatCount="indefinite" begin="0.4s" /></line>
      <line x1="90" y1="70" x2="160" y2="102" stroke="rgba(251,191,36,0.22)" strokeWidth="1" strokeDasharray="4 4"><animate attributeName="stroke-dashoffset" values="8;0" dur="1.8s" repeatCount="indefinite" begin="0.8s" /></line>
      <line x1="230" y1="70" x2="160" y2="102" stroke="rgba(251,191,36,0.22)" strokeWidth="1" strokeDasharray="4 4"><animate attributeName="stroke-dashoffset" values="8;0" dur="1.8s" repeatCount="indefinite" begin="1.2s" /></line>
      <line x1="160" y1="102" x2="260" y2="110" stroke="rgba(168,85,247,0.15)" strokeWidth="1" />
      <line x1="90" y1="70" x2="50" y2="100" stroke="rgba(168,85,247,0.15)" strokeWidth="1" />
      <line x1="160" y1="38" x2="120" y2="18" stroke="rgba(168,85,247,0.12)" strokeWidth="1" />
      <circle cx="160" cy="38" r="8" fill="#A855F7" opacity="0.9"><animate attributeName="r" values="8;10;8" dur="3.5s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.9;1;0.9" dur="3.5s" repeatCount="indefinite" /></circle>
      <circle cx="90" cy="70" r="6" fill="rgba(168,85,247,0.75)"><animate attributeName="r" values="6;7.5;6" dur="3s" repeatCount="indefinite" begin="0.6s" /></circle>
      <circle cx="230" cy="70" r="6" fill="rgba(168,85,247,0.7)"><animate attributeName="r" values="6;7.5;6" dur="2.8s" repeatCount="indefinite" begin="1s" /></circle>
      <circle cx="160" cy="102" r="5" fill="rgba(251,191,36,0.75)"><animate attributeName="r" values="5;6.5;5" dur="3.2s" repeatCount="indefinite" begin="1.4s" /></circle>
      <circle cx="260" cy="110" r="4" fill="rgba(168,85,247,0.45)" />
      <circle cx="50" cy="100" r="3.5" fill="rgba(168,85,247,0.40)" />
      <circle cx="120" cy="18" r="3" fill="rgba(168,85,247,0.30)" />
      <text x="160" y="27" fontSize="8" fill="rgba(255,255,255,0.55)" textAnchor="middle" fontFamily="DM Sans, sans-serif">Power</text>
      <text x="90" y="60" fontSize="8" fill="rgba(255,255,255,0.45)" textAnchor="middle" fontFamily="DM Sans, sans-serif">Foucault</text>
      <text x="230" y="60" fontSize="8" fill="rgba(255,255,255,0.45)" textAnchor="middle" fontFamily="DM Sans, sans-serif">Agency</text>
      <text x="160" y="117" fontSize="8" fill="rgba(251,191,36,0.7)" textAnchor="middle" fontFamily="DM Sans, sans-serif">Discourse</text>
    </svg>
  );
}

function IconBadge({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(168,85,247,0.10)', border: '1px solid rgba(168,85,247,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, flexShrink: 0 }}>
      <Icon size={16} color="var(--accent-purple)" />
    </div>
  );
}

const CARD_BASE = { padding: 28, height: '100%', display: 'flex', flexDirection: 'column' as const };

export function Features() {
  const { t } = useLang();
  const f = t.features;
  const items = f.items;

  return (
    <section id="features" style={{ padding: 'clamp(64px, 10vw, 128px) 24px' }} aria-labelledby="features-heading">
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55, ease: 'easeOut' }} style={{ marginBottom: 56, maxWidth: 560 }}>
          <p style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14, fontFamily: '"DM Sans", sans-serif' }}>
            {f.sectionBadge}
          </p>
          <h2 id="features-heading" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, letterSpacing: '-0.035em', color: 'var(--text-primary)', lineHeight: 1.08, marginBottom: 16, fontFamily: '"DM Sans", sans-serif' }}>
            {f.title}
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6, fontFamily: '"DM Sans", sans-serif' }}>
            {f.subtitle}
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 12 }}>
          {/* Card 1 — Large */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55, ease: 'easeOut', delay: 0 }}
            style={{ gridColumn: 'span 12' }} className="lg:col-span-7 lg:row-span-2"
          >
            <BentoCard style={{ ...CARD_BASE, minHeight: 280 }}>
              <IconBadge icon={ICONS[0]} />
              <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: 10, fontFamily: '"DM Sans", sans-serif' }}>{items[0].title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 28, fontFamily: '"DM Sans", sans-serif' }}>{items[0].description}</p>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}><KnowledgeGraph /></div>
            </BentoCard>
          </motion.div>

          {/* Card 2 */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55, ease: 'easeOut', delay: 0.06 }}
            style={{ gridColumn: 'span 12' }} className="lg:col-span-5"
          >
            <BentoCard style={{ ...CARD_BASE, minHeight: 200 }}>
              <IconBadge icon={ICONS[1]} />
              <h3 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: 8, fontFamily: '"DM Sans", sans-serif' }}>{items[1].title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, fontFamily: '"DM Sans", sans-serif' }}>{items[1].description}</p>
              <div style={{ marginTop: 16, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['PDF', 'EPUB', 'DOCX', 'TXT'].map(fmt => (
                  <span key={fmt} style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, color: 'rgba(168,85,247,0.85)', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)', fontFamily: '"DM Sans", sans-serif', letterSpacing: '0.03em' }}>{fmt}</span>
                ))}
              </div>
            </BentoCard>
          </motion.div>

          {/* Card 3 */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
            style={{ gridColumn: 'span 12' }} className="lg:col-span-5"
          >
            <BentoCard style={{ ...CARD_BASE, minHeight: 200 }}>
              <IconBadge icon={ICONS[2]} />
              <h3 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: 8, fontFamily: '"DM Sans", sans-serif' }}>{items[2].title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, fontFamily: '"DM Sans", sans-serif' }}>{items[2].description}</p>
              <div style={{ marginTop: 18, padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-purple)' }} />
                <div style={{ height: 1, flex: 1, background: 'rgba(168,85,247,0.25)' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(251,191,36,0.7)' }} />
              </div>
            </BentoCard>
          </motion.div>

          {/* Cards 4-6 */}
          {[items[3], items[4], items[5]].map((item, i) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.55, ease: 'easeOut', delay: 0.14 + i * 0.04 }}
              style={{ gridColumn: 'span 12' }} className="lg:col-span-4"
            >
              <BentoCard style={{ ...CARD_BASE }}>
                <IconBadge icon={ICONS[3 + i]} />
                <h3 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: 8, fontFamily: '"DM Sans", sans-serif' }}>{item.title}</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6, fontFamily: '"DM Sans", sans-serif' }}>{item.description}</p>
                {i === 0 && (
                  <div style={{ marginTop: 14, display: 'flex', gap: 6 }}>
                    {['Chicago', 'APA', 'MLA'].map(fmt => (
                      <span key={fmt} style={{ padding: '2px 9px', borderRadius: 4, fontSize: 10.5, fontWeight: 600, color: 'rgba(251,191,36,0.8)', background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.14)', fontFamily: '"DM Sans", sans-serif' }}>{fmt}</span>
                    ))}
                  </div>
                )}
              </BentoCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
