import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";
import { caseStudies } from "@/data/cases";
import { publicProjects } from "@/data/projects";
import { aiPillars, skillGroups } from "@/data/skills";
import {
  assertNoBlockedTokenHashes,
  assertNoForbiddenPatterns,
  INTERNAL_REST_PATH_REGEX,
  OS_REFERENCE_REGEX,
} from "./confidentiality-guard";

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectStrings);
  }
  return [];
}

describe("NDA and confidentiality guard", () => {
  const allText = collectStrings({ profile, caseStudies, publicProjects, skillGroups, aiPillars }).join("\n");

  it("matches zero forbidden internal patterns", () => {
    assertNoForbiddenPatterns(allText);
  });

  it("contains zero blocked institutional acronym hashes after NFD normalization", () => {
    assertNoBlockedTokenHashes(allText);
  });

  it("avoids Portuguese false positives on OS guard while catching real references and generic REST paths", () => {
    expect("os 4 estudos").not.toMatch(OS_REFERENCE_REGEX);
    expect("os 12 meses").not.toMatch(OS_REFERENCE_REGEX);
    expect("OS_144").toMatch(OS_REFERENCE_REGEX);
    expect("OS 144").toMatch(OS_REFERENCE_REGEX);
    expect("O.S. 12").toMatch(OS_REFERENCE_REGEX);
    expect("/modulo/rest/endpoint").toMatch(INTERNAL_REST_PATH_REGEX);
    expect("(/modulo/validar_acao_interna)").toMatch(INTERNAL_REST_PATH_REGEX);
  });
});
