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

export interface PortfolioOverlayContextValue {
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  openCommand: () => void;
  certDialogOpen: boolean;
  setCertDialogOpen: (open: boolean) => void;
  openCertDialog: () => void;
  openCase: (slug: string) => void;
  registerCaseHandler: (handler: CaseOpenHandler | null) => void;
}

const PortfolioOverlayContext =
  createContext<PortfolioOverlayContextValue | null>(null);

/**
 * Provides global overlay state for the command palette, certification dialog,
 * and Home CaseSheet delegation with router fallback across all routes.
 */
export function PortfolioOverlayProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [commandOpen, setCommandOpen] = useState(false);
  const [certDialogOpen, setCertDialogOpen] = useState(false);
  const caseHandlerRef = useRef<CaseOpenHandler | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        !event.isComposing &&
        (event.metaKey || event.ctrlKey) &&
        !event.altKey &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openCommand = useCallback(() => {
    setCommandOpen(true);
  }, []);

  const openCertDialog = useCallback(() => {
    setCertDialogOpen(true);
  }, []);

  const registerCaseHandler = useCallback((handler: CaseOpenHandler | null) => {
    caseHandlerRef.current = handler;
  }, []);

  const openCase = useCallback(
    (slug: string) => {
      const handler = caseHandlerRef.current;
      if (handler) {
        handler(slug);
        return;
      }
      router.push(`/cases/${slug}`);
    },
    [router],
  );

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
      openCommand,
      certDialogOpen,
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
