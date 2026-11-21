import { describe, expect, it } from "vitest";
import { caseStudies } from "@/data/cases";
import { publicProjects } from "@/data/projects";
import {
  CASE_STACK_FILTERS,
  caseMatchesStackFilter,
  findPortfolioMatchesForSkill,
} from "@/lib/stack-match";

describe("stack matching helpers", () => {
  it("exposes expected case stack filter pills", () => {
    expect(CASE_STACK_FILTERS).toEqual([
      "Todos",
      "Java",
      "PostgreSQL",
      "APIs REST/JSON",
      "JasperReports",
      "Hibernate/JPA",
    ]);
  });

  it("matches all 6 cases when filter is Todos", () => {
    const matched = caseStudies.filter((study) =>
      caseMatchesStackFilter(study, "Todos"),
    );
    expect(matched).toHaveLength(6);
  });

  it("matches PostgreSQL filter including PostgreSQL/SQL entries", () => {
    const matched = caseStudies.filter((study) =>
      caseMatchesStackFilter(study, "PostgreSQL"),
    );
    expect(matched.map((study) => study.slug)).toContain(
      "sustentacao-multi-institucional-regras-criticas",
    );
    expect(matched).toHaveLength(6);
  });

  it("matches APIs REST/JSON filter exclusively to apis-rest-sistema-academico", () => {
    const matched = caseStudies.filter((study) =>
      caseMatchesStackFilter(study, "APIs REST/JSON"),
    );
    expect(matched.map((study) => study.slug)).toEqual([
      "apis-rest-sistema-academico",
    ]);
  });

  it("finds all 6 cases and both Java projects for Java (Java EE, Spring Boot)", () => {
    const result = findPortfolioMatchesForSkill(
      "Java (Java EE, Spring Boot)",
      caseStudies,
      publicProjects,
    );
    expect(result.cases).toHaveLength(6);
    expect(result.projects.map((project) => project.name)).toEqual([
      "ProjetoEsigGroup",
      "BotRegistroImoveisBrasil",
    ]);
  });

  it("finds JPA/Hibernate project and Hibernate/JPA cases for Hibernate/JPA", () => {
    const result = findPortfolioMatchesForSkill(
      "Hibernate/JPA",
      caseStudies,
      publicProjects,
    );
    expect(result.projects.map((project) => project.name)).toEqual([
      "ProjetoEsigGroup",
    ]);
    expect(result.cases.map((study) => study.slug)).toEqual([
      "apis-rest-sistema-academico",
      "acervo-marc21-biblioteca-catalogacao",
      "fluxos-pesquisa-extensao-bolsas",
      "sustentacao-multi-institucional-regras-criticas",
    ]);
  });

  it("finds cases with JSF and JSF/JSP for JSF/JSP", () => {
    const result = findPortfolioMatchesForSkill(
      "JSF/JSP",
      caseStudies,
      publicProjects,
    );
    expect(result.cases.map((study) => study.slug)).toEqual([
      "motor-socioeconomico-auxilios",
      "verificacao-digital-diplomas-documentos",
      "acervo-marc21-biblioteca-catalogacao",
      "fluxos-pesquisa-extensao-bolsas",
      "sustentacao-multi-institucional-regras-criticas",
    ]);
    expect(result.projects).toHaveLength(0);
  });

  it("finds BotRegistroImoveisBrasil for Selenium (RPA/testes)", () => {
    const result = findPortfolioMatchesForSkill(
      "Selenium (RPA/testes)",
      caseStudies,
      publicProjects,
    );
    expect(result.cases).toHaveLength(0);
    expect(result.projects.map((project) => project.name)).toEqual([
      "BotRegistroImoveisBrasil",
    ]);
  });
});
