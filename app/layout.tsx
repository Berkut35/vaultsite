import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { LanguageProvider } from '@/lib/i18n';
import { JsonLd } from '@/components/JsonLd';
import './globals.css';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://vault.app';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Vault — Academic Research Platform | PDF Reader, Notes and Citation Manager',
    template: '%s | Vault',
  },
  description:
    'Vault helps researchers organize PDFs, take smart notes, build knowledge graphs, and export citations. The all-in-one research workspace for academics and PhD students.',
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
    'Zotero alternatifi',
    'academic writing tool',
    'akademik yazım asistanı',
    'EPUB reader',
    'bibliography generator',
    'kaynakça oluşturucu',
    'research workspace',
  ],
  authors: [{ name: 'Vault' }],
  creator: 'Vault',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'Vault',
    title: 'Vault — Academic Research Platform | PDF Reader, Notes and Citation Manager',
    description:
      'Vault helps researchers organize PDFs, take smart notes, build knowledge graphs, and export citations. The all-in-one research workspace for academics and PhD students.',
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
    title: 'Vault — Academic Research Platform',
    description:
      'The all-in-one research workspace for academics and PhD students. PDF annotation, knowledge graphs, citation management.',
    images: [`${APP_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: APP_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <JsonLd />
      </head>
      <body suppressHydrationWarning>
        <div className="noise-overlay" aria-hidden="true" />
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
