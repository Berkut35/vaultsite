import React from 'react';
import { notFound } from 'next/navigation';
import { getMarkdownDocument, getAllDocumentSlugs } from '@/lib/markdown';
import ReactMarkdown from 'react-markdown';
import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

interface PageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const doc = getMarkdownDocument('blog', resolvedParams.lang, resolvedParams.slug);

  if (!doc) return { title: 'Not Found' };

  return {
    title: `${doc.frontmatter.title} | Vault Blog`,
    description: doc.frontmatter.description,
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
  const doc = getMarkdownDocument('blog', resolvedParams.lang, resolvedParams.slug);

  if (!doc) notFound();

  return (
    <>
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
