import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { ProjectItem, ProjectStatus } from "@/data/content";

const STATUS_OPTIONS: ProjectStatus[] = ["Completed", "In Progress", "Upcoming"];
const CATEGORY_OPTIONS = ["Canal", "Highway", "Roads", "Reconditioning", "Bridge", "Building", "Other"];

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: ProjectItem | null; // null = create mode
  onSaved: (project: ProjectItem) => void;
  onDeleted?: (id: string) => void;
}

const EMPTY: ProjectItem = {
  id: "",
  title: "",
  category: "Other",
  status: "Upcoming",
  employer: "N/A",
  originalContractValue: "N/A",
  subcontractingAmount: "N/A",
  awarded: "N/A",
  completed: "N/A",
  scopeNote: "",
  hero: "",
  gallery: [],
};

async function resizeImage(file: File, maxWidth = 1800, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not load image"));
      img.onload = () => {
        const ratio = img.width > maxWidth ? maxWidth / img.width : 1;
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  initial,
  onSaved,
  onDeleted,
}: ProjectFormDialogProps) {
  const isEdit = !!initial;
  const [form, setForm] = useState<ProjectItem>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm(initial ?? EMPTY);
    setConfirmDelete(false);
  }, [initial, open]);

  function update<K extends keyof ProjectItem>(key: K, value: ProjectItem[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await resizeImage(file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, dataUrl }),
      });
      if (!res.ok) throw new Error(await res.text().catch(() => "Upload failed"));
      const json: { url: string } = await res.json();
      update("hero", json.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Upload failed", {
        description: err instanceof Error ? err.message : "",
      });
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const url = isEdit ? `/api/projects/${form.id}` : "/api/projects";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text().catch(() => "Save failed"));
      const saved: ProjectItem = await res.json();
      toast.success(isEdit ? "Project updated" : "Project added");
      onSaved(saved);
      onOpenChange(false);
    } catch (err) {
      toast.error("Save failed", {
        description: err instanceof Error ? err.message : "",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!isEdit) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${form.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text().catch(() => "Delete failed"));
      toast.success("Project deleted");
      onDeleted?.(form.id);
      onOpenChange(false);
    } catch (err) {
      toast.error("Delete failed", {
        description: err instanceof Error ? err.message : "",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border rounded-none p-0 overflow-hidden">
        <div className="max-h-[90vh] overflow-y-auto">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="font-display uppercase tracking-wide text-foreground text-2xl">
              {isEdit ? "Edit Project" : "Add Project"}
            </DialogTitle>
            <DialogDescription className="font-serif text-foreground/60">
              {isEdit
                ? "Update project details, status, scope and image."
                : "Fill in project details, choose status and category, and upload a cover image."}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-5">
            {/* Hero image upload */}
            <div className="space-y-2">
              <label className="text-xs font-display uppercase tracking-[0.2em] text-foreground/60">
                Cover Image
              </label>
              <div className="relative h-48 bg-muted border border-border overflow-hidden">
                {form.hero ? (
                  <img src={form.hero} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground/40 font-serif text-sm">
                    No image yet
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-3 right-3 bg-primary text-white px-4 py-2 text-xs font-display uppercase tracking-wider inline-flex items-center gap-2 hover:bg-primary/90 disabled:opacity-60"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {uploading ? "Uploading…" : form.hero ? "Replace" : "Upload Image"}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleFile(f);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-display uppercase tracking-[0.2em] text-foreground/60">
                Title <span className="text-primary">*</span>
              </label>
              <Input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Project title"
                className="rounded-none h-11"
              />
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-display uppercase tracking-[0.2em] text-foreground/60">
                  Category
                </label>
                <Select value={form.category} onValueChange={(v) => update("category", v)}>
                  <SelectTrigger className="rounded-none h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-display uppercase tracking-[0.2em] text-foreground/60">
                  Status
                </label>
                <Select
                  value={form.status}
                  onValueChange={(v) => update("status", v as ProjectStatus)}
                >
                  <SelectTrigger className="rounded-none h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Employer */}
            <div className="space-y-2">
              <label className="text-xs font-display uppercase tracking-[0.2em] text-foreground/60">
                Employer / Client
              </label>
              <Input
                value={form.employer}
                onChange={(e) => update("employer", e.target.value)}
                className="rounded-none h-11"
              />
            </div>

            {/* Contract values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-display uppercase tracking-[0.2em] text-foreground/60">
                  Contract Value
                </label>
                <Input
                  value={form.originalContractValue}
                  onChange={(e) => update("originalContractValue", e.target.value)}
                  className="rounded-none h-11"
                  placeholder="PKR 0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-display uppercase tracking-[0.2em] text-foreground/60">
                  Executed Value
                </label>
                <Input
                  value={form.subcontractingAmount}
                  onChange={(e) => update("subcontractingAmount", e.target.value)}
                  className="rounded-none h-11"
                  placeholder="PKR 0"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-display uppercase tracking-[0.2em] text-foreground/60">
                  Awarded
                </label>
                <Input
                  value={form.awarded}
                  onChange={(e) => update("awarded", e.target.value)}
                  className="rounded-none h-11"
                  placeholder="DD-MMM-YYYY"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-display uppercase tracking-[0.2em] text-foreground/60">
                  Completed
                </label>
                <Input
                  value={form.completed}
                  onChange={(e) => update("completed", e.target.value)}
                  className="rounded-none h-11"
                  placeholder="DD-MMM-YYYY"
                />
              </div>
            </div>

            {/* Scope */}
            <div className="space-y-2">
              <label className="text-xs font-display uppercase tracking-[0.2em] text-foreground/60">
                Scope of Work / Description
              </label>
              <Textarea
                value={form.scopeNote ?? ""}
                onChange={(e) => update("scopeNote", e.target.value)}
                rows={5}
                className="rounded-none"
                placeholder="Describe the scope of work for this project…"
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3 bg-muted/30">
            <div>
              {isEdit && onDeleted && (
                <Button
                  type="button"
                  onClick={() => (confirmDelete ? handleDelete() : setConfirmDelete(true))}
                  variant="ghost"
                  disabled={saving}
                  className="text-red-700 hover:text-red-800 hover:bg-red-50 rounded-none gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {confirmDelete ? "Click again to confirm" : "Delete"}
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="rounded-none"
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={saving || uploading}
                className="rounded-none bg-primary hover:bg-primary/90 text-white gap-2"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {isEdit ? "Save Changes" : "Add Project"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
