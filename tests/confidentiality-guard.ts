import { createHash } from "node:crypto";
import { expect } from "vitest";

// Opaque SHA-256 digests of normalized institutional and internal product acronyms (never stored in plaintext)
export const BLOCKED_TOKEN_HASHES = new Set<string>([
  "08f5e95cf257b97fc1f684a8d1f462259054b65337f8bfe9d18ac38773c094c9",
  "10434ee067b09f6aacf645307105f4e9ff38aff114d1e4d9d32fb707234543a3",
  "17665df03cb820c8e8e059a8a1f9635613abc7b55b6a000b900e83d9fa7c8b70",
  "1791374161da164a909ea5eeabdc8bbd4047f2cd9b1b1cbc2628ca01c9b16da7",
  "441e4b132dad878cd8865682af4904042a9a3316c1ef62ac7568ec18d4c85e75",
  "803d9bcb176a1d5274fcab356b03005927d350cad8a121b31863413de6d509c3",
  "961f8fe17db122e9e1b2fed6b4fcad0ef4c0a211c1b65f12089ec4e739385507",
  "9b48ebcff8d61cf6134ec5f4fbed37fd27f0b4f63f8cb7f8f8ca16aa1d50da0d",
  "a4f69824203b4e0937f5ef84f2b3a8c552c17c0a98dddaeef3f8a992c2420ee2",
  "ceae92584cb684bd6a87f7794c5eda5f139f655a7032bdf13edb01ddbe2114ac",
  "d510b49b07d14fa02fa636dcf01665606c84981f0660939b5509231bbc487532",
  "d76ef387635c6569d1bcfb264d90666c15cc7c09b728a5ba6d14dbd81b0ff009",
  "e0f509d4e9fa7d4af0ce393983b2895cad93aafbeec98f2aa5e23e1bdec6a2d4",
  "ee3595eb020f36329691245f3f62dcc5f1fde1b7273dd303fb735ab5cd157263",
  "f805dfa034e7258a2ad683270c72196ca460b0090c6e03ded73d89cd241be5b9",
  "fe0179c781dcddad04a9f985f4fdae47594203147ba12f18623698597a6afef4",
]);

export const OS_REFERENCE_REGEX = /\bO\.?S\.?[_ -]?\d{1,4}\b/;
export const INTERNAL_REST_PATH_REGEX = /\/[a-z]+\/rest\//i;

export const FORBIDDEN_PATTERNS: ReadonlyArray<{ label: string; regex: RegExp }> = [
  { label: "Jira ticket key", regex: /\b[A-Z]{2,8}-\d{3,}\b/ },
  { label: "Internal OS reference", regex: OS_REFERENCE_REGEX },
  { label: "Internal corporate domain", regex: /esig\.com\.br/i },
  { label: "Internal GitLab host", regex: /gitlab\./i },
  { label: "Database connection string", regex: /(postgres(ql)?:\/\/|jdbc:)/i },
  { label: "Internal REST path", regex: INTERNAL_REST_PATH_REGEX },
  { label: "Bearer token", regex: /Bearer\s+[A-Za-z0-9._-]{16,}/ },
];

/**
 * Asserts that the provided text contains zero forbidden internal patterns.
 */
export function assertNoForbiddenPatterns(text: string): void {
  for (const { label, regex } of FORBIDDEN_PATTERNS) {
    expect(text, `Forbidden pattern found: ${label}`).not.toMatch(regex);
  }
}

/**
 * Normalizes NFD diacritics and asserts that the provided text contains
 * zero blocked institutional or internal product acronym hashes.
 */
export function assertNoBlockedTokenHashes(text: string): void {
  const normalized = text.normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const tokens = normalized.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  for (const token of tokens) {
    const digest = createHash("sha256").update(token).digest("hex");
    expect(BLOCKED_TOKEN_HASHES.has(digest), "Blocked confidential token detected").toBe(false);
  }
}

/**
 * Asserts that the provided text contains zero forbidden internal patterns
 * and zero blocked institutional or internal product acronym hashes.
 */
export function assertNoConfidentialContent(text: string): void {
  assertNoForbiddenPatterns(text);
  assertNoBlockedTokenHashes(text);
}
