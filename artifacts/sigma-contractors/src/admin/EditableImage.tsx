import { useRef, useState } from "react";
import { useAdmin } from "./AdminContext";
import { Upload, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EditableImageProps {
  keyName: string;
  defaultSrc: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}

async function resizeImageToDataUrl(file: File, maxWidth: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not load image"));
      img.onload = () => {
        const ratio = img.width > maxWidth ? maxWidth / img.width : 1;
        const w = Math.max(1, Math.round(img.width * ratio));
        const h = Math.max(1, Math.round(img.height * ratio));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        try {
          resolve(canvas.toDataURL("image/jpeg", quality));
        } catch (err) {
          reject(err instanceof Error ? err : new Error("Encode failed"));
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function EditableImage({
  keyName,
  defaultSrc,
  alt,
  className,
  imgClassName,
}: EditableImageProps) {
  const { editMode, getValue, setValue, resetOne } = useAdmin();
  const src = getValue(keyName, defaultSrc);
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await resizeImageToDataUrl(file, 1800, 0.85);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, dataUrl }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Upload failed (${res.status})`);
      }
      const json: { url: string } = await res.json();
      setValue(keyName, json.url);
      toast.success("Image updated");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={`relative group/img ${className || ""}`}>
      {src ? (
        <img src={src} alt={alt} className={imgClassName || "w-full h-full object-cover"} />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center text-foreground/40 font-display uppercase text-xs tracking-widest">
          No image
        </div>
      )}

      {editMode && (
        <>
          {/* Always-visible floating button so it stays clickable even when
              parent overlays / siblings sit on top of the image. */}
          <div className="absolute top-3 left-3 z-30 flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                inputRef.current?.click();
              }}
              disabled={uploading}
              className="bg-primary text-white px-3 py-2 text-[11px] font-display uppercase tracking-wider inline-flex items-center gap-1.5 hover:bg-primary/90 disabled:opacity-60 shadow-lg ring-1 ring-white/20"
            >
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="h-3.5 w-3.5" />
              )}
              {uploading ? "Uploading…" : "Upload Image"}
            </button>
            {src !== defaultSrc && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  void resetOne(keyName);
                }}
                className="bg-foreground text-background px-2.5 py-2 text-[11px] font-display uppercase tracking-wider inline-flex items-center gap-1.5 hover:bg-foreground/85 shadow-lg"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            )}
          </div>
          {/* Subtle hover dim to signal editability */}
          <div className="absolute inset-0 ring-2 ring-primary/60 ring-inset pointer-events-none z-20" />
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
          if (inputRef.current) inputRef.current.value = "";
        }}
        className="hidden"
      />
    </div>
  );
}
