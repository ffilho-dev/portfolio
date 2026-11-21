import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";
import { caseStudies, getCaseStudyBySlug } from "@/data/cases";
import { publicProjects } from "@/data/projects";
import { aiPillars, skillGroups } from "@/data/skills";

describe("portfolio data integrity", () => {
  it("contains Francisco Filho profile, contact channels, and 5 experiences", () => {
    expect(profile.name).toBe("Francisco Filho");
    expect(profile.handle).toBe("ffilho.dev");
    expect(profile.location).toContain("Macau");
    expect(profile.availability).toMatch(/presencial/i);
    expect(profile.contact.email).toBe("contato@ffilho.dev");
    expect(profile.contact.whatsappUrl).toBe("https://wa.me/5584994980792");
    expect(profile.contact.linkedinUrl).toBe(
      "https://www.linkedin.com/in/francisco-filho-41793411a/",
    );
    expect(profile.contact.linkedinUrl).not.toContain("francisco-fernandes-41793411a");
    expect(profile.contact.githubUrl).toBe("https://github.com/ffilho-dev");
    expect(profile.metrics).toHaveLength(3);
    expect(profile.metrics).toContainEqual({
      value: "250+ entregas",
      label: "mapeadas no ciclo 2023–2026",
    });
    const metricsBlob = profile.metrics.map((m) => `${m.value} ${m.label}`).join(" ");
    expect(metricsBlob).not.toContain("120+");
    expect(metricsBlob).not.toContain("2024–2026");
    expect(profile.experiences).toHaveLength(5);
    expect(profile.education.expectedYear).toBe("2027");
    expect(profile.featuredCertification.hours).toBe(81);
    expect(profile.featuredCertification.modules).toHaveLength(16);
    expect(profile.featuredCertification.verifyUrl).toBe(
      "https://curso.dev/certificados/19acb84f-0036-43b6-bc20-fc39d7e4fa29",
    );
  });

  it("contains 6 unique anonymized case studies with valid diagram flows and updated 2023–2026 metrics", () => {
    expect(caseStudies).toHaveLength(6);
    expect(caseStudies.map((c) => c.slug)).toEqual([
      "motor-socioeconomico-auxilios",
      "apis-rest-sistema-academico",
      "verificacao-digital-diplomas-documentos",
      "acervo-marc21-biblioteca-catalogacao",
      "fluxos-pesquisa-extensao-bolsas",
      "sustentacao-multi-institucional-regras-criticas",
    ]);
    for (const item of caseStudies) {
      expect(getCaseStudyBySlug(item.slug)).toEqual(item);
      expect(item.domain.trim().length).toBeGreaterThan(0);
      expect(item.shortTitle.trim().length).toBeGreaterThan(0);
      expect(item.shortTitle.length).toBeLessThanOrEqual(48);
      expect(item.problem.length).toBeGreaterThan(40);
      expect(item.constraints.length).toBeGreaterThan(30);
      expect(item.solution.length).toBeGreaterThan(40);
      expect(item.result.length).toBeGreaterThan(20);
      expect(item.diagramNodes.length).toBeGreaterThanOrEqual(4);
      for (const node of item.diagramNodes) {
        expect(node.label.trim().length).toBeGreaterThan(0);
        expect(node.label.length).toBeLessThanOrEqual(40);
        expect(node.detail.trim().length).toBeGreaterThan(0);
        expect(node.detail.length).toBeLessThanOrEqual(90);
      }
      expect(item.stack.length).toBeGreaterThanOrEqual(3);
    }
    const sustentacao = getCaseStudyBySlug("sustentacao-multi-institucional-regras-criticas");
    expect(sustentacao).toBeDefined();
    const sustentacaoBlob = JSON.stringify(sustentacao);
    expect(sustentacaoBlob).toContain("250");
    expect(sustentacaoBlob).toContain("2023–2026");
    expect(sustentacaoBlob).toContain("4 sistemas corporativos");
    expect(sustentacaoBlob).not.toContain("120");
    expect(sustentacaoBlob).not.toContain("3 sistemas");
    expect(getCaseStudyBySlug("slug-inexistente")).toBeUndefined();
  });

  it("contains exactly 4 curated public projects without basic tutorial exercises", () => {
    expect(publicProjects).toHaveLength(4);
    const names = publicProjects.map((p) => p.name);
    expect(names).toEqual([
      "clone-tabnews",
      "ProjetoEsigGroup",
      "BotRegistroImoveisBrasil",
      "ffilho-dev/portfolio",
    ]);
    const legacy = publicProjects.filter((p) => p.isLegacyAccount);
    expect(legacy).toHaveLength(2);
  });

  it("contains 3 categorized skill groups and 3 AI engineering pillars", () => {
    expect(skillGroups).toHaveLength(3);
    expect(aiPillars).toHaveLength(3);
    for (const pillar of aiPillars) {
      expect(pillar.id.trim().length).toBeGreaterThan(0);
      expect(pillar.shortTitle.trim().length).toBeGreaterThan(0);
      expect(pillar.artifacts).toHaveLength(3);
      for (const artifact of pillar.artifacts) {
        expect(artifact.trim().length).toBeGreaterThan(0);
      }
    }
    const aiBlob = aiPillars.map((p) => `${p.title} ${p.description}`).join(" ");
    expect(aiBlob).toMatch(/AGENTS\.md/);
    expect(aiBlob).toMatch(/Skills/i);
    expect(aiBlob).toMatch(/MCP/i);
  });
});
