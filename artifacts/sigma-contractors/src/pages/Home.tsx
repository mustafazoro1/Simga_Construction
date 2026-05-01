import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { StatsStrip } from "@/components/StatsStrip";
import { VisionMissionGoal } from "@/components/VisionMissionGoal";
import { ServicesMarquee } from "@/components/ServicesMarquee";
import { ServicesGrid } from "@/components/ServicesGrid";
import { CTA } from "@/components/CTA";
import { LocationSection } from "@/components/LocationSection";
import { motion } from "framer-motion";
import type { ProjectItem } from "@/data/content";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

function FeaturedProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/projects", { credentials: "include" })
      .then((r) => r.json())
      .then((rows: ProjectItem[]) => {
        if (!cancelled) setProjects(rows);
      })
      .catch((err) => console.error("Failed to load featured projects", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Prefer Completed projects with a hero image first, then anything else with a hero.
  const featured = [...projects]
    .sort((a, b) => {
      const aDone = a.status === "Completed" ? 0 : 1;
      const bDone = b.status === "Completed" ? 0 : 1;
      if (aDone !== bDone) return aDone - bDone;
      const aHero = a.hero ? 0 : 1;
      const bHero = b.hero ? 0 : 1;
      return aHero - bHero;
    })
    .slice(0, 4);

  return (
    <section className="py-24 bg-background border-t border-border/80">

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-display text-primary mb-4 tracking-[0.3em] uppercase">Selected Work</div>
            <h2 className="text-4xl md:text-5xl font-display text-foreground mb-5 uppercase leading-[1.05]">
              Featured Projects
            </h2>
            <p className="text-base md:text-lg text-foreground/65 leading-relaxed">
              A selection of our major civil engineering works, delivering critical infrastructure across the region.The Fastest growing company in Pakistan.
            </p>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors uppercase tracking-[0.2em] text-xs"
          >
            View All Projects <span className="ml-2">→</span>
          </Link>
        </div>

        {loading && (
          <div className="text-center py-16 text-foreground/60 font-serif inline-flex w-full items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading featured projects…
          </div>
        )}

        {!loading && featured.length === 0 && (
          <div className="text-center py-16 text-foreground/60 font-serif">
            No projects to feature yet.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featured.map((project, idx) => (
            <Link key={project.id} href={`/projects?id=${project.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group cursor-pointer h-full border border-border bg-card overflow-hidden hover:border-primary/60 hover:shadow-lg transition-all"
              >
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <img
                    src={project.hero}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-display uppercase tracking-[0.2em] px-3 py-1.5">
                    {project.category}
                  </div>
                  <div
                    className={`absolute top-4 right-4 text-[10px] font-display uppercase tracking-[0.2em] px-3 py-1.5 backdrop-blur-sm border ${
                      project.status === "Completed"
                        ? "bg-emerald-600/90 text-white border-emerald-400/40"
                        : project.status === "In Progress"
                        ? "bg-amber-500/90 text-white border-amber-300/40"
                        : "bg-foreground/80 text-background border-background/30"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          project.status === "Completed"
                            ? "bg-white"
                            : project.status === "In Progress"
                            ? "bg-white animate-pulse"
                            : "bg-background"
                        }`}
                      />
                      {project.status}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl md:text-2xl font-serif text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-foreground/55 font-sans text-sm">
                    {project.employer !== "N/A" ? project.employer : "Infrastructure Development"}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <ServicesMarquee />
        <StatsStrip />
        <VisionMissionGoal />
        <ServicesGrid limit={6} />
        <FeaturedProjects />
        <LocationSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
