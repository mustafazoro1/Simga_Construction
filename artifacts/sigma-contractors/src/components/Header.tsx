import { Link, useLocation } from "wouter";
import { Menu, X, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useAdmin } from "@/admin/AdminContext";
import { AdminLoginDialog } from "@/admin/AdminLoginDialog";
import sigmaLogo from "@assets/sigma.logo-Photoroom_1777371371301.png";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/health-safety", label: "Health & Safety" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const { isAdmin } = useAdmin();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-card bg-card/90 backdrop-blur-md supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img
            src={sigmaLogo}
            alt="Sigma Contractors Logo"
            className="h-10 w-auto bg-white/95 rounded-sm px-2 py-1 shadow-sm"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <button
            type="button"
            onClick={() => setIsAdminDialogOpen(true)}
            className={`text-sm font-medium transition-colors inline-flex items-center gap-1.5 ${
              isAdmin
                ? "text-primary hover:text-primary/80"
                : "text-foreground/70 hover:text-primary"
            }`}
            title={isAdmin ? "Admin signed in" : "Admin login"}
          >
            {isAdmin ? <ShieldCheck className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5" />}
            Admin
          </button>

          <Button asChild variant="default" className="font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-none px-6">
            <Link href="/contact">Get a Quote</Link>
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-4">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base font-medium transition-colors hover:text-primary ${
                  location === link.href ? "text-primary" : "text-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAdminDialogOpen(true);
              }}
              className={`text-base font-medium transition-colors text-left inline-flex items-center gap-2 ${
                isAdmin ? "text-primary" : "text-foreground/80"
              }`}
            >
              {isAdmin ? <ShieldCheck className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              Admin
            </button>
            <Button asChild variant="default" className="w-full rounded-none">
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Get a Quote</Link>
            </Button>
          </nav>
        </div>
      )}

      <AdminLoginDialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen} />
    </header>
  );
}
