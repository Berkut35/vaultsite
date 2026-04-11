'use client';

import { useState, ReactNode, CSSProperties } from 'react';
import { Loader2, Monitor, Apple, Terminal } from 'lucide-react';
import { resolveDownloadUrl, detectOS, RELEASE_REPO } from '@/lib/download';

interface DownloadButtonProps {
  children: ReactNode;
  style?:   CSSProperties;
  className?: string;
  /** Wraps content in the magnetic spring div when used inside MagneticButton */
  asChild?: boolean;
}

export function DownloadButton({ children, style, className = '' }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const os = detectOS();
  const OsIcon = os === 'mac' ? Apple : os === 'linux' ? Terminal : Monitor;

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    try {
      const target = await resolveDownloadUrl();
      if (target) {
        // For cross-origin URLs (GitHub), navigate directly — anchor.download
        // only works for same-origin. window.location keeps the tab.
        window.location.href = target.url;
      } else {
        // No release available — redirect to GitHub releases page
        window.open(`https://github.com/${RELEASE_REPO}/releases`, '_blank', 'noopener,noreferrer');
      }
    } finally {
      setTimeout(() => setLoading(false), 1500);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`btn-shimmer ${className}`.trim()}
      style={{
        cursor: loading ? 'default' : 'pointer',
        border: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        ...style,
        opacity: loading ? 0.75 : 1,
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}
    >
      {loading
        ? <Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
        : <OsIcon  size={15} style={{ flexShrink: 0 }} />
      }
      {children}
    </button>
  );
}
