import { motion, Variants } from "framer-motion";
import { VISION_MISSION_GOAL } from "@/data/content";
import { EditableText } from "@/admin/EditableText";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export function VisionMissionGoal() {
  return (
    <section className="py-24 bg-background relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -6 }}
            className="bg-card p-10 border border-border shadow-sm group hover:shadow-2xl hover:border-primary/50 transition-all duration-300 cursor-default"
          >
            <div className="text-sm font-display text-primary mb-4 tracking-widest uppercase group-hover:tracking-[0.25em] transition-all duration-300">
              <EditableText keyName="vmg.vision.label" defaultText="Our Vision" />
            </div>
            <p className="text-lg font-serif text-foreground/90 leading-relaxed group-hover:text-foreground transition-colors">
              <EditableText keyName="vmg.vision.text" defaultText={VISION_MISSION_GOAL.vision} multiline />
            </p>
            <div className="mt-6 h-[2px] w-12 bg-primary/40 group-hover:w-24 group-hover:bg-primary transition-all duration-300" />
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -6 }}
            className="bg-foreground text-background p-10 border border-foreground shadow-sm group hover:shadow-2xl hover:bg-foreground/95 transition-all duration-300 cursor-default"
          >
            <div className="text-sm font-display text-primary mb-4 tracking-widest uppercase group-hover:tracking-[0.25em] transition-all duration-300">
              <EditableText keyName="vmg.mission.label" defaultText="Our Mission" />
            </div>
            <p className="text-lg font-serif text-background/90 leading-relaxed group-hover:text-background transition-colors">
              <EditableText keyName="vmg.mission.text" defaultText={VISION_MISSION_GOAL.mission} multiline />
            </p>
            <div className="mt-6 h-[2px] w-12 bg-primary group-hover:w-24 transition-all duration-300" />
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -6 }}
            className="bg-card p-10 border border-border shadow-sm group hover:shadow-2xl hover:border-primary/50 transition-all duration-300 cursor-default"
          >
            <div className="text-sm font-display text-primary mb-4 tracking-widest uppercase group-hover:tracking-[0.25em] transition-all duration-300">
              <EditableText keyName="vmg.goal.label" defaultText="Our Goal" />
            </div>
            <p className="text-lg font-serif text-foreground/90 leading-relaxed group-hover:text-foreground transition-colors">
              <EditableText keyName="vmg.goal.text" defaultText={VISION_MISSION_GOAL.goal} multiline />
            </p>
            <div className="mt-6 h-[2px] w-12 bg-primary/40 group-hover:w-24 group-hover:bg-primary transition-all duration-300" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
