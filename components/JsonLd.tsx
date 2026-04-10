interface JsonLdProps {
  lang: 'en' | 'tr';
}

const FAQ_EN = [
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
  },
];

const FAQ_TR = [
  {
    '@type': 'Question',
    name: 'Vault hangi dosya formatlarını destekliyor?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: "Vault, PDF (taranmış PDF'ler dahil), EPUB, DOCX ve TXT formatlarını desteklemektedir. Her format, uygun kontroller, tam metin arama ve o formata özel temalar içeren özel bir okuyucuya sahiptir.",
    },
  },
  {
    '@type': 'Question',
    name: 'Bilgi grafiği nasıl çalışıyor?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Bilgi grafiği, her belgenin, alıntının ve notun bir düğüme dönüştüğü sonsuz, fizik tabanlı bir tuvalidir. Düğümleri serbestçe sürükleyebilir, aralarında bağlantılar çizebilir ve Vault, araştırmalarınızdaki doğal kümeleri ortaya çıkarmak için kuvvet yönlendirmeli düzen kullanır.',
    },
  },
  {
    '@type': 'Question',
    name: 'Verilerim güvende mi?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: "Evet. Vault yerel öncelikli bir uygulamadır. Belgeleriniz ve notlarınız cihazınızda saklanır, hiçbir sunucuya yüklenmez. Yalnızca kimlik doğrulama token'ları ve grup işbirliği meta verileri Supabase üzerinden senkronize edilir; dosya içerikleriniz tamamen gizli kalır.",
    },
  },
  {
    '@type': 'Question',
    name: 'Akıllı Not Bağlama nedir?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Akıllı Not Bağlama, notlar, alıntılar ve belgeler arasında otomatik olarak çift yönlü bağlantılar oluşturur. Birden fazla kaynakta bir kavrama atıfta bulunduğunuzda Vault bunları birbirine bağlar; böylece herhangi bir düğümden tüm argüman yapınızda gezinebilirsiniz.',
    },
  },
  {
    '@type': 'Question',
    name: "Vault, Zotero'dan nasıl farklı?",
    acceptedAnswer: {
      '@type': 'Answer',
      text: "Zotero mükemmel bir kaynak yöneticisidir; ancak entegre okuma, açıklama ve bilgi grafiği özelliklerinden yoksundur. Vault tüm bunları tek bir çalışma alanında birleştirir; araç değiştirmeden okuyabilir, not alabilir, notları birbirine bağlayabilir, görsel bir argüman haritası oluşturabilir ve atıfları dışa aktarabilirsiniz.",
    },
  },
];

export function JsonLd({ lang }: JsonLdProps) {
  const faqItems = lang === 'tr' ? FAQ_TR : FAQ_EN;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://vault.app/#organization',
        name: 'Vault',
        url: 'https://vault.app',
      },
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
        inLanguage: lang === 'tr' ? 'tr-TR' : 'en-US',
        mainEntity: faqItems,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
