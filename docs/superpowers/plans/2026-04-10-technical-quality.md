# Technical Quality — Area D Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 6 TypeScript `as any` casts, migrate 2 `<img>` usages to `next/image`, add CSP header, and add bundle analyzer to the Vaultsite Next.js 15 landing page.

**Architecture:** Type fixes flow from i18n.tsx outward (define → consume). next/image requires next.config.js remotePatterns before component changes. CSP is added to next.config.js headers array. Bundle analyzer wraps the final config export.

**Tech Stack:** Next.js 15, TypeScript 5, next/image, @next/bundle-analyzer

---

## File Map

| File | Change |
|---|---|
| `lib/i18n.tsx` | Export `TestimonialItem` type |
| `components/sections/Testimonials.tsx` | Use `TestimonialItem`, `next/image`, remove all `as any` |
| `components/sections/ComparisonTable.tsx` | Fix `(c as any).tooltips` with local type extension |
| `app/[lang]/layout.tsx` | Import `Lang`, annotate `const lang: Lang`, remove `as any` |
| `app/auth/callback/route.ts` | Object spread form, remove `as any` + eslint-disable |
| `middleware.ts` | Object spread form, remove `as any` + eslint-disable |
| `next.config.js` | remotePatterns, dangerouslyAllowSVG, CSP header, bundle analyzer |
| `components/sections/Hero.tsx` | Replace `<img>` with `<Image unoptimized>` |

---

### Task 1: Export `TestimonialItem` type from `lib/i18n.tsx`

**Files:**
- Modify: `lib/i18n.tsx` (after line 799 — the `export type T` line)

- [ ] **Step 1: Add the type export**

In `lib/i18n.tsx`, find the two export type lines:
```ts
export type Lang = keyof typeof translations;
export type T = typeof translations.en;
```

Add immediately after them:
```ts
export type TestimonialItem = {
  quote:       string;
  name:        string;
  role:        string;
  institution: string;
  initials:    string;
  avatar?:     string | null;
  featured?:   boolean;
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd C:/Uygulama/Vaultsite && npx tsc --noEmit
```

Expected: no errors (or same errors as before — count them to confirm no regression).

- [ ] **Step 3: Commit**

```bash
cd C:/Uygulama/Vaultsite && git add lib/i18n.tsx && git commit -m "types: export TestimonialItem from i18n"
```

---

### Task 2: Fix `Testimonials.tsx` — remove `as any`, migrate to `next/image`

**Files:**
- Modify: `components/sections/Testimonials.tsx`

Current file has `(item as any).featured`, `(item as any).avatar`, and `<img>` tag.

- [ ] **Step 1: Replace the entire file content**

```tsx
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';
import type { TestimonialItem } from '@/lib/i18n';

export function Testimonials() {
  const { t } = useLang();
  const items = t.testimonials.items as TestimonialItem[];

  return (
    <section id="testimonials" style={{ padding: 'clamp(64px, 10vw, 128px) 24px' }} aria-labelledby="testimonials-heading">
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55, ease: 'easeOut' }} style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 id="testimonials-heading" style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 700, letterSpacing: '-0.035em', color: 'var(--text-primary)', lineHeight: 1.1, fontFamily: '"DM Sans", sans-serif' }}>
            {t.testimonials.title}
          </h2>
        </motion.div>

        <div style={{ display: 'grid', gap: 16 }} className="grid grid-cols-1 md:grid-cols-3">
          {items.map((item, i) => {
            const isFeatured = item.featured === true;
            return (
              <motion.article
                key={item.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: 'easeOut' }}
                className={isFeatured ? 'col-span-1 md:col-span-3' : undefined}
                style={{
                  background:          isFeatured ? 'rgba(168,85,247,0.05)' : 'rgba(255,255,255,0.02)',
                  backdropFilter:      'blur(20px)',
                  WebkitBackdropFilter:'blur(20px)',
                  borderTop:           '1px solid var(--border-subtle)',
                  borderRight:         '1px solid var(--border-subtle)',
                  borderBottom:        '1px solid var(--border-subtle)',
                  borderLeft:          isFeatured ? '3px solid rgba(168,85,247,0.45)' : '1px solid var(--border-subtle)',
                  borderRadius:        16,
                  padding:             '32px 28px',
                  display:             'flex',
                  flexDirection:       'column',
                  gap:                 24,
                }}
              >
                <div style={{ color: 'var(--accent-gold)', fontSize: 13, letterSpacing: '0.05em' }} aria-label="5 stars">★★★★★</div>
                <blockquote style={{ fontSize: isFeatured ? 16.5 : 15.5, lineHeight: 1.72, color: 'rgba(240,240,240,0.82)', flex: 1, fontFamily: '"DM Serif Display", serif', fontStyle: 'italic', margin: 0 }}>
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div aria-hidden="true" style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'rgba(168,85,247,0.9)', fontFamily: '"DM Sans", sans-serif', flexShrink: 0, overflow: 'hidden' }}>
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

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd C:/Uygulama/Vaultsite && npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
cd C:/Uygulama/Vaultsite && git add components/sections/Testimonials.tsx && git commit -m "fix(types): remove as-any casts in Testimonials, migrate to next/image"
```

