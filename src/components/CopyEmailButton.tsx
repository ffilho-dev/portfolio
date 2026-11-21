"use client";

import { useEffect, useRef, useState } from "react";

type CopyStatus = "idle" | "copied" | "failed";

/**
 * Copies the email address to the clipboard and announces the real outcome
 * via a polite live region without disabling the control.
 */
export function CopyEmailButton({ email }: { email: string }) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const [announcement, setAnnouncement] = useState("");
  const timeoutRef = useRef<number | null>(null);
  const lastAnnouncementRef = useRef("");

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    let ok = false;
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable");
      }
      await navigator.clipboard.writeText(email);
      ok = true;
    } catch {
      ok = false;
    }

    const baseMessage = ok
      ? "E-mail copiado"
      : "Não foi possível copiar automaticamente — use o link de e-mail";
    const nextMessage =
      lastAnnouncementRef.current === baseMessage ? `${baseMessage}\u00A0` : baseMessage;
    lastAnnouncementRef.current = nextMessage;

    setStatus(ok ? "copied" : "failed");
    setAnnouncement(nextMessage);

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setStatus("idle");
      setAnnouncement("");
      timeoutRef.current = null;
    }, 3500);
  };

  return (
    <span className="inline-flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleCopy}
        data-copied={status === "copied" ? "" : undefined}
        data-failed={status === "failed" ? "" : undefined}
        className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm font-medium text-[var(--ink)] transition-[color,background-color,border-color] duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)] [@media(pointer:coarse)]:min-h-11"
      >
        {status === "copied" ? (
          <svg
            aria-hidden="true"
            className="size-4 text-[var(--accent)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            className="size-4 text-[var(--muted)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        )}
        <span>Copiar e-mail</span>
      </button>

      <span
        role="status"
        aria-live="polite"
        className={
          status === "copied"
            ? "text-sm font-medium text-[var(--accent)]"
            : "text-sm text-[var(--muted)]"
        }
      >
        {announcement}
      </span>
    </span>
  );
}
