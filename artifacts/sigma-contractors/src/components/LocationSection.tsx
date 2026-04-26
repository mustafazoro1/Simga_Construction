import { CONTACT_INFO } from "@/data/content";
import { EditableText } from "@/admin/EditableText";

export function LocationSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-display text-foreground mb-6 uppercase">
              <EditableText keyName="location.title" defaultText="Headquarters" />
            </h2>
            <p className="text-lg font-serif text-foreground/70 mb-10 max-w-lg leading-relaxed">
              <EditableText
                keyName="location.description"
                defaultText="Based in Karachi, we execute projects across Sindh and Balochistan. Visit our office or reach out to discuss your next big infrastructure requirement."
                multiline
              />
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-display text-primary mb-2 uppercase tracking-widest">
                  <EditableText keyName="location.addressLabel" defaultText="Address" />
                </h3>
                <p className="text-foreground/80 font-serif leading-relaxed max-w-xs">
                  <EditableText keyName="contact.address" defaultText={CONTACT_INFO.address} multiline />
                </p>
              </div>

              <div className="flex gap-12">
                <div>
                  <h3 className="text-sm font-display text-primary mb-2 uppercase tracking-widest">
                    <EditableText keyName="location.phoneLabel" defaultText="Phone" />
                  </h3>
                  <p className="text-foreground/80 font-serif">
                    <EditableText keyName="contact.phone" defaultText={CONTACT_INFO.phone} />
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-display text-primary mb-2 uppercase tracking-widest">
                    <EditableText keyName="location.emailLabel" defaultText="Email" />
                  </h3>
                  <p className="text-foreground/80 font-serif">
                    <EditableText keyName="contact.email" defaultText={CONTACT_INFO.email} />
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[400px] bg-muted relative border border-border">
            <iframe
              src={CONTACT_INFO.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale contrast-125 opacity-80 mix-blend-multiply"
              title="Office Location Map"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
