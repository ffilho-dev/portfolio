import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CaseStudyPage, {
  generateMetadata,
  generateStaticParams,
} from "@/app/cases/[slug]/page";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { caseStudies } from "@/data/cases";

const notFoundMock = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});

vi.mock("next/navigation", () => ({
  notFound: () => notFoundMock(),
}));

describe("CaseStudyPage", () => {
  afterEach(() => {
    cleanup();
    notFoundMock.mockClear();
  });

  it("generates static params for all 4 anonymized cases", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(4);
    expect(params.map((p) => p.slug)).toContain("motor-socioeconomico-auxilios");
  });

  it("renders full factual case study sections, expanded SVG diagram, and next-case link", async () => {
    const ui = await CaseStudyPage({
      params: Promise.resolve({ slug: "motor-socioeconomico-auxilios" }),
    });
    render(ui);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/socioeconômica/i);
    const expandedSvg = screen.getByRole("img");
    expect(expandedSvg).toBeInTheDocument();
    expect(expandedSvg.getAttribute("viewBox")).toMatch(/^0 0 720 \d+$/);
    expect(screen.getByRole("heading", { name: /problema real/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /restrições e contexto operacional/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /solução e decisões técnicas/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /resultado prático/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /voltar para cases/i })).toHaveAttribute(
      "href",
      "/#cases",
    );

    expect(screen.getByText("Contexto")).toBeInTheDocument();
    expect(screen.getByText("Período")).toBeInTheDocument();
    expect(screen.getByText("Papel")).toBeInTheDocument();
    expect(screen.getByText("Stack")).toBeInTheDocument();

    const nextCase = caseStudies[1];
    expect(
      screen.getByRole("link", { name: new RegExp(nextCase.title, "i") }),
    ).toHaveAttribute("href", `/cases/${nextCase.slug}`);
    expect(screen.getByRole("link", { name: /ver currículo/i })).toHaveAttribute(
      "href",
      "/curriculo",
    );
  });

  it("wraps next-case link around from the last case to the first case", async () => {
    const lastCase = caseStudies[caseStudies.length - 1];
    const firstCase = caseStudies[0];
    const ui = await CaseStudyPage({
      params: Promise.resolve({ slug: lastCase.slug }),
    });
    render(ui);

    expect(
      screen.getByRole("link", { name: new RegExp(firstCase.title, "i") }),
    ).toHaveAttribute("href", `/cases/${firstCase.slug}`);
  });

  it("calls notFound() for unknown slugs", async () => {
    await expect(
      CaseStudyPage({ params: Promise.resolve({ slug: "inexistente" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFoundMock).toHaveBeenCalled();
  });

  it("generates metadata for valid slug and includes all routes in sitemap and robots", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "apis-rest-sistema-academico" }),
    });
    expect(meta.title).toContain("APIs REST");
    expect(meta.description).toBeTruthy();
    expect(meta.openGraph?.locale).toBe("pt_BR");
    expect(meta.openGraph?.siteName).toContain("ffilho-dev");
    expect(meta.openGraph?.images).toEqual([
      expect.objectContaining({ url: "/opengraph-image", width: 1200, height: 630 }),
    ]);
    expect(meta.twitter).toEqual(
      expect.objectContaining({
        card: "summary_large_image",
        images: ["/opengraph-image"],
      }),
    );

    const missingMeta = await generateMetadata({
      params: Promise.resolve({ slug: "inexistente" }),
    });
    expect(missingMeta.title).toBeTruthy();

    const entries = sitemap();
    expect(entries.length).toBeGreaterThanOrEqual(6);
    const urls = entries.map((entry) => entry.url);
    expect(urls.some((url) => url.endsWith("/curriculo"))).toBe(true);
    for (const item of caseStudies) {
      expect(urls.some((url) => url.endsWith(`/cases/${item.slug}`))).toBe(true);
    }

    const robotsConfig = robots();
    expect(robotsConfig.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});
