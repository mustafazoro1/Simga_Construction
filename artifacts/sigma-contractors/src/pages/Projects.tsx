import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { ProjectFormDialog } from "@/components/ProjectFormDialog";
import type { ProjectItem, ProjectStatus } from "@/data/content";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAdmin } from "@/admin/AdminContext";
import { Plus, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";

const STATUSES = ["All", "Completed", "In Progress", "Upcoming"] as const;

const statusStyles: Record<ProjectStatus, string> = {
  Completed: "bg-emerald-700/90 text-white",
  "In Progress": "bg-amber-600/90 text-white",
  Upcoming: "bg-slate-700/90 text-white",
};

async function patchStatus(id: string, status: ProjectStatus) {
  const res = await fetch(`/api/projects/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(await res.text().catch(() => "Failed"));
  return (await res.json()) as ProjectItem;
}

export default function Projects() {
  const { isAdmin, editMode } = useAdmin();
  const adminControls = isAdmin && editMode;

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUSES)[number]>("All");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [location] = useLocation();

  // Load projects
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/api/projects", { credentials: "include" })
      .then((r) => r.json())
      .then((rows: ProjectItem[]) => {
        if (!cancelled) setProjects(rows);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Could not load projects", {
          description: err instanceof Error ? err.message : "",
        });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Deep link: /projects?id=xxx
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id && projects.length) {
      const proj = projects.find((p) => p.id === id);
      if (proj) setSelectedProject(proj);
    }
  }, [location, projects]);

  // Build category list dynamically from data
  const categories = useMemo(() => {
    const set = new Set<string>(["All"]);
    projects.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [projects]);

  const filteredProjects = projects.filter(
    (p) =>
      (filter === "All" || p.category === filter) &&
      (statusFilter === "All" || p.status === statusFilter),
  );

  function applyUpdate(updated: ProjectItem) {
    setProjects((list) => {
      const exists = list.some((p) => p.id === updated.id);
      return exists
        ? list.map((p) => (p.id === updated.id ? updated : p))
        : [...list, updated];
    });
    if (selectedProject?.id === updated.id) setSelectedProject(updated);
  }

  function applyDelete(id: string) {
    setProjects((list) => list.filter((p) => p.id !== id));
    if (selectedProject?.id === id) {
      setSelectedProject(null);
      window.history.replaceState({}, "", "/projects");
    }
  }

  function handleCloseModal() {
    setSelectedProject(null);
    window.history.replaceState({}, "", "/projects");
  }

  async function handleStatusChange(project: ProjectItem, status: ProjectStatus) {
    if (project.status === status) return;
    const prev = project;
    // optimistic
    applyUpdate({ ...project, status });
    try {
      const updated = await patchStatus(project.id, status);
      applyUpdate(updated);
      toast.success(`Status set to ${status}`);
    } catch (err) {
      applyUpdate(prev);
      toast.error("Could not update status", {
        description: err instanceof Error ? err.message : "",
      });
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <PageHeader
          title="Featured Projects"
          description="A portfolio of major infrastructure developments successfully executed by Sigma."
          eyebrow="Our Portfolio"
          keyPrefix="page.projects"
          crumb="Projects"
        />

        <section className="py-20">
          <div className="container mx-auto px-4">
            {/* Status Filters */}
            <div className="text-center mb-4">
              <p className="text-xs font-display tracking-[0.3em] uppercase text-foreground/50 mb-3">
                Project Status
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-5 py-2 font-display text-xs uppercase tracking-[0.18em] transition-colors border ${
                      statusFilter === s
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-transparent text-foreground border-border hover:border-primary/60"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filters */}
            <div className="text-center mb-8 mt-8">
              <p className="text-xs font-display tracking-[0.3em] uppercase text-foreground/50 mb-3">
                Category
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-6 py-2 font-display text-xs uppercase tracking-[0.18em] transition-colors border ${
                      filter === cat
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-foreground border-border hover:border-primary/60"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Add Project (admin only) */}
            {adminControls && (
              <div className="text-center mb-10">
                <Button
                  onClick={() => setCreating(true)}
                  className="rounded-none bg-primary hover:bg-primary/90 text-white font-display uppercase tracking-[0.18em] gap-2 px-6 h-12"
                >
                  <Plus className="h-4 w-4" />
                  Add Project
                </Button>
              </div>
            )}

            {loading && (
              <div className="text-center py-20 text-foreground/60 font-serif inline-flex w-full items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading projects…
              </div>
            )}

            {!loading && filteredProjects.length === 0 && (
              <div className="text-center py-20 text-foreground/60 font-serif">
                No projects match these filters.
              </div>
            )}

            {/* Grid */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {filteredProjects.map((project) => (
                  <motion.div
                    layout
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="group cursor-pointer bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all flex flex-col"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="relative h-64 overflow-hidden bg-muted">
                      {project.hero ? (
                        <img
                          src={project.hero}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-foreground/30 font-display uppercase text-xs tracking-widest">
                          No cover image
                        </div>
                      )}
                      {/* Category — top left */}
                      <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-display uppercase tracking-[0.2em] px-3 py-1.5">
                        {project.category}
                      </div>
                      {/* Status — top right (admin: dropdown) */}
                      {adminControls ? (
                        <div
                          className="absolute top-4 right-4 z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Select
                            value={project.status}
                            onValueChange={(v) =>
                              handleStatusChange(project, v as ProjectStatus)
                            }
                          >
                            <SelectTrigger
                              className={`h-8 w-auto min-w-[125px] rounded-none border-0 text-[10px] font-display uppercase tracking-[0.2em] px-3 ${statusStyles[project.status]} hover:opacity-90 focus:ring-2 focus:ring-white/60`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Completed">Completed</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Upcoming">Upcoming</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div
                          className={`absolute top-4 right-4 text-[10px] font-display uppercase tracking-[0.2em] px-3 py-1.5 ${statusStyles[project.status]}`}
                        >
                          {project.status === "Completed" && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white mr-1.5 align-middle" />
                          )}
                          {project.status === "In Progress" && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white mr-1.5 align-middle animate-pulse" />
                          )}
                          {project.status}
                        </div>
                      )}
                      {/* Edit (admin) */}
                      {adminControls && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditing(project);
                          }}
                          className="absolute bottom-4 right-4 z-10 bg-foreground/85 text-white px-3 py-1.5 text-[10px] font-display uppercase tracking-[0.2em] inline-flex items-center gap-1.5 hover:bg-foreground"
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </button>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-serif text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <div className="mt-auto space-y-2 text-sm text-foreground/70 font-sans">
                        <div className="flex justify-between gap-3">
                          <span className="font-semibold text-foreground/90">Employer:</span>
                          <span className="text-right truncate">{project.employer}</span>
                        </div>
                        {project.completed !== "N/A" && (
                          <div className="flex justify-between">
                            <span className="font-semibold text-foreground/90">Completed:</span>
                            <span>{project.completed}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Project Detail Modal */}
        <Dialog
          open={!!selectedProject}
          onOpenChange={(open) => !open && handleCloseModal()}
        >
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card border-border rounded-none">
            {selectedProject && (
              <div className="max-h-[90vh] overflow-y-auto">
                <DialogHeader className="sr-only">
                  <DialogTitle>{selectedProject.title}</DialogTitle>
                  <DialogDescription>{selectedProject.scopeNote ?? selectedProject.title}</DialogDescription>
                </DialogHeader>
                <div className="h-64 sm:h-80 md:h-96 relative bg-muted">
                  {selectedProject.hero ? (
                    <img
                      src={selectedProject.hero}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-foreground/30 font-display uppercase text-xs tracking-widest">
                      No cover image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />

                  {/* Status badge — admin gets dropdown here too */}
                  {adminControls ? (
                    <div className="absolute top-4 right-4 z-10">
                      <Select
                        value={selectedProject.status}
                        onValueChange={(v) =>
                          handleStatusChange(selectedProject, v as ProjectStatus)
                        }
                      >
                        <SelectTrigger
                          className={`h-9 w-auto min-w-[140px] rounded-none border-0 text-[10px] font-display uppercase tracking-[0.2em] px-3 ${statusStyles[selectedProject.status]} hover:opacity-90 focus:ring-2 focus:ring-white/60`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Upcoming">Upcoming</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div
                      className={`absolute top-4 right-4 text-[10px] font-display uppercase tracking-[0.2em] px-3 py-1.5 ${statusStyles[selectedProject.status]}`}
                    >
                      {selectedProject.status}
                    </div>
                  )}

                  {/* Edit button (admin) */}
                  {adminControls && (
                    <button
                      type="button"
                      onClick={() => setEditing(selectedProject)}
                      className="absolute top-16 right-4 z-10 bg-foreground/85 text-white px-3 py-1.5 text-[10px] font-display uppercase tracking-[0.2em] inline-flex items-center gap-1.5 hover:bg-foreground"
                    >
                      <Pencil className="h-3 w-3" /> Edit Details
                    </button>
                  )}

                  <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                    <div className="bg-primary text-primary-foreground text-[10px] font-display uppercase tracking-[0.2em] px-3 py-1.5 inline-block mb-4">
                      {selectedProject.category}
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-white leading-tight">
                      {selectedProject.title}
                    </h2>
                  </div>
                </div>

                <div className="p-6 sm:p-8 bg-card text-foreground font-sans">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-6">
                      <h4 className="font-display text-xl uppercase text-foreground mb-4 border-b border-border pb-2">
                        Project Details
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-foreground/60 uppercase tracking-wider font-semibold mb-1">
                            Employer
                          </p>
                          <p className="text-lg font-serif">{selectedProject.employer}</p>
                        </div>
                        {selectedProject.originalContractValue !== "N/A" && (
                          <div>
                            <p className="text-sm text-foreground/60 uppercase tracking-wider font-semibold mb-1">
                              Contract Value
                            </p>
                            <p className="text-lg font-serif">
                              {selectedProject.originalContractValue}
                            </p>
                          </div>
                        )}
                        {selectedProject.subcontractingAmount !== "N/A" && (
                          <div>
                            <p className="text-sm text-foreground/60 uppercase tracking-wider font-semibold mb-1">
                              Executed Value
                            </p>
                            <p className="text-lg font-serif text-primary">
                              {selectedProject.subcontractingAmount}
                            </p>
                          </div>
                        )}
                        {selectedProject.awarded !== "N/A" && (
                          <div className="flex gap-8">
                            <div>
                              <p className="text-sm text-foreground/60 uppercase tracking-wider font-semibold mb-1">
                                Awarded
                              </p>
                              <p className="font-serif">{selectedProject.awarded}</p>
                            </div>
                            <div>
                              <p className="text-sm text-foreground/60 uppercase tracking-wider font-semibold mb-1">
                                Completed
                              </p>
                              <p className="font-serif">{selectedProject.completed}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedProject.scopeNote && (
                      <div>
                        <h4 className="font-display text-xl uppercase text-foreground mb-4 border-b border-border pb-2">
                          Scope of Work
                        </h4>
                        <p className="text-lg font-serif text-foreground/80 leading-relaxed whitespace-pre-line">
                          {selectedProject.scopeNote}
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedProject.gallery.length > 0 && (
                    <div className="mt-12">
                      <h4 className="font-display text-xl uppercase text-foreground mb-6">
                        Gallery
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedProject.gallery.map((img, i) => (
                          <div
                            key={i}
                            className="aspect-video bg-muted overflow-hidden border border-border"
                          >
                            <img
                              src={img}
                              alt={`Gallery ${i}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit / Add Dialog */}
        <ProjectFormDialog
          open={creating || !!editing}
          onOpenChange={(open) => {
            if (!open) {
              setCreating(false);
              setEditing(null);
            }
          }}
          initial={editing}
          onSaved={(p) => applyUpdate(p)}
          onDeleted={(id) => applyDelete(id)}
        />
      </main>
      <Footer />
    </div>
  );
}
