export type ColorSchemePreference = "light" | "dark";
export type MetaColorScheme = "light dark" | "light" | "dark";

export const THEME_STORAGE_KEY = "color-scheme";
export const THEME_COLOR_LIGHT = "#F7F8FA";
export const THEME_COLOR_DARK = "#161B22";

/**
 * Synchronous inline script executed in <head> immediately after
 * <meta name="color-scheme" content="light dark"> to avoid FOUC.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem("${THEME_STORAGE_KEY}");var v=s==="light"||s==="dark"?s:"light dark";var m=document.querySelector('meta[name="color-scheme"]');if(m){m.content=v;}if(v!=="light dark"){var c=v==="dark"?"${THEME_COLOR_DARK}":"${THEME_COLOR_LIGHT}";var t=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<t.length;i++){t[i].content=c;}}}catch(e){}})();`;

function resolveStorage(explicitStorage?: Storage): Storage | undefined {
  if (explicitStorage) {
    return explicitStorage;
  }
  if (typeof window === "undefined") {
    return undefined;
  }
  return window.localStorage;
}

/**
 * Safely reads a stored color-scheme override ("light" or "dark"),
 * returning null if unset, invalid, or blocked by storage restrictions.
 */
export function readStoredScheme(storage?: Storage): ColorSchemePreference | null {
  try {
    const target = resolveStorage(storage);
    if (!target) {
      return null;
    }
    const raw = target.getItem(THEME_STORAGE_KEY);
    return raw === "light" || raw === "dark" ? raw : null;
  } catch {
    return null;
  }
}

/**
 * Safely persists or clears the color-scheme override without throwing
 * when browser privacy settings block localStorage access.
 */
export function writeStoredScheme(
  scheme: ColorSchemePreference | null,
  storage?: Storage,
): void {
  try {
    const target = resolveStorage(storage);
    if (!target) {
      return;
    }
    if (scheme === null) {
      target.removeItem(THEME_STORAGE_KEY);
    } else {
      target.setItem(THEME_STORAGE_KEY, scheme);
    }
  } catch {
    // Visual override still works via <meta name="color-scheme"> even when storage is blocked.
  }
}

/**
 * Resolves the currently active scheme from an optional stored override
 * and the operating system preference.
 */
export function getResolvedScheme(
  stored: ColorSchemePreference | null,
  systemPrefersDark: boolean,
): ColorSchemePreference {
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return systemPrefersDark ? "dark" : "light";
}

/**
 * Computes the next stored value for a two-state theme toggle:
 * targets the opposite of the currently rendered scheme, clearing storage
 * (returning null) only when that target matches the current OS scheme.
 */
export function computeNextStoredScheme(
  stored: ColorSchemePreference | null,
  systemPrefersDark: boolean,
): ColorSchemePreference | null {
  const currentRendered = getResolvedScheme(stored, systemPrefersDark);
  const target: ColorSchemePreference =
    currentRendered === "dark" ? "light" : "dark";
  const systemScheme: ColorSchemePreference = systemPrefersDark
    ? "dark"
    : "light";
  return target === systemScheme ? null : target;
}

/**
 * Updates <meta name="color-scheme"> and <meta name="theme-color"> content on the
 * document to reflect either an explicit override or "light dark" (follow system preference).
 */
export function applySchemeToDocument(
  stored: ColorSchemePreference | null,
  doc?: Document,
): void {
  const targetDoc =
    doc ?? (typeof document !== "undefined" ? document : undefined);
  if (!targetDoc) {
    return;
  }
  const meta = targetDoc.querySelector<HTMLMetaElement>(
    'meta[name="color-scheme"]',
  );
  if (meta) {
    const content: MetaColorScheme = stored ?? "light dark";
    meta.content = content;
  }

  const themeMetas = targetDoc.querySelectorAll<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );
  for (const themeMeta of themeMetas) {
    if (stored === "dark") {
      themeMeta.content = THEME_COLOR_DARK;
    } else if (stored === "light") {
      themeMeta.content = THEME_COLOR_LIGHT;
    } else {
      themeMeta.content = themeMeta.media.includes("dark")
        ? THEME_COLOR_DARK
        : THEME_COLOR_LIGHT;
    }
  }
}
