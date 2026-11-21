import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CurriculoPage, { metadata as curriculoMetadata } from "@/app/curriculo/page";
import { PrintButton } from "@/components/PrintButton";
import { caseStudies } from "@/data/cases";

describe("CurriculoPage", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders download PDF link, print button, full experience timeline, UFERSA 2027, and curso.dev certificate", () => {
    render(<CurriculoPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Francisco Filho" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "contato@ffilho.dev" })).toHaveAttribute("href", "mailto:contato@ffilho.dev");
    expect(screen.queryByText(/@gmail\.com/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /voltar ao portfólio/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /baixar pdf/i })).toHaveAttribute("href", "/curriculo.pdf");
    expect(screen.getByRole("button", { name: /imprimir/i })).toBeInTheDocument();
    expect(screen.getByText(/ESIG Software/i)).toBeInTheDocument();
    expect(screen.getByText(/Quark Tecnologia/i)).toBeInTheDocument();
    expect(screen.getByText(/Turing Tecnologia/i)).toBeInTheDocument();
    expect(screen.getByText(/Yank Solutions/i)).toBeInTheDocument();
    expect(screen.getByText(/Salinor/i)).toBeInTheDocument();
    expect(screen.getByText(/\(2023–2026\)/)).toBeInTheDocument();
    expect(screen.queryByText(/2024–2026/)).not.toBeInTheDocument();
    for (const study of caseStudies) {
      expect(screen.getByRole("link", { name: study.title })).toHaveAttribute(
        "href",
        `/cases/${study.slug}`,
      );
    }
    expect(screen.getByText(/UFERSA/i)).toBeInTheDocument();
    expect(screen.getByText(/2027/)).toBeInTheDocument();
    expect(screen.getByText(/Inglês/i)).toBeInTheDocument();
    expect(screen.getByText(/81\s*h/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /verificar certificado/i })).toHaveAttribute(
      "href",
      "https://curso.dev/certificados/19acb84f-0036-43b6-bc20-fc39d7e4fa29",
    );
    expect(
      screen.getByRole("link", { name: /em produção clone-tabnews/i }),
    ).toHaveAttribute("href", "https://clone-tabnews-gamma-wheat.vercel.app");
    expect(screen.getAllByRole("link", { name: /^código /i })).toHaveLength(4);
    expect(curriculoMetadata.openGraph?.images).toEqual([
      expect.objectContaining({ url: "/opengraph-image", width: 1200, height: 630 }),
    ]);
    expect(curriculoMetadata.twitter).toEqual(
      expect.objectContaining({
        card: "summary_large_image",
        images: ["/opengraph-image"],
      }),
    );
  });

  it("triggers window.print when clicking PrintButton", () => {
    const printSpy = vi.spyOn(window, "print").mockImplementation(() => {});
    render(<PrintButton />);
    fireEvent.click(screen.getByRole("button", { name: /imprimir/i }));
    expect(printSpy).toHaveBeenCalledTimes(1);
  });
});
