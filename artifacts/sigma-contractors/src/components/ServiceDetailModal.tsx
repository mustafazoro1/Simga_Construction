import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditableText } from "@/admin/EditableText";
import { EditableImage } from "@/admin/EditableImage";
import { CheckCircle2, Pencil } from "lucide-react";
import type { ServiceItem } from "@/data/content";

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adminControls?: boolean;
  onEdit?: (service: ServiceItem) => void;
}

export function ServiceDetailModal({
  service,
  open,
  onOpenChange,
  adminControls = false,
  onEdit,
}: ServiceDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-card border-border rounded-none">
        {service && (
          <div className="max-h-[90vh] overflow-y-auto">
            <DialogHeader className="sr-only">
              <DialogTitle>{service.title}</DialogTitle>
              <DialogDescription>{service.description}</DialogDescription>
            </DialogHeader>
            <div className="h-56 sm:h-72 relative bg-muted overflow-hidden">
              <EditableImage
                keyName={`service.${service.id}.image`}
                defaultSrc={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full"
                imgClassName="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/45 via-foreground/10 to-transparent pointer-events-none" />
              {adminControls && onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(service)}
                  className="absolute top-3 right-3 z-20 bg-foreground/85 text-white px-3 py-1.5 text-[10px] font-display uppercase tracking-[0.2em] inline-flex items-center gap-1.5 hover:bg-foreground"
                >
                  <Pencil className="h-3 w-3" /> Edit Service
                </button>
              )}
              <div className="absolute bottom-0 left-0 p-6 sm:p-8 z-10">
                <div className="bg-primary text-primary-foreground text-[10px] font-display uppercase tracking-[0.2em] px-3 py-1.5 inline-block mb-3">
                  Sigma Service
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-display uppercase text-white leading-tight">
                  <EditableText
                    keyName={`service.${service.id}.title`}
                    defaultText={service.title}
                  />
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8 bg-card text-foreground">
              <p className="text-base md:text-lg font-serif text-foreground/80 leading-relaxed">
                <EditableText
                  keyName={`service.${service.id}.description`}
                  defaultText={service.description}
                  multiline
                />
              </p>

              <div>
                <h4 className="font-display text-sm uppercase tracking-[0.25em] text-primary mb-3">
                  About this service
                </h4>
                <div className="text-base md:text-lg font-serif text-foreground/85 leading-relaxed whitespace-pre-line">
                  <EditableText
                    keyName={`service.${service.id}.longDescription`}
                    defaultText={service.longDescription}
                    multiline
                  />
                </div>
              </div>

              <div>
                <h4 className="font-display text-sm uppercase tracking-[0.25em] text-primary mb-4">
                  Why choose Sigma
                </h4>
                <ul className="space-y-3">
                  {service.whyBest.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2
                        className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"
                        strokeWidth={2}
                      />
                      <span className="text-base font-serif text-foreground/80 leading-relaxed">
                        <EditableText
                          keyName={`service.${service.id}.whyBest.${i}`}
                          defaultText={item}
                          multiline
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
