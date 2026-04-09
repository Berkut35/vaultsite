'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// ─── Translation Dictionary ───────────────────────────────────────────────────

export const translations = {
  en: {
    nav: {
      features:          'Features',
      howItWorks:        'How It Works',
      pricing:           'Pricing',
      faq:               'FAQ',
      signin:            'Sign In',
      startFree:         'Start Free',
      download:          'Download Free',
      signout:           'Sign Out',
      myAccount:         'My Account',
      freePlan:          'Free Plan',
      proPlan:           'Pro',
      academicPlan:      'Academic',
      institutionalPlan: 'Institutional',
      daysLeft:          'days left',
      validUntil:        'Valid until',
      upgrade:           'Upgrade to Pro',
    },
    hero: {
      eyebrow:     'Academic Research Infrastructure',
      line1:       'Research Without',
      line2:       'The Chaos.',
      subtitle:    'Vault transforms scattered PDFs, notes, and citations into a structured knowledge system built for serious academic work.',
      primaryCta:  "Start for Free — It's Free",
      secondaryCta:'See How It Works',
      socialProof: 'Trusted by 10,000+ researchers at 50+ institutions',
      /* legacy keys (AuthModal / old code) */
      badge:       'Privacy-first · Rust core · Offline-ready',
      title:       'Your Research,',
      titleAccent: 'Perfectly Organized.',
      titleEnd:    'Finally.',
      cta:         'Download for Free',
      ctaSecondary:'Sign In',
      trusted:     'Trusted by researchers at 50+ universities',
    },
    stats: {
      items: [
        { suffix: '+',  label: 'Integrations'   },
        { suffix: 'K+', label: 'Researchers'    },
        { suffix: '',   label: 'Export Formats' },
        { suffix: '%',  label: 'Privacy-first'  },
      ],
    },
    features: {
      sectionBadge: 'Capabilities',
      title:    'Everything serious research demands.',
      subtitle: "Built around how researchers actually work — not how apps assume you do.",
      items: [
        {
          title:       'Spatial Knowledge Archiving',
          description: "Map the relationships between your documents, quotes, and ideas on an infinite, physics-driven graph. Discover connections you didn't know existed.",
        },
        {
          title:       'Multi-Format Reading',
          description: 'PDF, EPUB, DOCX, and TXT — every format with a native reader, full-text search, and per-format themes.',
        },
        {
          title:       'Smart Note Linking',
          description: 'Bidirectional links between notes, quotes, and documents. Every connection is automatic and navigable.',
        },
        {
          title:       'Citation Manager',
          description: 'One-click export in Chicago, APA, and MLA. Captures text, page, and metadata automatically.',
        },
        {
          title:       'Reading Groups',
          description: 'Collaborate in real time. Share libraries, annotate together, and sync across your research team.',
        },
        {
          title:       'Offline First',
          description: 'All documents, annotations, and canvases are stored locally. Vault works fully without internet.',
        },
      ],
    },
    howItWorks: {
      title: 'From PDF to thesis in four seamless steps.',
      steps: [
        {
          number:      '01',
          title:       'Gather & Archive',
          description: 'Drag in PDFs, EPUBs, or web articles. Vault instantly extracts author, year, and metadata, perfectly organizing your shelf.',
        },
        {
          number:      '02',
          title:       'Read & Annotate',
          description: 'Highlight texts, attach inline notes, and tag ideas. Vault lets you link similar concepts across different documents bidirectionally.',
        },
        {
          number:      '03',
          title:       'Map on Canvas',
          description: 'Drag your ideas onto the spatial Knowledge Graph. Visually structure your academic argument before writing a single draft.',
        },
        {
          number:      '04',
          title:       'Export & Cite',
          description: 'Export your entire structured knowledge in seconds. Generate perfectly formatted Chicago, APA, or MLA bibliographies seamlessly.',
        },
      ],
    },
    useCases: {
      sectionBadge: "Who it's for",
      title:  'Built for the most demanding academic work.',
      learnMore: 'Learn more',
      items: [
        {
          title:       'PhD Researchers',
          description: "Manage hundreds of sources without losing the thread of your argument. Vault keeps your entire research corpus structured and navigable.",
        },
        {
          title:       'Graduate Students',
          description: 'Build a second brain for your thesis. Find any note, any time. Link ideas across chapters and always know where each citation came from.',
        },
        {
          title:       'Academic Institutions',
          description: 'Deploy Vault for your department. Collaborative, secure, and scalable. Shared reading groups and institutional SSO included.',
        },
      ],
    },
    testimonials: {
      title: 'Trusted by researchers at leading institutions.',
      items: [
        {
          quote:       'Vault is the first tool that actually handles the complexity of a longitudinal study. I had over 300 sources across six years of fieldwork, and for the first time I could see how they all connected. The knowledge graph alone is worth every penny.',
          name:        'Dr. Sarah Chen',
          role:        'Associate Professor of Sociology',
          institution: 'Stanford University',
          initials:    'SC',
          avatar:      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
        },
        {
          quote:       'The note-linking system changed how I write. I used to lose half my reading time trying to remember where I had noted something. Now every idea connects back to its source instantly. My thesis committee has noticed the improvement.',
          name:        'Marcus Holt',
          role:        'PhD Candidate in History',
          institution: 'University of Cambridge',
          initials:    'MH',
          avatar:      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
        },
        {
          quote:       'During fieldwork in regions with no connectivity, Vault was the only tool that never let me down. Everything worked offline, perfectly. Coming back to a fully synced, structured archive of my annotations was something I had never experienced before.',
          name:        'Prof. Elif Yıldız',
          role:        'Computational Linguistics',
          institution: 'Middle East Technical University',
          initials:    'EY',
          avatar:      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200',
        },
      ],
    },
    productDeepDive: {
      sectionBadge: 'The workspace',
      title: 'A closer look at the workspace.',
      callouts: [
        {
          title:       'PDF Annotation Layer',
          description: 'Highlight text in any color, attach inline notes, and save quotes with their exact page reference — all non-destructively over your original file.',
        },
        {
          title:       'Knowledge Graph View',
          description: 'Every document, quote, and note becomes a node. Drag them freely on an infinite canvas and watch your research argument take shape visually.',
        },
        {
          title:       'Export & Citation Panel',
          description: 'One-click export to Chicago, APA 7th, or MLA 9th. Vault captures author, title, year, publisher, and DOI automatically from document metadata.',
        },
      ],
    },
    comparison: {
      title:    'How Vault compares.',
      subtitle: 'Unlike Zotero, Vault combines annotation, note-linking, and citation management in a single interface.',
      featureLabel: 'Feature',
      rows: [
        'Academic PDF reading',
        'Bidirectional note linking',
        'Citation export (Chicago, APA)',
        'Auto-metadata extraction',
        'Automated document grouping',
        'Knowledge graph & Spatial mapping',
        'Rust-powered core (10k+ docs)',
        'Local-first privacy (IndexedDB)',
        'Native EPUB / E-Book reader',
        '14-Day offline autonomy',
        'Deep-linked PDF annotations',
        'Offline access',
        'Privacy-first storage',
        'Price',
      ],
      priceVault:   'Free',
      priceNotion:  '$8/mo',
      priceZotero:  'Free',
      priceMendeley: 'Free',
      tooltips: [
        'Integrated PDF reader for highlighting and taking notes.',
        'Connect ideas across documents with clickable links.',
        'Generate bibliographies in Chicago, APA, or MLA.',
        'Automatically detects author, year, and DOI from files.',
        'Automatically sorts documents into categorical shelves.',
        'Visualize connections on an infinite physics-driven canvas.',
        'Blazing fast performance even with 10,000+ documents.',
        'Total privacy; your data stays local on your device.',
        'Native support for reading and annotating EPUB books.',
        'Works for 14 days without an internet connection.',
        'Every quote remains linked to its exact source page.',
        'Access all your research without needing the internet.',
        'Your data is never used for training or advertising.',
      ],
    },
    pricing: {
      sectionBadge: 'Simple pricing',
      title:    "Start free. Scale when you're ready.",
      subtitle: 'No hidden fees. No feature paywalls on the essentials.',
      plans: [
        {
          name:        'Free',
          price:       '0',
          period:      'TRY/mo',
          description: 'Start organizing your research at no cost.',
          cta:         'Get Started',
          ctaVariant:  'outline',
          highlighted: false,
          features: [
            '20 documents',
            'Unlimited Citations',
            'Unlimited Backup',
            'Offline access',
            'All file formats',
          ],
        },
        {
          name:        'Pro',
          oldPrice:    '299',
          price:       '179',
          period:      'TRY/mo',
          description: 'Unlimited everything for serious research. Special price for .edu accounts.',
          cta:         'Start Pro Trial',
          ctaVariant:  'filled',
          highlighted: true,
          badge:       'Most Popular',
          discountBadge: '-40%',
          features: [
            'Unlimited documents',
            'Unlimited reading groups',
            'All export formats',
            'Advanced citation tools',
            'Priority support',
            'Team features',
          ],
        },
      ],
    },
    faq: {
      sectionBadge: 'FAQ',
      title:    'Questions about Vault.',
      subtitle: 'Everything you need to know before you start.',
      items: [
        {
          q: 'Which file formats does Vault support?',
          a: 'Vault supports PDF (including scanned PDFs), EPUB, DOCX, and TXT. Each format has a dedicated reader with appropriate controls, full-text search, and themes tailored to that format.',
        },
        {
          q: 'Can I use Vault offline?',
          a: 'Yes, Vault works fully offline because all data is stored locally on your device using IndexedDB. Supabase sync is used only for authentication and reading groups, with a 14-day offline grace period.',
        },
        {
          q: 'How does the knowledge graph work?',
          a: 'The knowledge graph is an infinite, physics-driven canvas where every document, quote, and note becomes a node. You can drag nodes freely, draw connections between them, and Vault uses force-directed layout to reveal natural clusters in your research.',
        },
        {
          q: 'Is my data private?',
          a: 'Yes. Vault is a local-first application. Your documents and annotations are stored on your device and never uploaded to any server. Only authentication tokens and group collaboration metadata are synced via Supabase — your file contents remain entirely private.',
        },
        {
          q: 'What is Smart Note Linking?',
          a: 'Smart Note Linking creates bidirectional connections between notes, quotes, and documents automatically. When you reference a concept across multiple sources, Vault links them so you can navigate your entire argument structure from any node.',
        },
        {
          q: 'How does Vault compare to Zotero?',
          a: 'Zotero is an excellent citation manager, but it lacks integrated reading, annotation, and knowledge graph capabilities. Vault combines all of these in a single workspace — you can read, annotate, link notes, build a visual argument map, and export citations without switching tools.',
        },
        {
          q: 'What is the difference between Pro and Academic plans?',
          a: 'Both Pro and Academic offer unlimited documents, groups, and canvases. The Academic plan is priced lower for verified academic users and additionally includes institutional deployment options, SSO integration, a team admin panel, and dedicated support.',
        },
      ],
    },
    finalCta: {
      eyebrow:      'Begin today',
      title:        'Your research deserves\na proper home.',
      subtitle:     "Join thousands of researchers who've moved from chaos to clarity.",
      primaryBtn:   'Create Free Account',
      secondaryBtn: 'Schedule a Demo',
    },
    footer: {
      tagline: 'The academic research platform for serious work.',
      cols: [
        {
          title: 'Product',
          links: [
            { label: 'Features',  href: '#features' },
            { label: 'Pricing',   href: '#pricing'  },
            { label: 'Changelog', href: '#'          },
            { label: 'Roadmap',   href: '#'          },
          ],
        },
        {
          title: 'Resources',
          links: [
            { label: 'Documentation',     href: '/en/docs' },
            { label: 'API',               href: '#' },
            { label: 'Blog',              href: '/en/blog' },
            { label: 'Research Templates',href: '#' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'Privacy Policy', href: '/en/legal/privacy' },
            { label: 'Terms of Service',   href: '/en/legal/terms' },
            { label: 'Cookie Policy', href: '/en/legal/cookies' },
            { label: 'KVKK', href: '/en/legal/kvkk' },
            { label: 'About', href: '/en/blog/why-we-built-vault' },
            { label: 'Contact', href: '#' },
          ],
        },
      ],
      copyright: '© 2024 Vault. All rights reserved.',
      /* legacy keys */
      links: {
        product:   'Product',
        features:  'Features',
        pricing:   'Pricing',
        changelog: 'Changelog',
        legal:     'Legal',
        privacy:   'Privacy Policy',
        terms:     'Terms of Service',
        support:   'Support',
        docs:      'Documentation',
        contact:   'Contact',
        github:    'GitHub',
      },
      rights: 'All rights reserved.',
    },
    auth: {
      signin:          'Sign In',
      signup:          'Create Account',
      email:           'Email address',
      password:        'Password',
      forgotPassword:  'Forgot password?',
      noAccount:       "Don't have an account?",
      hasAccount:      'Already have an account?',
      signinBtn:       'Sign In',
      signupBtn:       'Create Account',
      orContinue:      'Or continue with',
      emailSent:       'Check your email for a confirmation link.',
      signingIn:       'Signing in…',
      creatingAccount: 'Creating account…',
      errorGeneric:    'Something went wrong. Please try again.',
      termsError:      'Please accept the terms and conditions to continue.',
      termsLabel:      'I have read and understood the [Terms of Service], [Privacy Policy], and [KVKK].',
    },
  },

  // ─── TÜRKÇE ─────────────────────────────────────────────────────────────────
  tr: {
    nav: {
      features:          'Özellikler',
      howItWorks:        'Nasıl Çalışır',
      pricing:           'Fiyatlandırma',
      faq:               'SSS',
      signin:            'Giriş Yap',
      startFree:         'Ücretsiz Başla',
      download:          'Ücretsiz İndir',
      signout:           'Çıkış Yap',
      myAccount:         'Hesabım',
      freePlan:          'Ücretsiz Plan',
      proPlan:           'Pro',
      academicPlan:      'Akademik',
      institutionalPlan: 'Kurumsal',
      daysLeft:          'gün kaldı',
      validUntil:        'Geçerlilik tarihi',
      upgrade:           "Pro'ya Yükselt",
    },
    hero: {
      eyebrow:     'Akademik Araştırma Altyapısı',
      line1:       'Araştırmanız',
      line2:       'Artık Düzenli.',
      subtitle:    "Vault, dağınık PDF'leri, notları ve alıntıları ciddi akademik çalışmalar için yapılandırılmış bir bilgi sistemine dönüştürür.",
      primaryCta:  'Ücretsiz Başla',
      secondaryCta:'Nasıl Çalıştığını Gör',
      socialProof: "50'den fazla kurumda 10.000'den fazla araştırmacı tarafından güvenilir",
      /* legacy keys */
      badge:       'Gizlilik önce · Rust çekirdeği · Çevrimdışı hazır',
      title:       'Araştırmanız,',
      titleAccent: 'Mükemmel Organize.',
      titleEnd:    'Sonunda.',
      cta:         'Ücretsiz İndir',
      ctaSecondary:'Giriş Yap',
      trusted:     '50+ üniversitedeki araştırmacıların tercihi',
    },
    stats: {
      items: [
        { suffix: '+',  label: 'Entegrasyon'            },
        { suffix: 'B+', label: 'Araştırmacı'            },
        { suffix: '',   label: 'Dışa Aktarma Formatı'   },
        { suffix: '%',  label: 'Gizlilik Öncelikli'     },
      ],
    },
    features: {
      sectionBadge: 'Yetenekler',
      title:    'Ciddi araştırmaların gerektirdiği her şey.',
      subtitle: 'Araştırmacıların gerçekte nasıl çalıştığı üzerine kurulu — uygulamaların nasıl çalıştığınızı varsaydığı üzerine değil.',
      items: [
        {
          title:       'Uzamsal Bilgi Arşivleme',
          description: 'Belgeleriniz, alıntılarınız ve fikirleriniz arasındaki ilişkileri sonsuz, fizik tabanlı bir grafikte haritalayın. Var olduğunu bilmediğiniz bağlantıları keşfedin.',
        },
        {
          title:       'Çok Formatlı Okuma',
          description: "PDF, EPUB, DOCX ve TXT — her format için yerel okuyucu, tam metin arama ve formata özel temalar.",
        },
        {
          title:       'Akıllı Not Bağlama',
          description: 'Notlar, alıntılar ve belgeler arasında çift yönlü bağlantılar. Her bağlantı otomatik ve gezilebilirdir.',
        },
        {
          title:       'Alıntı Yöneticisi',
          description: "Chicago, APA ve MLA'ya tek tıkla dışa aktarın. Metin, sayfa ve meta verileri otomatik olarak yakalar.",
        },
        {
          title:       'Okuma Grupları',
          description: 'Gerçek zamanlı işbirliği yapın. Kütüphaneleri paylaşın, birlikte not alın ve araştırma ekibinizle senkronize edin.',
        },
        {
          title:       'Çevrimdışı Önce',
          description: 'Tüm belgeler, notlar ve tuvaller yerel olarak saklanır. Vault internetsiz tam olarak çalışır.',
        },
      ],
    },
    howItWorks: {
      title: 'Dağınık PDF\'lerden kusursuz teze 4 adımda.',
      steps: [
        {
          number:      '01',
          title:       'Topla ve Arşivle',
          description: "PDF, EPUB veya web makalelerini sürükleyin. Vault; yazar, yıl ve DOI gibi meta verileri saniyeler içinde okuyup kütüphanenizi düzenler.",
        },
        {
          number:      '02',
          title:       'Oku ve Derinleş',
          description: 'Metinleri çizin, ilgili alanlara düşüncelerinizi not düşün. Farklı belgelerdeki benzer konuları kavramsal ağlarla birbirine düğümleyin.',
        },
        {
          number:      '03',
          title:       'Sonsuz Tuvalde Bağıntı Kur',
          description: "Araştırmanızı Bilgi Grafiği'ne dökün. Alıntılarınız ve notlarınız fizik tabanlı bir ağ üzerinde görsel olarak tezinizin iskeletini kursun.",
        },
        {
          number:      '04',
          title:       'Yaz ve Alıntıla',
          description: "Tüm bilginizi saniyeler içinde otomatik olarak dışa aktarın. Sıfır çabayla Chicago, APA veya MLA formatında eksiksiz ve hatasız kaynakçalar oluşturun.",
        },
      ],
    },
    useCases: {
      sectionBadge: 'Kimler için',
      title:  'En zorlu akademik çalışmalar için tasarlandı.',
      learnMore: 'Daha fazla',
      items: [
        {
          title:       'Doktora Araştırmacıları',
          description: "Argümanınızın izini kaybetmeden yüzlerce kaynağı yönetin. Vault tüm araştırma külliyatınızı yapılandırılmış ve gezilebilir tutar.",
        },
        {
          title:       'Lisansüstü Öğrenciler',
          description: "Teziniz için ikinci bir beyin oluşturun. Her notu, her zaman bulun. Bölümler arasında fikirleri bağlayın ve her alıntının nereden geldiğini her zaman bilin.",
        },
        {
          title:       'Akademik Kurumlar',
          description: "Departmanınız için Vault'u dağıtın. İşbirlikçi, güvenli ve ölçeklenebilir. Paylaşılan okuma grupları ve kurumsal SSO dahil.",
        },
      ],
    },
    testimonials: {
      title: 'Önde gelen kurumlardaki araştırmacıların güveni.',
      items: [
        {
          quote:       "Vault, boylamsal bir çalışmanın karmaşıklığını gerçekten ele alan ilk araçtır. Altı yıllık saha çalışmasında 300'den fazla kaynağım vardı ve ilk kez hepsinin nasıl bağlandığını görebildim. Tek başına bilgi grafiği her kuruşa değer.",
          name:        'Dr. Sarah Chen',
          role:        'Sosyoloji Doçenti',
          institution: 'Stanford Üniversitesi',
          initials:    'SC',
          avatar:      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
        },
        {
          quote:       'Not bağlama sistemi yazmam konusundaki bakış açımı tamamen değiştirdi. Bir şeyi nerede not ettiğimi hatırlamaya çalışarak okuma zamanımın yarısını harcardım. Artık her fikir anında kaynağına bağlanıyor. Tez komitem gelişimi fark etti.',
          name:        'Marcus Holt',
          role:        'Tarih Doktora Adayı',
          institution: 'Cambridge Üniversitesi',
          initials:    'MH',
          avatar:      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
        },
        {
          quote:       "Bağlantısız bölgelerde saha çalışması sırasında Vault beni hiç hayal kırıklığına uğratmayan tek araçtı. Her şey çevrimdışı, mükemmel çalıştı. Notlarımın tam senkronize, yapılandırılmış bir arşivine dönmek daha önce hiç yaşamadığım bir şeydi.",
          name:        'Prof. Elif Yıldız',
          role:        'Hesaplamalı Dilbilim',
          institution: 'Orta Doğu Teknik Üniversitesi',
          initials:    'EY',
          avatar:      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200',
        },
      ],
    },
    productDeepDive: {
      sectionBadge: 'Çalışma alanı',
      title: 'Çalışma alanına yakından bakış.',
      callouts: [
        {
          title:       'PDF Açıklama Katmanı',
          description: "Herhangi bir renkte metni vurgulayın, satır içi notlar ekleyin ve alıntıları tam sayfa referanslarıyla kaydedin — orijinal dosyanızda yıkıcı olmayan şekilde.",
        },
        {
          title:       'Bilgi Grafiği Görünümü',
          description: 'Her belge, alıntı ve not bir düğüm haline gelir. Onları sonsuz bir tuvalde serbestçe sürükleyin ve araştırma argümanınızın görsel olarak şekillendiğini izleyin.',
        },
        {
          title:       'Dışa Aktarma ve Alıntı Paneli',
          description: "Chicago, APA 7. veya MLA 9.'ya tek tıkla dışa aktarın. Vault yazar, başlık, yıl, yayıncı ve DOI'yi belge meta verilerinden otomatik olarak yakalar.",
        },
      ],
    },
    comparison: {
      title:        'Vault nasıl karşılaştırılır.',
      subtitle:     "Zotero'nun aksine Vault, açıklama, not bağlama ve alıntı yönetimini tek bir arayüzde birleştirir.",
      featureLabel: 'Özellik',
      rows: [
        'Akademik PDF okuma',
        'Çift yönlü not bağlama',
        'Alıntı dışa aktarma (Chicago, APA)',
        'Otomatik künye çekme ve düzenleme',
        'Otomatik belge gruplandırma',
        'Bilgi grafiği ve Uzamsal haritalama',
        'Rust çekirdeği (10b+ Belge hızı)',
        'Yerel öncelikli güvenlik (IndexedDB)',
        'Yerel EPUB ve Kitap okuyucu',
        '14 Gün kesintisiz çevrimdışı mod',
        'Derin bağlantılı PDF alıntıları',
        'Çevrimdışı erişim',
        'Gizlilik öncelikli depolama',
        'Fiyat',
      ],
      priceVault:    'Ücretsiz',
      priceNotion:   '8$/ay',
      priceZotero:   'Ücretsiz',
      priceMendeley: 'Ücretsiz',
      tooltips: [
        "PDF'ler üzerinde not alıp önemli yerleri işaretleyin.",
        "Fikirlerinizi belgeler arasında ağ gibi birbirine bağlayın.",
        "Tek tıkla Chicago, APA veya MLA kaynakçası oluşturun.",
        "Dosya bilgilerini (yazar, yıl) otomatik olarak tanır.",
        "Belgeleri konularına göre otomatik raflara ayırır.",
        "Bağlantıları sonsuz bir tuval üzerinde haritalayın.",
        "On binlerce belgeyi takılmadan, ışık hızında yönetin.",
        "Verileriniz sadece sizin cihazınızda kalır, güvende tutulur.",
        "Kitapları (EPUB) tıpkı PDF gibi not alarak okuyun.",
        "İnternet olmasa bile 14 gün boyunca tam kapasite çalışın.",
        "Alıntı yaptığınız her cümle, orijinal kaynağına bağlı kalır.",
        "İnternete ihtiyaç duymadan kütüphanenize erişin.",
        "Verileriniz asla eğitim veya reklam için kullanılmaz.",
      ],
    },
    pricing: {
      sectionBadge: 'Basit fiyatlandırma',
      title:    'Ücretsiz başlayın, hazır olduğunuzda ölçeklendirin.',
      subtitle: 'Gizli ücret yok. Temel özelliklerde duvar yok.',
      plans: [
        {
          name:        'Ücretsiz',
          price:       '0',
          period:      'TRY/ay',
          description: 'Araştırmanızı hiçbir ücret ödemeden organize etmeye başlayın.',
          cta:         'Başla',
          ctaVariant:  'outline',
          highlighted: false,
          features: [
            '20 belge',
            'Sınırsız Atıf Desteği',
            'Sınırsız Yedekleme',
            'Çevrimdışı erişim',
            'Tüm dosya formatları',
          ],
        },
        {
          name:        'Pro',
          oldPrice:    '299',
          price:       '179',
          period:      'TRY/ay',
          description: 'Ciddi araştırmalar için her şey sınırsız. .edu uzantılı hesaplar için indirimli fiyat.',
          cta:         'Pro Denemeyi Başlat',
          ctaVariant:  'filled',
          highlighted: true,
          badge:       'En Popüler',
          discountBadge: '%40 İNDİRİM',
          features: [
            'Sınırsız belge',
            'Sınırsız okuma grubu',
            'Tüm dışa aktarma formatları',
            'Gelişmiş alıntı araçları',
            'Öncelikli destek',
            'Takım özellikleri',
          ],
        },
      ],
    },
    faq: {
      sectionBadge: 'SSS',
      title:    "Vault hakkında sorular.",
      subtitle: 'Başlamadan önce bilmeniz gereken her şey.',
      items: [
        {
          q: "Vault hangi dosya formatlarını destekler?",
          a: "Vault; PDF (taranan PDF'ler dahil), EPUB, DOCX ve TXT'yi destekler. Her format için uygun kontroller, tam metin arama ve formata özel temalarla ayrı bir okuyucu bulunur.",
        },
        {
          q: "Vault'u çevrimdışı kullanabilir miyim?",
          a: "Evet, Vault tüm veriler IndexedDB kullanılarak cihazınızda yerel olarak saklandığı için tamamen çevrimdışı çalışır. Supabase senkronizasyonu yalnızca kimlik doğrulama ve okuma grupları için kullanılır; 14 günlük çevrimdışı tolerans süresi mevcuttur.",
        },
        {
          q: 'Bilgi grafiği nasıl çalışır?',
          a: 'Bilgi grafiği, her belge, alıntı ve notun bir düğüm haline geldiği sonsuz, fizik tabanlı bir tuvalidir. Düğümleri serbestçe sürükleyebilir, aralarında bağlantılar çizebilir ve Vault araştırmanızdaki doğal kümeleri ortaya çıkarmak için kuvvet yönlü düzen kullanır.',
        },
        {
          q: 'Verilerim özel mi?',
          a: "Evet. Vault yerel öncelikli bir uygulamadır. Belgeleriniz ve notlarınız cihazınızda saklanır ve hiçbir sunucuya yüklenmez. Yalnızca kimlik doğrulama token'ları ve grup işbirliği meta verileri Supabase aracılığıyla senkronize edilir — dosya içerikleriniz tamamen özel kalır.",
        },
        {
          q: 'Akıllı Not Bağlama nedir?',
          a: 'Akıllı Not Bağlama, notlar, alıntılar ve belgeler arasında otomatik olarak çift yönlü bağlantılar oluşturur. Birden fazla kaynak üzerinde bir kavrama atıfta bulunduğunuzda, Vault bunları bağlar ve tüm argüman yapınızda herhangi bir düğümden gezinmenizi sağlar.',
        },
        {
          q: "Vault, Zotero ile nasıl karşılaştırılır?",
          a: "Zotero mükemmel bir alıntı yöneticisidir, ancak entegre okuma, açıklama ve bilgi grafiği yeteneklerinden yoksundur. Vault tüm bunları tek bir çalışma alanında birleştirir — araçlar arasında geçiş yapmadan okuyabilir, not alabilir, görsel argüman haritası oluşturabilir ve alıntıları dışa aktarabilirsiniz.",
        },
        {
          q: 'Pro ve Akademik planlar arasındaki fark nedir?',
          a: 'Her iki plan da sınırsız belge, grup ve tuval sunar. Akademik plan, doğrulanmış akademik kullanıcılar için daha düşük fiyatlıdır ve ek olarak kurumsal dağıtım seçenekleri, SSO entegrasyonu, takım yönetici paneli ve özel destek içerir.',
        },
      ],
    },
    finalCta: {
      eyebrow:      'Bugün başlayın',
      title:        'Araştırmanız layık olduğu\nbir yuvayı hak ediyor.',
      subtitle:     "Kaostan netliğe geçen binlerce araştırmacıya katılın.",
      primaryBtn:   'Ücretsiz Hesap Oluştur',
      secondaryBtn: 'Demo Planla',
    },
    footer: {
      tagline: 'Ciddi çalışmalar için akademik araştırma platformu.',
      cols: [
        {
          title: 'Ürün',
          links: [
            { label: 'Özellikler',       href: '#features' },
            { label: 'Fiyatlandırma',    href: '#pricing'  },
            { label: 'Değişiklik Günlüğü', href: '#'       },
            { label: 'Yol Haritası',     href: '#'         },
          ],
        },
        {
          title: 'Kaynaklar',
          links: [
            { label: 'Belgeler',              href: '/tr/docs' },
            { label: 'API',                   href: '#' },
            { label: 'Blog',                  href: '/tr/blog' },
            { label: 'Araştırma Şablonları',  href: '#' },
          ],
        },
        {
          title: 'Şirket',
          links: [
            { label: 'Gizlilik Politikası',   href: '/tr/legal/privacy' },
            { label: 'Kullanım Şartları',   href: '/tr/legal/terms' },
            { label: 'Çerez Politikası', href: '/tr/legal/cookies' },
            { label: 'KVKK', href: '/tr/legal/kvkk' },
            { label: 'Hakkımızda', href: '/tr/blog/why-we-built-vault' },
            { label: 'İletişim',   href: '#' },
          ],
        },
      ],
      copyright: '© 2024 Vault. Tüm hakları saklıdır.',
      /* legacy keys */
      links: {
        product:   'Ürün',
        features:  'Özellikler',
        pricing:   'Fiyatlandırma',
        changelog: 'Değişiklik Günlüğü',
        legal:     'Yasal',
        privacy:   'Gizlilik Politikası',
        terms:     'Kullanım Koşulları',
        support:   'Destek',
        docs:      'Belgelendirme',
        contact:   'İletişim',
        github:    'GitHub',
      },
      rights: 'Tüm hakları saklıdır.',
    },
    auth: {
      signin:          'Giriş Yap',
      signup:          'Hesap Oluştur',
      email:           'E-posta adresi',
      password:        'Şifre',
      forgotPassword:  'Şifremi unuttum?',
      noAccount:       'Hesabınız yok mu?',
      hasAccount:      'Zaten hesabınız var mı?',
      signinBtn:       'Giriş Yap',
      signupBtn:       'Hesap Oluştur',
      orContinue:      'Veya şununla devam et',
      emailSent:       'Onay bağlantısı için e-postanızı kontrol edin.',
      signingIn:       'Giriş yapılıyor…',
      creatingAccount: 'Hesap oluşturuluyor…',
      errorGeneric:    'Bir şeyler ters gitti. Lütfen tekrar deneyin.',
      termsError:      'Devam etmek için kullanım koşullarını kabul etmelisiniz.',
      termsLabel:      '[Kullanım Koşulları], [Gizlilik Sözleşmesi] ve [KVKK] metinlerini okudum, anladım.',
    },
  },
} as const;

