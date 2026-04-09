# Vaultsite — Area C: İçerik & Pazarlama İyileştirmeleri

**Tarih:** 2026-04-10  
**Kapsam:** Pricing bölümü Academic + Institutional tier genişletmesi, Testimonials güçlendirmesi  
**Kapsam Dışı:** Blog altyapısı, docs genişletme, email capture formu

---

## Bağlam

Vaultsite'ın Pricing bölümünde yalnızca Free ve Pro planlar mevcut. Academic ve Institutional segmentler için ayrı fiyatlandırma ve özellik listesi sunulmuyor; bu hedef kitleye hitap eden içerik zayıf. Testimonials bölümündeki alıntılar genel; somut araştırma rakamları ve gerçekçi kullanım senaryoları içermiyor. 4. büyük "featured" testimonial yok.

---

## Karar Alınan Yaklaşım

**Pricing:** 2+2 ızgara — Free+Pro üst sıra (mevcut, korunur), "For Institutions" ayırıcı, Academic+Institutional alt sıra.  
**Testimonials:** 3 mevcut alıntı somut senaryolarla yenilenir + 1 "featured" (col-span-full) kart eklenir.

---

## Kritik Dosyalar

| Dosya | İşlem |
|---|---|
| `lib/i18n.tsx` | GÜNCELLE — Academic + Institutional plan verileri (EN+TR), `institutionsDivider` key, 4 testimonial güncelleme (EN+TR) |
| `components/sections/Pricing.tsx` | GÜNCELLE — `institutionPlans` ayrı dizi render, divider satırı, `custom` fiyat desteği |
| `components/sections/Testimonials.tsx` | GÜNCELLE — `featured` testimonial desteği, col-span-full layout |

---

## Tasarım Detayları

### 1. Pricing — 2+2 Layout

#### i18n Yapısı

`pricing` objesine şu yeni key'ler eklenir:

```ts
institutionsDivider: 'For Institutions'  // EN
institutionsDivider: 'Kurumlar İçin'     // TR

institutionPlans: [
  { /* Academic */ },
  { /* Institutional */ },
]
```

#### Academic Planı (EN)

```ts
{
  name:        'Academic',
  price:       '129',
  oldPrice:    '179',
  period:      'TRY/mo',
  description: 'For verified .edu accounts. All Pro features plus institutional tools.',
  cta:         'Verify .edu Account',
  ctaVariant:  'outline',
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
}
```

#### Institutional Planı (EN)

```ts
{
  name:        'Institutional',
  price:       'custom',
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
}
```

#### Akademik Planı (TR)

```ts
{
  name:        'Akademik',
  price:       '129',
  oldPrice:    '179',
  period:      'TRY/ay',
  description: 'Doğrulanmış .edu hesapları için. Tüm Pro özellikler + kurumsal araçlar.',
  cta:         '.edu Hesabını Doğrula',
  ctaVariant:  'outline',
  highlighted: false,
  badge:       'Akademik',
  features: [
    'Sınırsız belge',
    'Sınırsız okuma grupları',
    'Tüm dışa aktarma formatları',
    'Gelişmiş atıf araçları',
    'Kurumsal SSO',
    'Takım yönetim paneli',
    'Öncelikli destek',
  ],
}
```

#### Kurumsal Planı (TR)

```ts
{
  name:        'Kurumsal',
  price:       'custom',
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
}
```

#### `Pricing.tsx` Değişiklikleri

1. `p.plans` (Free+Pro) ve `p.institutionPlans` (Academic+Institutional) ayrı render edilir.
2. Grid wrapper `maxWidth: '840px'` → `maxWidth: '900px'` (biraz genişler).
3. `p.plans.map(...)` sonrasına divider satırı eklenir:

```tsx
<div className="col-span-full" style={{
  display: 'flex', alignItems: 'center', gap: 16,
  padding: '8px 0', marginTop: 8
}}>
  <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
  <span style={{
    fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)',
    textTransform: 'uppercase', letterSpacing: '0.1em',
    fontFamily: '"DM Sans", sans-serif'
  }}>
    {p.institutionsDivider}
  </span>
  <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
</div>
```

4. Ardından `p.institutionPlans.map(...)` (aynı kart şablonu, index offset `p.plans.length + 1`).
5. Fiyat render kuralı:
   - `plan.price === 'custom'` → `"Custom"` / `"Özel"` metni gösterilir, `₺` ve period gizlenir.
   - `plan.price === '0'` → mevcut mantık korunur.
6. CTA `<a href="#">` → `<a href={(plan as any).ctaHref ?? '#'}>` (Institutional için mailto desteği).
7. Badge renk kuralı:
   - `plan.badge === 'Academic'` veya `plan.badge === 'Akademik'` → mor `rgba(168,85,247,...)` tema.
   - `plan.badge === 'Enterprise'` veya `plan.badge === 'Kurumsal'` → altın `rgba(251,191,36,...)` tema (mevcut badge stili).

---

### 2. Testimonials — Güçlendirilmiş İçerik + Featured Kart

#### Güncel İçerik (EN)

