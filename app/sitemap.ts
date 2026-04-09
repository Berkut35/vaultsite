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
