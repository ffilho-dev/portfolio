import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";
import { caseStudies, getCaseStudyBySlug } from "@/data/cases";
import { publicProjects } from "@/data/projects";
import { aiPillars, skillGroups } from "@/data/skills";

describe("portfolio data integrity", () => {
  it("contains Francisco Fernandes profile, contact channels, and 5 experiences", () => {
    expect(profile.name).toBe("Francisco Fernandes");
    expect(profile.handle).toBe("ffilho-dev");
    expect(profile.location).toContain("Macau");
    expect(profile.availability).toMatch(/presencial/i);
    expect(profile.contact.email).toBe("fcofilho0809@gmail.com");
    expect(profile.contact.whatsappUrl).toBe("https://wa.me/5584994980792");
    expect(profile.contact.linkedinUrl).toContain("francisco-fernandes-41793411a");
    expect(profile.contact.githubUrl).toBe("https://github.com/ffilho-dev");
    expect(profile.metrics).toHaveLength(3);
    expect(profile.experiences).toHaveLength(5);
    expect(profile.education.expectedYear).toBe("2027");
    expect(profile.featuredCertification.hours).toBe(81);
    expect(profile.featuredCertification.modules).toHaveLength(16);
    expect(profile.featuredCertification.verifyUrl).toBe(
      "https://curso.dev/certificados/19acb84f-0036-43b6-bc20-fc39d7e4fa29",
    );
  });

  it("contains 4 unique anonymized case studies with valid diagram flows", () => {
    expect(caseStudies).toHaveLength(4);
    const slugs = new Set(caseStudies.map((c) => c.slug));
    expect(slugs.size).toBe(4);
    for (const item of caseStudies) {
      expect(getCaseStudyBySlug(item.slug)).toEqual(item);
      expect(item.problem.length).toBeGreaterThan(40);
      expect(item.constraints.length).toBeGreaterThan(30);
      expect(item.solution.length).toBeGreaterThan(40);
      expect(item.result.length).toBeGreaterThan(20);
      expect(item.diagramNodes.length).toBeGreaterThanOrEqual(4);
      expect(item.stack.length).toBeGreaterThanOrEqual(3);
    }
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
    const aiBlob = aiPillars.map((p) => `${p.title} ${p.description}`).join(" ");
    expect(aiBlob).toMatch(/AGENTS\.md/);
    expect(aiBlob).toMatch(/Skills/i);
    expect(aiBlob).toMatch(/MCP/i);
  });
});
