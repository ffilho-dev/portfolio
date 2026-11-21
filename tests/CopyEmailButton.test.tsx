import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyEmailButton } from "@/components/CopyEmailButton";

describe("CopyEmailButton", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("copies email, triggers toast, and announces confirmation politely", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    const toastSuccessSpy = vi.spyOn(toast, "success");
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    render(<CopyEmailButton email="contato@ffilho.dev" />);
    const button = screen.getByRole("button", { name: /copiar e-mail/i });
    expect(button).toHaveAttribute("data-slot", "button");
    expect(button).toHaveAttribute("data-variant", "outline");
    expect(button).toHaveAttribute("data-size", "sm");
    await user.click(button);
    expect(writeText).toHaveBeenCalledWith("contato@ffilho.dev");
    expect(screen.getByRole("status")).toHaveTextContent(/copiado/i);
    expect(toastSuccessSpy).toHaveBeenCalledWith("E-mail copiado", {
      description: "contato@ffilho.dev",
    });
    expect(button).toBeEnabled();
  });

  it("handles clipboard rejection honestly without unhandled error", async () => {
    const user = userEvent.setup();
    const toastErrorSpy = vi.spyOn(toast, "error");
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) },
      configurable: true,
    });
    render(<CopyEmailButton email="contato@ffilho.dev" />);
    await user.click(screen.getByRole("button", { name: /copiar e-mail/i }));
    expect(screen.getByRole("status")).toHaveTextContent(/não foi possível copiar/i);
    expect(toastErrorSpy).toHaveBeenCalled();
  });

  it("degrades honestly when navigator.clipboard is unavailable", async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
    });
    render(<CopyEmailButton email="contato@ffilho.dev" />);
    await user.click(screen.getByRole("button", { name: /copiar e-mail/i }));
    expect(screen.getByRole("status")).toHaveTextContent(/não foi possível copiar/i);
  });

  it("re-announces with non-breaking space on rapid repeat click and resets 3500ms timer", async () => {
    vi.useFakeTimers();
    try {
      const writeText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText },
        configurable: true,
      });
      render(<CopyEmailButton email="contato@ffilho.dev" />);
      const button = screen.getByRole("button", { name: /copiar e-mail/i });

      await act(async () => {
        fireEvent.click(button);
        await Promise.resolve();
      });
      const status = screen.getByRole("status");
      expect(status.textContent).toBe("E-mail copiado");

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });
      expect(status.textContent).toBe("E-mail copiado");

      await act(async () => {
        fireEvent.click(button);
        await Promise.resolve();
      });
      expect(status.textContent).toBe("E-mail copiado\u00A0");

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });
      expect(status.textContent).toBe("E-mail copiado\u00A0");

      await act(async () => {
        vi.advanceTimersByTime(1500);
      });
      expect(status.textContent).toBe("");
      expect(button).not.toHaveAttribute("data-copied");
    } finally {
      vi.useRealTimers();
    }
  });
});
