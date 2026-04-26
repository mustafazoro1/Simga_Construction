import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { LocationSection } from "@/components/LocationSection";
import { ContactForm } from "@/components/ContactForm";
import { EditableText } from "@/admin/EditableText";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <PageHeader
          title="Contact Us"
          description="Get in touch for inquiries, project consultations, or partnership opportunities."
          keyPrefix="page.contact"
        />

        <section className="py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-display text-foreground mb-6 uppercase">
                  <EditableText keyName="contact.form.title" defaultText="Send us a message" />
                </h2>
                <p className="font-serif text-lg text-foreground/70 max-w-2xl mx-auto">
                  <EditableText
                    keyName="contact.form.description"
                    defaultText="Whether you have a specific project in mind or want to learn more about our capabilities, our team is ready to assist you."
                    multiline
                  />
                </p>
              </div>

              <ContactForm />
            </motion.div>
          </div>
        </section>

        <LocationSection />
      </main>
      <Footer />
    </div>
  );
}
