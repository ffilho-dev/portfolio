import type { CaseStudy, PublicProject } from "@/data/types";

export const CASE_STACK_FILTERS = [
  "Todos",
  "Java",
  "PostgreSQL",
  "APIs REST/JSON",
  "JasperReports",
  "Hibernate/JPA",
] as const;

export type CaseStackFilter = (typeof CASE_STACK_FILTERS)[number];

const GENERIC_STOP_TOKENS = new Set([
  "de",
  "da",
  "do",
  "das",
  "dos",
  "e",
  "em",
  "na",
  "no",
  "nas",
  "nos",
  "com",
  "para",
  "por",
  "a",
  "o",
]);

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();
}

function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(/[\s/(),]+/)
    .filter((token) => token.length > 1 && !GENERIC_STOP_TOKENS.has(token));
}

function stackMatchesTokens(
  stack: readonly string[],
  tokens: readonly string[],
): boolean {
  const stackTokens = new Set(stack.flatMap(tokenize));
  return tokens.some((token) => stackTokens.has(token));
}

/**
 * Checks whether a case study satisfies the selected stack filter pill.
 */
export function caseMatchesStackFilter(
  study: CaseStudy,
  filter: CaseStackFilter,
): boolean {
  if (filter === "Todos") {
    return true;
  }

  const normalizedFilter = normalizeText(filter);
  return study.stack.some((entry) =>
    normalizeText(entry).includes(normalizedFilter),
  );
}

/**
 * Finds case studies and public projects whose stack entries share normalized tokens with a skill label.
 */
export function findPortfolioMatchesForSkill(
  skillLabel: string,
  cases: readonly CaseStudy[],
  projects: readonly PublicProject[],
): { cases: readonly CaseStudy[]; projects: readonly PublicProject[] } {
  const tokens = tokenize(skillLabel);
  if (tokens.length === 0) {
    return { cases: [], projects: [] };
  }

  return {
    cases: cases.filter((study) => stackMatchesTokens(study.stack, tokens)),
    projects: projects.filter((project) =>
      stackMatchesTokens(project.stack, tokens),
    ),
  };
}
