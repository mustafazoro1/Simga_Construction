import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { ServicesGrid } from "@/components/ServicesGrid";
import { ServicesMarquee } from "@/components/ServicesMarquee";
import { CTA } from "@/components/CTA";

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <PageHeader
          title="Our Services"
          description="Comprehensive civil engineering and construction capabilities, executed with precision."
          keyPrefix="page.services"
        />
        <ServicesMarquee />
        <ServicesGrid compact />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
