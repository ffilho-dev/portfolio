import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

describe("shadcn/ui PT-BR localization and dialog accessibility", () => {
  afterEach(() => {
    cleanup();
  });

  it("localizes DialogContent and DialogFooter close buttons to PT-BR by default", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes</DialogTitle>
            <DialogDescription>Resumo do item.</DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>,
    );

    const dialog = screen.getByRole("dialog", { name: "Detalhes" });
    const closeButtons = within(dialog).getAllByRole("button", {
      name: "Fechar",
    });
    expect(closeButtons).toHaveLength(2);
    expect(screen.queryByRole("button", { name: /^close$/i })).not.toBeInTheDocument();
  });

  it("localizes SheetContent close button to PT-BR by default", () => {
    render(
      <Sheet open>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Painel lateral</SheetTitle>
            <SheetDescription>Detalhes técnicos.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    );

    const sheet = screen.getByRole("dialog", { name: "Painel lateral" });
    expect(within(sheet).getByRole("button", { name: "Fechar" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^close$/i })).not.toBeInTheDocument();
  });

  it("does not mount headings while CommandDialog is closed and portals PT-BR title/description inside DialogContent when open", () => {
    const { rerender } = render(
      <CommandDialog open={false} onOpenChange={() => {}}>
        <CommandInput placeholder="Buscar…" />
        <CommandList>
          <CommandEmpty>Nenhum resultado.</CommandEmpty>
        </CommandList>
      </CommandDialog>,
    );

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <CommandDialog open onOpenChange={() => {}}>
        <CommandInput placeholder="Buscar…" />
        <CommandList>
          <CommandEmpty>Nenhum resultado.</CommandEmpty>
        </CommandList>
      </CommandDialog>,
    );

    const dialog = screen.getByRole("dialog", { name: "Paleta de comandos" });
    expect(
      within(dialog).getByRole("heading", { name: "Paleta de comandos" }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText("Busque um comando para executar…"),
    ).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Fechar" })).toBeInTheDocument();
  });

  it("allows overriding closeLabel on DialogContent, DialogFooter, and SheetContent", () => {
    const { rerender } = render(
      <Dialog open>
        <DialogContent closeLabel="Fechar janela">
          <DialogHeader>
            <DialogTitle>Modal</DialogTitle>
            <DialogDescription>Conteúdo</DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton closeLabel="Encerrar" />
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole("button", { name: "Fechar janela" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Encerrar" })).toBeInTheDocument();

    rerender(
      <Sheet open>
        <SheetContent closeLabel="Fechar painel">
          <SheetHeader>
            <SheetTitle>Painel</SheetTitle>
            <SheetDescription>Resumo</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    );

    expect(screen.getByRole("button", { name: "Fechar painel" })).toBeInTheDocument();
  });
});
