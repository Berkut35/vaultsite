# Vaultsite — Area E: SEO & Büyüme

**Tarih:** 2026-04-11  
**Kapsam:** Hreflang + Twitter metadata, structured data genişletme (Organization, BreadcrumbList, Article, TR FAQ), keyword güçlendirme, otomatik changelog sayfası (GitHub Releases)  
**Kapsam Dışı:** OG image generate altyapısı (`@vercel/og`), partnerships sayfası, blog içerik genişletme, `Product` şeması

---

## Bağlam

Vaultsite'ın mevcut SEO altyapısı kısmen mevcuttur: `robots.ts`, `sitemap.ts`, `JsonLd.tsx` (`SoftwareApplication` + `FAQPage`), `generateMetadata` (OG tags, keywords). Ancak kritik eksikler bulunmaktadır:

- Hreflang alternates yok — TR/EN geçişinde Google doğru dili seçemiyor
- Twitter/X card metadata yok
- `FAQPage` structured data yalnızca İngilizce
- Blog/docs inner sayfalarında `Article` ve `BreadcrumbList` şeması yok
- `Organization` structured data yok
- Keyword listesi generic (yüksek-intent akademik terimler eksik)
- Changelog sayfası yok (kullanıcı güveni + SEO için değerli)

---

## Karar Alınan Yaklaşım

- Hreflang → Next.js `alternates.languages` metadata API
- Twitter card → `twitter` metadata objesi (mevcut `generateMetadata`'ya eklenir)
- Structured data → `JsonLd.tsx` genişletme + yeni `ArticleJsonLd.tsx` bileşeni
- FAQ → `lang` prop ile dile göre TR/EN şema seçimi
- Keyword → layout.tsx'te dil bazlı keyword dizileri genişletilir
- Changelog → GitHub Releases API'dan build-time SSG, tek sayfa `/[lang]/changelog`

---

## Kritik Dosyalar

| Dosya | İşlem |
|---|---|
| `app/[lang]/layout.tsx` | GÜNCELLE — `alternates`, `twitter` metadata; keyword dizisi genişletme |
| `app/[lang]/blog/[slug]/page.tsx` | GÜNCELLE — `alternates` + `ArticleJsonLd` |
| `app/[lang]/docs/[slug]/page.tsx` | GÜNCELLE — `alternates` + `ArticleJsonLd` |
| `components/JsonLd.tsx` | GÜNCELLE — `lang` prop ekle, `Organization` şeması ekle, TR FAQ ekle |
| `components/ArticleJsonLd.tsx` | YENİ — `BreadcrumbList` + `Article`/`TechArticle` şeması |
| `lib/github.ts` | YENİ — GitHub Releases API fetch fonksiyonu |
| `app/[lang]/changelog/page.tsx` | YENİ — Changelog sayfası (SSG) |
| `components/sections/ChangelogEntry.tsx` | YENİ — Tek release render bileşeni |
| `lib/i18n.tsx` | GÜNCELLE — `changelog` çeviri objesi ekle |
| `app/sitemap.ts` | GÜNCELLE — changelog URL'leri ekle |

---

## Tasarım Detayları

### 1. Hreflang + Twitter Metadata

`app/[lang]/layout.tsx` → `generateMetadata`:

```ts
alternates: {
  canonical: `${APP_URL}/${lang}`,
  languages: {
    'en': `${APP_URL}/en`,
    'tr': `${APP_URL}/tr`,
    'x-default': `${APP_URL}/en`,
  },
},
twitter: {
  card: 'summary_large_image',
  title,
  description,
  images: [`${APP_URL}/og-image.png`],
},
```

Blog ve docs slug sayfaları için alternates slug bazlı olur:

```ts
alternates: {
  canonical: `${APP_URL}/${lang}/blog/${slug}`,
  languages: {
    'en': `${APP_URL}/en/blog/${slug}`,
    'tr': `${APP_URL}/tr/blog/${slug}`,
  },
},
```

---

### 2. Structured Data Genişletme

#### `components/JsonLd.tsx` — Değişiklikler

`lang: 'en' | 'tr'` prop eklenir. `@graph` dizisine `Organization` eklenir. `FAQPage`'e TR dil desteği:

```ts
// Organization (her dilde aynı)
{
  '@type': 'Organization',
  '@id': 'https://vault.app/#organization',
  name: 'Vault',
  url: 'https://vault.app',
  // logo ve sameAs: public/logos/vault-logo.png eklendiğinde ve sosyal hesaplar doğrulandığında eklenecek
}

// FAQPage — lang prop'a göre TR veya EN sorular render edilir
```

TR FAQ soruları (5 adet, EN FAQ ile paralel içerik):
- "Vault hangi dosya formatlarını destekliyor?"
- "Bilgi grafiği nasıl çalışıyor?"
- "Verilerim güvende mi?"
- "Akıllı Not Bağlama nedir?"
- "Vault Zotero'dan nasıl farklı?"

#### `components/ArticleJsonLd.tsx` — Yeni Bileşen

```ts
interface ArticleJsonLdProps {
  title: string;
  description: string;
  date: string;          // ISO date string
  url: string;
  lang: 'en' | 'tr';
  section: 'blog' | 'docs';
  breadcrumbs: Array<{ name: string; item: string }>;
}

export function ArticleJsonLd({ title, description, date, url, lang, section, breadcrumbs }: ArticleJsonLdProps)
```

Şema çıktısı:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://vault.app/en" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://vault.app/en/blog" },
        { "@type": "ListItem", "position": 3, "name": "Article Title", "item": "https://vault.app/en/blog/slug" }
      ]
    },
    {
      "@type": "Article",
      "headline": "Article Title",
      "description": "...",
      "author": { "@type": "Organization", "name": "Vault" },
      "datePublished": "2026-04-11",
      "inLanguage": "en",
      "url": "https://vault.app/en/blog/slug"
    }
  ]
}
```

Docs sayfaları için `"@type"` → `"TechArticle"`.

---

### 3. Keyword Güçlendirme

`app/[lang]/layout.tsx` `generateMetadata` içinde dil bazlı keyword dizileri:

**EN (mevcut 10 keyword → ~20 keyword):**
```
Zotero alternative, Mendeley alternative, literature review software,
PhD research tool, reference management software, academic PDF reader,
research workspace, annotation tool for researchers,
knowledge graph for research, BibTeX citation manager
```

**TR (mevcut 10 keyword → ~20 keyword):**
```
Zotero alternatifi, Mendeley alternatifi, literatür tarama aracı,
doktora araştırma aracı, akademik PDF okuyucu, kaynak yönetimi yazılımı,
araştırma çalışma alanı, bilgi grafiği aracı, BibTeX atıf yöneticisi,
tez araştırma programı
```

---

### 4. Changelog Sayfası

#### `lib/github.ts` — Veri Katmanı

```ts
export type Release = {
  tag_name: string;      // "v1.2.0"
  name: string;          // "Vault 1.2.0"
  published_at: string;  // ISO date
  body: string;          // markdown
};

