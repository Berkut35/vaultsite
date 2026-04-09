# Area B: Görsel Tasarım & UX İyileştirmeleri Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vaultsite'a global ambient arka plan katmanı, HowItWorks animasyonlu zaman tüneli ve FinalCTA görsel güçlendirmesi ekle.

**Architecture:** Yeni `AmbientBackground` bileşeni `layout.tsx`'e eklenerek tüm sayfayı kapsar. `HowItWorks` ve `FinalCTA` kendi dosyalarında güncellenir. Hiçbir yeni bağımlılık eklenmez — Framer Motion zaten yüklü.

**Tech Stack:** Next.js 15 App Router, React 19, Framer Motion 11, TypeScript, vanilla CSS + inline styles

---

## Dosya Haritası

| Dosya | İşlem |
|---|---|
| `components/AmbientBackground.tsx` | YENİ — scroll-aware parallax orb katmanı |
| `app/[lang]/layout.tsx` | GÜNCELLE — `<AmbientBackground />` ekle |
| `components/sections/HowItWorks.tsx` | GÜNCELLE — animasyonlu çizgi + badge pulse + ok animasyonu |
| `components/sections/FinalCTA.tsx` | GÜNCELLE — radial glow + dot mesh + gradient border |

---

## Task 1: AmbientBackground Bileşeni

**Files:**
- Create: `components/AmbientBackground.tsx`

- [ ] **Step 1: Dosyayı oluştur**

`components/AmbientBackground.tsx` dosyasını aşağıdaki içerikle oluştur:

```tsx
'use client';

import { useState, useEffect } from 'react';

export function AmbientBackground() {
  const [scrollY, setScrollY] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const orb1Y = reducedMotion ? 0 : scrollY * -0.10;
  const orb2Y = reducedMotion ? 0 : scrollY * 0.08;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Orb 1 — mor, sol üst (hero arkası) */}
      <div style={{
        position: 'absolute',
        width: 700,
        height: 700,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168,85,247,0.10), transparent 70%)',
        filter: 'blur(80px)',
        left: '-15%',
        top: '-10%',
        transform: `translateY(${orb1Y}px)`,
        willChange: reducedMotion ? 'auto' : 'transform',
      }} />
      {/* Orb 2 — altın, sağ orta (features arkası) */}
      <div style={{
        position: 'absolute',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(251,191,36,0.07), transparent 70%)',
        filter: 'blur(80px)',
        right: '-5%',
        top: '40%',
        transform: `translateY(${orb2Y}px)`,
        willChange: reducedMotion ? 'auto' : 'transform',
      }} />
      {/* Orb 3 — indigo, orta-alt (CTA arkası), sabit */}
      <div style={{
        position: 'absolute',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)',
        filter: 'blur(80px)',
        left: '30%',
        bottom: '-5%',
      }} />
    </div>
  );
}
```

- [ ] **Step 2: layout.tsx'e ekle**

`app/[lang]/layout.tsx` dosyasını aç. Şu import'u ekle:

```tsx
import { AmbientBackground } from '@/components/AmbientBackground';
```

Ardından `<body>` içindeki `<div className="noise-overlay" aria-hidden="true" />` satırının hemen **altına** ekle:

```tsx
<AmbientBackground />
```

Sonuç:
```tsx
<body suppressHydrationWarning>
  <div className="noise-overlay" aria-hidden="true" />
  <AmbientBackground />
  <LanguageProvider initialLang={lang as any}>
    {children}
    <CookieBanner />
  </LanguageProvider>
  <VercelAnalytics />
</body>
```

- [ ] **Step 3: Görsel doğrulama**

```bash
cd /c/Uygulama/Vaultsite && npm run dev
```

Tarayıcıda `http://localhost:3000/tr` aç. Sayfada sol üstte mor, sağda altın, altta indigo glow görünmeli. Scroll yaparken orb 1 yukarı, orb 2 aşağı kaymalı.

- [ ] **Step 4: Commit**

```bash
cd /c/Uygulama/Vaultsite
git add components/AmbientBackground.tsx app/[lang]/layout.tsx
git commit -m "feat: add AmbientBackground parallax orb layer"
```

---

## Task 2: HowItWorks Animasyonlu Zaman Tüneli