---

### Task 3: Fix `ComparisonTable.tsx` — `(c as any).tooltips`

**Files:**
- Modify: `components/sections/ComparisonTable.tsx` (line 107)

The fix: extend the local `c` type with `tooltips?` instead of casting to `any`.

- [ ] **Step 1: Replace the `c` assignment line**

Find in `components/sections/ComparisonTable.tsx`:
```ts
  const c = t.comparison;
```

Replace with:
```ts
  const c = t.comparison as typeof t.comparison & { tooltips?: (string | undefined)[] };
```

- [ ] **Step 2: Remove the `as any` cast on line 107**

Find:
```tsx
                      <FeatureLabel label={rowLabel} tooltip={(c as any).tooltips?.[i]} />
```

Replace with:
```tsx
                      <FeatureLabel label={rowLabel} tooltip={c.tooltips?.[i]} />
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd C:/Uygulama/Vaultsite && npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
cd C:/Uygulama/Vaultsite && git add components/sections/ComparisonTable.tsx && git commit -m "fix(types): replace as-any with typed extension in ComparisonTable"
```

---

### Task 4: Fix `layout.tsx` — `lang as any`

**Files:**
- Modify: `app/[lang]/layout.tsx`

- [ ] **Step 1: Add `Lang` import**

Find the imports at the top of `app/[lang]/layout.tsx`. Locate the line that imports from `@/lib/i18n` (e.g. `LanguageProvider` import). Add `Lang` to that import:

Find:
```ts
import { LanguageProvider } from '@/lib/i18n';
```

Replace with:
```ts
import { LanguageProvider } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';
```

(If there is no existing i18n import, add both lines near the other imports.)

- [ ] **Step 2: Annotate `lang` with the `Lang` type**

Find (around line 90):
```ts
  const lang = resolvedParams.lang === 'tr' ? 'tr' : 'en';
```

Replace with:
```ts
  const lang: Lang = resolvedParams.lang === 'tr' ? 'tr' : 'en';
```

- [ ] **Step 3: Remove `as any` from JSX**

Find:
```tsx
        <LanguageProvider initialLang={lang as any}>
```

Replace with:
```tsx
        <LanguageProvider initialLang={lang}>
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd C:/Uygulama/Vaultsite && npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
cd C:/Uygulama/Vaultsite && git add "app/[lang]/layout.tsx" && git commit -m "fix(types): annotate lang as Lang, remove as-any in layout"
```

---

### Task 5: Fix Supabase cookie `as any` — `route.ts` + `middleware.ts`

**Files:**
- Modify: `app/auth/callback/route.ts`
- Modify: `middleware.ts`

Root cause: the explicit `options?: object` annotation widens the type, causing a mismatch with Next.js's cookie API. Fix: remove the annotation and use the object spread overload.

- [ ] **Step 1: Update `app/auth/callback/route.ts`**

Find:
```ts
          setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cookieStore.set(name, value, options as any)
            );
          },
```

Replace with:
```ts
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set({ name, value, ...options })
            );
          },
```

- [ ] **Step 2: Update `middleware.ts`**

Find:
```ts
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options as any)
          );
        },
```

Replace with:
```ts
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set({ name, value, ...options })
          );
        },
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd C:/Uygulama/Vaultsite && npx tsc --noEmit
```

Expected: no new errors. If TypeScript still reports a type error on these lines due to Supabase/Next.js version mismatch, replace `{ name, value, ...options }` with `{ name, value, ...options } as Parameters<typeof cookieStore.set>[0]` for route.ts and `{ name, value, ...options } as Parameters<typeof response.cookies.set>[0]` for middleware.ts — this is a narrower cast than `as any`.

- [ ] **Step 4: Confirm no `as any` remains in these two files**