```ts
items: [
  {
    quote: 'I had over 300 sources across six years of longitudinal fieldwork. Vault\'s knowledge graph was the first tool that let me see — and show my committee — how every source connected to my central argument. My defense was stronger because of it.',
    name:        'Dr. Sarah Chen',
    role:        'Associate Professor of Sociology',
    institution: 'Stanford University',
    initials:    'SC',
    avatar:      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    quote: 'Note-linking removed the single biggest bottleneck in my writing process. I no longer spend hours hunting for the source behind a half-remembered idea. Every annotation is one click from its original context, and my supervisor has commented on how my arguments are better-evidenced now.',
    name:        'Marcus Holt',
    role:        'PhD Candidate in History',
    institution: 'University of Cambridge',
    initials:    'MH',
    avatar:      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    quote: 'I ran 18 months of fieldwork in regions with intermittent connectivity. Vault never missed a beat — everything worked offline, and when I returned to a network, my entire annotated archive was intact and ready. No other tool in my workflow even attempted this.',
    name:        'Prof. Elif Yıldız',
    role:        'Computational Linguistics',
    institution: 'Middle East Technical University',
    initials:    'EY',
    avatar:      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    quote: 'I supervise twelve PhD students, each with their own sprawling corpus of sources. Vault\'s reading groups let me see exactly where each student is in their literature review, annotate directly on their sources, and keep our group\'s shared bibliography synchronized — without a single email chain. It has genuinely changed how I run a research lab.',
    name:        'Prof. Arjun Mehta',
    role:        'Research Group Lead, Dept. of Computer Science',
    institution: 'Indian Institute of Technology Delhi',
    initials:    'AM',
    avatar:      null,
    featured:    true,
  },
]
```

#### Güncel İçerik (TR)

```ts
items: [
  {
    quote: '6 yıllık boylamsal saha araştırmamdan 300'ü aşkın kaynağım vardı. Vault\'ın bilgi grafiği, her kaynağın merkezi argümanımla nasıl bağlandığını hem benim görmemi hem de komiteme göstermemi sağlayan ilk araç oldu. Savunmam bu sayede çok daha güçlüydü.',
    name:        'Dr. Sarah Chen',
    role:        'Sosyoloji Doçenti',
    institution: 'Stanford Üniversitesi',
    initials:    'SC',
    avatar:      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    quote: 'Not bağlama özelliği, yazma sürecimdeki en büyük darboğazı ortadan kaldırdı. Artık aklımın köşesinde kalan bir fikrin kaynağını saatlerce aramıyorum. Her alıntı, orijinal bağlamına tek tıkla ulaşılabilir durumda; danışmanım argümanlarımın artık daha iyi desteklendiğini söylüyor.',
    name:        'Marcus Holt',
    role:        'Tarih Doktora Adayı',
    institution: 'Cambridge Üniversitesi',
    initials:    'MH',
    avatar:      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    quote: '18 ay boyunca internet bağlantısının kesintili olduğu bölgelerde saha çalışması yürüttüm. Vault hiç aksatmadı — her şey çevrimdışı çalıştı; ağa döndüğümde tüm notlu arşivim eksiksiz ve kullanıma hazırdı. Çalışma akışımdaki başka hiçbir araç bunu denemeye bile kalkışmadı.',
    name:        'Prof. Elif Yıldız',
    role:        'Hesaplamalı Dilbilim',
    institution: 'Orta Doğu Teknik Üniversitesi',
    initials:    'EY',
    avatar:      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200',
  },
  {
    quote: 'On iki doktora öğrencisini danışmanlık yapıyorum; her birinin kendi geniş kaynak külliyatı var. Vault\'ın okuma grupları her öğrencinin literatür taramasında tam olarak nerede olduğunu görmemi, doğrudan kaynaklarına not düşmemi ve grubumuzun ortak kaynakçasını tek bir e-posta zinciri olmadan senkronize tutmamı sağlıyor. Bir araştırma laboratuvarını yönetme biçimimi gerçekten değiştirdi.',
    name:        'Prof. Arjun Mehta',
    role:        'Araştırma Grubu Lideri, Bilgisayar Müh. Bölümü',
    institution: 'Hindistan Teknoloji Enstitüsü Delhi',
    initials:    'AM',
    avatar:      null,
    featured:    true,
  },
]
```

#### `Testimonials.tsx` Değişiklikleri

1. Grid: `grid-cols-1 md:grid-cols-3` korunur.
2. `featured: true` olan kart `md:col-span-3` alır (tam genişlik).
3. Featured kart stili:

```tsx
const isFeatured = (item as any).featured === true;

// article style ek özellikler (featured):
borderLeft: isFeatured ? '3px solid rgba(168,85,247,0.45)' : undefined,
background:  isFeatured ? 'rgba(168,85,247,0.05)' : 'rgba(255,255,255,0.02)',

// blockquote font-size (featured):
fontSize: isFeatured ? 16.5 : 15.5,

// motion.article className (featured):
className={isFeatured ? 'md:col-span-3' : undefined}
```

---

## Erişilebilirlik

- Institutional `mailto:` CTA: `aria-label="Contact Sales via email"` eklenir.
- Featured testimonial `<article>` üzerinde `aria-label` değişmez, `blockquote` `itemProp="text"` Schema.org uyumu devam eder.

---

## Doğrulama

1. `npm run dev` → Pricing'de 4 kart görünüyor mu? Ayırıcı doğru konumda mı?
2. Academic kart: `₺129` + `-₺50 indirim` + `Akademik` badge (mor) — doğru mu?
3. Institutional kart: "Custom" / "Özel" fiyat, mailto CTA — doğru mu?
4. Mobile'da (375px) 4 kart alt alta, ayırıcı tam genişlik — düzgün mü?
5. Testimonials'da 4. kart tam genişlik, mor sol kenar var mı?
6. `npm run build` — TypeScript hatası yok mu?
