"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Triggers the browser's native print dialog for A4 print output of /curriculo.
 */
export function PrintButton() {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => window.print()}
      className="cursor-pointer [@media(pointer:coarse)]:min-h-11"
    >
      <Printer
        aria-hidden="true"
        className="size-4 text-muted-foreground"
        strokeWidth={1.75}
      />
      <span>Imprimir</span>
    </Button>
  );
}
