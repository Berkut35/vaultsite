# Area C: Content & Marketing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Academic + Institutional pricing tiers (2+2 layout) and strengthen testimonials with more specific quotes plus a featured 4th card.

**Architecture:** Two independent changes to existing components. `lib/i18n.tsx` is updated first (data layer), then `Pricing.tsx` and `Testimonials.tsx` consume the new data. No new files are created. Vaultsite has no test suite — build (`npm run build`) serves as the verification proxy.

**Tech Stack:** Next.js 15, React 19, TypeScript, Framer Motion, Tailwind (utility classes only), inline styles.

---

## File Map

| File | Change |
|---|---|
| `lib/i18n.tsx` | Add `institutionsDivider` + `institutionPlans` (EN+TR); update `testimonials.items` (EN+TR) |
| `components/sections/Pricing.tsx` | Render `institutionPlans` array with divider row; handle `custom` price + `ctaHref` + badge colors |
| `components/sections/Testimonials.tsx` | Support `featured: true` item → `md:col-span-3`, purple left border, larger quote font |

---

## Task 1: i18n — Add Institution Pricing Data (EN + TR)

**Files:**
- Modify: `lib/i18n.tsx:257-258` (EN pricing close) and `lib/i18n.tsx:621-622` (TR pricing close)

**Context:** `lib/i18n.tsx` exports a `translations` object with `en` and `tr` keys. Each has a `pricing.plans` array. We add `institutionsDivider` string and `institutionPlans` array right after the existing `plans` array closes, inside the `pricing` object.

- [ ] **Step 1: Add EN institution pricing data**

In `lib/i18n.tsx`, find the EN pricing section (around line 257). Replace:

```ts
      ],
    },
    faq: {
```

With:

```ts
      ],
      institutionsDivider: 'For Institutions',
      institutionPlans: [
        {
          name:        'Academic',
          price:       '129',
          oldPrice:    '179',
          period:      'TRY/mo',
          description: 'For verified .edu accounts. All Pro features plus institutional tools.',
          cta:         'Verify .edu Account',
          ctaVariant:  'outline',
          ctaHref:     '#',
          highlighted: false,
          badge:       'Academic',
          features: [
            'Unlimited documents',
            'Unlimited reading groups',
            'All export formats',
            'Advanced citation tools',
            'Institutional SSO',
            'Team admin panel',
            'Priority support',
          ],
        },
        {
          name:        'Institutional',
          price:       'custom',
          priceLabel:  'Custom',
          period:      '',
          description: 'For departments and research centers. Custom deployment across your institution.',
          cta:         'Contact Sales',
          ctaVariant:  'outline',
          ctaHref:     'mailto:sales@vault.app',
          highlighted: false,
          badge:       'Enterprise',
          features: [
            'Everything in Academic',
            'Unlimited seats',
            'White-label option',
            'Dedicated onboarding',
            'SLA guarantee',
            'Custom integrations',
          ],
        },
      ],
    },
    faq: {
```

- [ ] **Step 2: Add TR institution pricing data**

In `lib/i18n.tsx`, find the TR pricing section (around line 621). Replace:

```ts
      ],
    },
    faq: {
      sectionBadge: 'SSS',
```

With:

```ts
      ],
      institutionsDivider: 'Kurumlar İçin',
      institutionPlans: [
        {
          name:        'Akademik',
          price:       '129',
          oldPrice:    '179',
          period:      'TRY/ay',
          description: 'Doğrulanmış .edu hesapları için. Tüm Pro özellikler + kurumsal araçlar.',
          cta:         '.edu Hesabını Doğrula',
          ctaVariant:  'outline',
          ctaHref:     '#',
          highlighted: false,
          badge:       'Akademik',
          features: [
            'Sınırsız belge',
            'Sınırsız okuma grubu',
            'Tüm dışa aktarma formatları',
            'Gelişmiş atıf araçları',
            'Kurumsal SSO',
            'Takım yönetim paneli',
            'Öncelikli destek',
          ],
        },
        {
          name:        'Kurumsal',
          price:       'custom',
          priceLabel:  'Özel',
          period:      '',
          description: 'Bölümler ve araştırma merkezleri için. Kurumunuz genelinde özel dağıtım.',
          cta:         'Satış Ekibiyle İletişim',
          ctaVariant:  'outline',
          ctaHref:     'mailto:sales@vault.app',
          highlighted: false,
          badge:       'Kurumsal',
          features: [
            'Akademik plandaki her şey',
            'Sınırsız kullanıcı',
            'White-label seçeneği',
            'Özel kurulum desteği',
            'SLA garantisi',
            'Özel entegrasyonlar',
          ],
        },
      ],
    },
    faq: {
      sectionBadge: 'SSS',
```

