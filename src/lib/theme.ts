export type ColorSchemePreference = "light" | "dark";
export type MetaColorScheme = "light dark" | "light" | "dark";

export const THEME_STORAGE_KEY = "color-scheme";
export const THEME_COLOR_LIGHT = "#FFFFFF";
export const THEME_COLOR_DARK = "#09090B";

/**
 * Synchronous inline script executed in <head> immediately after
 * <meta name="color-scheme" content="light dark"> to avoid FOUC.
 */
export const THEME_INIT_SCRIPT = `(function(){var s=null;try{s=localStorage.getItem("${THEME_STORAGE_KEY}");}catch(e){}var v=s==="light"||s==="dark"?s:"light dark";var m=document.querySelector('meta[name="color-scheme"]');if(m){m.content=v;}var isDark=v==="dark"||(v==="light dark"&&typeof window!=="undefined"&&typeof window.matchMedia==="function"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",isDark);if(v!=="light dark"){var c=v==="dark"?"${THEME_COLOR_DARK}":"${THEME_COLOR_LIGHT}";var t=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<t.length;i++){t[i].content=c;}}})();`;

function resolveStorage(explicitStorage?: Storage): Storage | undefined {
  if (explicitStorage) {
    return explicitStorage;
  }
  if (typeof window === "undefined") {
    return undefined;
  }
  return window.localStorage;
}

function detectSystemPrefersDark(targetDoc: Document): boolean {
  const win =
    targetDoc.defaultView ??
    (typeof window !== "undefined" ? window : undefined);
  if (!win || typeof win.matchMedia !== "function") {
    return false;
  }
  return win.matchMedia("(prefers-color-scheme: dark)").matches;
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
 * Updates <meta name="color-scheme">, <meta name="theme-color">, and the
 * root .dark class to reflect an explicit override or system preference.
 */
export function applySchemeToDocument(
  stored: ColorSchemePreference | null,
  doc?: Document,
  systemPrefersDark?: boolean,
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

  const resolved = getResolvedScheme(
    stored,
    systemPrefersDark ?? detectSystemPrefersDark(targetDoc),
  );
  targetDoc.documentElement.classList.toggle("dark", resolved === "dark");
}
