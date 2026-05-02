import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const STORAGE_EDITS_CACHE = "sigma_admin_edits_cache";

type EditsMap = Record<string, string>;

interface AdminContextValue {
  isAdmin: boolean;
  editMode: boolean;
  edits: EditsMap;
  contentLoaded: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setEditMode: (next: boolean) => void;
  toggleEditMode: () => void;
  getValue: (key: string, defaultValue: string) => string;
  setValue: (key: string, value: string) => void;
  resetAll: () => Promise<void>;
  resetOne: (key: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextValue | null>(null);

function readCachedEdits(): EditsMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_EDITS_CACHE);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writeCachedEdits(edits: EditsMap) {
  try {
    window.localStorage.setItem(STORAGE_EDITS_CACHE, JSON.stringify(edits));
  } catch {
    // ignore
  }
}

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [editMode, setEditModeState] = useState<boolean>(false);
  const [edits, setEdits] = useState<EditsMap>(() => readCachedEdits());
  const [contentLoaded, setContentLoaded] = useState<boolean>(false);

  // Load published content + admin session on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchJson<EditsMap>("/api/content");
        if (!cancelled) {
          setEdits(data);
          writeCachedEdits(data);
        }
      } catch {
        // keep cached edits as fallback
      } finally {
        if (!cancelled) setContentLoaded(true);
      }

      try {
        const me = await fetchJson<{ isAdmin: boolean }>("/api/admin/me");
        if (!cancelled) setIsAdmin(Boolean(me.isAdmin));
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (password: string) => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) return false;
      setIsAdmin(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    } catch {
      // ignore
    }
    setIsAdmin(false);
    setEditModeState(false);
  }, []);

  const setEditMode = useCallback((next: boolean) => {
    setEditModeState(next);
  }, []);

  const toggleEditMode = useCallback(() => {
    setEditModeState((prev) => !prev);
  }, []);

  const getValue = useCallback(
    (key: string, defaultValue: string) => {
      const v = edits[key];
      return typeof v === "string" ? v : defaultValue;
    },
    [edits],
  );

  const setValue = useCallback((key: string, value: string) => {
    setEdits((prev) => {
      if (prev[key] === value) return prev;
      const next = { ...prev, [key]: value };
      writeCachedEdits(next);
      return next;
    });
    // Persist to backend (fire-and-forget; errors logged).
    fetch(`/api/content/${encodeURIComponent(key)}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    }).catch((err) => {
      console.error("Failed to save admin edit", key, err);
    });
  }, []);

  const resetAll = useCallback(async () => {
    try {
      await fetch("/api/content", { method: "DELETE", credentials: "include" });
    } catch {
      // ignore
    }
    setEdits({});
    writeCachedEdits({});
  }, []);

  const resetOne = useCallback(async (key: string) => {
    try {
      await fetch(`/api/content/${encodeURIComponent(key)}`, {
        method: "DELETE",
        credentials: "include",
      });
    } catch {
      // ignore
    }
    setEdits((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      writeCachedEdits(next);
      return next;
    });
  }, []);

  const value = useMemo<AdminContextValue>(
    () => ({
      isAdmin,
      editMode: isAdmin && editMode,
      edits,
      contentLoaded,
      login,
      logout,
      setEditMode,
      toggleEditMode,
      getValue,
      setValue,
      resetAll,
      resetOne,
    }),
    [isAdmin, editMode, edits, contentLoaded, login, logout, setEditMode, toggleEditMode, getValue, setValue, resetAll, resetOne],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin must be used inside <AdminProvider>");
  }
  return ctx;
}