**Files:**
- Modify: `components/sections/HowItWorks.tsx`

- [ ] **Step 1: Mevcut dosyayı oku**

`components/sections/HowItWorks.tsx` dosyasını oku — tam içeriği zihninde tut.

- [ ] **Step 2: useInView import'unu ekle**

Dosyanın ilk satırını güncelle:

```tsx
import { motion, useInView } from 'framer-motion';
```

Ve `useRef` import'unu ekle:

```tsx
import { useRef } from 'react';
```

Tam import bloğu:

```tsx
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Upload, Highlighter, Network, Share2 } from 'lucide-react';
import { useLang } from '@/lib/i18n';
```

- [ ] **Step 3: HowItWorks fonksiyonuna ref ve inView ekle**

`export function HowItWorks()` gövdesinin başına ekle:

```tsx
const sectionRef = useRef<HTMLDivElement>(null);
const inView = useInView(sectionRef, { once: true, margin: '-80px' });
```

- [ ] **Step 4: CSS keyframe ve section ref'i ekle**

Bölümün return'ündeki `<section>` tag'ine `ref={sectionRef}` ekle ve `<style>` bloğunu bölümün hemen içine ekle:

```tsx
return (
  <section
    ref={sectionRef}
    id="how-it-works"
    style={{ padding: 'clamp(64px, 10vw, 128px) 24px' }}
    aria-labelledby="how-it-works-heading"
  >
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes badgePulse {
        0%   { box-shadow: 0 0 0 0 rgba(168,85,247,0.45); }
        70%  { box-shadow: 0 0 0 10px rgba(168,85,247,0); }
        100% { box-shadow: 0 0 0 0 rgba(168,85,247,0); }
      }
    `}} />
    {/* ... geri kalan içerik */}
  </section>
);
```

- [ ] **Step 5: Grid wrapper'ına animasyonlu çizgi ve position: relative ekle**

Mevcut step grid div'ini şu yapıyla değiştir:

```tsx
<div style={{ display: 'grid', gap: 0, position: 'relative' }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* Animasyonlu bağlantı çizgisi — yalnızca lg ekranlarda */}
  <motion.div
    className="hidden lg:block"
    style={{
      position: 'absolute',
      top: 22,
      left: '12.5%',
      right: '12.5%',
      height: 1,
      background: 'rgba(168,85,247,0.30)',
      transformOrigin: 'left',
      zIndex: 0,
    }}
    initial={{ scaleX: 0 }}
    animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
  />

  {h.steps.map((step, i) => {
    const Icon = ICONS[i];
    return (
      <motion.div key={step.number}
        initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
        className={`p-8 relative border-[var(--border-subtle)] ${i !== h.steps.length - 1 ? 'border-b lg:border-b-0 lg:border-r' : ''}`}
      >
        <div aria-hidden="true" style={{ position: 'absolute', top: 24, right: 24, fontSize: 80, fontWeight: 800, color: 'var(--accent-gold)', opacity: 0.07, lineHeight: 1, letterSpacing: '-0.06em', fontFamily: '"DM Sans", sans-serif', userSelect: 'none', pointerEvents: 'none' }}>
          {step.number}
        </div>
        {/* Badge — pulse animasyonu ile */}
        <div style={{
          width: 44, height: 44, borderRadius: 11,
          background: 'rgba(168,85,247,0.08)',
          border: '1px solid rgba(168,85,247,0.16)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
          animation: inView ? `badgePulse 0.6s ease-out ${0.4 + i * 0.15}s 1` : 'none',
        }}>
          <Icon size={18} color="var(--accent-purple)" />
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10, fontFamily: '"DM Sans", sans-serif' }}>
          Step {step.number}
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: 12, fontFamily: '"DM Sans", sans-serif' }}>
          {step.title}
        </h3>
        <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.65, fontFamily: '"DM Sans", sans-serif' }}>
          {step.description}
        </p>
        {i < h.steps.length - 1 && (
          <motion.div
            className="hidden lg:flex"
            aria-hidden="true"
            style={{ position: 'absolute', right: -14, top: '50%', transform: 'translateY(-50%)', zIndex: 1, width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-surface)', border: '1px solid rgba(251,191,36,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(251,191,36,0.6)', fontSize: 12 }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.35, delay: 0.5 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            →
          </motion.div>
        )}
      </motion.div>
    );
  })}
