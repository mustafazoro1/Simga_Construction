import { SERVICES_MARQUEE } from "@/data/content";

export function ServicesMarquee() {
  // Duplicate the items so the -50% translate creates a seamless loop
  const items = [...SERVICES_MARQUEE, ...SERVICES_MARQUEE];

  return (
    <div className="bg-foreground text-white py-5 overflow-hidden relative border-y-2 border-primary">
      <div className="flex w-max animate-marquee-track">
        {items.map((label, i) => (
          <div key={i} className="flex items-center pr-12 shrink-0">
            <span
              className={`text-lg md:text-xl font-display uppercase tracking-[0.2em] whitespace-nowrap ${
                i % 2 === 0 ? "text-primary" : "text-white"
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
