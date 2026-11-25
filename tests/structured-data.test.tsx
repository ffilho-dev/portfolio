import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CaseStudyPage from "@/app/cases/[slug]/page";
import CurriculoPage from "@/app/curriculo/page";
import HomePage from "@/app/page";
import sitemap from "@/app/sitemap";
import { PortfolioOverlayProvider } from "@/components/PortfolioOverlayProvider";
import { caseStudies } from "@/data/cases";
import { profile } from "@/data/profile";
import { skillGroups } from "@/data/skills";
import { SITE_LAST_MODIFIED } from "@/lib/site";
import {
  buildCaseStudyJsonLd,
  buildCurriculoJsonLd,
  buildHomeJsonLd,
  serializeJsonLd,
} from "@/lib/structured-data";
import {
  assertNoBlockedTokenHashes,
  assertNoForbiddenPatterns,
} from "./confidentiality-guard";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

function getJsonLdScripts(container: HTMLElement): Array<Record<string, unknown>> {
  const scripts = Array.from(
    container.querySelectorAll('script[type="application/ld+json"]'),
  );
  return scripts.map(
    (script) => JSON.parse(script.textContent ?? "") as Record<string, unknown>,
  );
}

describe("JSON-LD structured data", () => {
  afterEach(() => {
    cleanup();
  });

  it("serializes JSON-LD safely escaping '<' to prevent script tag breakout", () => {
    const payload = {
      name: "Teste </script><script>alert(1)</script>",
      url: "https://ffilho.dev/?a=1&b=2",
    };

    const serialized = serializeJsonLd(payload);
    expect(serialized).not.toContain("</script>");
    expect(serialized).not.toContain("<");
    expect(serialized).toContain("\\u003c/script>");
    expect(JSON.parse(serialized)).toEqual(payload);
  });

  it("builds Home JSON-LD graph with WebSite, ProfilePage, and factual Person schema", () => {
    const graphDoc = buildHomeJsonLd("https://ffilho.dev");
    expect(graphDoc["@context"]).toBe("https://schema.org");

    const graph = graphDoc["@graph"] as Array<Record<string, unknown>>;
    expect(graph).toHaveLength(3);

    const website = graph.find((node) => node["@type"] === "WebSite");
    const profilePage = graph.find((node) => node["@type"] === "ProfilePage");
    const person = graph.find((node) => node["@type"] === "Person");

    expect(website).toEqual(
      expect.objectContaining({
        "@id": "https://ffilho.dev/#website",
        url: "https://ffilho.dev/",
        name: "Francisco Filho (ffilho.dev)",
        alternateName: "ffilho.dev",
        inLanguage: "pt-BR",
        author: { "@id": "https://ffilho.dev/#person" },
      }),
    );

    expect(profilePage).toEqual(
      expect.objectContaining({
        "@id": "https://ffilho.dev/#profilepage",
        url: "https://ffilho.dev/",
        inLanguage: "pt-BR",
        dateModified: SITE_LAST_MODIFIED,
        isPartOf: { "@id": "https://ffilho.dev/#website" },
        mainEntity: { "@id": "https://ffilho.dev/#person" },
      }),
    );

    expect(person).toEqual(
      expect.objectContaining({
        "@id": "https://ffilho.dev/#person",
        name: profile.name,
        alternateName: profile.handle,
        url: "https://ffilho.dev/",
        jobTitle: profile.title,
        description: profile.bio,
        email: `mailto:${profile.contact.email}`,
        sameAs: [profile.contact.githubUrl, profile.contact.linkedinUrl],
        worksFor: {
          "@type": "Organization",
          name: "ESIG Software e Consultoria em TI",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Macau",
          addressRegion: "RN",
          addressCountry: "BR",
        },
        knowsLanguage: "pt-BR",
      }),
    );

    expect(person).not.toHaveProperty("image");
    expect(person).not.toHaveProperty("alumniOf");
    expect(person?.knowsAbout).toEqual(skillGroups.flatMap((group) => group.items));
  });

  it("normalizes trailing slash on custom baseUrl in JSON-LD builders", () => {
    const graphDoc = buildHomeJsonLd("https://preview.ffilho.dev/");
    const graph = graphDoc["@graph"] as Array<Record<string, unknown>>;
    const website = graph.find((node) => node["@type"] === "WebSite");

    expect(website?.["@id"]).toBe("https://preview.ffilho.dev/#website");
    expect(website?.url).toBe("https://preview.ffilho.dev/");
  });

  it("builds Curriculo JSON-LD graph with ProfilePage and 2-level BreadcrumbList", () => {
    const graphDoc = buildCurriculoJsonLd("https://ffilho.dev");
    const graph = graphDoc["@graph"] as Array<Record<string, unknown>>;

    const profilePage = graph.find((node) => node["@type"] === "ProfilePage");
    const breadcrumb = graph.find((node) => node["@type"] === "BreadcrumbList");

    expect(profilePage).toEqual(
      expect.objectContaining({
        "@id": "https://ffilho.dev/curriculo#profilepage",
        url: "https://ffilho.dev/curriculo",
        inLanguage: "pt-BR",
        dateModified: SITE_LAST_MODIFIED,
        isPartOf: { "@id": "https://ffilho.dev/#website" },
      }),
    );
    expect(breadcrumb).toEqual(
      expect.objectContaining({
        "@id": "https://ffilho.dev/curriculo#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: profile.name,
            item: "https://ffilho.dev/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Currículo",
            item: "https://ffilho.dev/curriculo",
          },
        ],
      }),
    );
  });

  it("builds CaseStudy JSON-LD graph with TechArticle and 3-level BreadcrumbList", () => {
    const study = caseStudies[0];
    const graphDoc = buildCaseStudyJsonLd(study, "https://ffilho.dev");
    const graph = graphDoc["@graph"] as Array<Record<string, unknown>>;

    const article = graph.find((node) => node["@type"] === "TechArticle");
    const breadcrumb = graph.find((node) => node["@type"] === "BreadcrumbList");

    expect(article).toEqual(
      expect.objectContaining({
        "@id": `https://ffilho.dev/cases/${study.slug}#article`,
        url: `https://ffilho.dev/cases/${study.slug}`,
        headline: study.title,
        description: study.summary,
        about: study.domain,
        keywords: study.stack.join(", "),
        inLanguage: "pt-BR",
        dateModified: SITE_LAST_MODIFIED,
        author: expect.objectContaining({
          "@type": "Person",
          "@id": "https://ffilho.dev/#person",
          name: profile.name,
          url: "https://ffilho.dev/",
        }),
      }),
    );

    expect(breadcrumb).toEqual(
      expect.objectContaining({
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: profile.name,
            item: "https://ffilho.dev/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Estudos de caso",
            item: "https://ffilho.dev/#cases",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: study.shortTitle,
            item: `https://ffilho.dev/cases/${study.slug}`,
          },
        ],
      }),
    );
  });

  it("embeds JSON-LD script tags in HomePage, CurriculoPage, and CaseStudyPage", async () => {
    const home = render(
      <PortfolioOverlayProvider>
        <HomePage />
      </PortfolioOverlayProvider>,
    );
    const homeScripts = getJsonLdScripts(home.container);
    expect(homeScripts).toHaveLength(1);
    expect(
      (homeScripts[0]["@graph"] as Array<Record<string, unknown>>).map(
        (node) => node["@type"],
      ),
    ).toEqual(["WebSite", "ProfilePage", "Person"]);
    cleanup();

    const curriculo = render(<CurriculoPage />);
    const curriculoScripts = getJsonLdScripts(curriculo.container);
    expect(curriculoScripts).toHaveLength(1);
    expect(
      (curriculoScripts[0]["@graph"] as Array<Record<string, unknown>>).map(
        (node) => node["@type"],
      ),
    ).toEqual(["ProfilePage", "BreadcrumbList"]);
    cleanup();

    const caseUi = await CaseStudyPage({
      params: Promise.resolve({ slug: caseStudies[0].slug }),
    });
    const caseRender = render(caseUi);
    const caseScripts = getJsonLdScripts(caseRender.container);
    expect(caseScripts).toHaveLength(1);
    expect(
      (caseScripts[0]["@graph"] as Array<Record<string, unknown>>).map(
        (node) => node["@type"],
      ),
    ).toEqual(["TechArticle", "BreadcrumbList"]);
  });

  it("keeps all serialized JSON-LD compliant with NDA/confidentiality rules and without legacy contacts", () => {
    const allSerialized = [
      serializeJsonLd(buildHomeJsonLd("https://ffilho.dev")),
      serializeJsonLd(buildCurriculoJsonLd("https://ffilho.dev")),
      ...caseStudies.map((study) =>
        serializeJsonLd(buildCaseStudyJsonLd(study, "https://ffilho.dev")),
      ),
    ].join("\n");

    assertNoForbiddenPatterns(allSerialized);
    assertNoBlockedTokenHashes(allSerialized);
    expect(allSerialized).not.toMatch(/@gmail\.com/i);
    expect(allSerialized).not.toContain("francisco-fernandes-41793411a");
  });
});

describe("sitemap lastModified metadata", () => {
  it("sets a valid ISO YYYY-MM-DD lastModified date on every sitemap route", () => {
    expect(SITE_LAST_MODIFIED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(Date.parse(SITE_LAST_MODIFIED))).toBe(false);

    const entries = sitemap();
    expect(entries).toHaveLength(2 + caseStudies.length);

    for (const entry of entries) {
      expect(entry.lastModified).toBe(SITE_LAST_MODIFIED);
    }
  });
});
