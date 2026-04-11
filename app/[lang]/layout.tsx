import type { Metadata } from 'next';
import { LanguageProvider } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';
import { JsonLd } from '@/components/JsonLd';
import { CookieBanner } from '@/components/ui/CookieBanner';
import { VercelAnalytics } from '@/components/VercelAnalytics';
import { AmbientBackground } from '@/components/AmbientBackground';
import '../globals.css';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://vault.app';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === 'tr' ? 'tr' : 'en';
  
  const title = lang === 'tr' 
    ? 'Vault — Akademik Araştırma Platformu | PDF, Not ve Atıf Yönetimi'
    : 'Vault — Academic Research Platform | PDF Reader, Notes and Citation Manager';
    
  const description = lang === 'tr'
    ? 'Vault, araştırmacıların PDF\'leri düzenlemesine, akıllı notlar almasına, bilgi grafikleri oluşturmasına ve atıfları dışa aktarmasına yardımcı olur. Akademisyenler için hepsi bir arada çalışma alanı.'
    : 'Vault helps researchers organize PDFs, take smart notes, build knowledge graphs, and export citations. The all-in-one research workspace for academics and PhD students.';

  return {
    metadataBase: new URL(APP_URL),
    title: {
      default: title,
      template: '%s | Vault',
    },
    description,
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
    authors: [{ name: 'Vault' }],
    creator: 'Vault',
    openGraph: {
      type: 'website',
      locale: lang === 'tr' ? 'tr_TR' : 'en_US',
      url: `${APP_URL}/${lang}`,
      siteName: 'Vault',
      title,
      description,
      images: [
        {
          url: `${APP_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Vault — Academic Research Platform',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${APP_URL}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
    alternates: {
      canonical: `${APP_URL}/${lang}`,
      languages: {
        'en': `${APP_URL}/en`,
        'tr': `${APP_URL}/tr`,
        'x-default': `${APP_URL}/en`,
      },
    },
    icons: {
      icon: '/favicon.svg',
      shortcut: '/favicon.svg',
      apple: '/favicon.svg',
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  const lang: Lang = resolvedParams.lang === 'tr' ? 'tr' : 'en';

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <JsonLd lang={lang} />
      </head>
      <body suppressHydrationWarning>
        <div className="noise-overlay" aria-hidden="true" />
        <AmbientBackground />
        <LanguageProvider initialLang={lang}>
          {children}
          <CookieBanner />
        </LanguageProvider>
        <VercelAnalytics />
      </body>
    </html>
  );
}
