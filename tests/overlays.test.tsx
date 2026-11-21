import { useEffect } from "react";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CertificationDialog } from "@/components/CertificationDialog";
import { CommandMenu } from "@/components/CommandMenu";
import {
  PortfolioOverlayProvider,
  usePortfolioOverlays,
} from "@/components/PortfolioOverlayProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { caseStudies } from "@/data/cases";
import { profile } from "@/data/profile";
import { publicProjects } from "@/data/projects";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

function CaseHandlerRegistrar({
  onOpenCase,
}: {
  onOpenCase: (slug: string) => void;
}) {
  const { registerCaseHandler } = usePortfolioOverlays();

  useEffect(() => {
    registerCaseHandler(onOpenCase);
    return () => registerCaseHandler(null);
  }, [onOpenCase, registerCaseHandler]);

  return null;
}

function OverlayControlProbe({
  onControls,
}: {
  onControls: (value: ReturnType<typeof usePortfolioOverlays>) => void;
}) {
  const overlays = usePortfolioOverlays();

  useEffect(() => {
    onControls(overlays);
  }, [onControls, overlays]);

  return (
    <span data-testid="overlay-state">{`${overlays.commandOpen}:${overlays.certDialogOpen}`}</span>
  );
}

function renderShell(
  caseHandler?: (slug: string) => void,
  onControls?: (value: ReturnType<typeof usePortfolioOverlays>) => void,
) {
  return render(
    <PortfolioOverlayProvider>
      <SiteHeader />
      <main id="conteudo">
        {caseHandler ? <CaseHandlerRegistrar onOpenCase={caseHandler} /> : null}
        {onControls ? <OverlayControlProbe onControls={onControls} /> : null}
      </main>
      <SiteFooter />
      <CommandMenu />
      <CertificationDialog />
    </PortfolioOverlayProvider>,
  );
}

