'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '@/lib/i18n';

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const { lang } = useLang();

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('vault-cookie-consent');
    if (!consent) {
      // Delay showing it slightly for better UX
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (type: 'all' | 'essential') => {
    localStorage.setItem('vault-cookie-consent', type);
    setShow(false);
    
    if (type === 'all') {
      // Analytics tracking can be toggled on here 
      // Vercel Analytics loads in layout.tsx natively but we can emit a custom event if integrated with Tag Manager.
      window.dispatchEvent(new Event('cookies-accepted'));
    }
  };

  const text = lang === 'tr' ? {
    title: "Gizliliğinize Önem Veriyoruz",
    desc: "Vault'un site performansını analiz etmesi için çerezleri (cookies) kullanıyoruz. Yerel öncelikli gizlilik ilkemiz gereği araştırmalarınız veya dosyalarınız asla takip edilmez.",
    accept: "Tümünü Kabul Et",
    essential: "Yalnızca Gerekli Olanlar",
    linkText: "Çerez Politikası",
    linkHref: "/tr/legal/cookies"
  } : {
    title: "We Value Your Privacy",
    desc: "We use cookies to analyze site traffic and performance. Keeping with our local-first ethos, your research databases and documents are never tracked.",
    accept: "Accept All",
    essential: "Essential Only",
    linkText: "Cookie Policy",
    linkHref: "/en/legal/cookies"
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:w-[480px] z-[100] vault-card rounded-2xl border border-vault-border shadow-vault backdrop-blur-vault flex flex-col p-6"
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-text-primary font-sans font-semibold text-[15px]">
              {text.title}
            </h3>
          </div>
          
          <p className="text-text-secondary text-[13px] leading-relaxed mb-5 font-sans">
            {text.desc}{' '}
            <a href={text.linkHref} className="text-accent-purple hover:text-accent-gold transition-colors underline underline-offset-2">
              {text.linkText}
            </a>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => handleConsent('essential')}
              className="flex-1 px-4 py-2.5 rounded-xl border border-vault-border bg-transparent text-text-secondary text-[13px] font-semibold hover:bg-white/5 hover:text-text-primary transition-colors font-sans"
            >
              {text.essential}
            </button>
            <button 
              onClick={() => handleConsent('all')}
              className="flex-1 px-4 py-2.5 rounded-xl bg-accent-purple text-white text-[13px] font-semibold shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:opacity-90 transition-opacity font-sans"
            >
              {text.accept}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
