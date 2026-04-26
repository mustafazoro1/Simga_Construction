import { motion } from "framer-motion";
import { Link } from "wouter";
import { EditableText } from "@/admin/EditableText";

export function CTA() {
  return (
    <section className="py-32 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stucco.png')] opacity-10 mix-blend-overlay"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-display text-primary-foreground mb-8 uppercase leading-tight drop-shadow-sm">
            <EditableText keyName="cta.title" defaultText="Ready to Build the Future?" />
          </h2>
          <p className="text-xl md:text-2xl font-serif text-primary-foreground/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            <EditableText
              keyName="cta.description"
              defaultText="Partner with Sigma Contractors for your next major infrastructure project. We bring decades of expertise and unwavering commitment to quality."
              multiline
            />
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center px-10 py-5 bg-background text-foreground font-semibold hover:bg-background/90 transition-colors text-lg shadow-lg">
              <EditableText keyName="cta.primaryCta" defaultText="Get in Touch" />
            </Link>
            <Link href="/projects" className="inline-flex items-center justify-center px-10 py-5 border-2 border-primary-foreground text-primary-foreground font-semibold hover:bg-primary-foreground/10 transition-colors text-lg">
              <EditableText keyName="cta.secondaryCta" defaultText="View Our Work" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
