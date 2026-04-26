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
import { Loader2, Upload, Save, Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import type { ServiceItem } from "@/data/content";

const ICON_OPTIONS = [
  { value: "Truck", label: "Truck (Roads)" },
  { value: "Waves", label: "Waves (Canals)" },
  { value: "Bridge", label: "Bridge (Structures)" },
  { value: "Droplets", label: "Droplets (Water)" },
  { value: "Mountain", label: "Mountain (Dams)" },
  { value: "HardHat", label: "Hard Hat (Civil)" },
];

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: ServiceItem | null;
  onSaved: (service: ServiceItem) => void;
  onDeleted?: (id: string) => void;
}

const EMPTY: ServiceItem = {
  id: "",
  title: "",
  description: "",
  longDescription: "",
  image: "",
  whyBest: [""],
  icon: "HardHat",
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

export function ServiceFormDialog({
  open,
  onOpenChange,
  initial,
  onSaved,
  onDeleted,
}: ServiceFormDialogProps) {
  const isEdit = !!initial;
  const [form, setForm] = useState<ServiceItem>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm(
      initial ?? { ...EMPTY, whyBest: [""] },
    );
    setConfirmDelete(false);
  }, [initial, open]);

  function update<K extends keyof ServiceItem>(key: K, value: ServiceItem[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateWhyBest(idx: number, value: string) {
    setForm((f) => {
      const next = [...f.whyBest];
      next[idx] = value;
      return { ...f, whyBest: next };
    });
  }

  function addWhyBest() {
    setForm((f) => ({ ...f, whyBest: [...f.whyBest, ""] }));
  }

  function removeWhyBest(idx: number) {
    setForm((f) => ({ ...f, whyBest: f.whyBest.filter((_, i) => i !== idx) }));
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
      update("image", json.url);
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
      const url = isEdit ? `/api/services/${form.id}` : "/api/services";
      const method = isEdit ? "PUT" : "POST";
      const payload = {
        ...form,
        whyBest: form.whyBest.map((s) => s.trim()).filter((s) => s.length > 0),
      };
      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text().catch(() => "Save failed"));
      const saved: ServiceItem = await res.json();
      toast.success(isEdit ? "Service updated" : "Service added");
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
      const res = await fetch(`/api/services/${form.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text().catch(() => "Delete failed"));
      toast.success("Service deleted");
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
              {isEdit ? "Edit Service" : "Add Service"}
            </DialogTitle>
            <DialogDescription className="font-serif text-foreground/60">
              {isEdit
                ? "Update this service's details, image and selling points."
                : "Fill in the new service's name, description, icon and a cover image."}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-5">
            {/* Image upload */}
            <div className="space-y-2">
              <label className="text-xs font-display uppercase tracking-[0.2em] text-foreground/60">
                Cover Image
              </label>
              <div className="relative h-48 bg-muted border border-border overflow-hidden">
                {form.image ? (
                  <img src={form.image} alt="" className="w-full h-full object-cover" />
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
                  {uploading ? "Uploading…" : form.image ? "Replace" : "Upload Image"}
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
                Service Title <span className="text-primary">*</span>
              </label>
              <Input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. Roads & Highways"
                className="rounded-none h-11"
              />
            </div>

            {/* Icon */}
            <div className="space-y-2">
              <label className="text-xs font-display uppercase tracking-[0.2em] text-foreground/60">
                Icon
              </label>
              <Select value={form.icon} onValueChange={(v) => update("icon", v)}>
                <SelectTrigger className="rounded-none h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Short description */}
            <div className="space-y-2">
              <label className="text-xs font-display uppercase tracking-[0.2em] text-foreground/60">
                Short Description (card)
              </label>
              <Textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={3}
                className="rounded-none"
                placeholder="A brief one- or two-sentence summary shown on the service card."
              />
            </div>

            {/* Long description */}
            <div className="space-y-2">
              <label className="text-xs font-display uppercase tracking-[0.2em] text-foreground/60">
                Long Description (modal)
              </label>
              <Textarea
                value={form.longDescription}
                onChange={(e) => update("longDescription", e.target.value)}
                rows={6}
                className="rounded-none"
                placeholder="Detailed description shown when the user opens this service."
              />
            </div>

            {/* Why best bullets */}
            <div className="space-y-2">
              <label className="text-xs font-display uppercase tracking-[0.2em] text-foreground/60">
                Why Choose Sigma — Bullets
              </label>
              <div className="space-y-2">
                {form.whyBest.map((line, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={line}
                      onChange={(e) => updateWhyBest(idx, e.target.value)}
                      placeholder={`Reason #${idx + 1}`}
                      className="rounded-none h-10"
                    />
                    <button
                      type="button"
                      onClick={() => removeWhyBest(idx)}
                      className="px-3 border border-border text-foreground/60 hover:text-red-700 hover:border-red-300"
                      title="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addWhyBest}
                  className="inline-flex items-center gap-2 text-xs font-display uppercase tracking-wider text-primary hover:text-primary/80"
                >
                  <Plus className="h-3.5 w-3.5" /> Add bullet
                </button>
              </div>
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
                {isEdit ? "Save Changes" : "Add Service"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
