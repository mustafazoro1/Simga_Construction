import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HERO_TAGLINES } from "@/data/content";
import { Button } from "./ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { EditableText } from "@/admin/EditableText";
import { useAdmin } from "@/admin/AdminContext";

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { editMode } = useAdmin();

  useEffect(() => {
    if (editMode) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_TAGLINES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [editMode]);

  return (
    <div className="relative min-h-[760px] lg:min-h-[820px] max-h-[920px] flex items-center overflow-hidden bg-background">
      {/* Right-side flyover/highway image — full color so machinery/steel pops
          against the navy backdrop. */}
      <div className="absolute inset-y-0 right-0 w-full md:w-[58%] lg:w-[55%] z-0">
        <img
          src="/sigma/basima2.jpeg"
          alt="Highway flyover under construction"
          className="w-full h-full object-cover saturate-110 contrast-105"
        />
        {/* Navy gradient — heavy on the left so headline is readable, fading to
            transparent on the right per the Power & Trust spec. */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        {/* Subtle navy darken across the whole image so it harmonises with the page */}
        <div className="absolute inset-0 bg-background/30" />
        {/* Bottom & top fade so it integrates with the page */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-background/70 border border-foreground/10 rounded-full backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <EditableText
            keyName="hero.eyebrow"
            defaultText="Sigma Contractors & Engineering Works (Pvt) Ltd."
            className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground/80"
          />
        </motion.div>

        <div className="max-w-2xl lg:max-w-3xl relative min-h-[560px] sm:min-h-[480px] md:min-h-[440px] lg:min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display uppercase leading-[1.05] text-foreground mb-6">
                <EditableText
                  keyName={`hero.tagline.${currentIndex}.title`}
                  defaultText={HERO_TAGLINES[currentIndex].title}
                />
              </h1>
              <p className="text-sm md:text-base text-foreground/70 max-w-xl leading-relaxed">
                <EditableText
                  keyName={`hero.tagline.${currentIndex}.sub`}
                  defaultText={HERO_TAGLINES[currentIndex].sub}
                  multiline
                />
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 sm:mt-16 flex flex-col sm:flex-row gap-4"
        >
          <Button
            asChild
            size="lg"
            className="rounded-none bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-14 text-base group shadow-[0_0_25px_-4px_hsl(var(--primary)/0.7)] hover:shadow-[0_0_35px_-2px_hsl(var(--primary)/0.85)] transition-shadow"
          >
            <Link href="/projects">
              Our Projects
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-none border-primary/40 text-foreground hover:border-primary hover:text-primary font-semibold px-8 h-14 text-base bg-card/60 backdrop-blur-sm"
          >
            <Link href="/contact">Contact Us</Link>
          </Button>
        </motion.div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 z-10">
        <div className="container mx-auto px-4 flex items-center gap-3">
          {HERO_TAGLINES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-[3px] transition-all duration-500 ${
                idx === currentIndex
                  ? "w-16 bg-primary"
                  : "w-8 bg-foreground/20 hover:bg-foreground/40"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
          <span className="ml-4 text-xs uppercase tracking-[0.25em] text-foreground/50 font-semibold">
            0{currentIndex + 1} / 0{HERO_TAGLINES.length}
          </span>
        </div>
      </div>
    </div>
  );
}
