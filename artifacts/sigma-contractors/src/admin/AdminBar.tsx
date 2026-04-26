import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, LogOut, Pencil, RotateCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAdmin } from "./AdminContext";

export function AdminBar() {
  const { isAdmin, editMode, toggleEditMode, logout, edits, resetAll } = useAdmin();
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isAdmin) return null;

  const editCount = Object.keys(edits).length;

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-foreground text-background rounded-full shadow-2xl border border-background/10 px-3 py-2">
          <span className="flex items-center gap-2 pl-2 pr-3 border-r border-background/15 mr-1">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-xs uppercase tracking-widest font-semibold hidden sm:inline">
              Admin
            </span>
          </span>

          <Button
            type="button"
            size="sm"
            onClick={toggleEditMode}
            className={`rounded-full h-9 px-4 gap-2 font-semibold ${
              editMode
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-background/10 text-background hover:bg-background/20"
            }`}
          >
            {editMode ? (
              <>
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Preview</span>
              </>
            ) : (
              <>
                <Pencil className="h-4 w-4" />
                <span className="hidden sm:inline">Edit Mode</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={editCount === 0}
            onClick={() => setConfirmReset(true)}
            className="rounded-full h-9 px-3 gap-2 text-background hover:bg-background/10 hover:text-background disabled:opacity-40"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden md:inline">Reset</span>
            {editCount > 0 && (
              <span className="ml-1 text-[10px] bg-primary/90 text-primary-foreground rounded-full px-1.5 py-0.5 font-bold">
                {editCount}
              </span>
            )}
          </Button>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={async () => {
              await logout();
              toast.success("Logged out of admin");
            }}
            className="rounded-full h-9 px-3 gap-2 text-background hover:bg-background/10 hover:text-background"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>

      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display uppercase">Reset all edits?</AlertDialogTitle>
            <AlertDialogDescription className="font-serif">
              This will clear every change you've made and restore the original site content. This action can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-none bg-destructive hover:bg-destructive/90"
              onClick={async () => {
                await resetAll();
                toast.success("All edits reset");
              }}
            >
              Reset everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
