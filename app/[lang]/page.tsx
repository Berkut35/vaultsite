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

export default function Page() {
  return (
    <>
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
