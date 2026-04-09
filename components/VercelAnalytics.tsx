'use client';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { useState, useEffect } from 'react';

export function VercelAnalytics() {
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConsent = () => {
      const c = localStorage.getItem('vault-cookie-consent');
      setConsent(c === 'all');
    };

    // Initial check
    checkConsent();

    // Listen for the custom event from CookieBanner
    window.addEventListener('cookies-accepted', checkConsent);
    
    return () => {
      window.removeEventListener('cookies-accepted', checkConsent);
    };
  }, []);

  // Don't render anything until we've checked localStorage
  // Or if consent is not granted
  if (consent !== true) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
