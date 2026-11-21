import { act, cleanup, render, screen, within } from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
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
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

describe("shadcn/ui PT-BR localization and dialog accessibility", () => {
  beforeEach(() => {
    document.head.innerHTML = '<meta name="color-scheme" content="light dark">';
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    toast.dismiss();
    cleanup();
    vi.restoreAllMocks();
  });

  it("localizes DialogContent and DialogFooter close buttons to PT-BR by default with accessible hit targets", () => {
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
    const iconCloseButton = dialog.querySelector('[data-slot="dialog-close"]');
    expect(iconCloseButton).toHaveClass("size-8", "[@media(pointer:coarse)]:size-11");
    expect(document.querySelector('[data-slot="dialog-overlay"]')).toHaveClass("no-print");
    expect(screen.queryByRole("button", { name: /^close$/i })).not.toBeInTheDocument();
  });

  it("localizes SheetContent close button to PT-BR with accessible hit target and printable-safe overlay", () => {
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
    const closeButton = within(sheet).getByRole("button", { name: "Fechar" });
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveClass("size-8", "[@media(pointer:coarse)]:size-11");
    expect(document.querySelector('[data-slot="sheet-overlay"]')).toHaveClass("no-print");
    expect(screen.queryByRole("button", { name: /^close$/i })).not.toBeInTheDocument();
  });

  it("does not mount headings while CommandDialog is closed and exposes PT-BR labels when open", () => {
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
          <CommandItem>Item exemplo</CommandItem>
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
    expect(
      within(dialog).getByRole("combobox", { name: "Paleta de comandos" }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole("listbox", { name: "Sugestões" }),
    ).toBeInTheDocument();
    expect(within(dialog).queryByRole("listbox", { name: "Suggestions" })).not.toBeInTheDocument();
    expect(
      dialog.querySelector('[data-slot="command"]'),
    ).toHaveClass("**:data-[slot=command-input-wrapper]:pe-12");
    expect(within(dialog).getByRole("button", { name: "Fechar" })).toBeInTheDocument();
  });

  it("localizes Toaster container and close button ARIA labels to PT-BR", async () => {
    render(<Toaster closeButton toastOptions={{ duration: 5000 }} />);

    const region = screen.getByRole("region", { name: /Notificações/i });
    expect(region).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: /Notifications/i })).not.toBeInTheDocument();

    act(() => {
      toast.success("Operação concluída");
    });

    expect(
      await screen.findByRole("button", { name: "Fechar notificação" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Close toast" })).not.toBeInTheDocument();
  });

  it("allows horizontal line TabsList to size to content without locking height to h-9", () => {
    render(
      <Tabs defaultValue="a">
        <TabsList variant="line" aria-label="Abas de exemplo">
          <TabsTrigger value="a">Aba A</TabsTrigger>
          <TabsTrigger value="b">Aba B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Conteúdo A</TabsContent>
        <TabsContent value="b">Conteúdo B</TabsContent>
      </Tabs>,
    );

    const tablist = screen.getByRole("tablist", { name: "Abas de exemplo" });
    expect(tablist).toHaveClass("group-data-[orientation=horizontal]/tabs:h-auto");
    expect(tablist.className).not.toContain("group-data-[orientation=horizontal]/tabs:h-9");
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