</div>
```

- [ ] **Step 6: Görsel doğrulama**

Dev sunucusu çalışıyorsa `http://localhost:3000/tr#how-it-works` aç. Sayfayı aşağı kaydır:
- Bölüm ekrana girince mor yatay çizgi soldan sağa çizilmeli
- Her adımın ikon badge'i sırayla pulse yapmalı
- Ok badge'leri soluktan belirgin hale gelmeli

- [ ] **Step 7: Commit**

```bash
cd /c/Uygulama/Vaultsite
git add components/sections/HowItWorks.tsx
git commit -m "feat: add HowItWorks animated timeline (connecting line, badge pulse, arrow fade)"
```

---

## Task 3: FinalCTA Görsel Güçlendirme

**Files:**
- Modify: `components/sections/FinalCTA.tsx`

- [ ] **Step 1: Section stilini güncelle**

`FinalCTA.tsx` dosyasındaki `<section>` tag'inin `style` prop'unu şu şekilde güncelle (mevcut `borderTop` ve `background` değişiyor, diğerleri korunuyor):

```tsx
<section
  id="cta"
  style={{
    padding: 'clamp(80px, 12vw, 160px) 24px',
    background: '#0d0d0d',
    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
    backgroundSize: '24px 24px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  }}
  aria-labelledby="cta-heading"
>
```

`borderTop` satırı kaldırılıyor — yerine aşağıdaki gradient çizgiyi ekleyeceğiz.

- [ ] **Step 2: Gradient border + glow div'lerini ekle**

`<section>` açılış tag'inden hemen sonra, `<div style={{ maxWidth: '640px'... }}>` wrapper'ından önce şu üç div'i ekle:

```tsx
{/* Gradient üst border */}
<div aria-hidden="true" style={{
  position: 'absolute',
  top: 0, left: 0, right: 0,
  height: 1,
  background: 'linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.5) 30%, rgba(251,191,36,0.35) 70%, transparent 100%)',
}} />

{/* Radial glow 1 — mor, altta ortalı */}
<div aria-hidden="true" style={{
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(168,85,247,0.14), transparent)',
}} />

{/* Radial glow 2 — altın, sağ üstte */}
<div aria-hidden="true" style={{
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  background: 'radial-gradient(ellipse 30% 40% at 78% 18%, rgba(251,191,36,0.07), transparent)',
}} />
```

- [ ] **Step 3: Görsel doğrulama**

`http://localhost:3000/tr` sayfasının en altına kadar kaydır. FinalCTA bölümünde:
- Üstte mor→altın gradyanlı ince bir çizgi görünmeli
- Bölüm arka planında dot mesh (ince nokta ızgarası) görünmeli
- Alt kısımda mor radial glow, sağ üstte altın glow görünmeli

- [ ] **Step 4: Build kontrolü**

```bash
cd /c/Uygulama/Vaultsite && npm run build
```

Beklenen çıktı: `✓ Compiled successfully` (TypeScript hatası yok).

- [ ] **Step 5: Commit**

```bash
cd /c/Uygulama/Vaultsite
git add components/sections/FinalCTA.tsx
git commit -m "feat: add FinalCTA radial glow, dot mesh background, and gradient border"
```

---

## Doğrulama Listesi (Tüm Görevler Sonrası)

- [ ] Sayfada 3 ambient orb görünüyor (mor sol üst, altın sağ orta, indigo sol alt)
- [ ] Scroll yaparken orb 1 yukarı, orb 2 aşağı paralaks hareketi yapıyor
- [ ] HowItWorks: yatay mor çizgi soldan sağa çiziliyor
- [ ] HowItWorks: badge'ler sırayla pulse yapıyor (stagger 0.15s)
- [ ] HowItWorks: ok badge'leri fade-in + scale animasyonu yapıyor
- [ ] FinalCTA: gradient üst kenar çizgisi görünüyor
- [ ] FinalCTA: dot mesh arka plan görünüyor
- [ ] FinalCTA: mor + altın radial glow görünüyor
- [ ] `prefers-reduced-motion: reduce` ayarında AmbientBackground statik duruyor
- [ ] `npm run build` sıfır hatayla tamamlanıyor