export type Lang = keyof typeof translations;
export type T = typeof translations.en;

// ─── Context ──────────────────────────────────────────────────────────────────

type LanguageCtx = { lang: Lang; t: T; setLang: (l: Lang) => void };
const Ctx = createContext<LanguageCtx>({
  lang: 'en',
  t: translations.en,
  setLang: () => {},
});

export function LanguageProvider({ children, initialLang }: { children: React.ReactNode, initialLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(initialLang || 'en');

  useEffect(() => {
    const cookieLang = document.cookie
      .split('; ')
      .find((r) => r.startsWith('vault-lang='))
      ?.split('=')[1] as Lang | undefined;

    const navLang = navigator.language.toLowerCase().startsWith('tr') ? 'tr' : 'en';
    const detected = initialLang || (cookieLang === 'tr' || cookieLang === 'en' ? cookieLang : navLang);
    if (!initialLang && detected !== lang) {
      setLangState(detected);
    }
  }, [initialLang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    document.cookie = `vault-lang=${l}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`;
    // Force a navigation to the correct URL route:
    if (typeof window !== 'undefined') {
      window.location.href = `/${l}`;
    }
  };

  return (
    <Ctx.Provider value={{ lang, t: translations[lang] as T, setLang }}>
      {children}
    </Ctx.Provider>
  );
}

export const useLang = () => useContext(Ctx);
