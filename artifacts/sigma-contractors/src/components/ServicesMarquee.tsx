import { SERVICES_MARQUEE } from "@/data/content";

export function ServicesMarquee() {
  // Duplicate the items so the -50% translate creates a seamless loop
  const items = [...SERVICES_MARQUEE, ...SERVICES_MARQUEE];

  return (
    <div className="bg-card text-foreground py-5 overflow-hidden relative border-y border-primary/40">
      <div className="flex w-max animate-marquee-track">
        {items.map((label, i) => (
          <div key={i} className="flex items-center pr-12 shrink-0">
            <span
              className={`text-lg md:text-xl font-display uppercase tracking-[0.2em] whitespace-nowrap ${
                i % 2 === 0 ? "text-primary" : "text-foreground"
              }`}
            >
              {label}
            </span>
            <span className="ml-12 text-primary text-2xl">◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}
