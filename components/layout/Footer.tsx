'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Footer() {
  const { t, lang } = useLang();
  const pathname = usePathname();
  const f = t.footer;

  const getHref = (href: string) => {
    if (href.startsWith('#')) {
      // If we're on a subpage (blog, docs, legal), we need to go back to the home page for anchors
      const isHome = pathname === `/${lang}` || pathname === `/${lang}/`;
      return isHome ? href : `/${lang}${href}`;
    }
    return href;
  };

  return (
    <footer style={{ background: '#030303', borderTop: '1px solid var(--border-subtle)', paddingTop: 64, paddingBottom: 40 }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gap: 48, marginBottom: 56 }} className="grid grid-cols-2 md:grid-cols-4">
          {/* Col 1 — Brand */}
          <div>
            <Link href={`/${lang}`} style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', marginBottom: 12 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <rect x="2" y="5" width="4" height="14" rx="1" fill="#8B5CF6" opacity="0.9"/>
                <rect x="7" y="3" width="4.5" height="16" rx="1" fill="#6366F1" opacity="0.95"/>
                <rect x="13" y="6" width="3.5" height="13" rx="1" fill="#7C3AED" opacity="0.85"/>
                <rect x="17.5" y="8" width="3" height="11" rx="1" fill="#4F46E5" opacity="0.8"/>
                <line x1="1.5" y1="19.5" x2="22.5" y2="19.5" stroke="#6D28D9" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em', color: '#F0F0F0', fontFamily: '"DM Sans", sans-serif' }}>Vault</span>
            </Link>
            <p style={{ fontSize: 13, color: '#444444', lineHeight: 1.65, maxWidth: 180, fontFamily: '"DM Sans", sans-serif', marginBottom: 20 }}>
              {f.tagline}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[{ Icon: Twitter, label: 'Twitter/X', href: '#' }, { Icon: Github, label: 'GitHub', href: 'https://github.com/Berkut35/vault-releases' }, { Icon: Linkedin, label: 'LinkedIn', href: '#' }].map(({ Icon, label, href }) => (
                <a key={label} href={href} aria-label={label}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={{ width: 32, height: 32, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444444', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none', transition: 'color 0.2s ease, border-color 0.2s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#F0F0F0'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#444444'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}
                >
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Cols 2-4 */}
          {f.cols.map(col => (
            <div key={col.title}>
              <p style={{ fontSize: 11.5, fontWeight: 600, color: '#F0F0F0', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: '"DM Sans", sans-serif' }}>
                {col.title}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(link => (
                  <Link key={link.label} href={getHref(link.href)}
                    style={{ fontSize: 13.5, color: '#444444', textDecoration: 'none', transition: 'color 0.2s ease', fontFamily: '"DM Sans", sans-serif' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#888888')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#444444')}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: 12, color: '#333333', fontFamily: '"DM Sans", sans-serif' }}>
            {f.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
