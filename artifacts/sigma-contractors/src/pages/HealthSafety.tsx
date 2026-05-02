import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { CTA } from "@/components/CTA";
import { motion } from "framer-motion";
import { ShieldAlert, CheckCircle, HeartPulse, HardHat, ClipboardCheck, Users, TreePine } from "lucide-react";
import { EditableText } from "@/admin/EditableText";

const SAFETY_POINTS = [
  {
    icon: <HardHat className="h-8 w-8 text-primary" />,
    title: "Mandatory PPE Compliance",
    description: "Strict enforcement of Personal Protective Equipment (PPE) on all construction sites, ensuring every worker is protected against on-site hazards."
  },
  {
    icon: <ClipboardCheck className="h-8 w-8 text-primary" />,
    title: "Comprehensive Risk Assessment",
    description: "Thorough hazard identification and risk assessments are conducted before the commencement of every project phase to prevent accidents."
  },
  {
    icon: <HeartPulse className="h-8 w-8 text-primary" />,
    title: "On-Site Health Facilities",
    description: "We provide immediate medical assistance and first-aid facilities at all major operational sites, along with periodic health checkups for our staff."
  },
  {
    icon: <ShieldAlert className="h-8 w-8 text-primary" />,
    title: "Emergency Response Protocols",
    description: "Well-defined and regularly practiced emergency response and evacuation procedures to handle any unforeseen incidents effectively."
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Safety Training & Education",
    description: "Continuous training programs for our workforce to instill a 'Safety First' culture and keep them updated on international safety standards."
  },
  {
    icon: <TreePine className="h-8 w-8 text-primary" />,
    title: "Environmental Health & Safety",
    description: "Strict adherence to environmental safety standards to protect both our workers and the health of the surrounding communities."
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: "Regular Safety Audits",
    description: "Internal and external safety audits are performed periodically to ensure consistent compliance with national and global safety regulations."
  }
];

export default function HealthSafety() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <PageHeader
          title="Health & Safety Policy"
          description="At Sigma Contractors, we believe that every accident is preventable. Safety is not just a policy; it's our core value."
          keyPrefix="page.health-safety"
        />

        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-sm font-display text-primary mb-4 tracking-widest uppercase">
                  <EditableText keyName="hs.commitment.eyebrow" defaultText="Our Commitment" />
                </div>
                <h2 className="text-3xl md:text-5xl font-display text-foreground mb-8 uppercase leading-tight">
                  <EditableText keyName="hs.commitment.title" defaultText="Safety Above All Else" />
                </h2>
                <div className="space-y-6 font-serif text-lg text-foreground/80 leading-relaxed">
                  <p>
                    <EditableText
                      keyName="hs.commitment.body1"
                      defaultText="Sigma Contractors & Engineering Works (Pvt) Ltd is dedicated to providing a safe and healthy work environment for all employees, contractors, and visitors. We recognize that our human resources are our most valuable asset."
                      multiline
                    />
                  </p>
                  <p>
                    <EditableText
                      keyName="hs.commitment.body2"
                      defaultText="Our goal is zero accidents and zero work-related illnesses. We achieve this through rigorous planning, continuous training, and an unwavering commitment to safety protocols at every level of our operations."
                      multiline
                    />
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative h-[400px] border border-border p-4 bg-card shadow-2xl"
              >
                <img
                  src="/sigma/basima1.jpeg"
                  alt="Safety on site"
                  className="w-full h-full object-cover filter saturate-[0.8]"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SAFETY_POINTS.map((point, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="p-10 border border-border bg-card group hover:border-primary transition-all duration-300"
                >
                  <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                    {point.icon}
                  </div>
                  <h3 className="text-xl font-display text-foreground mb-4 uppercase tracking-wider">
                    <EditableText keyName={`hs.point.title.${idx}`} defaultText={point.title} />
                  </h3>
                  <p className="font-serif text-foreground/70 leading-relaxed">
                    <EditableText keyName={`hs.point.desc.${idx}`} defaultText={point.description} multiline />
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-foreground text-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-display text-primary mb-8 uppercase">
              <EditableText keyName="hs.footer.title" defaultText="No Project Is Worth An Injury" />
            </h2>
            <p className="max-w-2xl mx-auto font-serif text-lg text-background/70 mb-12">
              <EditableText
                keyName="hs.footer.text"
                defaultText="We empower every team member with the authority to stop work if they identify an unsafe condition. At Sigma, safety is everyone's responsibility."
                multiline
              />
            </p>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
}