- [ ] **Step 3: Verify build passes**

```bash
cd C:/Uygulama/Vaultsite && npm run build
```

Expected: build succeeds, 18 static pages generated, zero TypeScript errors.

- [ ] **Step 4: Commit**

```bash
cd C:/Uygulama/Vaultsite
git add lib/i18n.tsx
git commit -m "feat(i18n): add Academic and Institutional pricing plans (EN+TR)"
```

---

## Task 2: i18n — Update Testimonials Content (EN + TR)

**Files:**
- Modify: `lib/i18n.tsx:131-156` (EN items) and `lib/i18n.tsx:495-520` (TR items)

**Context:** `testimonials.items` is an array of 3 objects. We replace the quotes with more specific research scenarios and add a 4th featured item.

- [ ] **Step 1: Replace EN testimonials items**

In `lib/i18n.tsx`, find the EN testimonials section (around line 131). Replace the entire `items: [` array (lines 131–156):

```ts
      items: [
        {
          quote:       'Vault is the first tool that actually handles the complexity of a longitudinal study. I had over 300 sources across six years of fieldwork, and for the first time I could see how they all connected. The knowledge graph alone is worth every penny.',
          name:        'Dr. Sarah Chen',
          role:        'Associate Professor of Sociology',
          institution: 'Stanford University',
          initials:    'SC',
          avatar:      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
        },
        {
          quote:       'The note-linking system changed how I write. I used to lose half my reading time trying to remember where I had noted something. Now every idea connects back to its source instantly. My thesis committee has noticed the improvement.',
          name:        'Marcus Holt',
          role:        'PhD Candidate in History',
          institution: 'University of Cambridge',
          initials:    'MH',
          avatar:      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
        },
        {
          quote:       'During fieldwork in regions with no connectivity, Vault was the only tool that never let me down. Everything worked offline, perfectly. Coming back to a fully synced, structured archive of my annotations was something I had never experienced before.',
          name:        'Prof. Elif Yıldız',
          role:        'Computational Linguistics',
          institution: 'Middle East Technical University',
          initials:    'EY',
          avatar:      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200',
        },
      ],
```

With:

```ts
      items: [
        {
          quote:       "I had over 300 sources across six years of longitudinal fieldwork. Vault's knowledge graph was the first tool that let me see — and show my committee — how every source connected to my central argument. My defense was stronger because of it.",
          name:        'Dr. Sarah Chen',
          role:        'Associate Professor of Sociology',
          institution: 'Stanford University',
          initials:    'SC',
          avatar:      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
        },
        {
          quote:       'Note-linking removed the single biggest bottleneck in my writing process. I no longer spend hours hunting for the source behind a half-remembered idea. Every annotation is one click from its original context, and my supervisor has commented on how my arguments are better-evidenced now.',
          name:        'Marcus Holt',
          role:        'PhD Candidate in History',
          institution: 'University of Cambridge',
          initials:    'MH',
          avatar:      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
        },
        {
          quote:       'I ran 18 months of fieldwork in regions with intermittent connectivity. Vault never missed a beat — everything worked offline, and when I returned to a network, my entire annotated archive was intact and ready. No other tool in my workflow even attempted this.',
          name:        'Prof. Elif Yıldız',
          role:        'Computational Linguistics',
          institution: 'Middle East Technical University',
          initials:    'EY',
          avatar:      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200',
        },
        {
          quote:       "I supervise twelve PhD students, each with their own sprawling corpus of sources. Vault's reading groups let me see exactly where each student is in their literature review, annotate directly on their sources, and keep our group's shared bibliography synchronized — without a single email chain. It has genuinely changed how I run a research lab.",
          name:        'Prof. Arjun Mehta',
          role:        'Research Group Lead, Dept. of Computer Science',
          institution: 'Indian Institute of Technology Delhi',
          initials:    'AM',
          avatar:      null,
          featured:    true,
        },
      ],
```

- [ ] **Step 2: Replace TR testimonials items**

In `lib/i18n.tsx`, find the TR testimonials section (around line 495). Replace the entire `items: [` array (lines 495–520):

