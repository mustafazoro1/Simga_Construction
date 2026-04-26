import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAdmin } from "./AdminContext";

interface AdminLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminLoginDialog({ open, onOpenChange }: AdminLoginDialogProps) {
  const { login, setEditMode } = useAdmin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setPassword("");
      setError(null);
    }
  }, [open]);

  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const ok = await login(password);
      if (ok) {
        setEditMode(true);
        onOpenChange(false);
        toast.success("Admin access granted", {
          description: "Edit mode is on — click any text to change it.",
          icon: <ShieldCheck className="h-5 w-5" />,
        });
      } else {
        setError("Incorrect password.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-none border-foreground/10">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <span className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Lock className="h-5 w-5" />
            </span>
            <div>
              <DialogTitle className="font-display text-xl uppercase tracking-wide">Admin Login</DialogTitle>
              <DialogDescription className="font-serif text-sm text-foreground/70">
                Enter the admin password to enable inline editing.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password" className="font-serif text-foreground/80">Password</Label>
            <Input
              id="admin-password"
              type="password"
              autoFocus
              autoComplete="off"
              placeholder="••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              className="bg-background border-border rounded-none h-12 focus-visible:ring-primary"
            />
            {error && (
              <p className="text-sm text-destructive font-serif">{error}</p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-none"
            >
              Close
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-none bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {submitting ? "Verifying…" : "Unlock Editing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
