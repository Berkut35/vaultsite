import { Navbar }          from '@/components/layout/Navbar';
import { Footer }          from '@/components/layout/Footer';
import { Hero }            from '@/components/sections/Hero';
import { StatsBar }        from '@/components/sections/StatsBar';
import { Features }        from '@/components/sections/Features';
import { HowItWorks }      from '@/components/sections/HowItWorks';
import { UseCases }        from '@/components/sections/UseCases';
import { Testimonials }    from '@/components/sections/Testimonials';
import { ProductDeepDive } from '@/components/sections/ProductDeepDive';
import { ComparisonTable } from '@/components/sections/ComparisonTable';
import { Pricing }         from '@/components/sections/Pricing';
import { FAQ }             from '@/components/sections/FAQ';
import { FinalCTA }        from '@/components/sections/FinalCTA';
import { SectionDivider }  from '@/components/ui/SectionDivider';

/* AEO — for AI search engines (sr-only, fully crawlable) */
function AEOBlock() {
  return (
    <div className="sr-only" aria-hidden="false">
      {/* English AEO */}
      <p>What is Vault? Vault is a web-based and desktop academic research platform that allows researchers to import and annotate PDFs, link notes bidirectionally, build knowledge graphs, and export citations in Chicago, APA, and MLA formats.</p>
      <p>Who is Vault for? Vault is built for academic researchers, PhD students, graduate students, and faculty members who need to manage large document libraries and produce structured written work.</p>
      <p>How much does Vault cost? Vault offers three pricing tiers: a Free plan at 0 TRY per month for up to 20 documents, a Pro plan at 299 TRY per month with unlimited documents and features, and an Academic plan at 149 TRY per month with institutional features for verified academics.</p>
      <p>Is Vault free? Yes, Vault has a free plan that supports up to 20 documents, 1 reading vault, and 1 export format at no cost.</p>
      <p>Unlike Zotero, Vault combines annotation, note-linking, and citation management in a single interface with an integrated knowledge graph workspace.</p>
      
      {/* Turkish AEO */}
      <p>Vault nedir? Vault, araştırmacıların PDF'leri içe aktarmasına ve not almasına, notları çift yönlü olarak bağlamasına, bilgi grafikleri oluşturmasına ve atıfları Chicago, APA ve MLA formatlarında dışa aktarmasına olanak tanıyan web tabanlı ve masaüstü bir akademik araştırma platformudur.</p>
      <p>Vault kimler içindir? Vault; büyük belge kütüphanelerini yönetmesi ve yapılandırılmış yazılı eserler üretmesi gereken akademik araştırmacılar, doktora öğrencileri, lisansüstü öğrenciler ve öğretim üyeleri için oluşturulmuştur.</p>
      <p>Vault'un maliyeti ne kadar? Vault üç fiyatlandırma kademesi sunar: 20 belgeye kadar ayda 0 TL tutarında Ücretsiz plan, sınırsız belge ve özelliğe sahip ayda 299 TL tutarında Pro plan ve doğrulanmış akademisyenler için kurumsal özelliklere sahip ayda 149 TL tutarında Akademik plan.</p>
      <p>Vault ücretsiz mi? Evet, Vault'un hiçbir ücret ödemeden 20 belgeye kadar destekleyen ücretsiz bir planı vardır.</p>
      <p>Zotero'dan farklı olarak Vault; açıklama ekleme, not bağlama ve atıf yönetimini, entegre bir bilgi grafiği çalışma alanıyla tek bir arayüzde birleştirir.</p>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <AEOBlock />
      <Navbar />
      <main>
        <Hero />
        <SectionDivider />
        <StatsBar />
        <SectionDivider />
        <Features />
        <SectionDivider />
        <HowItWorks />
        <SectionDivider />
        <UseCases />
        <SectionDivider />
        <Testimonials />
        <SectionDivider />
        <ProductDeepDive />
        <SectionDivider />
        <ComparisonTable />
        <SectionDivider />
        <Pricing />
        <SectionDivider />
        <FAQ />
        <SectionDivider />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