```ts
      items: [
        {
          quote:       "Vault, boylamsal bir çalışmanın karmaşıklığını gerçekten ele alan ilk araçtır. Altı yıllık saha çalışmasında 300'den fazla kaynağım vardı ve ilk kez hepsinin nasıl bağlandığını görebildim. Tek başına bilgi grafiği her kuruşa değer.",
          name:        'Dr. Sarah Chen',
          role:        'Sosyoloji Doçenti',
          institution: 'Stanford Üniversitesi',
          initials:    'SC',
          avatar:      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
        },
        {
          quote:       'Not bağlama sistemi yazmam konusundaki bakış açımı tamamen değiştirdi. Bir şeyi nerede not ettiğimi hatırlamaya çalışarak okuma zamanımın yarısını harcardım. Artık her fikir anında kaynağına bağlanıyor. Tez komitem gelişimi fark etti.',
          name:        'Marcus Holt',
          role:        'Tarih Doktora Adayı',
          institution: 'Cambridge Üniversitesi',
          initials:    'MH',
          avatar:      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
        },
        {
          quote:       "Bağlantısız bölgelerde saha çalışması sırasında Vault beni hiç hayal kırıklığına uğratmayan tek araçtı. Her şey çevrimdışı, mükemmel çalıştı. Notlarımın tam senkronize, yapılandırılmış bir arşivine dönmek daha önce hiç yaşamadığım bir şeydi.",
          name:        'Prof. Elif Yıldız',
          role:        'Hesaplamalı Dilbilim',
          institution: 'Orta Doğu Teknik Üniversitesi',
          initials:    'EY',
          avatar:      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200',
        },
      ],
```

With:

```ts
      items: [
        {
          quote:       "6 yıllık boylamsal saha araştırmamdan 300'ü aşkın kaynağım vardı. Vault'ın bilgi grafiği, her kaynağın merkezi argümanımla nasıl bağlandığını hem benim görmemi hem de komiteme göstermemi sağlayan ilk araç oldu. Savunmam bu sayede çok daha güçlüydü.",
          name:        'Dr. Sarah Chen',
          role:        'Sosyoloji Doçenti',
          institution: 'Stanford Üniversitesi',
          initials:    'SC',
          avatar:      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
        },
        {
          quote:       'Not bağlama özelliği, yazma sürecimdeki en büyük darboğazı ortadan kaldırdı. Artık aklımın köşesinde kalan bir fikrin kaynağını saatlerce aramıyorum. Her alıntı, orijinal bağlamına tek tıkla ulaşılabilir durumda; danışmanım argümanlarımın artık daha iyi desteklendiğini söylüyor.',
          name:        'Marcus Holt',
          role:        'Tarih Doktora Adayı',
          institution: 'Cambridge Üniversitesi',
          initials:    'MH',
          avatar:      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
        },
        {
          quote:       '18 ay boyunca internet bağlantısının kesintili olduğu bölgelerde saha çalışması yürüttüm. Vault hiç aksatmadı — her şey çevrimdışı çalıştı; ağa döndüğümde tüm notlu arşivim eksiksiz ve kullanıma hazırdı. Çalışma akışımdaki başka hiçbir araç bunu denemeye bile kalkışmadı.',
          name:        'Prof. Elif Yıldız',
          role:        'Hesaplamalı Dilbilim',
          institution: 'Orta Doğu Teknik Üniversitesi',
          initials:    'EY',
          avatar:      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200',
        },
        {
          quote:       "On iki doktora öğrencisine danışmanlık yapıyorum; her birinin kendi geniş kaynak külliyatı var. Vault'ın okuma grupları her öğrencinin literatür taramasında tam olarak nerede olduğunu görmemi, doğrudan kaynaklarına not düşmemi ve grubumuzun ortak kaynakçasını tek bir e-posta zinciri olmadan senkronize tutmamı sağlıyor. Bir araştırma laboratuvarını yönetme biçimimi gerçekten değiştirdi.",
          name:        'Prof. Arjun Mehta',
          role:        'Araştırma Grubu Lideri, Bilgisayar Müh. Bölümü',
          institution: 'Hindistan Teknoloji Enstitüsü Delhi',
          initials:    'AM',
          avatar:      null,
          featured:    true,
        },
      ],
```

- [ ] **Step 3: Verify build passes**

```bash
cd C:/Uygulama/Vaultsite && npm run build
```

Expected: build succeeds, zero TypeScript errors.

- [ ] **Step 4: Commit**

```bash
cd C:/Uygulama/Vaultsite
git add lib/i18n.tsx
git commit -m "feat(i18n): strengthen testimonials with specific quotes, add featured 4th item (EN+TR)"
```

---

## Task 3: Pricing.tsx — 2+2 Layout with Institution Plans

**Files:**
- Modify: `components/sections/Pricing.tsx`

