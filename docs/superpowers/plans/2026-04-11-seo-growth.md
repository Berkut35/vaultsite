# SEO & Growth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add GitHub Releases changelog page, expand structured data (Organization + TR FAQ + Article/BreadcrumbList), strengthen keyword metadata, and add alternates to blog/docs inner pages.

**Architecture:** Changelog is a Next.js 15 Server Component (`app/[lang]/changelog/page.tsx`) that fetches GitHub Releases at build time via `lib/github.ts`. Structured data lives in two components: the existing `components/JsonLd.tsx` (site-wide, now with `lang` prop) and a new `components/ArticleJsonLd.tsx` (per-page blog/docs). Layout `generateMetadata` gets keyword expansion. Blog/docs slug pages get hreflang `alternates` and `ArticleJsonLd`.

**Tech Stack:** Next.js 15 App Router, TypeScript, GitHub Releases API (public, no auth required for public repos), ReactMarkdown (already installed), Framer Motion (already installed)

**Discovery note:** `app/[lang]/layout.tsx` already has `twitter` card metadata and hreflang `alternates` — those tasks are skipped. Only genuinely missing pieces are implemented below.

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `lib/github.ts` | CREATE | GitHub Releases fetch — `Release` type + `getReleases()` |
| `components/sections/ChangelogEntry.tsx` | CREATE | Renders one GitHub Release as a styled card |
| `app/[lang]/changelog/page.tsx` | CREATE | Changelog page — SSG, fetches releases at build time |
| `app/sitemap.ts` | MODIFY | Add `/[lang]/changelog` URLs |
| `components/ArticleJsonLd.tsx` | CREATE | BreadcrumbList + Article/TechArticle schema for blog/docs |
| `components/JsonLd.tsx` | MODIFY | Add `lang` prop, Organization schema, TR FAQ questions |
| `app/[lang]/layout.tsx` | MODIFY | Pass `lang` to `<JsonLd>`, expand keyword array |
| `app/[lang]/blog/[slug]/page.tsx` | MODIFY | Add `alternates` metadata + `<ArticleJsonLd>` |
| `app/[lang]/docs/[slug]/page.tsx` | MODIFY | Add `alternates` metadata + `<ArticleJsonLd>` |

---

## Task 1: GitHub Releases Data Layer

**Files:**
- Create: `lib/github.ts`

- [ ] **Step 1: Create `lib/github.ts`**

```ts
export type Release = {
  tag_name: string;      // "v1.2.0"
  name: string;          // "Vault 1.2.0"
  published_at: string;  // ISO date string
  body: string;          // markdown release notes
};

export async function getReleases(): Promise<Release[]> {
  try {
    const res = await fetch(
      'https://api.github.com/repos/Berkut35/vault-releases/releases',
      {
        headers: {
          Accept: 'application/vnd.github+json',
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: false }, // build-time SSG only
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}
```

- [ ] **Step 2: Verify build**

```bash
cd /c/Uygulama/Vaultsite && npm run build
```

Expected: No TypeScript errors. `lib/github.ts` compiles cleanly.

- [ ] **Step 3: Commit**

```bash
cd /c/Uygulama/Vaultsite
git add lib/github.ts
git commit -m "feat(seo): add GitHub Releases data layer"
```

---

## Task 2: ChangelogEntry Component

**Files:**
- Create: `components/sections/ChangelogEntry.tsx`

- [ ] **Step 1: Create `components/sections/ChangelogEntry.tsx`**

```tsx
import ReactMarkdown from 'react-markdown';
import type { Release } from '@/lib/github';

interface ChangelogEntryProps {
  release: Release;
  lang: 'en' | 'tr';
}

export function ChangelogEntry({ release, lang }: ChangelogEntryProps) {
  const date = new Date(release.published_at).toLocaleDateString(
    lang === 'tr' ? 'tr-TR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <div style={{
      paddingBottom: 48,
      marginBottom: 48,
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{
          fontFamily: 'monospace',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--accent-purple)',
          background: 'rgba(168,85,247,0.1)',
          border: '1px solid rgba(168,85,247,0.25)',
          borderRadius: 6,
          padding: '2px 8px',
        }}>
          {release.tag_name}
        </span>
        <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: '"DM Sans", sans-serif' }}>
          {date}
        </span>
      </div>

      {release.name && (
        <h2 style={{
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 16,
          fontFamily: '"DM Sans", sans-serif',
          letterSpacing: '-0.02em',
        }}>
          {release.name}
        </h2>
      )}

      <div style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)', fontFamily: '"DM Sans", sans-serif' }}>
        <ReactMarkdown>{release.body ?? ''}</ReactMarkdown>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
cd /c/Uygulama/Vaultsite && npm run build
```

