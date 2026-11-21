import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ThemeToggle,
  toggleDocumentTheme,
  useResolvedTheme,
} from "@/components/ThemeToggle";

describe("ThemeToggle", () => {
  let mediaListeners: Array<(event: MediaQueryListEvent) => void>;
  let systemPrefersDark: boolean;

  afterEach(() => {
    cleanup();
    document.documentElement.classList.remove("dark");
  });

  beforeEach(() => {
    document.head.innerHTML = '<meta name="color-scheme" content="light dark">';
    document.documentElement.classList.remove("dark");
    localStorage.clear();
    mediaListeners = [];
    systemPrefersDark = false;
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        get matches() {
          return query === "(prefers-color-scheme: dark)"
            ? systemPrefersDark
            : false;
        },
        media: query,
        addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
          mediaListeners.push(listener);
        },
        removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
          mediaListeners = mediaListeners.filter((item) => item !== listener);
        },
      })),
    });
  });

  it("toggles meta color-scheme, .dark class, and persists override", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /alternar para tema escuro/i });
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    await user.click(button);
    const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
    expect(meta?.content).toBe("dark");
    expect(localStorage.getItem("color-scheme")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("still applies visual override to meta when localStorage.setItem throws", async () => {
    const user = userEvent.setup();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Blocked", "SecurityError");
    });
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    await user.click(button);
    const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
    expect(meta?.content).toBe("dark");
    vi.restoreAllMocks();
  });

  it("clears stored override when toggling back to match system preference", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /alternar para tema escuro/i });
    await user.click(button);
    expect(localStorage.getItem("color-scheme")).toBe("dark");

    const revertButton = screen.getByRole("button", { name: /alternar para tema claro/i });
    await user.click(revertButton);
    const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
    expect(meta?.content).toBe("light dark");
    expect(localStorage.getItem("color-scheme")).toBeNull();
  });

  it("does not clear stored preference when OS preference changes to match", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole("button", { name: /alternar para tema escuro/i }));
    expect(localStorage.getItem("color-scheme")).toBe("dark");

    act(() => {
      systemPrefersDark = true;
      for (const listener of mediaListeners) {
        listener({ matches: true } as MediaQueryListEvent);
      }
    });

    const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
    expect(localStorage.getItem("color-scheme")).toBe("dark");
    expect(meta?.content).toBe("dark");
  });

  it("updates aria-label and .dark class when OS preference flips while stored preference is null", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: /alternar para tema escuro/i })).toBeInTheDocument();
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    act(() => {
      systemPrefersDark = true;
      for (const listener of mediaListeners) {
        listener({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(localStorage.getItem("color-scheme")).toBeNull();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(screen.getByRole("button", { name: /alternar para tema claro/i })).toBeInTheDocument();

    act(() => {
      systemPrefersDark = false;
      for (const listener of mediaListeners) {
        listener({ matches: false } as MediaQueryListEvent);
      }
    });

    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(screen.getByRole("button", { name: /alternar para tema escuro/i })).toBeInTheDocument();
  });

  it("syncs theme override across tabs via window storage event", () => {
    render(<ThemeToggle />);
    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "color-scheme",
          newValue: "dark",
        }),
      );
    });

    const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
    expect(meta?.content).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(screen.getByRole("button", { name: /alternar para tema claro/i })).toBeInTheDocument();
  });

  it("exposes useResolvedTheme and toggleDocumentTheme synchronized with the store", () => {
    function ThemeProbe() {
      const resolved = useResolvedTheme();
      return <span data-testid="resolved-theme">{resolved}</span>;
    }

    render(<ThemeProbe />);
    expect(screen.getByTestId("resolved-theme")).toHaveTextContent("light");

    let nextScheme: string | undefined;
    act(() => {
      nextScheme = toggleDocumentTheme();
    });

    expect(nextScheme).toBe("dark");
    expect(screen.getByTestId("resolved-theme")).toHaveTextContent("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(
      document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')?.content,
    ).toBe("dark");
  });
});
