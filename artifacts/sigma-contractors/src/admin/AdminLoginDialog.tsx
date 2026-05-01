import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, ShieldCheck, Timer } from "lucide-react";
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
  const [submitting, setSubmitting] = useState(false);

  // --- LOCKOUT STATE ---
  const [attempts, setAttempts] = useState(() => Number(localStorage.getItem("admin_attempts") || 0));
  const [lockoutUntil, setLockoutUntil] = useState(() => Number(localStorage.getItem("admin_lockout_until") || 0));
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Helper to calculate wait time based on your specific rules
  const getWaitTime = (failCount: number) => {
    if (failCount < 3) return 0;
    switch (failCount) {
      case 3: return 5;          // 3rd wrong: 5 sec
      case 4: return 15;         // 4th wrong: 15 sec
      case 5: return 60;         // 5th wrong: 1 min
      case 6: return 300;        // 6th wrong: 5 min
      case 7: return 600;        // 7th wrong: 10 min
      case 8: return 900;        // 8th wrong: 15 min
      case 9: return 1200;       // 9th wrong: 20 min
      default: return 3600;      // 10+ wrong: 1 hour
    }
  };

  // Timer Effect: Updates the countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (lockoutUntil > now) {
        setSecondsLeft(Math.ceil((lockoutUntil - now) / 1000));
      } else {
        setSecondsLeft(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem("admin_attempts", attempts.toString());
    localStorage.setItem("admin_lockout_until", lockoutUntil.toString());
  }, [attempts, lockoutUntil]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || secondsLeft > 0) return;

    setSubmitting(true);
    try {
      const ok = await login(password);
      if (ok) {
        // Success: Reset everything
        setAttempts(0);
        setLockoutUntil(0);
        setEditMode(true);
        onOpenChange(false);
        toast.success("Admin access granted");
      } else {
        // Failure: Increment attempts and calculate new lockout
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        const waitSeconds = getWaitTime(newAttempts);
        if (waitSeconds > 0) {
          const until = Date.now() + waitSeconds * 1000;
          setLockoutUntil(until);
          setError(`Too many attempts. Try again in ${waitSeconds}s.`);
        } else {
          setError("Incorrect password.");
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  const isLocked = secondsLeft > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-none border-foreground/10">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <span className={`h-10 w-10 rounded-full flex items-center justify-center ${isLocked ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
              {isLocked ? <Timer className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
            </span>
            <div>
              <DialogTitle className="font-display text-xl uppercase tracking-wide">
                {isLocked ? "System Locked" : "Admin Login"}
              </DialogTitle>
              <DialogDescription className="font-serif text-sm text-foreground/70">
                {isLocked 
                  ? `Security lockout active. Please wait.` 
                  : "Enter the admin password to enable inline editing."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              disabled={isLocked}
              placeholder={isLocked ? `Locked for ${secondsLeft}s` : "••••••"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              className="bg-background border-border rounded-none h-12"
            />
            {error && (
              <p className="text-sm text-destructive font-serif animate-pulse">{error}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-none">
              Close
            </Button>
            <Button
              type="submit"
              disabled={submitting || isLocked}
              className="rounded-none bg-primary text-primary-foreground"
            >
              {isLocked ? `Locked (${secondsLeft}s)` : submitting ? "Verifying…" : "Unlock Editing"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}