**Context:** Current `Pricing.tsx` renders `p.plans` (2 cards) in a `md:grid-cols-2` grid. We keep that unchanged and add: a full-width divider row, then `(p as any).institutionPlans` rendered with the same card template but with custom price support, `ctaHref`, and badge color variants.

The full updated file is shown below. Replace the entire file content.

- [ ] **Step 1: Replace `components/sections/Pricing.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify build passes**

```bash
cd C:/Uygulama/Vaultsite && npm run build
```

Expected: build succeeds, zero TypeScript errors.

- [ ] **Step 3: Commit**

```bash
cd C:/Uygulama/Vaultsite
git add components/sections/Pricing.tsx
git commit -m "feat(pricing): add Academic and Institutional tiers with 2+2 divider layout"
```

---

## Task 4: Testimonials.tsx — Featured Card Support

**Files:**
- Modify: `components/sections/Testimonials.tsx`

**Context:** Current component renders all items with `md:grid-cols-3`. Items with `featured: true` need `md:col-span-3` (full width), a purple left border, slightly different background, and a larger quote font. The 4th item added in Task 2 has `featured: true`.

Replace the entire file content:

- [ ] **Step 1: Replace `components/sections/Testimonials.tsx`**

```tsx
'use client';

import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';

export function Testimonials() {
  const { t } = useLang();
  const tm = t.testimonials;

  return (
    <section id="testimonials" style={{ padding: 'clamp(64px, 10vw, 128px) 24px' }} aria-labelledby="testimonials-heading">
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55, ease: 'easeOut' }} style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 id="testimonials-heading" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.035em', color: 'var(--text-primary)', lineHeight: 1.1, fontFamily: '"DM Sans", sans-serif' }}>
            {tm.title}
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gap: 16 }} className="grid grid-cols-1 md:grid-cols-3">
          {tm.items.map((item, i) => {
            const isFeatured = (item as any).featured === true;
            return (
              <motion.article
                key={item.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: 'easeOut' }}
                className={isFeatured ? 'col-span-1 md:col-span-3' : undefined}
                style={{
                  background:     isFeatured ? 'rgba(168,85,247,0.05)' : 'rgba(255,255,255,0.02)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border:      '1px solid var(--border-subtle)',
                  borderLeft:  isFeatured ? '3px solid rgba(168,85,247,0.45)' : '1px solid var(--border-subtle)',
                  borderRadius: 16,
                  padding:     '32px 28px',
                  display:     'flex',
                  flexDirection: 'column',
                  gap:         24,
                }}
              >
                <div style={{ color: 'var(--accent-gold)', fontSize: 13, letterSpacing: '0.05em' }} aria-label="5 stars">★★★★★</div>
                <blockquote style={{ fontSize: isFeatured ? 16.5 : 15.5, lineHeight: 1.72, color: 'rgba(240,240,240,0.82)', flex: 1, fontFamily: '"DM Serif Display", serif', fontStyle: 'italic', margin: 0 }}>
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div aria-hidden="true" style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'rgba(168,85,247,0.9)', fontFamily: '"DM Sans", sans-serif', flexShrink: 0, overflow: 'hidden' }}>
                    {(item as any).avatar ? (
                      <img src={(item as any).avatar} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      item.initials
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', fontFamily: '"DM Sans", sans-serif', marginBottom: 2 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.4 }}>
                      {item.role}<br />{item.institution}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build passes**

```bash
cd C:/Uygulama/Vaultsite && npm run build
```

Expected: build succeeds, zero TypeScript errors.

- [ ] **Step 3: Visual check**

Run `npm run dev`, open `http://localhost:3000`. Verify:
- Pricing: 4 cards in 2+2 layout, "For Institutions" / "Kurumlar İçin" divider visible
- Academic card shows `₺129` + strikethrough `₺179` + purple "Academic" badge
- Institutional card shows "Custom" / "Özel" (no `₺`), gold "Enterprise" badge, "Contact Sales" links to `mailto:sales@vault.app`
- Mobile (375px DevTools): 4 cards stack vertically, divider full width
- Testimonials: first 3 cards in 3-col grid, 4th card spans full width with purple left border
- Switch to `/tr` — Turkish labels render correctly everywhere

- [ ] **Step 4: Commit**

```bash
cd C:/Uygulama/Vaultsite
git add components/sections/Testimonials.tsx
git commit -m "feat(testimonials): add featured full-width 4th card with purple left border"
```

---

## Kapsam Dışı

- Blog altyapısı (Area C'den çıkarıldı)
- Email capture formu
- Testimonial fotoğrafları gerçek fotoğraflarla değiştirme
