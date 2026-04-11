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

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'tr' }];
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

  const titleText    = lang === 'tr' ? 'Değişiklik Günlüğü' : 'Changelog';
  const subtitleText = lang === 'tr'
    ? 'Her güncelleme, her iyileştirme.'
    : 'Every update, every improvement.';
  const emptyText    = lang === 'tr' ? 'Henüz yayın yok.' : 'No releases yet.';

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
