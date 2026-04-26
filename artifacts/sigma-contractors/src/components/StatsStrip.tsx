import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { STATS } from "@/data/content";
import { EditableText } from "@/admin/EditableText";

function Counter({ index, value, label }: { index: number; value: string; label: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-display text-primary mb-2"
      >
        <EditableText keyName={`stats.${index}.value`} defaultText={value} />
      </motion.div>
      <div className="font-serif text-lg text-foreground/80 font-medium">
        <EditableText keyName={`stats.${index}.label`} defaultText={label} />
      </div>
    </div>
  );
}

export function StatsStrip() {
  return (
    <section className="py-20 bg-muted/30 border-y border-border/50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 divide-x divide-border/0 md:divide-border/40">
          {STATS.map((stat, i) => (
            <Counter key={i} index={i} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
