# Vaultsite — Area D: Teknik Kalite İyileştirmeleri

**Tarih:** 2026-04-10  
**Kapsam:** TypeScript `as any` düzeltmeleri (6 konum), `next/image` migrasyonu, CSP header, bundle analizi  
**Kapsam Dışı:** Blog altyapısı, SEO optimizasyonu, test coverage genişletme

---

## Bağlam

Vaultsite'ın mevcut kodunda 6 adet `as any` cast, 2 adet `<img>` etiketi, eksik CSP header ve bundle analizi altyapısı bulunmaktadır. Bu düzeltmeler TypeScript güvenliğini artırır, görselleri Next.js optimizasyon pipeline'ına taşır ve güvenlik duruşunu güçlendirir.

---

## Karar Alınan Yaklaşım

- `as any` → her konum için kök sebep tipini düzelt; Supabase için nesne spread overload kullan
- `<img>` → `next/image` `<Image>` bileşenine geç; SVG'ler için `unoptimized`
- CSP → `'unsafe-inline'` içeren pratik politika (Framer Motion uyumu)
- Bundle → `@next/bundle-analyzer` dev dependency olarak ekle

---

## Kritik Dosyalar

| Dosya | İşlem |
|---|---|
| `app/auth/callback/route.ts` | GÜNCELLE — `options as any` → object spread |
| `middleware.ts` | GÜNCELLE — `options as any` → object spread |
| `app/[lang]/layout.tsx` | GÜNCELLE — `lang as any` → `const lang: Lang` |
| `lib/i18n.tsx` | GÜNCELLE — testimonial item tipine `featured?`, `avatar?` ekle; comparison tipine `tooltips?` ekle |
| `components/sections/ComparisonTable.tsx` | GÜNCELLE — `(c as any).tooltips` cast kaldır |
| `components/sections/Testimonials.tsx` | GÜNCELLE — `(item as any)` cast'ler kaldır, `<img>` → `<Image>` |
| `components/sections/Hero.tsx` | GÜNCELLE — `<img>` → `<Image unoptimized>` |
| `next.config.js` | GÜNCELLE — remotePatterns, dangerouslyAllowSVG, CSP header, bundle analyzer |

---

## Tasarım Detayları

### 1. TypeScript `as any` Düzeltmeleri

#### 1a. Supabase Cookie (`route.ts:23`, `middleware.ts:35`)

**Root cause:** `@supabase/ssr`'nin `CookieOptions.sameSite` tipi `boolean` kabul eder; Next.js `ResponseCookie.sameSite` kabul etmez.

**Fix:** Positional overload yerine object overload kullan:

```ts
// Önce
cookieStore.set(name, value, options as any)

// Sonra
cookieStore.set({ name, value, ...options })
```

`eslint-disable` yorumları da kaldırılır.

#### 1b. `lang as any` (`app/[lang]/layout.tsx:102`)

**Root cause:** `resolvedParams.lang` tipi `string`, `LanguageProvider.initialLang` tipi `Lang`.

**Fix:**
```ts
import type { Lang } from '@/lib/i18n';

// Önce
const lang = resolvedParams.lang === 'tr' ? 'tr' : 'en';
<LanguageProvider initialLang={lang as any}>

// Sonra
const lang: Lang = resolvedParams.lang === 'tr' ? 'tr' : 'en';
<LanguageProvider initialLang={lang}>
```

#### 1c. `(c as any).tooltips` (`ComparisonTable.tsx:107`)

**Fix:** i18n'deki comparison satır tipine `tooltips?: string[]` eklenir; cast kaldırılır.

#### 1d. `(item as any).featured` / `.avatar` (`Testimonials.tsx:21,51,52`)

**Fix:** i18n'deki testimonial item tipine opsiyonel alanlar eklenir:

```ts
type TestimonialItem = {
  quote:       string;
  name:        string;
  role:        string;
  institution: string;
  initials:    string;
  avatar?:     string | null;
  featured?:   boolean;
};
```

`(item as any)` cast'leri kaldırılır; `item.avatar`, `item.featured` olarak kullanılır.

---

### 2. `next/image` Migrasyonu

#### `next.config.js` güncellemeleri

```js
images: {
  formats: ['image/avif', 'image/webp'],
  dangerouslyAllowSVG: true,
  contentDispositionType: 'attachment',
  remotePatterns: [
    { protocol: 'https', hostname: 'images.unsplash.com' },
    { protocol: 'https', hostname: 'upload.wikimedia.org' },
  ],
},
```

#### Hero.tsx — üniversite logoları

SVG dosyaları için format dönüşümü yapılamaz; `unoptimized` prop ile lazy loading ve remotePatterns güvenliği sağlanır:

```tsx
import Image from 'next/image';

<Image
  src={univ.src}
  alt={univ.name}
  width={80}
  height={28}
  unoptimized
  style={{
    height: '100%',
    width: 'auto',
    filter: 'grayscale(1) brightness(0) invert(1)',
    opacity: 0.45,
    objectFit: 'contain',
  }}
/>
```

#### Testimonials.tsx — avatar fotoğrafları

Unsplash JPEG'leri WebP/AVIF'e dönüştürülür + lazy loading:

```tsx
import Image from 'next/image';

{item.avatar ? (
  <Image
    src={item.avatar}
    alt={item.name}
    width={38}
    height={38}
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  />
) : (
  item.initials
)}
```

---

### 3. CSP Header

`next.config.js` `headers()` fonksiyonuna eklenir:

```js
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https://images.unsplash.com https://upload.wikimedia.org",
    "connect-src 'self' https://*.supabase.co https://vitals.vercel-insights.com",
    "frame-ancestors 'none'",
  ].join('; '),
}
```

**Gerekçeler:**
- `'unsafe-inline'` — Framer Motion inline stiller + Next.js hydration script'leri
- `va.vercel-scripts.com` — `<VercelAnalytics />` (layout.tsx)
- `fonts.googleapis.com` / `fonts.gstatic.com` — Google Fonts (layout.tsx preconnect)
- `upload.wikimedia.org` — Hero SVG logoları
- `*.supabase.co` — Auth API + Realtime

---

### 4. Bundle Analizi

```bash
npm install --save-dev @next/bundle-analyzer
```

`next.config.js` güncellenir:

```js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer(nextConfig);
```

Kullanım: `ANALYZE=true npm run build` → `.next/analyze/client.html` + `server.html`

---

## Doğrulama

1. `npm run build` — TypeScript hatası yok mu?
2. `as any` hiçbir bileşen dosyasında kalmadı mı? (`grep -r "as any" --include="*.tsx" --include="*.ts"`)
3. Testimonials ve Hero görsellerinin Network sekmesinde WebP/AVIF olarak geldiği doğrulanır
4. CSP header'ın browser DevTools → Network → Response Headers'da göründüğü doğrulanır
5. Konsol'da CSP ihlali yoktur
6. `ANALYZE=true npm run build` → `.next/analyze/` klasörü oluşuyor mu?
