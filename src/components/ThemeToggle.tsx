"use client";

import { useEffect, useSyncExternalStore } from "react";
import {
  THEME_STORAGE_KEY,
  applySchemeToDocument,
  computeNextStoredScheme,
  getResolvedScheme,
  readStoredScheme,
  writeStoredScheme,
  type ColorSchemePreference,
} from "@/lib/theme";

const themeListeners = new Set<() => void>();

function notifyThemeListeners(): void {
  for (const listener of themeListeners) {
    listener();
  }
}

function readEffectiveOverride(): ColorSchemePreference | null {
  if (typeof document !== "undefined") {
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="color-scheme"]',
    );
    if (meta?.content === "light" || meta?.content === "dark") {
      return meta.content;
    }
  }
  return readStoredScheme();
}

function readSystemPrefersDark(): boolean {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getThemeSnapshot(): string {
  const stored = readEffectiveOverride();
  const systemPrefersDark = readSystemPrefersDark();
  return `${stored ?? "system"}:${systemPrefersDark ? "1" : "0"}`;
}

function getServerThemeSnapshot(): string {
  return "system:0";
}

function parseSnapshot(snapshot: string): {
  stored: ColorSchemePreference | null;
  systemPrefersDark: boolean;
} {
  const [storedPart, darkPart] = snapshot.split(":");
  const stored: ColorSchemePreference | null =
    storedPart === "light" || storedPart === "dark" ? storedPart : null;
  return {
    stored,
    systemPrefersDark: darkPart === "1",
  };
}

function subscribeToTheme(onStoreChange: () => void): () => void {
  themeListeners.add(onStoreChange);

  const mediaQuery =
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null;

  const handleMediaChange = () => {
    // Never delete the user's stored override when OS changes to match it.
    onStoreChange();
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== THEME_STORAGE_KEY) {
      return;
    }
    let nextStored: ColorSchemePreference | null = null;
    if (event.key !== null) {
      if (event.newValue === "light" || event.newValue === "dark") {
        nextStored = event.newValue;
      } else if (event.newValue === null && event.storageArea === null) {
        nextStored = readStoredScheme();
      } else if (event.storageArea) {
        nextStored = readStoredScheme(event.storageArea);
      }
    }
    applySchemeToDocument(nextStored, document);
    onStoreChange();
  };

  mediaQuery?.addEventListener("change", handleMediaChange);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    themeListeners.delete(onStoreChange);
    mediaQuery?.removeEventListener("change", handleMediaChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

/**
 * Two-state theme toggle syncing <meta name="color-scheme"> and localStorage
 * with OS preferences and cross-tab storage events.
 */
export function ThemeToggle() {
  const snapshot = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const { stored, systemPrefersDark } = parseSnapshot(snapshot);
  const resolvedScheme = getResolvedScheme(stored, systemPrefersDark);

  useEffect(() => {
    const persisted = readStoredScheme();
    if (persisted) {
      applySchemeToDocument(persisted, document);
      notifyThemeListeners();
    }
  }, []);

  const handleToggle = () => {
    const nextStored = computeNextStoredScheme(stored, systemPrefersDark);
    applySchemeToDocument(nextStored, document);
    writeStoredScheme(nextStored);
    notifyThemeListeners();
  };

  const ariaLabel =
    resolvedScheme === "dark"
      ? "Alternar para tema claro"
      : "Alternar para tema escuro";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={ariaLabel}
      className="theme-toggle-btn inline-flex cursor-pointer items-center justify-center rounded-md border border-[var(--border)] bg-transparent text-[var(--muted)] transition-[color,background-color,border-color] duration-150 hover:border-[var(--accent)] hover:bg-[var(--surface)] hover:text-[var(--ink)]"
    >
      <svg
        aria-hidden="true"
        className="theme-icon-to-dark size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
      </svg>
      <svg
        aria-hidden="true"
        className="theme-icon-to-light size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41" />
      </svg>
    </button>
  );
}
