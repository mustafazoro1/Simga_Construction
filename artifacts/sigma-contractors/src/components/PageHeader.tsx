import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, Home as HomeIcon } from "lucide-react";
import { EditableText } from "@/admin/EditableText";
import { EditableImage } from "@/admin/EditableImage";

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  keyPrefix?: string;
  /** Default background image. Admins can override per-page if keyPrefix is set. */
  defaultImage?: string;
  /** Crumb label, e.g. "Services". Defaults to title. */
  crumb?: string;
}

export function PageHeader({
  title,
  description,
  eyebrow,
  keyPrefix,
  defaultImage = "/sigma/header.jpg",
  crumb,
}: PageHeaderProps) {
  const imageKey = keyPrefix ? `${keyPrefix}.heroImage` : "page.default.heroImage";
  const breadcrumb = crumb ?? title;

  return (
    <div className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden flex items-center justify-start text-white">
      {/* Background image (admin-editable). No z-index here so EditableImage's
          admin button can rise above the page-header text container below. */}
      <div className="absolute inset-0">
        <EditableImage
          keyName={imageKey}
          defaultSrc={defaultImage}
          alt=""
          className="w-full h-full"
          imgClassName="w-full h-full object-cover"
        />
        {/* Dramatic navy overlay (pointer-events-none so the upload button stays clickable) */}
        <div className="absolute inset-0 bg-background/70 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-background/70 to-background/90 pointer-events-none" />
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-10 pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto [&_[contenteditable=true]]:pointer-events-auto">
        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-5"
          >
            {keyPrefix ? (
              <EditableText keyName={`${keyPrefix}.eyebrow`} defaultText={eyebrow} />
            ) : (
              eyebrow
            )}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-4xl md:text-6xl lg:text-7xl font-display uppercase tracking-tight text-white leading-[1.05]"
        >
          {keyPrefix ? (
            <EditableText keyName={`${keyPrefix}.title`} defaultText={title} />
          ) : (
            title
          )}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-3 h-[2px] w-16 bg-primary"
        />
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base md:text-lg max-w-2xl text-white/85 leading-relaxed"
          >
            {keyPrefix ? (
              <EditableText
                keyName={`${keyPrefix}.description`}
                defaultText={description}
                multiline
              />
            ) : (
              description
            )}
          </motion.p>
        )}

        <motion.nav
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-7 flex items-center gap-2 text-xs font-display uppercase tracking-[0.18em] text-white/75"
        >
          <Link href="/" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
            <HomeIcon className="h-3.5 w-3.5" />
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-primary" />
          <span className="text-white">{breadcrumb}</span>
        </motion.nav>
      </div>
    </div>
  );
}