```bash
cd C:/Uygulama/Vaultsite && grep -n "as any" app/auth/callback/route.ts middleware.ts
```

Expected: no output.

- [ ] **Step 5: Commit**

```bash
cd C:/Uygulama/Vaultsite && git add app/auth/callback/route.ts middleware.ts && git commit -m "fix(types): remove as-any Supabase cookie workaround, use object spread overload"
```

---

### Task 6: Update `next.config.js` — remotePatterns, SVG, CSP

**Files:**
- Modify: `next.config.js`

- [ ] **Step 1: Replace the entire file**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',   value: 'nosniff' },
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-XSS-Protection',          value: '1; mode=block' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
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
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

- [ ] **Step 2: Verify build succeeds**

```bash
cd C:/Uygulama/Vaultsite && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully` or similar — no errors.

- [ ] **Step 3: Commit**

```bash
cd C:/Uygulama/Vaultsite && git add next.config.js && git commit -m "feat(config): add remotePatterns, dangerouslyAllowSVG, and CSP header"
```

---

### Task 7: Migrate Hero university logos to `next/image`

**Files:**
- Modify: `components/sections/Hero.tsx`

- [ ] **Step 1: Add `Image` import**

At the top of `components/sections/Hero.tsx`, add:
```tsx
import Image from 'next/image';
```

- [ ] **Step 2: Replace `<img>` with `<Image>`**

Find:
```tsx
                          <img 
                            src={univ.src} 
                            alt={univ.name} 
                            style={{ 
                              height: '100%', 
                              width: 'auto', 
                              filter: 'grayscale(1) brightness(0) invert(1)',
                              opacity: 0.45,
                              objectFit: 'contain'
                            }} 
                          />
```

Replace with:
```tsx
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

Note: `width={80}` is a layout hint only — `style.width: 'auto'` controls the rendered width. `unoptimized` is required because Next.js cannot convert SVG files to WebP/AVIF.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd C:/Uygulama/Vaultsite && npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 4: Confirm no `<img` tags remain in component files**

```bash
cd C:/Uygulama/Vaultsite && grep -rn "<img " components/ app/
```

Expected: no output.

- [ ] **Step 5: Commit**

```bash
cd C:/Uygulama/Vaultsite && git add components/sections/Hero.tsx && git commit -m "feat(perf): migrate Hero university logos to next/image"
```

---

### Task 8: Add bundle analyzer

**Files:**
- Modify: `next.config.js`
- Install: `@next/bundle-analyzer`

- [ ] **Step 1: Install the package**

```bash
cd C:/Uygulama/Vaultsite && npm install --save-dev @next/bundle-analyzer
```

Expected: package added to `devDependencies` in `package.json`.

- [ ] **Step 2: Wrap the config export in `next.config.js`**

Find at the bottom of `next.config.js`:
```js
module.exports = nextConfig;
```

Replace with:
```js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

Add this at the TOP of the file (before `nextConfig`):
```js
// Bundle analyzer — run with: ANALYZE=true npm run build
```

- [ ] **Step 3: Verify normal build still works**

```bash
cd C:/Uygulama/Vaultsite && npm run build 2>&1 | tail -10
```

Expected: builds successfully without opening browser (ANALYZE not set).

- [ ] **Step 4: Confirm no `as any` remains in any source file**

```bash
cd C:/Uygulama/Vaultsite && grep -rn "as any" --include="*.tsx" --include="*.ts" app/ components/ lib/ middleware.ts
```

Expected: no output (all 6 locations fixed).

- [ ] **Step 5: Commit**

```bash
cd C:/Uygulama/Vaultsite && git add next.config.js package.json package-lock.json && git commit -m "feat(dx): add @next/bundle-analyzer with ANALYZE=true flag"
```

---

## Doğrulama (Tüm Görevler Tamamlandıktan Sonra)

1. `npx tsc --noEmit` — TypeScript hatası yok
2. `grep -rn "as any" --include="*.tsx" --include="*.ts" app/ components/ lib/ middleware.ts` — çıktı yok
3. `grep -rn "<img " components/ app/` — çıktı yok
4. `npm run build` — başarıyla derlenir
5. `npm run dev` → tarayıcıda Network sekmesi → Testimonials avatar'ları WebP olarak gelir
6. DevTools → Network → Response Headers → `Content-Security-Policy` başlığı görünür
7. Konsol'da CSP ihlal hatası yok
8. `ANALYZE=true npm run build` → `.next/analyze/client.html` açılır
