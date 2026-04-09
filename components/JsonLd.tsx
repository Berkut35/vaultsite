export function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
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
        mainEntity: [
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
          }
        ],
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