Expected: No TypeScript errors. `ChangelogEntry` compiles cleanly.

- [ ] **Step 3: Commit**

```bash
cd /c/Uygulama/Vaultsite
git add components/sections/ChangelogEntry.tsx
git commit -m "feat(seo): add ChangelogEntry component"
```

---

## Task 3: Changelog Page

**Files:**
- Create: `app/[lang]/changelog/page.tsx`

- [ ] **Step 1: Create `app/[lang]/changelog/page.tsx`**

```tsx
import type { Metadata } from 'next';
import type { Lang } from '@/lib/i18n';
import { getReleases } from '@/lib/github';
import { ChangelogEntry } from '@/components/sections/ChangelogEntry';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://vault.app';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang: Lang = langParam === 'tr' ? 'tr' : 'en';

  const title = lang === 'tr' ? 'Değişiklik Günlüğü | Vault' : 'Changelog | Vault';
  const description = lang === 'tr'
    ? 'Vault uygulamasının tüm güncellemeleri ve iyileştirmeleri.'
    : 'Every update and improvement to the Vault app.';

  return {
    title,
    description,
    alternates: {
      canonical: `${APP_URL}/${lang}/changelog`,
      languages: {
        en: `${APP_URL}/en/changelog`,
        tr: `${APP_URL}/tr/changelog`,
      },
    },
  };
}

export default async function ChangelogPage({ params }: PageProps) {
  const { lang: langParam } = await params;
  const lang: Lang = langParam === 'tr' ? 'tr' : 'en';
  const releases = await getReleases();

  const titleText   = lang === 'tr' ? 'Değişiklik Günlüğü' : 'Changelog';
  const subtitleText = lang === 'tr'
    ? 'Her güncelleme, her iyileştirme.'
    : 'Every update, every improvement.';
  const emptyText   = lang === 'tr' ? 'Henüz yayın yok.' : 'No releases yet.';

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: '48rem', margin: '0 auto', padding: 'clamp(64px, 10vw, 128px) 24px' }}>
        <h1 style={{
          fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: 700,
          letterSpacing: '-0.035em',
          color: 'var(--text-primary)',
          fontFamily: '"DM Sans", sans-serif',
          marginBottom: 8,
          lineHeight: 1.1,
        }}>
          {titleText}
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 64, fontFamily: '"DM Sans", sans-serif' }}>
          {subtitleText}
        </p>

        {releases.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 14, fontFamily: '"DM Sans", sans-serif' }}>
            {emptyText}
          </p>
        ) : (
          releases.map((release) => (
            <ChangelogEntry key={release.tag_name} release={release} lang={lang} />
          ))
        )}
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
cd /c/Uygulama/Vaultsite && npm run build
```

Expected: No TypeScript errors. Routes `/en/changelog` and `/tr/changelog` appear in build output.

- [ ] **Step 3: Verify pages render**

```bash
cd /c/Uygulama/Vaultsite && npm run dev
```

Open `http://localhost:3000/en/changelog` and `http://localhost:3000/tr/changelog`. Both pages load; if no releases exist, "No releases yet." / "Henüz yayın yok." is shown.

- [ ] **Step 4: Commit**

```bash
cd /c/Uygulama/Vaultsite
git add app/\[lang\]/changelog/page.tsx
git commit -m "feat(seo): add changelog page fetching GitHub Releases at build time"
```

---

## Task 4: Sitemap — Add Changelog URLs

**Files:**
- Modify: `app/sitemap.ts`

- [ ] **Step 1: Read current sitemap**

Current `app/sitemap.ts`:

