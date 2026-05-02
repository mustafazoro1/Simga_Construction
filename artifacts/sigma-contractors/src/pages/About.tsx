import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { CTA } from "@/components/CTA";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { VISION_MISSION_GOAL } from "@/data/content";
import { EditableText } from "@/admin/EditableText";

const WHY_CHOOSE_US = [
  "Professional & Experienced Team",
  "Quality Assurance & Safety Standards",
  "Timely Project Completion",
  "Modern Equipment & Technology",
  "Client-Centered Approach"
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <PageHeader
          title="About Sigma"
          description="A trusted name in construction, civil engineering, and infrastructure development."
          keyPrefix="page.about"
        />

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-sm font-display text-primary mb-4 tracking-widest uppercase">
                  <EditableText keyName="about.who.eyebrow" defaultText="Who We Are" />
                </div>
                <h2 className="text-3xl md:text-5xl font-display text-foreground mb-8 uppercase leading-tight">
                  <EditableText keyName="about.who.title" defaultText="Building the Backbone of Tomorrow" />
                </h2>
                <div className="space-y-6 font-serif text-lg text-foreground/80 leading-relaxed">
                  <p>
                    <EditableText
                      keyName="about.who.body1"
                      defaultText="Sigma Contractors & Engineering Works (Pvt) Ltd is a trusted name in construction, civil engineering, and infrastructure development. With a strong commitment to quality, safety, and innovation, we deliver reliable engineering solutions tailored to meet modern industry standards.The Fastest growing company in Pakistan.With the best engineers and workers and 24 hour service."
                      multiline
                    />
                  </p>
                  <p>
                    <EditableText
                      keyName="about.who.body2"
                      defaultText="Our company specializes in residential, commercial, and industrial projects, ensuring timely completion with superior workmanship and cost-effective planning. We are a team of experienced engineers, project managers, and skilled technical professionals dedicated to excellence."
                      multiline
                    />
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative h-[500px] border border-border p-4 bg-card hidden lg:block"
              >
                <img
                  src="/sigma/basima2.jpeg"
                  alt="Construction Site"
                  className="w-full h-full object-cover object-center filter brightness-110 saturate-100 contrast-100"
                />
                <div className="absolute -bottom-8 -left-8 bg-primary text-primary-foreground p-8 max-w-xs shadow-xl hidden md:block">
                  <div className="text-4xl font-display mb-2">
                    <EditableText keyName="about.badge.value" defaultText="30+" />
                  </div>
                  <div className="font-serif text-primary-foreground/90">
                    <EditableText
                      keyName="about.badge.label"
                      defaultText="Years of combined engineering excellence."
                      multiline
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-foreground text-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-display text-black mb-6 uppercase">
                <EditableText keyName="about.why.title" defaultText="Why Choose Us" />
              </h2>
              <p className="font-serif text-lg text-background/70">
                <EditableText
                  keyName="about.why.subtitle"
                  defaultText="We combine technical rigor with modern methodologies to deliver projects that stand the test of time."
                  multiline
                />
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {WHY_CHOOSE_US.map((reason, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="flex items-start gap-4 p-6 border border-primary/30 bg-white"
                >
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                  <span className="font-serif text-lg text-black">
                    <EditableText keyName={`about.why.item.${idx}`} defaultText={reason} />
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-card p-10 border border-border shadow-sm">
                <div className="text-sm font-display text-primary mb-4 tracking-widest uppercase">
                  <EditableText keyName="vmg.mission.label" defaultText="Mission" />
                </div>
                <p className="text-lg font-serif text-foreground/80 leading-relaxed">
                  <EditableText keyName="vmg.mission.text" defaultText={VISION_MISSION_GOAL.mission} multiline />
                </p>
              </div>
              <div className="bg-card p-10 border border-border shadow-sm">
                <div className="text-sm font-display text-primary mb-4 tracking-widest uppercase">
                  <EditableText keyName="vmg.vision.label" defaultText="Vision" />
                </div>
                <p className="text-lg font-serif text-foreground/80 leading-relaxed">
                  <EditableText keyName="vmg.vision.text" defaultText={VISION_MISSION_GOAL.vision} multiline />
                </p>
              </div>
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
}
