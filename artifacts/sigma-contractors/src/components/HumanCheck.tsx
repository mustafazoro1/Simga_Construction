import { useState } from "react";
import { Check, Loader2, ShieldCheck } from "lucide-react";

interface HumanCheckProps {
  verified: boolean;
  onChange: (verified: boolean) => void;
}

export function HumanCheck({ verified, onChange }: HumanCheckProps) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    if (verified || busy) return;
    setBusy(true);
    // Simulated verification with a small randomized delay (like reCAPTCHA does).
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 500));
    setBusy(false);
    onChange(true);
  }

  return (
    <div className="border border-border bg-background px-5 py-4 flex items-center justify-between gap-4 select-none">
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={verified}
        className="flex items-center gap-3 text-left"
      >
        <span
          className={`w-7 h-7 border-2 flex items-center justify-center transition-colors ${
            verified
              ? "border-emerald-600 bg-emerald-600 text-white"
              : "border-foreground/35 bg-background"
          }`}
        >
          {busy ? (
            <Loader2 className="w-4 h-4 animate-spin text-foreground/60" />
          ) : verified ? (
            <Check className="w-4 h-4" strokeWidth={3} />
          ) : null}
        </span>
        <span className="font-serif text-foreground/80">
          {verified ? "Verified — you're human" : "I'm not a robot"}
        </span>
      </button>
      <div className="flex items-center gap-2 text-foreground/40">
        <ShieldCheck className="w-5 h-5" />
        <span className="text-[10px] uppercase tracking-[0.2em] font-display">
          Sigma Verify
        </span>
      </div>
    </div>
  );
}
