"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type CopyStatus = "idle" | "copied" | "failed";

/**
 * Safely writes text to the system clipboard, returning false when unavailable or denied.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) {
      return false;
    }
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Copies an email address to the clipboard and triggers the corresponding Sonner toast.
 */
export async function copyEmailWithToast(email: string): Promise<boolean> {
  const ok = await copyTextToClipboard(email);
  if (ok) {
    toast.success("E-mail copiado", { description: email });
  } else {
    toast.error("Não foi possível copiar automaticamente", {
      description: `Use o link direto para ${email}.`,
    });
  }
  return ok;
}

/**
 * Copies the email address to the clipboard, triggers a Sonner toast, and announces
 * the real outcome via a polite live region without disabling the control.
 */
export function CopyEmailButton({ email }: { email: string }) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const [announcement, setAnnouncement] = useState("");
  const timeoutRef = useRef<number | null>(null);
  const lastAnnouncementRef = useRef("");
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const handleCopy = async () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const ok = await copyEmailWithToast(email);
    if (!mountedRef.current) {
      return;
    }

    const baseMessage = ok
      ? "E-mail copiado"
      : `Não foi possível copiar automaticamente. Use o link direto para ${email}.`;
    const nextMessage =
      lastAnnouncementRef.current === baseMessage
        ? `${baseMessage}\u00A0`
        : baseMessage;
    lastAnnouncementRef.current = nextMessage;

    setStatus(ok ? "copied" : "failed");
    setAnnouncement(nextMessage);

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      if (!mountedRef.current) {
        return;
      }
      setStatus("idle");
      setAnnouncement("");
      timeoutRef.current = null;
    }, 3500);
  };

  return (
    <span className="inline-flex flex-wrap items-center gap-3">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleCopy}
        data-copied={status === "copied" ? "" : undefined}
        data-failed={status === "failed" ? "" : undefined}
        className="cursor-pointer [@media(pointer:coarse)]:min-h-11"
      >
        {status === "copied" ? (
          <Check
            aria-hidden="true"
            className="size-4 text-signal"
            strokeWidth={2}
          />
        ) : (
          <Copy
            aria-hidden="true"
            className="size-4 text-muted-foreground"
            strokeWidth={1.75}
          />
        )}
        <span>Copiar e-mail</span>
      </Button>

      <span
        role="status"
        aria-live="polite"
        className={
          status === "copied"
            ? "text-sm font-medium text-signal"
            : "text-sm text-muted-foreground"
        }
      >
        {announcement}
      </span>
    </span>
  );
}
