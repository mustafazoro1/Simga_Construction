import { SERVICES_MARQUEE } from "@/data/content";

export function ServicesMarquee() {
  // Duplicate the items so the -50% translate creates a seamless loop
  const items = [...SERVICES_MARQUEE, ...SERVICES_MARQUEE];

  return (
    <div className="bg-primary text-primary-foreground py-5 overflow-hidden relative">
      <div className="flex w-max animate-marquee-track">
        {items.map((label, i) => (
          <div key={i} className="flex items-center pr-12 shrink-0">
            <span className="text-lg md:text-xl font-display uppercase tracking-[0.2em] whitespace-nowrap">
              {label}
            </span>
            <span className="ml-12 text-primary-foreground/60 text-2xl">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
