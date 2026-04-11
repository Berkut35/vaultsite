'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, Globe, LogOut, Zap, Crown, ChevronDown } from 'lucide-react';
import { AuthModal } from '../AuthModal';
import { useLang } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';
import { getSupabase, getUserWithPlan, isPaidPlan } from '@/lib/supabase';
import { DownloadButton } from '@/components/ui/DownloadButton';
import type { UserWithPlan, PlanType } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function planLabel(plan: PlanType, n: ReturnType<typeof useLang>['t']['nav']): string {
  if (plan === 'pro')           return n.proPlan;
  if (plan === 'academic')      return n.academicPlan;
  if (plan === 'institutional') return n.institutionalPlan;
  return n.freePlan;
}

function planColors(plan: PlanType): { bg: string; color: string; border: string } {
  if (plan === 'pro')           return { bg: 'rgba(168,85,247,0.15)', color: '#C084FC', border: 'rgba(168,85,247,0.35)' };
  if (plan === 'academic')      return { bg: 'rgba(99,102,241,0.15)', color: '#818CF8', border: 'rgba(99,102,241,0.35)' };
  if (plan === 'institutional') return { bg: 'rgba(20,184,166,0.15)', color: '#2DD4BF', border: 'rgba(20,184,166,0.35)' };
  return { bg: 'rgba(255,255,255,0.06)', color: '#888', border: 'rgba(255,255,255,0.12)' };
}

function getInitials(user: User, profile: UserWithPlan['profile'] | null): string {
  const name = profile?.full_name || user.email || '';
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return '?';
}

// ─── Profile Dropdown ─────────────────────────────────────────────────────────

interface ProfileDropdownProps {
  user: User;
  data: UserWithPlan | null;
  onSignOut: () => void;
  n: ReturnType<typeof useLang>['t']['nav'];
}

