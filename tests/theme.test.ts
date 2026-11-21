import { describe, expect, it } from "vitest";
import {
  THEME_COLOR_DARK,
  THEME_COLOR_LIGHT,
  THEME_INIT_SCRIPT,
  THEME_STORAGE_KEY,
  applySchemeToDocument,
  computeNextStoredScheme,
  getResolvedScheme,
  readStoredScheme,
  writeStoredScheme,
} from "@/lib/theme";

describe("two-state color scheme logic", () => {
  it("resolves to system preference when nothing is stored", () => {
    expect(getResolvedScheme(null, false)).toBe("light");
    expect(getResolvedScheme(null, true)).toBe("dark");
  });

  it("stores literal opposite when toggling from system default and clears when returning to system", () => {
    // OS light -> toggle -> store "dark"
    expect(computeNextStoredScheme(null, false)).toBe("dark");
    // OS light, stored "dark" -> toggle -> target "light" matches OS -> clear (null)
    expect(computeNextStoredScheme("dark", false)).toBeNull();
    // OS dark -> toggle -> store "light"
    expect(computeNextStoredScheme(null, true)).toBe("light");
    // OS switched to dark while stored is "dark" -> toggle -> target "light" differs from OS -> store "light"
    expect(computeNextStoredScheme("dark", true)).toBe("light");
  });

  it("degrades safely when storage throws SecurityError", () => {
    const brokenStorage = {
      getItem: () => {
        throw new DOMException("Blocked", "SecurityError");
      },
      setItem: () => {
        throw new DOMException("Blocked", "SecurityError");
      },
      removeItem: () => {
        throw new DOMException("Blocked", "SecurityError");
      },
    } as unknown as Storage;
    expect(readStoredScheme(brokenStorage)).toBeNull();
    expect(() => writeStoredScheme("dark", brokenStorage)).not.toThrow();
    expect(() => writeStoredScheme(null, brokenStorage)).not.toThrow();
  });

  it("ignores invalid stored values and persists valid overrides", () => {
    localStorage.clear();
    localStorage.setItem(THEME_STORAGE_KEY, "invalid-value");
    expect(readStoredScheme(localStorage)).toBeNull();

    writeStoredScheme("light", localStorage);
    expect(readStoredScheme(localStorage)).toBe("light");

    writeStoredScheme(null, localStorage);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it("updates meta[name=color-scheme] and meta[name=theme-color] content cleanly", () => {
    const meta = document.createElement("meta");
    meta.name = "color-scheme";
    meta.content = "light dark";
    const themeLight = document.createElement("meta");
    themeLight.name = "theme-color";
    themeLight.content = THEME_COLOR_LIGHT;
    themeLight.media = "(prefers-color-scheme: light)";
    const themeDark = document.createElement("meta");
    themeDark.name = "theme-color";
    themeDark.content = THEME_COLOR_DARK;
    themeDark.media = "(prefers-color-scheme: dark)";
    document.head.append(meta, themeLight, themeDark);

    applySchemeToDocument("dark", document);
    expect(meta.content).toBe("dark");
    expect(themeLight.content).toBe(THEME_COLOR_DARK);
    expect(themeDark.content).toBe(THEME_COLOR_DARK);

    applySchemeToDocument("light", document);
    expect(meta.content).toBe("light");
    expect(themeLight.content).toBe(THEME_COLOR_LIGHT);
    expect(themeDark.content).toBe(THEME_COLOR_LIGHT);

    applySchemeToDocument(null, document);
    expect(meta.content).toBe("light dark");
    expect(themeLight.content).toBe(THEME_COLOR_LIGHT);
    expect(themeDark.content).toBe(THEME_COLOR_DARK);

    meta.remove();
    themeLight.remove();
    themeDark.remove();
  });

  it("wraps localStorage access in try/catch inside THEME_INIT_SCRIPT", () => {
    expect(THEME_INIT_SCRIPT).toContain("try");
    expect(THEME_INIT_SCRIPT).toContain('meta[name="color-scheme"]');
    expect(THEME_INIT_SCRIPT).toContain('meta[name="theme-color"]');
  });
});
