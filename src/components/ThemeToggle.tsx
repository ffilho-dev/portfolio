"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
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

  const handleMediaChange = (event: MediaQueryListEvent) => {
    // Never delete the user's stored override when OS changes to match it.
    if (typeof document !== "undefined") {
      const nextSystemDark =
        typeof event?.matches === "boolean"
          ? event.matches
          : readSystemPrefersDark();
      applySchemeToDocument(readEffectiveOverride(), document, nextSystemDark);
    }
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
    applySchemeToDocument(nextStored, document, readSystemPrefersDark());
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
 * Subscribes to the current resolved color scheme ("light" or "dark").
 */
export function useResolvedTheme(): ColorSchemePreference {
  const snapshot = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const { stored, systemPrefersDark } = parseSnapshot(snapshot);
  return getResolvedScheme(stored, systemPrefersDark);
}

/**
 * Toggles the active document theme and returns the resulting resolved scheme.
 */
export function toggleDocumentTheme(): ColorSchemePreference {
  const stored = readEffectiveOverride();
  const systemPrefersDark = readSystemPrefersDark();
  const nextStored = computeNextStoredScheme(stored, systemPrefersDark);
  if (typeof document !== "undefined") {
    applySchemeToDocument(nextStored, document, systemPrefersDark);
  }
  writeStoredScheme(nextStored);
  notifyThemeListeners();
  return getResolvedScheme(nextStored, systemPrefersDark);
}

/**
 * Two-state theme toggle syncing <meta name="color-scheme">, .dark, and localStorage
 * with OS preferences and cross-tab storage events.
 */
export function ThemeToggle() {
  const resolvedScheme = useResolvedTheme();

  useEffect(() => {
    const persisted = readStoredScheme();
    applySchemeToDocument(persisted, document, readSystemPrefersDark());
    if (persisted) {
      notifyThemeListeners();
    }
  }, []);

  const ariaLabel =
    resolvedScheme === "dark"
      ? "Alternar para tema claro"
      : "Alternar para tema escuro";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleDocumentTheme}
      aria-label={ariaLabel}
      className="theme-toggle-btn cursor-pointer text-muted-foreground hover:text-foreground"
    >
      <Moon
        aria-hidden="true"
        className="theme-icon-to-dark size-4"
        strokeWidth={1.75}
      />
      <Sun
        aria-hidden="true"
        className="theme-icon-to-light size-4"
        strokeWidth={1.75}
      />
    </Button>
  );
}
