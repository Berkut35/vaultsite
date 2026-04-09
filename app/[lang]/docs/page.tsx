import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getAllDocumentSlugs, getMarkdownDocument } from '@/lib/markdown';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function DocsIndexPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slugs = getAllDocumentSlugs('docs', resolvedParams.lang);
  
  const posts = slugs.map((slug) => {
    return getMarkdownDocument('docs', resolvedParams.lang, slug);
  }).filter(Boolean);

  const t = resolvedParams.lang === 'tr' ? {
    title: "Sistem Dokümantasyonu",
    subtitle: "Vault'un nasıl çalıştığını, mimarisini ve ileri düzey okuma grubu kullanımlarını keşfedin.",
    read: "Rehberi Oku",
    empty: "Henüz bir dokümantasyon eklenmedi."
  } : {
    title: "System Documentation",
    subtitle: "Discover how Vault works, its local-first architecture, and advanced reading group mechanics.",
    read: "Read Guide",
    empty: "No documentation available yet."
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <header className="mb-14 text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-sans tracking-tight mb-4 text-text-primary">
              {t.title}
            </h1>
            <p className="text-text-secondary text-base lg:text-lg max-w-2xl mx-auto">
              {t.subtitle}
            </p>
          </header>

          {posts.length === 0 ? (
            <div className="text-center py-20 vault-card rounded-card border border-vault-border">
              <p className="text-text-secondary">{t.empty}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article key={post!.slug} className="vault-card rounded-2xl p-6 border border-vault-border flex flex-col items-start shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-semibold tracking-wider text-accent-purple mb-3 uppercase">
                    {post!.frontmatter.date}
                  </span>
                  <h2 className="text-xl font-bold text-text-primary mb-3 leading-snug">
                    {post!.frontmatter.title}
                  </h2>
                  <p className="text-sm text-text-secondary mb-6 flex-grow">
                    {post!.frontmatter.description}
                  </p>
                  <a href={`/${resolvedParams.lang}/docs/${post!.slug}`} className="text-sm font-semibold text-[#F0F0F0] bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg transition-colors inline-block mt-auto">
                    {t.read} →
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