export async function getReleases(): Promise<Release[]> {
  const res = await fetch(
    'https://api.github.com/repos/Berkut35/vault-releases/releases',
    {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      next: { revalidate: false }, // build-time SSG
    }
  );
  if (!res.ok) return [];
  return res.json();
}
```

`GITHUB_TOKEN` env değişkeni opsiyonel — public repo için gerek yok, rate limit için kullanılabilir. Vercel'de `GITHUB_TOKEN` environment variable olarak eklenir.

#### `app/[lang]/changelog/page.tsx` — Sayfa

Server Component. `generateMetadata` TR/EN başlık ve description döner. `getReleases()` çağrılır, sonuçlar `ChangelogEntry` bileşenine aktarılır.

```ts
export async function generateMetadata({ params }) {
  const lang = (await params).lang === 'tr' ? 'tr' : 'en';
  // title: "Changelog | Vault" / "Değişiklik Günlüğü | Vault"
  // alternates: { languages: { en: .../en/changelog, tr: .../tr/changelog } }
}

export default async function ChangelogPage({ params }) {
  const lang = (await params).lang === 'tr' ? 'tr' : 'en';
  const releases = await getReleases();
  // render releases with ChangelogEntry
}
```

#### `components/sections/ChangelogEntry.tsx` — Release Kartı

Her release için:

```
┌─────────────────────────────────────────┐
│  [v1.2.0]  12 Nisan 2026                │
│  ─────────────────────────────────      │
│  Vault 1.2.0 — Canvas & Export          │
│                                         │
│  • Knowledge graph performance +40%     │
│  • BibTeX batch export                  │
│  • Dark theme refinements               │
└─────────────────────────────────────────┘
```

- Tag badge: mor, monospace font
- Tarih: `lang` prop'a göre TR-TR veya en-US locale formatı
- Markdown body: mevcut `lib/markdown.ts` `renderMarkdown` fonksiyonu ile parse edilir
- Kart arası ayraç: `border-bottom: 1px solid var(--border-subtle)`

Props: `{ release: Release; lang: 'en' | 'tr' }`

#### `lib/i18n.tsx` — Çeviri

```ts
changelog: {
  title: "Changelog",                         // TR: "Değişiklik Günlüğü"
  subtitle: "Every update, every improvement.", // TR: "Her güncelleme, her iyileştirme."
  noReleases: "No releases yet.",              // TR: "Henüz yayın yok."
}
```

#### `app/sitemap.ts` — Güncelleme

```ts
const changelogRoutes = languages.map((lang) => ({
  url: `${APP_URL}/${lang}/changelog`,
  lastModified: new Date(),
  changeFrequency: 'weekly' as const,
  priority: 0.6,
}));

return [...routes, ...dynamicRoutes, ...changelogRoutes];
```

---

## Doğrulama

1. `npm run build` — TypeScript hatası yok mu?
2. Chrome DevTools → Elements → `<head>` → `<link rel="alternate" hreflang="...">` görünüyor mu?
3. Rich Results Test (Google) → `SoftwareApplication`, `FAQPage`, `Organization` şemaları doğrulanıyor mu?
4. Blog slug sayfasında `Article` + `BreadcrumbList` şeması var mı?
5. `twitter:card` meta tag `<head>`'de mevcut mu?
6. `/en/changelog` ve `/tr/changelog` sayfaları açılıyor mu?
7. GitHub Releases verisi doğru render ediliyor mu?
8. `sitemap.xml`'de changelog URL'leri var mı?
