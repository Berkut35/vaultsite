'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MagneticButton }  from '@/components/ui/MagneticButton';
import { DownloadButton }  from '@/components/ui/DownloadButton';
import { AppMockup } from '@/components/AppMockup';
import { useLang }        from '@/lib/i18n';

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const wordVar = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  const { t } = useLang();
  const h = t.hero;

  return (
    <section id="hero" style={{ paddingTop: 'clamp(100px, 18vh, 160px)', paddingBottom: 'clamp(80px, 12vh, 140px)', paddingLeft: 24, paddingRight: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <div style={{ display: 'grid', gap: 64, alignItems: 'center' }} className="lg:grid-cols-[60fr_40fr]">

          {/* Left */}
          <div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} style={{ marginBottom: 28 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 14px', borderRadius: 999, border: '1px solid rgba(168,85,247,0.3)', fontSize: 12, fontWeight: 500, color: 'rgba(168,85,247,0.9)', letterSpacing: '0.03em', fontFamily: '"DM Sans", sans-serif', background: 'rgba(168,85,247,0.05)' }}>
                {h.eyebrow}
              </span>
            </motion.div>

            <motion.h1 variants={container} initial="hidden" animate="visible"
              style={{ fontSize: 'clamp(48px, 6.5vw, 72px)', fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.04em', marginBottom: 24, fontFamily: '"DM Sans", sans-serif' }}
            >
              <span style={{ display: 'block' }}>
                {h.line1.split(' ').map(word => (
                  <motion.span key={word} variants={wordVar} style={{ display: 'inline-block', marginRight: '0.28em', color: 'var(--text-primary)' }}>
                    {word}
                  </motion.span>
                ))}
              </span>
              <span style={{ display: 'block' }}>
                {h.line2.split(' ').map(word => (
                  <motion.span key={word} variants={wordVar} style={{ display: 'inline-block', marginRight: '0.28em', color: 'var(--accent-purple)' }}>
                    {word}
                  </motion.span>
                ))}
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.38, ease: 'easeOut' }}
              style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: 460, marginBottom: 36, fontFamily: '"DM Sans", sans-serif', fontWeight: 400 }}
            >
              {h.subtitle}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
              style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}
            >
              <DownloadButton
                style={{ padding: '13px 28px', borderRadius: 999, background: '#A855F7', color: '#fff', fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', fontFamily: '"DM Sans", sans-serif', boxShadow: '0 4px 24px rgba(168,85,247,0.22)' }}
              >
                {h.primaryCta}
              </DownloadButton>

              <a href="#how-it-works"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '13px 20px', borderRadius: 999, color: 'var(--text-secondary)', fontSize: 15, fontWeight: 400, textDecoration: 'none', fontFamily: '"DM Sans", sans-serif', border: '1px solid var(--border-subtle)', transition: 'color 0.2s ease, border-color 0.2s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)'; }}
              >
                {h.secondaryCta}
                <ArrowRight size={14} />
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.65 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', gap: 2, color: '#FBBF24' }} aria-label="5 stars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ filter: 'drop-shadow(0 0 4px rgba(251,191,36,0.2))' }}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.87L12 17.77l-6.18 3.24L7 14.14l-5-4.87 6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <span style={{ fontSize: 13, color: '#666', fontWeight: 500, fontFamily: '"DM Sans", sans-serif' }}>
                  {h.socialProof}
                </span>
              </div>

              {/* Focused Institutional Trust Ribbon with Original Logos & Gradient Overlays */}
              <div style={{ position: 'relative', maxWidth: '540px', overflow: 'hidden', padding: '20px 0', marginTop: 8 }}>
                {/* Lateral masking gradients for smooth marquee transitions */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: 80, height: '100%', background: 'linear-gradient(to right, rgb(10,10,10), transparent)', zIndex: 10 }} />
                <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: '100%', background: 'linear-gradient(to left, rgb(10,10,10), transparent)', zIndex: 10 }} />
                
                <div className="marquee-content" style={{ display: 'flex', alignItems: 'center', gap: 54, whiteSpace: 'nowrap' }}>
                  {[...Array(3)].map((_, groupIdx) => (
                    <div key={groupIdx} style={{ display: 'flex', alignItems: 'center', gap: 54 }}>
                      {[
                        { name: 'Stanford', src: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Stanford_University_seal_2003.svg' },
                        { name: 'Harvard',  src: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Harvard_University_logo.svg' },
                        { name: 'MIT',      src: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg' },
                        { name: 'Cambridge',src: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Coat_of_Arms_of_the_University_of_Cambridge.svg' },
                        { name: 'Oxford',   src: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Oxford-University-Circlet.svg' },
                        { name: 'ETH',      src: 'https://upload.wikimedia.org/wikipedia/commons/9/99/ETH_Z%C3%BCrich_Logo.svg' },
                        { name: 'Tsinghua', src: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Tsinghua_University_Logo.svg' },
                        { name: 'METU',     src: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Middle_East_Technical_University_Logo.svg' },
                        { name: 'ITU',      src: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Istanbul_Technical_University_Logo.svg' },
                        { name: 'UTokyo',   src: 'https://upload.wikimedia.org/wikipedia/commons/2/25/The_University_of_Tokyo_Logo.svg' }
                      ].map((univ, idx) => (
                        <div key={`${groupIdx}-${idx}`} className="logo-gradient-box" style={{ 
                          position: 'relative', 
                          height: 28, 
                          width: 'auto',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <img 
                            src={univ.src} 
                            alt={univ.name} 
                            style={{ 
                              height: '100%', 
                              width: 'auto', 
                              filter: 'grayscale(1) brightness(0) invert(1)',
                              opacity: 0.45,
                              objectFit: 'contain'
                            }} 
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — MacOS window */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes heroFloat {
              0%, 100% { transform: translateY(0px) rotate(1deg); }
              50% { transform: translateY(-16px) rotate(1deg); }
            }
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-33.333%); }
            }
            .hero-float-anim {
              animation: heroFloat 6s ease-in-out infinite;
              will-change: transform;
            }
            .marquee-content {
              animation: marquee 46s linear infinite;
              width: fit-content;
            }
            .marquee-content:hover {
              animation-play-state: paused;
            }
            .logo-gradient-box::after {
              content: '';
              position: absolute;
              inset: 0;
              background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.6));
              pointer-events: none;
              mix-blend-mode: multiply;
              opacity: 0.8;
            }
          `}} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="mt-16 lg:mt-0 w-full max-w-[860px] mx-auto">
            <div className="hero-float-anim">
              <AppMockup />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
