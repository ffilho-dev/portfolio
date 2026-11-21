"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type CaseOpenHandler = (slug: string) => void;
export type CaseDismissHandler = () => void;
type ActiveOverlay = "none" | "command" | "cert";

export interface PortfolioOverlayContextValue {
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  openCommand: () => void;
  certDialogOpen: boolean;
  setCertDialogOpen: (open: boolean) => void;
  openCertDialog: () => void;
  openCase: (slug: string) => void;
  registerCaseHandler: (
    handler: CaseOpenHandler | null,
    onDismiss?: CaseDismissHandler | null,
  ) => void;
}

const PortfolioOverlayContext =
  createContext<PortfolioOverlayContextValue | null>(null);

/**
 * Provides mutually exclusive global overlay state for the command palette,
 * certification dialog, and Home CaseSheet delegation across all routes.
 */
export function PortfolioOverlayProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>("none");
  const caseHandlerRef = useRef<CaseOpenHandler | null>(null);
  const caseDismissRef = useRef<CaseDismissHandler | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        !event.isComposing &&
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        !event.shiftKey &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        caseDismissRef.current?.();
        setActiveOverlay((prev) => (prev === "command" ? "none" : "command"));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const setCommandOpen = useCallback((open: boolean) => {
    if (open) {
      caseDismissRef.current?.();
    }
    setActiveOverlay((prev) =>
      open ? "command" : prev === "command" ? "none" : prev,
    );
  }, []);

  const setCertDialogOpen = useCallback((open: boolean) => {
    if (open) {
      caseDismissRef.current?.();
    }
    setActiveOverlay((prev) =>
      open ? "cert" : prev === "cert" ? "none" : prev,
    );
  }, []);

  const openCommand = useCallback(() => {
    caseDismissRef.current?.();
    setActiveOverlay("command");
  }, []);

  const openCertDialog = useCallback(() => {
    caseDismissRef.current?.();
    setActiveOverlay("cert");
  }, []);

  const registerCaseHandler = useCallback(
    (
      handler: CaseOpenHandler | null,
      onDismiss?: CaseDismissHandler | null,
    ) => {
      caseHandlerRef.current = handler;
      caseDismissRef.current = onDismiss ?? null;
    },
    [],
  );

  const openCase = useCallback(
    (slug: string) => {
      setActiveOverlay("none");
      const handler = caseHandlerRef.current;
      if (handler) {
        handler(slug);
        return;
      }
      router.push(`/cases/${slug}`);
    },
    [router],
  );

  const commandOpen = activeOverlay === "command";
  const certDialogOpen = activeOverlay === "cert";

  const value = useMemo<PortfolioOverlayContextValue>(
    () => ({
      commandOpen,
      setCommandOpen,
      openCommand,
      certDialogOpen,
      setCertDialogOpen,
      openCertDialog,
      openCase,
      registerCaseHandler,
    }),
    [
      commandOpen,
      setCommandOpen,
      openCommand,
      certDialogOpen,
      setCertDialogOpen,
      openCertDialog,
      openCase,
      registerCaseHandler,
    ],
  );

  return (
    <PortfolioOverlayContext.Provider value={value}>
      {children}
    </PortfolioOverlayContext.Provider>
  );
}

/**
 * Accesses global overlay controls managed by PortfolioOverlayProvider.
 */
export function usePortfolioOverlays(): PortfolioOverlayContextValue {
  const context = useContext(PortfolioOverlayContext);
  if (!context) {
    throw new Error(
      "usePortfolioOverlays deve ser usado dentro de PortfolioOverlayProvider.",
    );
  }
  return context;
}