```ts
import { MetadataRoute } from 'next';
import { getAllDocumentSlugs } from '@/lib/markdown';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://vault.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = ['en', 'tr'];
  const scopes = ['blog', 'docs', 'legal'];

  const routes = languages.map((lang) => ({
    url: `${APP_URL}/${lang}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1,
  }));

  const dynamicRoutes = languages.flatMap((lang) =>
    scopes.flatMap((scope) => {
      const slugs = getAllDocumentSlugs(scope, lang);
      return slugs.map((slug) => ({
        url: `${APP_URL}/${lang}/${scope}/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
    })
  );

  return [...routes, ...dynamicRoutes];
}
```

- [ ] **Step 2: Add changelog routes**

Replace the `return` statement with:

```ts
  const changelogRoutes = languages.map((lang) => ({
    url: `${APP_URL}/${lang}/changelog`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes, ...dynamicRoutes, ...changelogRoutes];
```

Full updated file:

```ts
import { MetadataRoute } from 'next';
import { getAllDocumentSlugs } from '@/lib/markdown';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://vault.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = ['en', 'tr'];
  const scopes = ['blog', 'docs', 'legal'];

  const routes = languages.map((lang) => ({
    url: `${APP_URL}/${lang}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1,
  }));

  const dynamicRoutes = languages.flatMap((lang) =>
    scopes.flatMap((scope) => {
      const slugs = getAllDocumentSlugs(scope, lang);
      return slugs.map((slug) => ({
        url: `${APP_URL}/${lang}/${scope}/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
    })
  );

  const changelogRoutes = languages.map((lang) => ({
    url: `${APP_URL}/${lang}/changelog`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes, ...dynamicRoutes, ...changelogRoutes];
}
```

- [ ] **Step 3: Verify sitemap**

```bash
cd /c/Uygulama/Vaultsite && npm run build && npm run start
```

Open `http://localhost:3000/sitemap.xml`. Verify `/en/changelog` and `/tr/changelog` appear in the output.

- [ ] **Step 4: Commit**

```bash
cd /c/Uygulama/Vaultsite
git add app/sitemap.ts
git commit -m "feat(seo): add changelog URLs to sitemap"
```

---

## Task 5: ArticleJsonLd Component

**Files:**
- Create: `components/ArticleJsonLd.tsx`

- [ ] **Step 1: Create `components/ArticleJsonLd.tsx`**

```tsx
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://vault.app';

interface Breadcrumb {
  name: string;
  item: string;
}

interface ArticleJsonLdProps {
  title: string;
  description: string;
  date?: string;
  url: string;
  lang: 'en' | 'tr';
  section: 'blog' | 'docs';
  breadcrumbs: Breadcrumb[];
}

export function ArticleJsonLd({ title, description, date, url, lang, section, breadcrumbs }: ArticleJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: breadcrumbs.map((crumb, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: crumb.name,
          item: crumb.item,
        })),
      },
      {
        '@type': section === 'blog' ? 'Article' : 'TechArticle',
        '@id': `${url}#article`,
        headline: title,
        description,
        author: { '@type': 'Organization', name: 'Vault' },
        publisher: { '@type': 'Organization', name: 'Vault', url: APP_URL },
        inLanguage: lang === 'tr' ? 'tr-TR' : 'en-US',
        url,
        ...(date ? { datePublished: date } : {}),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

- [ ] **Step 2: Verify build**

```bash
cd /c/Uygulama/Vaultsite && npm run build
```

Expected: No TypeScript errors.

- [ ] **Step 3: Commit**

```bash
cd /c/Uygulama/Vaultsite
git add components/ArticleJsonLd.tsx
git commit -m "feat(seo): add ArticleJsonLd component with BreadcrumbList and Article schema"
```

---

## Task 6: JsonLd — Organization Schema + TR FAQ + lang prop

**Files:**
- Modify: `components/JsonLd.tsx`

- [ ] **Step 1: Rewrite `components/JsonLd.tsx`**

Replace the entire file content:

```tsx
interface JsonLdProps {
  lang: 'en' | 'tr';
}

const FAQ_EN = [
  {
    '@type': 'Question',
    name: 'Which file formats does Vault support?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Vault supports PDF (including scanned PDFs), EPUB, DOCX, and TXT. Each format has a dedicated reader with appropriate controls, full-text search, and themes tailored to that format.',
    },
  },
  {
    '@type': 'Question',
    name: 'How does the knowledge graph work?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'The knowledge graph is an infinite, physics-driven canvas where every document, quote, and note becomes a node. You can drag nodes freely, draw connections between them, and Vault uses force-directed layout to reveal natural clusters in your research.',
    },
  },
  {
    '@type': 'Question',
    name: 'Is my data private?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Yes. Vault is a local-first application. Your documents and annotations are stored on your device and never uploaded to any server. Only authentication tokens and group collaboration metadata are synced via Supabase — your file contents remain entirely private.',
    },
  },
  {
    '@type': 'Question',
    name: 'What is Smart Note Linking?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Smart Note Linking creates bidirectional connections between notes, quotes, and documents automatically. When you reference a concept across multiple sources, Vault links them so you can navigate your entire argument structure from any node.',
    },
  },
  {
    '@type': 'Question',
    name: 'How does Vault compare to Zotero?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Zotero is an excellent citation manager, but it lacks integrated reading, annotation, and knowledge graph capabilities. Vault combines all of these in a single workspace — you can read, annotate, link notes, build a visual argument map, and export citations without switching tools.',
    },
  },
];

const FAQ_TR = [
  {
    '@type': 'Question',
    name: 'Vault hangi dosya formatlarını destekliyor?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: "Vault, PDF (taranmış PDF'ler dahil), EPUB, DOCX ve TXT formatlarını desteklemektedir. Her format, uygun kontroller, tam metin arama ve o formata özel temalar içeren özel bir okuyucuya sahiptir.",
    },
  },
  {
    '@type': 'Question',
    name: 'Bilgi grafiği nasıl çalışıyor?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Bilgi grafiği, her belgenin, alıntının ve notun bir düğüme dönüştüğü sonsuz, fizik tabanlı bir tuvalidir. Düğümleri serbestçe sürükleyebilir, aralarında bağlantılar çizebilir ve Vault, araştırmalarınızdaki doğal kümeleri ortaya çıkarmak için kuvvet yönlendirmeli düzen kullanır.',
    },
  },
  {
    '@type': 'Question',
    name: 'Verilerim güvende mi?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: "Evet. Vault yerel öncelikli bir uygulamadır. Belgeleriniz ve notlarınız cihazınızda saklanır, hiçbir sunucuya yüklenmez. Yalnızca kimlik doğrulama token'ları ve grup işbirliği meta verileri Supabase üzerinden senkronize edilir; dosya içerikleriniz tamamen gizli kalır.",
    },
  },
  {
    '@type': 'Question',
    name: 'Akıllı Not Bağlama nedir?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Akıllı Not Bağlama, notlar, alıntılar ve belgeler arasında otomatik olarak çift yönlü bağlantılar oluşturur. Birden fazla kaynakta bir kavrama atıfta bulunduğunuzda Vault bunları birbirine bağlar; böylece herhangi bir düğümden tüm argüman yapınızda gezinebilirsiniz.',
    },
  },
  {
    '@type': 'Question',
    name: "Vault, Zotero'dan nasıl farklı?",
    acceptedAnswer: {
      '@type': 'Answer',
      text: "Zotero mükemmel bir kaynak yöneticisidir; ancak entegre okuma, açıklama ve bilgi grafiği özelliklerinden yoksundur. Vault tüm bunları tek bir çalışma alanında birleştirir; araç değiştirmeden okuyabilir, not alabilir, notları birbirine bağlayabilir, görsel bir argüman haritası oluşturabilir ve atıfları dışa aktarabilirsiniz.",
    },
  },
];

export function JsonLd({ lang }: JsonLdProps) {
  const faqItems = lang === 'tr' ? FAQ_TR : FAQ_EN;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://vault.app/#organization',
        name: 'Vault',
        url: 'https://vault.app',
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://vault.app/#software',
        name: 'Vault',
        applicationCategory: 'EducationApplication',
        operatingSystem: 'Web, macOS, Windows',
        description:
          'Vault is an academic research platform for PDF annotation, note-linking, knowledge graphs, and citation management.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'TRY',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '10000',
        },
        featureList: [
          'PDF, EPUB, DOCX, TXT document reading and annotation',
          'Bidirectional smart note linking',
          'Knowledge graph — infinite physics-driven canvas',
          'Citation export in BibTeX, APA, and MLA formats',
          'Real-time collaborative reading groups',
          'Privacy-first local storage — files never leave your device',
          'Offline-first with 14-day sync grace period',
        ],
        author: {
          '@type': 'Organization',
          name: 'Vault',
        },
        url: 'https://vault.app',
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://vault.app/#faq',
        inLanguage: lang === 'tr' ? 'tr-TR' : 'en-US',
        mainEntity: faqItems,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
```

- [ ] **Step 2: Verify build**

```bash
cd /c/Uygulama/Vaultsite && npm run build
```

Expected: TypeScript error about `<JsonLd />` missing required `lang` prop in `app/[lang]/layout.tsx`. This is expected — fix in Step 3.

- [ ] **Step 3: Update `app/[lang]/layout.tsx` to pass `lang` prop**

In `app/[lang]/layout.tsx`, find line 98:
```tsx
        <JsonLd />
```

Replace with:
```tsx
        <JsonLd lang={lang} />
```

- [ ] **Step 4: Verify build passes**

```bash
cd /c/Uygulama/Vaultsite && npm run build
```

Expected: No TypeScript errors.

- [ ] **Step 5: Commit**

```bash
cd /c/Uygulama/Vaultsite
git add components/JsonLd.tsx app/\[lang\]/layout.tsx
git commit -m "feat(seo): add Organization schema and TR FAQ to JsonLd, add lang prop"
```

---

## Task 7: Keyword Expansion

**Files:**
- Modify: `app/[lang]/layout.tsx`

- [ ] **Step 1: Expand keyword list in `generateMetadata`**

In `app/[lang]/layout.tsx`, find the `keywords` array (lines ~31–42):

```ts
    keywords: [
      'academic research software',
      'akademik araştırma aracı',
      'PDF annotation tool',
      'PDF okuyucu ve not alma',
      'citation manager',
      'atıf yönetimi',
      'knowledge graph',
      'bilgi grafiği',
      'research note-taking',
      'Zotero alternative',
    ],
```

Replace with:

```ts
    keywords: [
      // EN — high-intent academic terms
      'academic research software',
      'PDF annotation tool',
      'citation manager',
      'knowledge graph',
      'research note-taking',
      'Zotero alternative',
      'Mendeley alternative',
      'literature review software',
      'PhD research tool',
      'reference management software',
      'academic PDF reader',
      'research workspace',
      'BibTeX citation manager',
      // TR — high-intent academic terms
      'akademik araştırma aracı',
      'PDF okuyucu ve not alma',
      'atıf yönetimi',
      'bilgi grafiği',
      'Zotero alternatifi',
      'Mendeley alternatifi',
      'literatür tarama aracı',
      'doktora araştırma aracı',
      'kaynak yönetimi yazılımı',
      'akademik PDF okuyucu',
      'araştırma çalışma alanı',
      'BibTeX atıf yöneticisi',
      'tez araştırma programı',
    ],
```

- [ ] **Step 2: Verify build**

```bash
cd /c/Uygulama/Vaultsite && npm run build
```

Expected: No TypeScript errors.

- [ ] **Step 3: Commit**

```bash
cd /c/Uygulama/Vaultsite
git add app/\[lang\]/layout.tsx
git commit -m "feat(seo): expand keyword list with high-intent academic search terms"
```

---

## Task 8: Blog Slug Page — Alternates + ArticleJsonLd

**Files:**
- Modify: `app/[lang]/blog/[slug]/page.tsx`

- [ ] **Step 1: Rewrite `app/[lang]/blog/[slug]/page.tsx`**

Full updated file:

```tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { getMarkdownDocument, getAllDocumentSlugs } from '@/lib/markdown';
import ReactMarkdown from 'react-markdown';
import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArticleJsonLd } from '@/components/ArticleJsonLd';
import type { Lang } from '@/lib/i18n';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://vault.app';

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const lang: Lang = resolvedParams.lang === 'tr' ? 'tr' : 'en';
  const doc = getMarkdownDocument('blog', resolvedParams.lang, resolvedParams.slug);

  if (!doc) return { title: 'Not Found' };

  return {
    title: `${doc.frontmatter.title} | Vault Blog`,
    description: doc.frontmatter.description,
    alternates: {
      canonical: `${APP_URL}/${lang}/blog/${resolvedParams.slug}`,
      languages: {
        en: `${APP_URL}/en/blog/${resolvedParams.slug}`,
        tr: `${APP_URL}/tr/blog/${resolvedParams.slug}`,
      },
    },
  };
}

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  const langs = ['en', 'tr'];
  
  for (const lang of langs) {
    const slugs = getAllDocumentSlugs('blog', lang);
    for (const slug of slugs) {
      params.push({ lang, slug });
    }
  }

  return params;
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const lang: Lang = resolvedParams.lang === 'tr' ? 'tr' : 'en';
  const doc = getMarkdownDocument('blog', resolvedParams.lang, resolvedParams.slug);

  if (!doc) notFound();

  const pageUrl = `${APP_URL}/${lang}/blog/${resolvedParams.slug}`;
  const breadcrumbs = [
    { name: lang === 'tr' ? 'Ana Sayfa' : 'Home', item: `${APP_URL}/${lang}` },
    { name: 'Blog', item: `${APP_URL}/${lang}/blog` },
    { name: doc.frontmatter.title, item: pageUrl },
  ];

  return (
    <>
      <ArticleJsonLd
        title={doc.frontmatter.title}
        description={doc.frontmatter.description ?? ''}
        date={doc.frontmatter.date}
        url={pageUrl}
        lang={lang}
        section="blog"
        breadcrumbs={breadcrumbs}
      />
      <Navbar />
      <main className="min-h-screen pt-32 pb-16 px-6 relative z-10">
        <div className="max-w-3xl mx-auto vault-card rounded-card p-8 md:p-12 border border-vault-border">
          <a href={`/${resolvedParams.lang}/blog`} className="text-accent-purple hover:underline text-sm font-medium inline-block mb-8">
            ← {resolvedParams.lang === 'tr' ? 'Blog Anasayfasına Dön' : 'Back to Blog'}
          </a>
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold font-sans tracking-tight mb-4 text-text-primary">
              {doc.frontmatter.title}
            </h1>
            <div className="flex items-center gap-4 text-text-secondary text-sm">
              <span>{doc.frontmatter.date}</span>
            </div>
          </header>
          
          <article className="prose prose-invert prose-purple max-w-none prose-headings:font-sans prose-headings:font-semibold prose-a:text-accent-purple hover:prose-a:text-accent-gold transition-colors">
            <ReactMarkdown>{doc.content}</ReactMarkdown>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
cd /c/Uygulama/Vaultsite && npm run build
```

Expected: No TypeScript errors. Blog slug pages still generate correctly.

- [ ] **Step 3: Commit**

```bash
cd /c/Uygulama/Vaultsite
git add app/\[lang\]/blog/\[slug\]/page.tsx
git commit -m "feat(seo): add hreflang alternates and ArticleJsonLd to blog post pages"
```

---

## Task 9: Docs Slug Page — Alternates + ArticleJsonLd

**Files:**
- Modify: `app/[lang]/docs/[slug]/page.tsx`

- [ ] **Step 1: Rewrite `app/[lang]/docs/[slug]/page.tsx`**

Full updated file:

```tsx
import React from 'react';
import { notFound } from 'next/navigation';
import { getMarkdownDocument, getAllDocumentSlugs } from '@/lib/markdown';
import ReactMarkdown from 'react-markdown';
import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArticleJsonLd } from '@/components/ArticleJsonLd';
import type { Lang } from '@/lib/i18n';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://vault.app';

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const lang: Lang = resolvedParams.lang === 'tr' ? 'tr' : 'en';
  const doc = getMarkdownDocument('docs', resolvedParams.lang, resolvedParams.slug);

  if (!doc) return { title: 'Not Found' };

  return {
    title: `${doc.frontmatter.title} | Vault Docs`,
    description: doc.frontmatter.description,
    alternates: {
      canonical: `${APP_URL}/${lang}/docs/${resolvedParams.slug}`,
      languages: {
        en: `${APP_URL}/en/docs/${resolvedParams.slug}`,
        tr: `${APP_URL}/tr/docs/${resolvedParams.slug}`,
      },
    },
  };
}

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  const langs = ['en', 'tr'];
  
  for (const lang of langs) {
    const slugs = getAllDocumentSlugs('docs', lang);
    for (const slug of slugs) {
      params.push({ lang, slug });
    }
  }

  return params;
}

export default async function DocsPostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const lang: Lang = resolvedParams.lang === 'tr' ? 'tr' : 'en';
  const doc = getMarkdownDocument('docs', resolvedParams.lang, resolvedParams.slug);

  if (!doc) notFound();

  const pageUrl = `${APP_URL}/${lang}/docs/${resolvedParams.slug}`;
  const docsLabel = lang === 'tr' ? 'Belgeler' : 'Docs';
  const breadcrumbs = [
    { name: lang === 'tr' ? 'Ana Sayfa' : 'Home', item: `${APP_URL}/${lang}` },
    { name: docsLabel, item: `${APP_URL}/${lang}/docs` },
    { name: doc.frontmatter.title, item: pageUrl },
  ];

  return (
    <>
      <ArticleJsonLd
        title={doc.frontmatter.title}
        description={doc.frontmatter.description ?? ''}
        date={doc.frontmatter.date}
        url={pageUrl}
        lang={lang}
        section="docs"
        breadcrumbs={breadcrumbs}
      />
      <Navbar />
      <main className="min-h-screen pt-32 pb-16 px-6 relative z-10">
        <div className="max-w-3xl mx-auto vault-card rounded-card p-8 md:p-12 border border-vault-border">
          <a href={`/${resolvedParams.lang}/docs`} className="text-accent-purple hover:underline text-sm font-medium inline-block mb-8">
            ← {resolvedParams.lang === 'tr' ? 'Belgelere Dön' : 'Back to Docs'}
          </a>
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold font-sans tracking-tight mb-4 text-text-primary">
              {doc.frontmatter.title}
            </h1>
            <div className="flex items-center gap-4 text-text-secondary text-sm">
              <span>{doc.frontmatter.date}</span>
            </div>
          </header>
          
          <article className="prose prose-invert prose-purple max-w-none prose-headings:font-sans prose-headings:font-semibold prose-a:text-accent-purple hover:prose-a:text-accent-gold transition-colors">
            <ReactMarkdown>{doc.content}</ReactMarkdown>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
cd /c/Uygulama/Vaultsite && npm run build
```

Expected: No TypeScript errors. All pages generate correctly.

- [ ] **Step 3: Final verification checklist**

```bash
# No remaining as-any in new files
grep -r "as any" lib/github.ts components/sections/ChangelogEntry.tsx app/\[lang\]/changelog/page.tsx components/ArticleJsonLd.tsx components/JsonLd.tsx 2>/dev/null
# Expected: no output
```

- [ ] **Step 4: Commit**

```bash
cd /c/Uygulama/Vaultsite
git add app/\[lang\]/docs/\[slug\]/page.tsx
git commit -m "feat(seo): add hreflang alternates and ArticleJsonLd to docs pages"
```

---

## Doğrulama

After all tasks complete:

1. `npm run build` — zero TypeScript errors
2. `/en/changelog` ve `/tr/changelog` açılıyor, release listesi görünüyor
3. `/sitemap.xml` içinde `changelog` URL'leri mevcut
4. Chrome DevTools → `<head>` → `<link rel="alternate" hreflang>` blog/docs slug sayfalarında görünüyor
5. Google Rich Results Test → `Organization`, `SoftwareApplication`, `FAQPage` (TR veya EN) doğrulanıyor
6. Blog post sayfasında `<script type="application/ld+json">` içinde `Article` ve `BreadcrumbList` var