function ProfileDropdown({ user, data, onSignOut, n }: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const profile      = data?.profile ?? null;
  const subscription = data?.subscription ?? null;
  const plan         = subscription?.plan_type ?? 'free';
  const paid         = subscription ? isPaidPlan(subscription) : false;
  const colors       = planColors(plan);
  const initials     = getInitials(user, profile);
  const displayName  = profile?.full_name || user.email?.split('@')[0] || 'User';
  const email        = user.email ?? '';

  const daysLeft = paid && subscription?.current_period_end
    ? daysUntil(subscription.current_period_end)
    : null;

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 10px 4px 4px',
          borderRadius: 999,
          background: open ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.10)',
          cursor: 'pointer',
          transition: 'all 0.18s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
      >
        {/* Initials circle */}
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: 'linear-gradient(135deg, #A78BFA, #6366F1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '0.02em',
          flexShrink: 0,
        }}>
          {initials}
        </div>
        {/* Plan badge */}
        <span style={{
          fontSize: 11, fontWeight: 600, fontFamily: '"DM Sans", sans-serif',
          color: colors.color,
          paddingLeft: 2,
        }}>
          {planLabel(plan, n)}
        </span>
        <ChevronDown
          size={12}
          style={{
            color: '#666',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1     }}
            exit={{    opacity: 0, y: 4,  scale: 0.97  }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              width: 228,
              background: 'rgba(10,10,14,0.97)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 12,
              boxShadow: '0 16px 48px rgba(0,0,0,0.55)',
              overflow: 'hidden',
              zIndex: 100,
            }}
          >
            {/* User info header */}
            <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #A78BFA, #6366F1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>
                  {initials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 600, color: '#F0F0F0',
                    fontFamily: '"DM Sans", sans-serif',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {displayName}
                  </div>
                  <div style={{
                    fontSize: 11, color: '#666',
                    fontFamily: '"DM Sans", sans-serif',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {email}
                  </div>
                </div>
              </div>
            </div>

            {/* Plan section */}
            <div style={{ padding: '10px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontFamily: '"DM Sans", sans-serif' }}>
                {n.myAccount}
              </div>

              {/* Plan badge row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  {paid
                    ? <Crown size={13} style={{ color: colors.color, flexShrink: 0 }} />
                    : <Zap   size={13} style={{ color: '#666',        flexShrink: 0 }} />
                  }
                  <span style={{
                    fontSize: 12.5, fontWeight: 600,
                    color: colors.color,
                    fontFamily: '"DM Sans", sans-serif',
                  }}>
                    {planLabel(plan, n)}
                  </span>
                </div>

                {/* Plan badge pill */}
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.05em',
                  padding: '2px 8px', borderRadius: 999,
                  background: colors.bg, color: colors.color,
                  border: `1px solid ${colors.border}`,
                  fontFamily: '"DM Sans", sans-serif',
                  textTransform: 'uppercase',
                }}>
                  {paid ? 'ACTIVE' : 'FREE'}
                </span>
              </div>

              {/* Time remaining */}
              {daysLeft !== null && (
                <div style={{
                  marginTop: 8,
                  padding: '7px 10px',
                  borderRadius: 8,
                  background: daysLeft <= 7
                    ? 'rgba(248,113,113,0.08)'
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${daysLeft <= 7 ? 'rgba(248,113,113,0.18)' : 'rgba(255,255,255,0.07)'}`,
                }}>
                  <div style={{
                    fontSize: 11, color: daysLeft <= 7 ? '#FCA5A5' : '#888',
                    fontFamily: '"DM Sans", sans-serif',
                  }}>
                    {subscription?.current_period_end && (
                      <>
                        <span style={{ fontWeight: 600, color: daysLeft <= 7 ? '#FCA5A5' : colors.color }}>
                          {daysLeft}
                        </span>
                        {' '}{n.daysLeft}
                        {' · '}
                        <span style={{ color: '#555' }}>
                          {new Date(subscription.current_period_end).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Upgrade CTA for free users */}
              {!paid && (
                <a
                  href="#pricing"
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'block', marginTop: 8,
                    padding: '7px 12px', borderRadius: 8, textAlign: 'center',
                    fontSize: 12, fontWeight: 600,
                    color: '#fff',
                    background: 'linear-gradient(135deg, rgba(168,85,247,0.85), rgba(99,102,241,0.85))',
                    textDecoration: 'none',
                    fontFamily: '"DM Sans", sans-serif',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  {n.upgrade}
                </a>
              )}
            </div>

            {/* Sign out */}
            <div style={{ padding: '6px 8px' }}>
              <button
                onClick={() => { setOpen(false); onSignOut(); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 9,
                  padding: '9px 10px', borderRadius: 8,
                  fontSize: 13, color: '#888',
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', textAlign: 'left',
                  fontFamily: '"DM Sans", sans-serif',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; e.currentTarget.style.color = '#FCA5A5'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#888'; }}
              >
                <LogOut size={13} />
                {n.signout}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarInner />
    </Suspense>
  );
}

function NavbarInner() {
  const { lang, setLang, t } = useLang();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const n = t.nav;

  const getHref = (href: string) => {
    if (href.startsWith('#')) {
      const isHome = pathname === `/${lang}` || pathname === `/${lang}/`;
      return isHome ? href : `/${lang}${href}`;
    }
    return href;
  };

  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen,   setAuthOpen]   = useState(false);
  const [authMode,   setAuthMode]   = useState<'signin' | 'signup' | 'reset'>('signin');
  const [activeHref, setActiveHref] = useState('');

  // Detect reset_password param (legacy fallback — primary flow uses /reset-password page)
  useEffect(() => {
    if (searchParams?.get('reset_password') === '1') {
      setAuthMode('reset');
      setAuthOpen(true);
    }
  }, [searchParams]);

  // Auth state
  const [user,     setUser]     = useState<User | null>(null);
  const [userData, setUserData] = useState<UserWithPlan | null>(null);

  const NAV_LINKS = [
    { label: n.features,   href: '#features'    },
    { label: n.howItWorks, href: '#how-it-works' },
    { label: n.pricing,    href: '#pricing'      },
    { label: n.faq,        href: '#faq'          },
  ];

  // ── Auth listener ──
  useEffect(() => {
    const sb = getSupabase();

    // Initial session check
    sb.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        getUserWithPlan(data.user.id).then(setUserData);
      }
    });

    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        getUserWithPlan(u.id).then(setUserData);
      } else {
        setUserData(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await getSupabase().auth.signOut();
  }

  // ── Scroll + intersection ──
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
          <Link href={`/${lang}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0, marginRight: 32 }}>
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
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex" style={{ gap: 4, flex: 1 }} aria-label="Main navigation">
            {NAV_LINKS.map(link => {
              const isActive = activeHref === link.href;
              return (
                <Link
                  key={link.href}
                  href={getHref(link.href)}
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
                </Link>
              );
            })}
          </nav>

          {/* Right */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'en' ? 'tr' : 'en' as Lang)}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, fontSize: 11.5, fontWeight: 500, color: '#888888', background: 'transparent', border: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: '"DM Sans", sans-serif' }}
              onMouseEnter={e => { const el = e.currentTarget; el.style.color = '#F0F0F0'; el.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { const el = e.currentTarget; el.style.color = '#888888'; el.style.background = 'transparent'; }}
            >
              <Globe size={11} />
              {lang.toUpperCase()}
            </button>

            {user ? (
              /* Logged-in: profile dropdown */
              <ProfileDropdown
                user={user}
                data={userData}
                onSignOut={handleSignOut}
                n={n}
              />
            ) : (
              /* Logged-out: sign in + CTA */
              <>
                <button
                  onClick={() => { setAuthMode('signin'); setAuthOpen(true); }}
                  style={{ padding: '7px 16px', borderRadius: 8, fontSize: 13.5, fontWeight: 400, color: '#F0F0F0', background: 'transparent', border: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: '"DM Sans", sans-serif' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                >
                  {n.signin}
                </button>
                <button
                  onClick={() => { setAuthMode('signup'); setAuthOpen(true); }}
                   style={{ padding: '7px 18px', borderRadius: 999, fontSize: 13.5, fontWeight: 600, color: '#fff', background: '#A855F7', fontFamily: '"DM Sans", sans-serif', border: 'none', cursor: 'pointer', letterSpacing: '-0.01em' }}
                >
                  {n.startFree}
                </button>
              </>
            )}
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

              {user ? (
                <>
                  {/* Mobile: plan info */}
                  <div style={{ padding: '8px 14px' }}>
                    <div style={{ fontSize: 11, color: '#555', marginBottom: 4, fontFamily: '"DM Sans", sans-serif' }}>
                      {user.email}
                    </div>
                    {(() => {
                      const plan   = userData?.subscription?.plan_type ?? 'free';
                      const colors = planColors(plan);
                      const paid   = userData?.subscription ? isPaidPlan(userData.subscription) : false;
                      const days   = paid && userData?.subscription?.current_period_end
                        ? daysUntil(userData.subscription.current_period_end) : null;
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                            background: colors.bg, color: colors.color, border: `1px solid ${colors.border}`,
                            fontFamily: '"DM Sans", sans-serif',
                          }}>
                            {planLabel(plan, n)}
                          </span>
                          {days !== null && (
                            <span style={{ fontSize: 11, color: '#666', fontFamily: '"DM Sans", sans-serif' }}>
                              {days} {n.daysLeft}
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  <button
                    onClick={() => { handleSignOut(); setMobileOpen(false); }}
                    style={{ padding: '10px 14px', borderRadius: 8, fontSize: 14, color: '#FCA5A5', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: '"DM Sans", sans-serif', display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <LogOut size={13} />
                    {n.signout}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { setAuthMode('signin'); setAuthOpen(true); setMobileOpen(false); }}
                    style={{ padding: '10px 14px', borderRadius: 8, fontSize: 14, color: 'rgba(240,240,240,0.8)', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: '"DM Sans", sans-serif' }}
                  >
                    {n.signin}
                  </button>
                  <button
                    onClick={() => { setAuthMode('signup'); setAuthOpen(true); setMobileOpen(false); }}
                    style={{ margin: '4px 6px 0', padding: '10px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#fff', background: '#A855F7', textAlign: 'center', fontFamily: '"DM Sans", sans-serif', justifyContent: 'center', width: 'calc(100% - 12px)', border: 'none', cursor: 'pointer' }}
                  >
                    {n.startFree}
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <AuthModal
        key={authMode}
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
      />
    </>
  );
}
