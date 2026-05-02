import { Link } from "wouter";
import { CONTACT_INFO } from "@/data/content";
import { Mail, MapPin, Phone } from "lucide-react";
import { EditableText } from "@/admin/EditableText";
import sigmaLogo from "@assets/sigma.logo-Photoroom_1777371371301.png";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 border-t border-border/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <img
                src={sigmaLogo}
                alt="Sigma Contractors Logo"
                className="h-14 w-auto bg-white/95 rounded-sm px-3 py-2 shadow-sm"
              />
            </Link>
            <p className="text-sm text-background/80 leading-relaxed font-sans">
              <EditableText
                keyName="footer.about"
                defaultText="Sigma Contractors & Engineering Works (Pvt) Ltd is a trusted name in construction, civil engineering, and infrastructure development across Pakistan."
                multiline
              />
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg mb-6 uppercase tracking-wider text-background/90">
              Quick Links
            </h4>
            <ul className="space-y-3 font-sans">
              <li>
                <Link
                  href="/"
                  className="text-background/70 hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-background/70 hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-background/70 hover:text-primary transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-background/70 hover:text-primary transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-background/70 hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg mb-6 uppercase tracking-wider text-background/90">
              Services
            </h4>
            <ul className="space-y-3 font-sans text-background/70">
              <li className="hover:text-yellow-400 transition-colors duration-300">
                <Link href="/services"> linkRoads & Highways</Link>
              </li>
              <li className="hover:text-yellow-400 transition-colors duration-300">
                <Link href="/services">Canal Lining & Irrigation</Link>
              </li>
              <li className="hover:text-yellow-400 transition-colors duration-300">
                <Link href="/services">Bridges & Structures</Link>
              </li>
              <li className="hover:text-yellow-400 transition-colors duration-300">
                <Link href="/services">Water Supply Networks</Link>
              </li>
              <li className="hover:text-yellow-400 transition-colors duration-300">
                <Link href="/services">Dams & Barrages</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg mb-6 uppercase tracking-wider text-background/90">
              Contact
            </h4>
            <ul className="space-y-4 font-sans">
              <li className="flex items-start gap-3 text-background/80">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <EditableText
                  keyName="contact.address"
                  defaultText={CONTACT_INFO.address}
                  multiline
                  className="text-sm"
                />
              </li>
              <li className="flex items-center gap-3 text-background/80">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <EditableText
                  keyName="contact.phone"
                  defaultText={CONTACT_INFO.phone}
                  className="text-sm"
                />
              </li>
              <li className="flex items-center gap-3 text-background/80">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <EditableText
                  keyName="contact.email"
                  defaultText={CONTACT_INFO.email}
                  className="text-sm"
                />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4 font-sans text-sm text-background/50">
          <p>
            © 2026 Sigma Contractors and Engineering Works (Pvt) Ltd. All
            rights reserved.
          </p>
          <div className="flex gap-4">
            <span>Karachi, Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
