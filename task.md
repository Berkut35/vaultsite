# Vaultsite SEO, GEO, & AEO Optimization Tasks

## Phase 1: Core SEO (Path-based Routing & Crawlability)
- [x] Create `middleware.ts` redirect logic to ensure empty paths redirect to `/[lang]` structure.
- [x] Refactor `app/page.tsx` and `app/layout.tsx` into `app/[lang]/page.tsx` and `app/[lang]/layout.tsx`.
- [x] Update `LanguageProvider` to accept `initialLang` for SSR rendering.
- [x] Configure dynamic `generateMetadata` with `hreflang` alternates in `[lang]/layout.tsx`.
- [x] Create dynamic `sitemap.ts`.
- [x] Create `robots.ts`.

## Phase 2: AEO (Answering Engine Optimization)
- [x] Identify and delete `AEOBlock` component from `page.tsx`.
- [x] Refactor `JsonLd.tsx` to include `FAQPage` schema by migrating the deleted `AEOBlock` questions.

## Phase 3: GEO (Generative Engine Optimization)
- [x] Add textual trust signals `sr-only` to `Hero.tsx` for AI parsers.
- [x] Create `public/llms.txt` with Vault features and structure.
