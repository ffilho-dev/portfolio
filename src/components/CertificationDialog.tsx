"use client";

import { ExternalLink } from "lucide-react";
import { usePortfolioOverlays } from "@/components/PortfolioOverlayProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { profile } from "@/data/profile";

/**
 * Modal dialog displaying all 16 completed modules of the featured certification
 * and a direct link for public verification.
 */
export function CertificationDialog() {
  const { certDialogOpen, setCertDialogOpen } = usePortfolioOverlays();
  const { featuredCertification } = profile;

  return (
    <Dialog open={certDialogOpen} onOpenChange={setCertDialogOpen}>
      <DialogContent className="no-print max-h-[85dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{featuredCertification.title}</DialogTitle>
          <DialogDescription>
            <span translate="no">{featuredCertification.issuer}</span> —{" "}
            <span className="tabular-data font-mono">
              {featuredCertification.hours}h
            </span>{" "}
            em{" "}
            <span className="tabular-data font-mono">
              {featuredCertification.modules.length}
            </span>{" "}
            módulos concluídos, emitido em{" "}
            <span className="tabular-data font-mono">
              {featuredCertification.issuedAt}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <ol role="list" className="grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
          {featuredCertification.modules.map((moduleName, index) => (
            <li
              key={moduleName}
              className="flex items-baseline gap-2.5 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-foreground"
            >
              <span className="tabular-data font-mono text-xs font-medium text-signal">
                {index + 1}.
              </span>
              <span className="min-w-0 leading-snug">{moduleName}</span>
            </li>
          ))}
        </ol>

        <DialogFooter showCloseButton className="sm:justify-between">
          <Button asChild>
            <a
              href={featuredCertification.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.75}
              />
              <span>Verificar certificado</span>
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
