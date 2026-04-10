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