describe("Global overlays and shell", () => {
  beforeEach(() => {
    pushMock.mockReset();
    document.head.innerHTML = '<meta name="color-scheme" content="light dark">';
    document.documentElement.classList.remove("dark");
    localStorage.clear();
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
    cleanup();
    vi.restoreAllMocks();
    document.documentElement.classList.remove("dark");
  });

  it("opens CommandMenu from the header search button and via Ctrl+K shortcut", async () => {
    const user = userEvent.setup();
    renderShell();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /buscar/i }));
    const dialogFromClick = screen.getByRole("dialog", { name: /paleta de comandos/i });
    expect(dialogFromClick).toBeInTheDocument();
    expect(within(dialogFromClick).getByText("Cases em produção")).toBeInTheDocument();
    expect(within(dialogFromClick).getByText("Projetos públicos")).toBeInTheDocument();
    expect(within(dialogFromClick).getByText("Navegação")).toBeInTheDocument();
    expect(within(dialogFromClick).getByText("Ações rápidas")).toBeInTheDocument();

    for (const study of caseStudies) {
      expect(within(dialogFromClick).getByText(study.shortTitle)).toBeInTheDocument();
    }
    for (const project of publicProjects) {
      expect(within(dialogFromClick).getByText(project.name)).toBeInTheDocument();
    }

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    expect(screen.getByRole("dialog", { name: /paleta de comandos/i })).toBeInTheDocument();
  });

  it("closes CommandMenu and opens CertificationDialog with all 16 numbered modules and verify link", async () => {
    const user = userEvent.setup();
    renderShell();

    await user.click(screen.getByRole("button", { name: /buscar/i }));
    await user.click(
      screen.getByRole("option", {
        name: /ver os 16 módulos da certificação curso\.dev/i,
      }),
    );

    expect(
      screen.queryByRole("dialog", { name: /paleta de comandos/i }),
    ).not.toBeInTheDocument();

    const certDialog = screen.getByRole("dialog", {
      name: profile.featuredCertification.title,
    });
    expect(certDialog).toBeInTheDocument();

    const list = within(certDialog).getByRole("list");
    const items = within(list).getAllByRole("listitem");
    expect(items).toHaveLength(16);

    profile.featuredCertification.modules.forEach((moduleName, index) => {
      expect(items[index]).toHaveTextContent(`${index + 1}.`);
      expect(items[index]).toHaveTextContent(moduleName);
    });

    expect(
      within(certDialog).getByRole("link", { name: /verificar certificado/i }),
    ).toHaveAttribute("href", profile.featuredCertification.verifyUrl);
  });

  it("navigates via router.push when selecting a case study without a registered Home handler", async () => {
    const user = userEvent.setup();
    renderShell();

    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    const firstCase = caseStudies[0];
    await user.click(
      screen.getByRole("option", {
        name: new RegExp(firstCase.shortTitle, "i"),
      }),
    );

    expect(pushMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith(`/cases/${firstCase.slug}`);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("invokes registered case handler instead of router.push when Home registers CaseSheet handler", async () => {
    const user = userEvent.setup();
    const caseHandler = vi.fn();
    renderShell(caseHandler);

    fireEvent.keyDown(document, { key: "k", metaKey: true });
    const firstCase = caseStudies[0];
    await user.click(
      screen.getByRole("option", {
        name: new RegExp(firstCase.shortTitle, "i"),
      }),
    );

    expect(caseHandler).toHaveBeenCalledTimes(1);
    expect(caseHandler).toHaveBeenCalledWith(firstCase.slug);
    expect(pushMock).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("supports copying email and toggling theme from CommandMenu quick actions, and keeps shell landmarks printable-safe", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    const toastSuccessSpy = vi.spyOn(toast, "success");
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });

    const { container } = renderShell();

    const header = container.querySelector("header");
    const footer = container.querySelector("footer");
    expect(header).toHaveClass("no-print", "md:sticky", "md:top-0");
    expect(header?.className).not.toMatch(/(?:^|\s)sticky(?:\s|$)/);
    expect(header?.innerHTML).not.toMatch(/(?:^|[\s"])order-/);
    expect(footer).toHaveClass("no-print");
    const headerWhatsapp = within(header!).getByRole("link", { name: /whatsapp/i });
    expect(headerWhatsapp).toHaveAttribute("href", profile.contact.whatsappUrl);
    expect(headerWhatsapp).toHaveClass("hidden", "lg:inline-flex");
    expect(
      within(footer!).getByRole("link", { name: /linkedin/i }),
    ).toHaveAttribute("href", profile.contact.linkedinUrl);

    await user.click(screen.getByRole("button", { name: /buscar/i }));
    await user.click(screen.getByRole("option", { name: /copiar e-mail/i }));

    expect(writeText).toHaveBeenCalledWith(profile.contact.email);
    expect(toastSuccessSpy).toHaveBeenCalledWith("E-mail copiado", {
      description: profile.contact.email,
    });

    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    await user.click(
      screen.getByRole("option", { name: /alternar para tema escuro/i }),
    );
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("filters items in CommandMenu and shows empty state when nothing matches", async () => {
    const user = userEvent.setup();
    renderShell();

    await user.click(screen.getByRole("button", { name: /buscar/i }));
    const input = screen.getByPlaceholderText(/buscar cases, projetos, rotas ou ações/i);

    await user.type(input, "MARC21");
    expect(screen.getByText("Saneamento MARC21 e biblioteca")).toBeInTheDocument();
    expect(screen.queryByText("Motor socioeconômico e folha de auxílios")).not.toBeInTheDocument();

    await user.clear(input);
    await user.type(input, "termo-inexistente-xyz");
    expect(screen.getByText("Nenhum resultado encontrado.")).toBeInTheDocument();
  });

  it("enforces mutual exclusion between CertificationDialog and CommandMenu across Ctrl+K, programmatic setters, and openCase", () => {
    let controls!: ReturnType<typeof usePortfolioOverlays>;
    renderShell(undefined, (value) => {
      controls = value;
    });

    expect(screen.getByTestId("overlay-state")).toHaveTextContent("false:false");

    // Open CertificationDialog first
    act(() => {
      controls.openCertDialog();
    });
    expect(screen.getByTestId("overlay-state")).toHaveTextContent("false:true");
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(
      screen.getByRole("dialog", { name: profile.featuredCertification.title }),
    ).toBeInTheDocument();

    // Pressing Ctrl+K while CertificationDialog is open must close CertificationDialog and open CommandMenu
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(screen.getByTestId("overlay-state")).toHaveTextContent("true:false");
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(
      screen.getByRole("dialog", { name: /paleta de comandos/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("dialog", { name: profile.featuredCertification.title }),
    ).not.toBeInTheDocument();

    // Calling setCertDialogOpen(true) while CommandMenu is open must close CommandMenu
    act(() => {
      controls.setCertDialogOpen(true);
    });
    expect(screen.getByTestId("overlay-state")).toHaveTextContent("false:true");
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(
      screen.getByRole("dialog", { name: profile.featuredCertification.title }),
    ).toBeInTheDocument();

    // Calling setCommandOpen(true) while CertificationDialog is open must close CertificationDialog
    act(() => {
      controls.setCommandOpen(true);
    });
    expect(screen.getByTestId("overlay-state")).toHaveTextContent("true:false");
    expect(screen.getAllByRole("dialog")).toHaveLength(1);

    // Calling openCertDialog() while CommandMenu is open, then openCase(), closes overlays before navigating
    act(() => {
      controls.openCertDialog();
    });
    expect(screen.getByTestId("overlay-state")).toHaveTextContent("false:true");

    act(() => {
      controls.openCase("motor-socioeconomico-auxilios");
    });
    expect(screen.getByTestId("overlay-state")).toHaveTextContent("false:false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(pushMock).toHaveBeenCalledWith("/cases/motor-socioeconomico-auxilios");

    // Calling openCommand() while CertificationDialog is open must also close CertificationDialog
    act(() => {
      controls.setCertDialogOpen(true);
    });
    expect(screen.getByTestId("overlay-state")).toHaveTextContent("false:true");
    act(() => {
      controls.openCommand();
    });
    expect(screen.getByTestId("overlay-state")).toHaveTextContent("true:false");
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
  });

  it("ignores Ctrl+Shift+K and Cmd+Shift+K so browser console shortcuts are not intercepted", () => {
    renderShell();

    const ctrlShiftEvent = new KeyboardEvent("keydown", {
      key: "k",
      ctrlKey: true,
      shiftKey: true,
      cancelable: true,
      bubbles: true,
    });
    window.dispatchEvent(ctrlShiftEvent);

    expect(ctrlShiftEvent.defaultPrevented).toBe(false);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    const metaShiftEvent = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      shiftKey: true,
      cancelable: true,
      bubbles: true,
    });
    window.dispatchEvent(metaShiftEvent);

    expect(metaShiftEvent.defaultPrevented).toBe(false);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
