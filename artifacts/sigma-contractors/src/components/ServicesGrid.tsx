import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { ServiceItem } from "@/data/content";
import { Truck, Waves, GitFork, Droplets, Mountain, HardHat, ArrowRight, Plus, Pencil, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { EditableText } from "@/admin/EditableText";
import { ServiceDetailModal } from "@/components/ServiceDetailModal";
import { ServiceFormDialog } from "@/components/ServiceFormDialog";
import { useAdmin } from "@/admin/AdminContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const iconMap: Record<string, React.ElementType> = {
  Truck, Waves, Bridge: GitFork, Droplets, Mountain, HardHat
};

interface ServicesGridProps {
  limit?: number;
  compact?: boolean;
}

export function ServicesGrid({ limit, compact = false }: ServicesGridProps) {
  const { isAdmin, editMode } = useAdmin();
  const adminControls = isAdmin && editMode;

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openService, setOpenService] = useState<ServiceItem | null>(null);
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/services", { credentials: "include" })
      .then((r) => r.json())
      .then((rows: ServiceItem[]) => {
        if (!cancelled) setServices(rows);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Could not load services");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function applyUpdate(updated: ServiceItem) {
    setServices((list) => {
      const exists = list.some((s) => s.id === updated.id);
      return exists
        ? list.map((s) => (s.id === updated.id ? updated : s))
        : [...list, updated];
    });
    if (openService?.id === updated.id) setOpenService(updated);
  }

  function applyDelete(id: string) {
    setServices((list) => list.filter((s) => s.id !== id));
    if (openService?.id === id) setOpenService(null);
  }

  const displayServices = limit ? services.slice(0, limit) : services;

  return (
    <section className={`${compact ? "pt-8 pb-20" : "py-24"} bg-muted/20`}>
      <div className="container mx-auto px-4">

        <div className={`text-center max-w-3xl mx-auto ${compact ? "mb-10" : "mb-12"}`}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display text-foreground mb-5 uppercase"
          >
            <EditableText keyName="services.section.title" defaultText="Our Expertise" />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl font-serif text-foreground/70 leading-relaxed"
          >
            <EditableText
              keyName="services.section.subtitle"
              defaultText="Delivering heavy civil works and infrastructure development with rigorous quality assurance across Pakistan."
              multiline
            />
          </motion.p>
        </div>

        {/* Add Service (admin only) */}
        {adminControls && (
          <div className="text-center mb-10">
            <Button
              onClick={() => setCreating(true)}
              className="rounded-none bg-primary hover:bg-primary/90 text-white font-display uppercase tracking-[0.18em] gap-2 px-6 h-12"
            >
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-20 text-foreground/60 font-serif inline-flex w-full items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading services…
          </div>
        )}

        {!loading && displayServices.length === 0 && (
          <div className="text-center py-20 text-foreground/60 font-serif">
            No services yet.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service, index) => {
            const Icon = iconMap[service.icon] ?? HardHat;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                onClick={() => setOpenService(service)}
                className="bg-card border border-border p-8 hover:border-primary hover:shadow-2xl transition-all duration-300 group flex flex-col h-full relative overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-x-0 top-0 h-[3px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                {adminControls && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditing(service);
                    }}
                    className="absolute top-3 right-3 z-10 bg-foreground/85 text-black px-2.5 py-1.5 text-[10px] font-display uppercase tracking-[0.2em] inline-flex items-center gap-1.5 hover:bg-foreground"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                )}

                <div className="h-14 w-14 bg-primary/10 flex items-center justify-center rounded-sm mb-6 text-primary group-hover:bg-primary group-hover:text-white group-hover:rotate-3 transition-all duration-300">
                  <Icon className="h-7 w-7" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-display text-foreground mb-3 group-hover:text-primary transition-colors">
                  <EditableText keyName={`service.${service.id}.title`} defaultText={service.title} />
                </h3>
                <p className="text-foreground/70 font-serif leading-relaxed mb-6 flex-grow text-base md:text-lg">
                  <EditableText
                    keyName={`service.${service.id}.description`}
                    defaultText={service.description}
                    multiline
                  />
                </p>
                <span className="text-primary font-semibold text-sm tracking-wider uppercase inline-flex items-center group-hover:text-primary/80 transition-colors mt-auto">
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                </span>
              </motion.div>
            );
          })}
        </div>

        {limit && services.length > limit && (
          <div className="mt-16 text-center">
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-10 py-5 bg-foreground text-background font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-none shadow-md hover:shadow-xl group"
            >
              View All Services
              <ArrowRight className="ml-3 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </div>
        )}
      </div>

      <ServiceDetailModal
        service={openService}
        open={!!openService}
        onOpenChange={(o) => !o && setOpenService(null)}
        onEdit={(s) => {
          setOpenService(null);
          setEditing(s);
        }}
        adminControls={adminControls}
      />

      <ServiceFormDialog
        open={creating || !!editing}
        onOpenChange={(open) => {
          if (!open) {
            setCreating(false);
            setEditing(null);
          }
        }}
        initial={editing}
        onSaved={(s) => applyUpdate(s)}
        onDeleted={(id) => applyDelete(id)}
      />
    </section>
  );
}
