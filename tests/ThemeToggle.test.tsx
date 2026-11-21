import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "@/components/ThemeToggle";

describe("ThemeToggle", () => {
  let mediaListeners: Array<(event: MediaQueryListEvent) => void>;
  let systemPrefersDark: boolean;

  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    document.head.innerHTML = '<meta name="color-scheme" content="light dark">';
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

  it("toggles meta color-scheme and persists override", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /alternar para tema escuro/i });
    await user.click(button);
    const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
    expect(meta?.content).toBe("dark");
    expect(localStorage.getItem("color-scheme")).toBe("dark");
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

  it("updates aria-label when OS preference flips while stored preference is null", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: /alternar para tema escuro/i })).toBeInTheDocument();

    act(() => {
      systemPrefersDark = true;
      for (const listener of mediaListeners) {
        listener({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(localStorage.getItem("color-scheme")).toBeNull();
    expect(screen.getByRole("button", { name: /alternar para tema claro/i })).toBeInTheDocument();
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
    expect(screen.getByRole("button", { name: /alternar para tema claro/i })).toBeInTheDocument();
  });
});
