export function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
