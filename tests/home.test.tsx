import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HomePage from "@/app/page";
import { CaseDiagram } from "@/components/CaseDiagram";
import { CertificationDialog } from "@/components/CertificationDialog";
import { CommandMenu } from "@/components/CommandMenu";
import { PortfolioOverlayProvider } from "@/components/PortfolioOverlayProvider";
import { caseStudies } from "@/data/cases";
import { profile } from "@/data/profile";
import { aiPillars } from "@/data/skills";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

function renderHome() {
  return render(
    <PortfolioOverlayProvider>
      <HomePage />
      <CommandMenu />
      <CertificationDialog />
    </PortfolioOverlayProvider>,
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    pushMock.mockReset();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders Bento hero, 3 metrics, direct channels, 6 section anchors, and 4 public projects without legacy email or LinkedIn", () => {
    const { container } = renderHome();

    expect(screen.getByRole("heading", { level: 1, name: "Francisco Filho" })).toBeInTheDocument();
    expect(screen.getByText("Desenvolvedor FullStack")).toBeInTheDocument();
    expect(screen.getByText(/presencial/i)).toBeInTheDocument();

    expect(screen.getByText("6+ anos")).toBeInTheDocument();
    expect(screen.getByText("12 instituições")).toBeInTheDocument();
    expect(screen.getByText("250+ entregas")).toBeInTheDocument();
    expect(screen.getByText(/ciclo 2023–2026/i)).toBeInTheDocument();

    for (const id of ["cases", "ia", "projetos", "stack", "trajetoria", "contato"]) {
      expect(container.querySelector(`section#${id}`)).toBeInTheDocument();
    }

    const whatsappLinks = screen.getAllByRole("link", { name: /whatsapp/i });
    expect(whatsappLinks.length).toBeGreaterThanOrEqual(1);
    for (const link of whatsappLinks) {
      expect(link).toHaveAttribute("href", "https://wa.me/5584994980792");
    }

    expect(screen.getByRole("link", { name: /baixar currículo/i })).toHaveAttribute(
      "href",
      "/curriculo.pdf",
    );
    expect(screen.getByRole("link", { name: /ver currículo/i })).toHaveAttribute(
      "href",
      "/curriculo",
    );

    const emailLinks = screen.getAllByRole("link", { name: "contato@ffilho.dev" });
    expect(emailLinks.length).toBeGreaterThanOrEqual(1);
    for (const link of emailLinks) {
      expect(link).toHaveAttribute("href", "mailto:contato@ffilho.dev");
    }

    const linkedinLinks = screen.getAllByRole("link", {
      name: /linkedin\.com\/in\/francisco-filho-41793411a/i,
    });
    expect(linkedinLinks.length).toBeGreaterThanOrEqual(1);
    for (const link of linkedinLinks) {
      expect(link).toHaveAttribute(
        "href",
        "https://www.linkedin.com/in/francisco-filho-41793411a/",
      );
    }

    expect(screen.queryByText(/@gmail\.com/i)).not.toBeInTheDocument();
    expect(container.innerHTML).not.toContain("francisco-fernandes-41793411a");

    const projetosSection = container.querySelector("section#projetos") as HTMLElement;
    expect(within(projetosSection).getByText("clone-tabnews")).toBeInTheDocument();
    expect(within(projetosSection).getByRole("link", { name: /live/i })).toHaveAttribute(
      "href",
      "https://clone-tabnews-gamma-wheat.vercel.app",
    );
    expect(within(projetosSection).getByText("ProjetoEsigGroup")).toBeInTheDocument();
    expect(within(projetosSection).getByText("BotRegistroImoveisBrasil")).toBeInTheDocument();
    expect(within(projetosSection).getByText("ffilho-dev/portfolio")).toBeInTheDocument();
    expect(within(projetosSection).getAllByText(/conta anterior/i)).toHaveLength(2);
  });

  it("renders all 6 direct case links and inspect buttons, and filters cases by stack via ToggleGroup", async () => {
    const user = userEvent.setup();
    const { container } = renderHome();

    const casesSection = container.querySelector("section#cases") as HTMLElement;
    const caseLinks = within(casesSection).getAllByRole("link", {
      name: /ler estudo de caso/i,
    });
    expect(caseLinks).toHaveLength(6);
    expect(caseLinks.map((link) => link.getAttribute("href"))).toEqual(
      caseStudies.map((item) => `/cases/${item.slug}`),
    );
    expect(new Set(caseLinks.map((link) => link.textContent)).size).toBe(1);

    const inspectButtons = within(casesSection).getAllByRole("button", {
      name: /inspecionar case/i,
    });
    expect(inspectButtons).toHaveLength(6);
    expect(within(casesSection).getAllByRole("img")).toHaveLength(6);

    await user.click(within(casesSection).getByRole("radio", { name: "PostgreSQL" }));
    const postgresLinks = within(casesSection).getAllByRole("link", {
      name: /ler estudo de caso/i,
    });
    expect(postgresLinks.map((link) => link.getAttribute("href"))).toContain(
      "/cases/sustentacao-multi-institucional-regras-criticas",
    );
    expect(postgresLinks).toHaveLength(6);

    await user.click(within(casesSection).getByRole("radio", { name: "APIs REST/JSON" }));
    const restLinks = within(casesSection).getAllByRole("link", {
      name: /ler estudo de caso/i,
    });
    expect(restLinks).toHaveLength(1);
    expect(restLinks[0]).toHaveAttribute("href", "/cases/apis-rest-sistema-academico");
    expect(
      within(casesSection).getByText(/APIs REST para matrícula, frequência/i),
    ).toBeInTheDocument();

    await user.click(within(casesSection).getByRole("radio", { name: "Todos" }));
    expect(
      within(casesSection).getAllByRole("link", { name: /ler estudo de caso/i }),
    ).toHaveLength(6);
  });

  it("opens CaseSheet on inspect click, supports interactive diagram steps, and advances to the next case", async () => {
    const user = userEvent.setup();
    const { container } = renderHome();

    const casesSection = container.querySelector("section#cases") as HTMLElement;
    const inspectButtons = within(casesSection).getAllByRole("button", {
      name: /inspecionar case/i,
    });

    await user.click(inspectButtons[0]);

    const firstStudy = caseStudies[0];
    const sheet = screen.getByRole("dialog", { name: firstStudy.title });
    expect(sheet).toBeInTheDocument();
    expect(within(sheet).getByText(firstStudy.problem)).toBeInTheDocument();
    expect(within(sheet).getByText(firstStudy.constraints)).toBeInTheDocument();
    expect(within(sheet).getByText(firstStudy.solution)).toBeInTheDocument();
    expect(within(sheet).getByText(firstStudy.result)).toBeInTheDocument();
    expect(
      within(sheet).getByRole("link", { name: /abrir página completa/i }),
    ).toHaveAttribute("href", `/cases/${firstStudy.slug}`);
    expect(
      within(sheet).getByRole("link", { name: /baixar pdf/i }),
    ).toHaveAttribute("href", "/curriculo.pdf");

    expect(
      within(sheet).getByText(firstStudy.diagramNodes[0].detail),
    ).toBeInTheDocument();

    const step2Button = within(sheet).getByRole("button", {
      name: new RegExp(firstStudy.diagramNodes[1].label, "i"),
    });
    await user.click(step2Button);
    expect(step2Button).toHaveAttribute("aria-pressed", "true");
    expect(
      within(sheet).getByText(firstStudy.diagramNodes[1].detail),
    ).toBeInTheDocument();

    const secondStudy = caseStudies[1];
    await user.click(
      within(sheet).getByRole("button", {
        name: new RegExp(secondStudy.shortTitle, "i"),
      }),
    );

    const updatedSheet = screen.getByRole("dialog", { name: secondStudy.title });
    expect(updatedSheet).toBeInTheDocument();
    expect(
      within(updatedSheet).getByRole("link", { name: /abrir página completa/i }),
    ).toHaveAttribute("href", `/cases/${secondStudy.slug}`);
    expect(
      within(updatedSheet).getByText(secondStudy.diagramNodes[0].detail),
    ).toBeInTheDocument();

    const updatedStep2Button = within(updatedSheet).getByRole("button", {
      name: (name) => name.includes(secondStudy.diagramNodes[1].label),
    });
    await user.click(updatedStep2Button);
    expect(updatedStep2Button).toHaveAttribute("aria-pressed", "true");

    await user.click(within(updatedSheet).getByRole("button", { name: "Fechar" }));
    expect(
      screen.queryByRole("dialog", { name: secondStudy.title }),
    ).not.toBeInTheDocument();

    await user.click(inspectButtons[1]);
    const reopenedSheet = screen.getByRole("dialog", { name: secondStudy.title });
    const reopenedStep1Button = within(reopenedSheet).getByRole("button", {
      name: (name) => name.includes(secondStudy.diagramNodes[0].label),
    });
    expect(reopenedStep1Button).toHaveAttribute("aria-pressed", "true");
    expect(
      within(reopenedSheet).getByText(secondStudy.diagramNodes[0].detail),
    ).toBeInTheDocument();
  });

  it("switches AI workflow tabs without height lock or overflow clipping and shows full pillar description and artifacts", async () => {
    const user = userEvent.setup();
    const { container } = renderHome();

    const iaSection = container.querySelector("section#ia") as HTMLElement;
    const tablist = within(iaSection).getByRole("tablist", {
      name: /pilares de trabalho com ia/i,
    });
    expect(tablist).toHaveClass("overflow-visible", "flex-wrap");
    expect(tablist.className).not.toContain("overflow-x-auto");
    expect(within(iaSection).getByText(aiPillars[0].description)).toBeInTheDocument();

    const verificationPillar = aiPillars[2];
    const verificationTab = within(iaSection).getByRole("tab", {
      name: verificationPillar.shortTitle,
    });
    await user.click(verificationTab);

    expect(verificationTab).toHaveAttribute("aria-selected", "true");
    expect(within(iaSection).getByText(verificationPillar.title)).toBeInTheDocument();
    expect(
      within(iaSection).getByText(verificationPillar.description),
    ).toBeInTheDocument();
    for (const artifact of verificationPillar.artifacts) {
      expect(within(iaSection).getByText(artifact)).toBeInTheDocument();
    }
  });

  it("cross-highlights stack technologies across cases and projects, announces selection changes politely, opens CaseSheet, and clears selection", async () => {
    const user = userEvent.setup();
    const { container } = renderHome();

    const stackSection = container.querySelector("section#stack") as HTMLElement;
    const liveStatus = within(stackSection).getByRole("status");
    expect(liveStatus).toHaveAttribute("aria-live", "polite");
    expect(liveStatus).toHaveTextContent("");

    const pgToggle = within(stackSection).getByRole("button", {
      name: "PostgreSQL",
    });
    await user.click(pgToggle);

    expect(pgToggle).toHaveAttribute("aria-pressed", "true");
    expect(liveStatus).toHaveTextContent(/PostgreSQL selecionada/i);
    expect(
      within(stackSection).getByRole("heading", {
        name: /onde “PostgreSQL” aparece no portfólio/i,
      }),
    ).toBeInTheDocument();
    expect(within(stackSection).getByText("clone-tabnews")).toBeInTheDocument();
    expect(within(stackSection).getByText("ProjetoEsigGroup")).toBeInTheDocument();

    await user.click(
      within(stackSection).getByRole("button", {
        name: caseStudies[0].shortTitle,
      }),
    );
    expect(
      screen.getByRole("dialog", { name: caseStudies[0].title }),
    ).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(
      screen.queryByRole("dialog", { name: caseStudies[0].title }),
    ).not.toBeInTheDocument();

    await user.click(
      within(stackSection).getByRole("button", { name: /limpar seleção/i }),
    );
    expect(
      within(stackSection).queryByRole("heading", {
        name: /onde “PostgreSQL” aparece no portfólio/i,
      }),
    ).not.toBeInTheDocument();
    expect(pgToggle).toHaveAttribute("aria-pressed", "false");
    expect(liveStatus).toHaveTextContent(/Seleção de tecnologia limpa/i);
  });

  it("renders ESIG expanded by default in trajectory accordion and opens the 16-module CertificationDialog", async () => {
    const user = userEvent.setup();
    const { container } = renderHome();

    const trajSection = container.querySelector("section#trajetoria") as HTMLElement;
    const esigTrigger = within(trajSection).getByRole("button", {
      name: /ESIG Software/i,
    });
    expect(esigTrigger).toHaveAttribute("aria-expanded", "true");
    expect(
      within(trajSection).getByText(profile.experiences[0].summary),
    ).toBeInTheDocument();

    const quarkTrigger = within(trajSection).getByRole("button", {
      name: /Quark Tecnologia/i,
    });
    expect(quarkTrigger).toHaveAttribute("aria-expanded", "false");
    await user.click(quarkTrigger);
    expect(quarkTrigger).toHaveAttribute("aria-expanded", "true");
    expect(
      within(trajSection).getByText(profile.experiences[1].summary),
    ).toBeInTheDocument();

    await user.click(
      within(trajSection).getByRole("button", { name: /abrir os 16 módulos/i }),
    );

    const certDialog = screen.getByRole("dialog", {
      name: profile.featuredCertification.title,
    });
    expect(certDialog).toBeInTheDocument();
    const list = within(certDialog).getByRole("list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(16);
    for (const mod of profile.featuredCertification.modules) {
      expect(within(certDialog).getByText(mod)).toBeInTheDocument();
    }
  });

  it("keeps CaseSheet and CommandMenu mutually exclusive and opens CaseSheet when selecting a case via Ctrl+K", async () => {
    const user = userEvent.setup();
    const { container } = renderHome();

    const casesSection = container.querySelector("section#cases") as HTMLElement;
    await user.click(
      within(casesSection).getAllByRole("button", { name: /inspecionar case/i })[0],
    );
    expect(
      screen.getByRole("dialog", { name: caseStudies[0].title }),
    ).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(
      screen.getByRole("dialog", { name: /paleta de comandos/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("dialog", { name: caseStudies[0].title }),
    ).not.toBeInTheDocument();

    // Closing CommandMenu afterward must keep CaseSheet closed (must not pop back open)
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    const targetCase = caseStudies[2];
    await user.click(
      screen.getByRole("option", {
        name: (accessibleName) => accessibleName.includes(targetCase.shortTitle),
      }),
    );
    expect(pushMock).not.toHaveBeenCalled();
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(
      screen.getByRole("dialog", { name: targetCase.title }),
    ).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    await user.click(
      screen.getByRole("option", {
        name: /ver os 16 módulos da certificação curso\.dev/i,
      }),
    );
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(
      screen.getByRole("dialog", { name: profile.featuredCertification.title }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("CaseDiagram", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders descriptive accessible SVG schematics for compact and expanded variants", () => {
    const sample = caseStudies[0];
    const { rerender } = render(
      <CaseDiagram title={sample.title} nodes={sample.diagramNodes} variant="compact" />,
    );

    const compactSvg = screen.getByRole("img");
    expect(compactSvg.tagName.toLowerCase()).toBe("svg");
    expect(compactSvg).toHaveAttribute(
      "aria-label",
      `Fluxo arquitetural de ${sample.title}: ${sample.diagramNodes.map((n) => n.label).join(", ")}`,
    );
    expect(compactSvg.getAttribute("viewBox")).toMatch(/^0 0 \d+ \d+$/);

    rerender(
      <CaseDiagram title={sample.title} nodes={sample.diagramNodes} variant="expanded" />,
    );
    const expandedSvg = screen.getByRole("img");
    expect(expandedSvg).toHaveTextContent(sample.diagramNodes[0].detail);
    expect(expandedSvg.getAttribute("class")).toContain("min-w-[38.75rem]");
    expect(expandedSvg.parentElement).toHaveAttribute("tabindex", "0");
    expect(expandedSvg.parentElement?.className).toContain("overflow-x-auto");
    expect(expandedSvg.parentElement?.className).toContain("overscroll-x-contain");
    expect(expandedSvg.querySelectorAll('rect[stroke="var(--rule)"]')).toHaveLength(0);
    expect(
      expandedSvg.querySelectorAll('rect[stroke="var(--border)"]').length,
    ).toBeGreaterThanOrEqual(sample.diagramNodes.length + 1);
    expect(expandedSvg.querySelectorAll('[fill="var(--card)"]')).not.toHaveLength(0);
    expect(expandedSvg.querySelectorAll('[fill="var(--background)"]')).not.toHaveLength(0);
    expect(expandedSvg.querySelectorAll('[fill="var(--foreground)"]')).not.toHaveLength(0);
    expect(expandedSvg.querySelectorAll('[fill="var(--muted-foreground)"]')).not.toHaveLength(0);
    expect(expandedSvg.querySelectorAll('[stroke="var(--signal)"]')).not.toHaveLength(0);
    expect(expandedSvg.querySelectorAll('[fill="var(--surface)"], [fill="var(--bg)"], [fill="var(--ink)"], [fill="var(--muted)"], [stroke="var(--accent)"]')).toHaveLength(0);
  });

  it("chunks unspaced long tokens without overflowing max line width", () => {
    const longToken = "A".repeat(75);
    render(
      <CaseDiagram
        title="Token longo"
        nodes={[{ label: longToken, detail: "Detalhe" }]}
        variant="compact"
      />,
    );
    const svg = screen.getByRole("img");
    const tspans = Array.from(svg.querySelectorAll("tspan"));
    expect(tspans.length).toBeGreaterThanOrEqual(3);
    for (const span of tspans) {
      expect((span.textContent ?? "").trim().length).toBeLessThanOrEqual(35);
    }
  });
});
