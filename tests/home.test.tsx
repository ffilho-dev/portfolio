import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import HomePage from "@/app/page";
import { CaseDiagram } from "@/components/CaseDiagram";
import { caseStudies } from "@/data/cases";

describe("HomePage", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders lean hero, 3 metrics, 6 production cases with SVG diagrams, AI workflow, 4 projects, trajectory, certificate, and direct contact", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1, name: "Francisco Filho" })).toBeInTheDocument();
    expect(screen.getByText(/Desenvolvedor FullStack/i)).toBeInTheDocument();
    expect(screen.getByText(/presencial/i)).toBeInTheDocument();
    expect(screen.getByText("250+ entregas")).toBeInTheDocument();
    expect(screen.getByText(/ciclo 2023–2026/i)).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(6);
    expect(screen.getAllByRole("link", { name: /ler estudo de caso/i })).toHaveLength(6);
    expect(screen.getByRole("link", { name: /baixar currículo/i })).toHaveAttribute("href", "/curriculo.pdf");
    expect(screen.getByRole("link", { name: /whatsapp/i })).toHaveAttribute("href", "https://wa.me/5584994980792");
    expect(screen.getByRole("link", { name: "contato@ffilho.dev" })).toHaveAttribute("href", "mailto:contato@ffilho.dev");
    expect(screen.queryByText(/@gmail\.com/i)).not.toBeInTheDocument();
    expect(screen.getByText(/curso\.dev/i)).toBeInTheDocument();
    expect(screen.getByText(/ProjetoEsigGroup/i)).toBeInTheDocument();
  });

  it("exposes section anchors, distinct case routes, and project links accurately", () => {
    const { container } = render(<HomePage />);
    for (const id of ["cases", "ia", "projetos", "stack", "trajetoria", "contato"]) {
      expect(container.querySelector(`section#${id}`)).toBeInTheDocument();
    }

    const caseLinks = screen.getAllByRole("link", { name: /ler estudo de caso/i });
    expect(caseLinks.map((link) => link.getAttribute("href"))).toEqual(
      caseStudies.map((item) => `/cases/${item.slug}`),
    );
    expect(new Set(caseLinks.map((link) => link.textContent)).size).toBe(1);

    expect(screen.getByRole("link", { name: /live/i })).toHaveAttribute(
      "href",
      "https://clone-tabnews-gamma-wheat.vercel.app",
    );
    expect(screen.getAllByText(/conta anterior/i)).toHaveLength(2);
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
