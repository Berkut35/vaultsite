'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { AuthModal } from '../AuthModal';
import { useLang } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';

export function Navbar() {
  const { lang, setLang, t } = useLang();
  const n = t.nav;

  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen,   setAuthOpen]   = useState(false);
  const [activeHref, setActiveHref] = useState('');

  const NAV_LINKS = [
    { label: n.features,   href: '#features'    },
    { label: n.howItWorks, href: '#how-it-works' },
    { label: n.pricing,    href: '#pricing'      },
    { label: n.faq,        href: '#faq'          },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = ['features', 'how-it-works', 'pricing', 'faq'];
    const observers: IntersectionObserver[] = [];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveHref(`#${id}`); },
        { rootMargin: '-38% 0px -38% 0px', threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}
      >
        <div
          style={{
            height: 56,
            background: scrolled ? 'rgba(5,5,5,0.92)' : 'rgba(5,5,5,0.40)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
            boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.5)' : 'none',
            transition: 'all 0.35s ease',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
          }}
        >
          {/* Logo */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0, marginRight: 32 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <rect x="2" y="5" width="4" height="14" rx="1" fill="#8B5CF6" opacity="0.9"/>
              <rect x="7" y="3" width="4.5" height="16" rx="1" fill="#6366F1" opacity="0.95"/>
              <rect x="13" y="6" width="3.5" height="13" rx="1" fill="#7C3AED" opacity="0.85"/>
              <rect x="17.5" y="8" width="3" height="11" rx="1" fill="#4F46E5" opacity="0.8"/>
              <line x1="1.5" y1="19.5" x2="22.5" y2="19.5" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', color: '#F0F0F0', fontFamily: '"DM Sans", sans-serif' }}>
              Vault
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex" style={{ gap: 4, flex: 1 }} aria-label="Main navigation">
            {NAV_LINKS.map(link => {
              const isActive = activeHref === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: '6px 14px', borderRadius: 8, fontSize: 13.5, fontWeight: 400,
                    color: isActive ? '#F0F0F0' : '#888888', textDecoration: 'none',
                    transition: 'color 0.2s ease, background 0.2s ease',
                    fontFamily: '"DM Sans", sans-serif',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#F0F0F0'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = isActive ? '#F0F0F0' : '#888888'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <button
              onClick={() => setLang(lang === 'en' ? 'tr' : 'en' as Lang)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, fontSize: 11.5, fontWeight: 500, color: '#888888', background: 'transparent', border: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: '"DM Sans", sans-serif' }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.color = '#F0F0F0'; el.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.color = '#888888'; el.style.background = 'transparent'; }}
            >
              <Globe size={11} />
              {lang.toUpperCase()}
            </button>
            <button
              onClick={() => setAuthOpen(true)}
              style={{ padding: '7px 16px', borderRadius: 8, fontSize: 13.5, fontWeight: 400, color: '#F0F0F0', background: 'transparent', border: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: '"DM Sans", sans-serif' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
            >
              {n.signin}
            </button>
            <a
              href="#pricing"
              style={{ padding: '7px 18px', borderRadius: 999, fontSize: 13.5, fontWeight: 600, color: '#fff', background: '#A855F7', textDecoration: 'none', transition: 'opacity 0.2s ease, transform 0.2s ease', fontFamily: '"DM Sans", sans-serif', letterSpacing: '-0.01em' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.88'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              {n.startFree}
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden"
            style={{ marginLeft: 'auto', padding: 6, borderRadius: 7, color: '#888888', background: 'transparent', border: 'none', cursor: 'pointer' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: 'absolute', top: 64, left: 12, right: 12, borderRadius: 12, padding: '12px 8px', background: 'rgba(8,8,8,0.97)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 48px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              {NAV_LINKS.map(link => (
                <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  style={{ padding: '10px 14px', borderRadius: 8, fontSize: 14, color: 'rgba(240,240,240,0.8)', textDecoration: 'none', fontFamily: '"DM Sans", sans-serif', transition: 'background 0.15s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {link.label}
                </a>
              ))}
              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '6px 0' }} />
              <button onClick={() => { setAuthOpen(true); setMobileOpen(false); }}
                style={{ padding: '10px 14px', borderRadius: 8, fontSize: 14, color: 'rgba(240,240,240,0.8)', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: '"DM Sans", sans-serif' }}
              >
                {n.signin}
              </button>
              <a href="#pricing" onClick={() => setMobileOpen(false)}
                style={{ margin: '4px 6px 0', padding: '10px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#fff', background: '#A855F7', textDecoration: 'none', textAlign: 'center', fontFamily: '"DM Sans", sans-serif' }}
              >
                {n.startFree}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
