# Portfólio Francisco Fernandes (`ffilho-dev`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o portfólio profissional em português de Francisco Fernandes (`ffilho-dev`) — um dossiê linear rápido, acessível e estático na Vercel centrado em 4 estudos de caso reais de produção (anonimizados), 4 projetos públicos curados, práticas concretas de engenharia com IA, currículo web e PDF vetorial ATS-friendly gerado automaticamente em build time.

**Architecture:** Aplicação Next.js App Router totalmente estática (SSG, sem banco de dados nem CMS) apoiada em uma camada única de dados tipados em `src/data/*.ts` que alimenta a home (`/`), as páginas de detalhe dos cases (`/cases/[slug]`), o currículo web imprimível (`/curriculo`) e o gerador de PDF estático (`/curriculo.pdf` via `pdf-lib`). O sistema visual implementa a Estrutura 1 (Dossiê Linear) com suporte nativo a tema Claro (branco mineral + petróleo) e Escuro (ardósia + âmbar) via `color-scheme: light dark`, `light-dark()` com fallback `@media (prefers-color-scheme: dark)` e override sem FOUC via `<meta name="color-scheme">`.

**Tech Stack:** Next.js (App Router, última estável), React 19, TypeScript (`strict: true`), Tailwind CSS v4, `pdf-lib`, Vitest, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, ESLint, Node.js 24 (`npm`).

**Spec:** `docs/superpowers/specs/2026-11-20-portfolio-design.md`

## Global Constraints

- **Idioma e público:** 100% PT-BR, mercado brasileiro, visando vagas FullStack (sem i18n, sem foto pessoal no site ou currículo).
- **Diretório e autoria Git:** Repositório em `/home/franciscofilho/Projects/portfolio` com autoria local `Francisco Filho <fcofilho0809@gmail.com>` (nunca usar e-mail corporativo nos commits).
- **Confidencialidade/NDA:** Zero nomes ou siglas de instituições clientes da ESIG, zero números de OS/chamado, zero URLs/credenciais internas e zero siglas internas de produtos em texto claro no código, dados, testes, PDF ou histórico Git.
- **Tokens de cor exatos (WCAG AA/AAA):**
  - Claro (Opção A): `--bg: #F7F8FA`, `--surface: #FFFFFF`, `--ink: #0F172A`, `--muted: #334155`, `--border: #64748B`, `--rule: #CBD5E1`, `--accent: #0F4C5C`, `--accent-ink: #FFFFFF`.
  - Escuro (Opção C): `--bg: #161B22`, `--surface: #1F2630`, `--ink: #F8FAFC`, `--muted: #CBD5E1`, `--border: #6E7F94`, `--rule: #3B4654`, `--accent: #E09F3E`, `--accent-ink: #161B22`.
- **Tipografia e anti-padrões (`frontend-design` + `web-design-guidelines`):** `Plus Jakarta Sans` (principal) e `IBM Plex Mono` (restrita a diagramas, rotas e números tabulares); prosa `<= 68ch`; `text-wrap: balance` em títulos; `tabular-nums` em números; aspas tipográficas (`“”`) e reticências (`…`); **proibido** rótulos em CAIXA ALTA acima de títulos, numeração falsa (`01 / 02`), cadeias `A · B · C` decorativas, `→` em botões/links, barrinhas de porcentagem de skill, `transition: all` e `100vw`.
- **Padrões modernos da web (`modern-web-guidance`):** `<meta name="color-scheme" content="light dark">` + script inline síncrono anti-FOUC, `color-scheme: light dark` em `:root`, `light-dark()` com fallback `@media (prefers-color-scheme: dark)`, `overflow: clip`, propriedades lógicas de CSS, `@media (forced-colors: active)`, `@media (prefers-reduced-motion: reduce)`, `:focus-visible`, skip link e HTML semântico.
- **Fidelidade factual:** Nenhum percentual ou métrica de performance inventada; apenas os fatos verificados na Seção 6 do spec.

## Review Focus

1. **Slug inválido em `/cases/[slug]`** (ex.: link digitado errado pelo recrutador): deve invocar `notFound()` (HTTP 404), nunca renderizar casca vazia ou lançar exceção — coberto em `tests/case-page.test.tsx` (Task 5).
2. **`localStorage` bloqueado lançando `SecurityError`** (navegador corporativo restrito / aba anônima endurecida): tanto o script anti-FOUC quanto o `ThemeToggle` devem capturar o erro e ainda aplicar a troca visual em `<meta name="color-scheme">` sem erro não tratado — coberto em `tests/theme.test.ts` e `tests/ThemeToggle.test.tsx` (Task 3).
3. **`navigator.clipboard` indisponível ou rejeitado** ao clicar em `Copiar e-mail`: `CopyEmailButton` deve degradar graciosamente exibindo mensagem honesta em `aria-live="polite"` (sem mentir “Copiado!” nem gerar unhandled rejection) — coberto em `tests/CopyEmailButton.test.tsx` (Task 4).
4. **Caracteres Unicode/português em `pdf-lib` (`/curriculo.pdf`)**: `StandardFonts.Helvetica` usa WinAnsi e lança erro em símbolos fora de WinAnsi (como `→` ou `↳`); o gerador deve sanitizar/mapear qualquer caractere incompatível e gerar PDF válido com 100% dos dados reais de `src/data/` — coberto em `tests/pdf.test.ts` (Task 6).
5. **Vazamento acidental de termo confidencial/NDA ou padrão interno** nos dados, na renderização ou no texto extraído do PDF: deve falhar nos testes automatizados usando regexes + blocklist em SHA-256 (sem nunca gravar siglas de clientes em texto claro nos testes) — coberto em `tests/confidentiality.test.ts` (Task 2) e `tests/pdf.test.ts` (Task 6).

## File Structure

- **Configuração e guia do projeto:** `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `eslint.config.mjs`, `.gitignore`, `AGENTS.md`
- **Utilitários puros (`src/lib/`):**
  - `src/lib/site.ts` — resolução da URL canônica (`NEXT_PUBLIC_SITE_URL` → `VERCEL_URL` → `http://localhost:3000`)
  - `src/lib/theme.ts` — estado de 2 opções do tema (`light dark` | `light` | `dark`), sincronização com `<meta name="color-scheme">`, acesso resiliente ao `localStorage` e snippet inline anti-FOUC
  - `src/lib/pdf.ts` — gerador puro de PDF A4 ATS-friendly com `pdf-lib` a partir de `src/data/*` (inclui sanitização WinAnsi)
- **Camada de dados tipados (`src/data/`):**
  - `src/data/types.ts` — interfaces TypeScript estritas do domínio
  - `src/data/profile.ts` — dados de Francisco Fernandes, disponibilidade, contatos, métricas, 5 experiências, formação UFERSA (2027), idioma e certificações (incluindo `curso.dev` 81h + 16 módulos)
  - `src/data/cases.ts` — os 4 estudos de caso anonimizados com nós de fluxo para os diagramas SVG
  - `src/data/projects.ts` — os 4 projetos públicos selecionados
  - `src/data/skills.ts` — 3 grupos de stack + 3 pilares práticos de engenharia com IA
- **Shell, estilos e componentes (`src/app/`, `src/components/`):**
  - `src/app/globals.css` — Tailwind v4, tokens Claro/Escuro, mapeamento `:root:has(> head > meta[name="color-scheme"]...)`, `forced-colors`, `prefers-reduced-motion` e `@media print`
  - `src/app/layout.tsx` — fontes (`Plus Jakarta Sans` + `IBM Plex Mono`), `<meta name="color-scheme">`, script anti-FOUC, skip link, header/footer e metadata base
  - `src/components/SiteHeader.tsx`, `src/components/ThemeToggle.tsx`, `src/components/SiteFooter.tsx`
  - `src/components/CaseDiagram.tsx` — diagrama arquitetural SVG acessível (`variant="compact" | "expanded"`)
  - `src/components/CopyEmailButton.tsx` — botão copiar e-mail com `aria-live="polite"` e fallback
  - `src/components/PrintButton.tsx` — botão `Imprimir` para `/curriculo`
- **Rotas estáticas (`src/app/`):**
  - `src/app/page.tsx` — Dossiê principal (Estrutura 1 — Opção A simplificada)
  - `src/app/cases/[slug]/page.tsx` — Estudo de caso aprofundado (`generateStaticParams`, `generateMetadata`, `notFound()`)
  - `src/app/curriculo/page.tsx` — Currículo web e imprimível A4
  - `src/app/curriculo.pdf/route.ts` — Route Handler estático (`force-static`) servindo `curriculo-francisco-fernandes.pdf`
  - `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx`
- **Testes (`tests/`):** `site.test.ts`, `data-integrity.test.ts`, `confidentiality.test.ts`, `theme.test.ts`, `ThemeToggle.test.tsx`, `CopyEmailButton.test.tsx`, `home.test.tsx`, `case-page.test.tsx`, `pdf.test.ts`, `curriculo.test.tsx`

---

### Task 1: Project Scaffold, Tooling & Canonical Site URL Helper

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `eslint.config.mjs`, `.gitignore`, `AGENTS.md`
- Create: `src/lib/site.ts`
- Test: `tests/site.test.ts`

**Interfaces:**
- Consumes: none
- Produces:
  - `getSiteUrl(env?: Record<string, string | undefined>): string` in `src/lib/site.ts`
  - `npm` scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `test`

- [ ] **Step 1: Scaffold base config, install dependencies, and write `AGENTS.md`**

Initialize the Next.js App Router + TypeScript strict + Tailwind CSS v4 + `pdf-lib` + Vitest + Testing Library setup in `/home/franciscofilho/Projects/portfolio`:
- Dependencies: `next`, `react`, `react-dom`, `pdf-lib`
- DevDependencies: `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `tailwindcss`, `@tailwindcss/postcss`, `eslint`, `eslint-config-next`, `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`
- Configure `tsconfig.json` with `"strict": true` and `"@/*": ["./src/*"]`, `vitest.config.ts` with `environment: "jsdom"`, alias `@` → `./src`, `setupFiles: ["./vitest.setup.ts"]`, and `AGENTS.md` documenting project rules (PT-BR, NDA rule, `frontend-design` & `modern-web-guidance` constraints, repo-local git email).
- Configure `.gitignore` excluding `node_modules`, `.next`, `out`, `coverage`, `.env*`, `.superpowers/`.

- [ ] **Step 2: Write the failing test in `tests/site.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { getSiteUrl } from "@/lib/site";

describe("getSiteUrl", () => {
  it("uses NEXT_PUBLIC_SITE_URL and strips trailing slash", () => {
    expect(getSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://ffilho.dev/" })).toBe(
      "https://ffilho.dev",
    );
  });

  it("prefixes VERCEL_URL with https when NEXT_PUBLIC_SITE_URL is unset", () => {
    expect(getSiteUrl({ VERCEL_URL: "portfolio-ffilho.vercel.app" })).toBe(
      "https://portfolio-ffilho.vercel.app",
    );
  });

  it("falls back to http://localhost:3000 when no env var is set", () => {
    expect(getSiteUrl({})).toBe("http://localhost:3000");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run tests/site.test.ts`
Expected: FAIL with module not found (`@/lib/site`).

- [ ] **Step 4: Implement `getSiteUrl(env?: Record<string, string | undefined>): string` in `src/lib/site.ts`**

Resolve `NEXT_PUBLIC_SITE_URL` first (trimming whitespace and trailing `/`), then `VERCEL_URL` prefixed with `https://` unless it already starts with `http`, falling back to `http://localhost:3000`. Default parameter `env = process.env`.

- [ ] **Step 5: Run tests and typecheck to verify they pass**

Run: `npm run test -- tests/site.test.ts && npm run typecheck`
Expected: PASS (3 tests passing, 0 TypeScript errors).

- [ ] **Step 6: Commit**

```bash
git add .gitignore AGENTS.md package.json package-lock.json next.config.ts tsconfig.json postcss.config.mjs vitest.config.ts vitest.setup.ts eslint.config.mjs src/lib/site.ts tests/site.test.ts
git commit -m "chore: scaffold Next.js portfolio with Vitest, Tailwind v4 and site URL helper"
```

---

### Task 2: Typed Content Layer & Confidentiality/NDA Guard

**Files:**
- Create: `src/data/types.ts`
- Create: `src/data/profile.ts`
- Create: `src/data/cases.ts`
- Create: `src/data/projects.ts`
- Create: `src/data/skills.ts`
- Test: `tests/data-integrity.test.ts`
- Test: `tests/confidentiality.test.ts`

**Interfaces:**
- Consumes: none
- Produces:
  - Types in `src/data/types.ts`: `Profile`, `MetricItem`, `ExperienceItem`, `EducationItem`, `CertificationItem`, `DiagramNode`, `CaseStudy`, `PublicProject`, `SkillGroup`, `AiPillar`
  - Exports: `profile` (`src/data/profile.ts`), `caseStudies` and `getCaseStudyBySlug(slug: string): CaseStudy | undefined` (`src/data/cases.ts`), `publicProjects` (`src/data/projects.ts`), `skillGroups` and `aiPillars` (`src/data/skills.ts`)

- [ ] **Step 1: Write the failing tests in `tests/data-integrity.test.ts` and `tests/confidentiality.test.ts`**

`tests/data-integrity.test.ts`:
```ts
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
```

`tests/confidentiality.test.ts`:
```ts
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { profile } from "@/data/profile";
import { caseStudies } from "@/data/cases";
import { publicProjects } from "@/data/projects";
import { aiPillars, skillGroups } from "@/data/skills";

// Opaque SHA-256 digests of normalized institutional acronyms (never stored in plaintext)
const BLOCKED_TOKEN_HASHES = new Set<string>([
  "10434ee067b09f6aacf645307105f4e9ff38aff114d1e4d9d32fb707234543a3",
  "17665df03cb820c8e8e059a8a1f9635613abc7b55b6a000b900e83d9fa7c8b70",
  "1791374161da164a909ea5eeabdc8bbd4047f2cd9b1b1cbc2628ca01c9b16da7",
  "441e4b132dad878cd8865682af4904042a9a3316c1ef62ac7568ec18d4c85e75",
  "803d9bcb176a1d5274fcab356b03005927d350cad8a121b31863413de6d509c3",
  "9b48ebcff8d61cf6134ec5f4fbed37fd27f0b4f63f8cb7f8f8ca16aa1d50da0d",
  "a4f69824203b4e0937f5ef84f2b3a8c552c17c0a98dddaeef3f8a992c2420ee2",
  "ceae92584cb684bd6a87f7794c5eda5f139f655a7032bdf13edb01ddbe2114ac",
  "d510b49b07d14fa02fa636dcf01665606c84981f0660939b5509231bbc487532",
  "e0f509d4e9fa7d4af0ce393983b2895cad93aafbeec98f2aa5e23e1bdec6a2d4",
  "ee3595eb020f36329691245f3f62dcc5f1fde1b7273dd303fb735ab5cd157263",
  "f805dfa034e7258a2ad683270c72196ca460b0090c6e03ded73d89cd241be5b9",
  "fe0179c781dcddad04a9f985f4fdae47594203147ba12f18623698597a6afef4",
]);

const FORBIDDEN_PATTERNS: ReadonlyArray<{ label: string; regex: RegExp }> = [
  { label: "Jira ticket key", regex: /\b[A-Z]{2,8}-\d{3,}\b/ },
  { label: "Internal OS reference", regex: /\bOS[_ -]?\d{1,4}\b/i },
  { label: "Internal corporate domain", regex: /esig\.com\.br/i },
  { label: "Internal GitLab host", regex: /gitlab\./i },
  { label: "Database connection string", regex: /(postgres(ql)?:\/\/|jdbc:)/i },
  { label: "Internal REST path", regex: /\/[a-z]+\/rest\//i },
  // Siglas internas de produtos são verificadas exclusivamente via hashes SHA-256 em BLOCKED_TOKEN_HASHES
  { label: "Bearer token", regex: /Bearer\s+[A-Za-z0-9._-]{16,}/ },
];

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
    for (const { label, regex } of FORBIDDEN_PATTERNS) {
      expect(allText, `Forbidden pattern found: ${label}`).not.toMatch(regex);
    }
  });

  it("contains zero blocked institutional acronym hashes", () => {
    const tokens = allText.toLowerCase().match(/[a-z0-9]+/g) ?? [];
    for (const token of tokens) {
      const digest = createHash("sha256").update(token).digest("hex");
      expect(BLOCKED_TOKEN_HASHES.has(digest), "Blocked confidential token detected").toBe(false);
    }
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/data-integrity.test.ts tests/confidentiality.test.ts`
Expected: FAIL with module not found (`@/data/profile`, etc.).

- [ ] **Step 3: Implement `src/data/{types,profile,cases,projects,skills}.ts`**

- Author `src/data/types.ts` with clean readonly TypeScript interfaces matching the consumed properties above (`DiagramNode` has `{ label: string; detail: string }`).
- Populate `src/data/profile.ts`, `src/data/cases.ts`, `src/data/projects.ts`, and `src/data/skills.ts` strictly from Section 6 of `docs/superpowers/specs/2026-11-20-portfolio-design.md` (all 4 case slugs: `motor-socioeconomico-auxilios`, `apis-rest-sistema-academico`, `verificacao-digital-diplomas-documentos`, `sustentacao-multi-institucional-regras-criticas`; 4 public projects with live URL `https://clone-tabnews-gamma-wheat.vercel.app` and legacy flag on `ProjetoEsigGroup` and `BotRegistroImoveisBrasil`; full 5 experiences and verifiable `curso.dev` certificate with 16 modules).
- Use curly Portuguese quotes (`“”`) and real ellipsis (`…`) if needed; zero ALL-CAPS decorative tags, zero invented percentages, zero confidential client names.

- [ ] **Step 4: Run tests and typecheck to verify they pass**

Run: `npm run test -- tests/data-integrity.test.ts tests/confidentiality.test.ts && npm run typecheck`
Expected: PASS (all data integrity & NDA checks green).

- [ ] **Step 5: Commit**

```bash
git add src/data/ tests/data-integrity.test.ts tests/confidentiality.test.ts
git commit -m "feat: add typed portfolio content layer and NDA confidentiality guard tests"
```

---

### Task 3: Design System, Dual Theme (Claro A / Escuro C) & Root Layout Shell

**Files:**
- Create: `src/lib/theme.ts`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/components/ThemeToggle.tsx`
- Create: `src/components/SiteHeader.tsx`
- Create: `src/components/SiteFooter.tsx`
- Test: `tests/theme.test.ts`
- Test: `tests/ThemeToggle.test.tsx`

**Interfaces:**
- Consumes: `getSiteUrl` (`src/lib/site.ts`), `profile` (`src/data/profile.ts`)
- Produces:
  - `ColorSchemePreference = "light" | "dark"` and `MetaColorScheme = "light dark" | "light" | "dark"` in `src/lib/theme.ts`
  - `THEME_STORAGE_KEY = "color-scheme"`, `THEME_INIT_SCRIPT: string`, `readStoredScheme(storage?: Storage): ColorSchemePreference | null`, `getResolvedScheme(stored: ColorSchemePreference | null, systemPrefersDark: boolean): ColorSchemePreference`, `computeNextStoredScheme(stored: ColorSchemePreference | null, systemPrefersDark: boolean): ColorSchemePreference | null`, `applySchemeToDocument(stored: ColorSchemePreference | null, doc?: Document): void` in `src/lib/theme.ts`
  - Components: `ThemeToggle`, `SiteHeader`, `SiteFooter`

- [ ] **Step 1: Write failing tests in `tests/theme.test.ts` and `tests/ThemeToggle.test.tsx`**

`tests/theme.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import {
  THEME_INIT_SCRIPT,
  applySchemeToDocument,
  computeNextStoredScheme,
  getResolvedScheme,
  readStoredScheme,
} from "@/lib/theme";

describe("two-state color scheme logic", () => {
  it("resolves to system preference when nothing is stored", () => {
    expect(getResolvedScheme(null, false)).toBe("light");
    expect(getResolvedScheme(null, true)).toBe("dark");
  });

  it("stores literal opposite when toggling from system default and clears when returning to system", () => {
    // OS light -> toggle -> store "dark"
    expect(computeNextStoredScheme(null, false)).toBe("dark");
    // OS light, stored "dark" -> toggle -> target "light" matches OS -> clear (null)
    expect(computeNextStoredScheme("dark", false)).toBeNull();
    // OS dark -> toggle -> store "light"
    expect(computeNextStoredScheme(null, true)).toBe("light");
    // OS switched to dark while stored is "dark" -> toggle -> target "light" differs from OS -> store "light"
    expect(computeNextStoredScheme("dark", true)).toBe("light");
  });

  it("degrades safely when storage throws SecurityError", () => {
    const brokenStorage = {
      getItem: () => {
        throw new DOMException("Blocked", "SecurityError");
      },
    } as unknown as Storage;
    expect(readStoredScheme(brokenStorage)).toBeNull();
  });

  it("updates meta[name=color-scheme] content cleanly", () => {
    const meta = document.createElement("meta");
    meta.name = "color-scheme";
    meta.content = "light dark";
    document.head.appendChild(meta);
    applySchemeToDocument("dark", document);
    expect(meta.content).toBe("dark");
    applySchemeToDocument(null, document);
    expect(meta.content).toBe("light dark");
    meta.remove();
  });

  it("wraps localStorage access in try/catch inside THEME_INIT_SCRIPT", () => {
    expect(THEME_INIT_SCRIPT).toContain("try");
    expect(THEME_INIT_SCRIPT).toContain('meta[name="color-scheme"]');
  });
});
```

`tests/ThemeToggle.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "@/components/ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.head.innerHTML = '<meta name="color-scheme" content="light dark">';
    localStorage.clear();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
  });

  it("toggles meta color-scheme and persists override", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /alternar para tema escuro/i });
    await user.click(button);
    const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
    expect(meta?.content).toBe("dark");
    expect(localStorage.getItem("color-scheme")).toBe("dark");
  });

  it("still applies visual override to meta when localStorage.setItem throws", async () => {
    const user = userEvent.setup();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Blocked", "SecurityError");
    });
    render(<ThemeToggle />);
    const button = screen.getByRole("button");
    await user.click(button);
    const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
    expect(meta?.content).toBe("dark");
    vi.restoreAllMocks();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/theme.test.ts tests/ThemeToggle.test.tsx`
Expected: FAIL with module not found (`@/lib/theme`, `@/components/ThemeToggle`).

- [ ] **Step 3: Implement `src/lib/theme.ts`, `src/app/globals.css`, `src/app/layout.tsx`, `SiteHeader`, `ThemeToggle`, and `SiteFooter`**

- `src/lib/theme.ts`: Implement the exact two-state algorithm from `modern-web-guidance`'s `dark-mode-toggle` guide (syncing `<meta name="color-scheme">` and `localStorage`, wrapped in `try/catch`).
- `src/app/globals.css`:
  - Import Tailwind CSS v4 (`@import "tailwindcss";`).
  - Define raw light and dark custom properties matching the exact verified WCAG hex tokens in Global Constraints (`#F7F8FA`/`#FFFFFF`/`#0F172A`/`#334155`/`#64748B`/`#CBD5E1`/`#0F4C5C`/`#FFFFFF` and `#161B22`/`#1F2630`/`#F8FAFC`/`#CBD5E1`/`#6E7F94`/`#3B4654`/`#E09F3E`/`#161B22`).
  - Declare `color-scheme: light dark` on `:root`, map `<meta name="color-scheme">` overrides via `:root:has(> head > meta[name="color-scheme"][content="dark"])` and `[content="light"]`, provide fallback `@media (prefers-color-scheme: dark)` + `@supports (color: light-dark(white, black))` using `light-dark()`.
  - Include `:focus-visible` ring (2px solid `var(--accent)`, offset 2px), `scroll-margin-top` on section headings, `font-variant-numeric: tabular-nums` helper, `@media (forced-colors: active)`, `@media (prefers-reduced-motion: reduce)`, and complete `@media print` A4 rules (hiding `.no-print`, forcing `#FFFFFF` background and `#111111` ink, `break-inside: avoid` on sections/entries).
- `src/app/layout.tsx`:
  - Load `Plus_Jakarta_Sans` (`--font-sans`, weights 400–800) and `IBM_Plex_Mono` (`--font-mono`, weights 400–500) via `next/font/google`.
  - Render `<html lang="pt-BR" className={`${plusJakarta.variable} ${ibmPlexMono.variable}`}>` with `<meta name="color-scheme" content="light dark">` followed immediately by the synchronous inline `<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />`.
  - Include accessible skip link (`Pular para o conteúdo`) targeting `#conteudo`, `SiteHeader`, `<main id="conteudo">`, and `SiteFooter`.
  - Export complete Next.js `Metadata` (`metadataBase: new URL(getSiteUrl())`, Portuguese title/description, OpenGraph, `robots`).
- `src/components/ThemeToggle.tsx`: Client component syncing with `matchMedia("(prefers-color-scheme: dark)")` `change` event and `window` `storage` event; never clears stored preference when OS changes to match; explicit CSS transitions (no `transition: all`).
- `src/components/SiteHeader.tsx` & `src/components/SiteFooter.tsx`: Clean architectural hairline header (`ffilho-dev`, links `Cases`, `IA no fluxo`, `Projetos`, `Trajetória`, `Currículo`, and `ThemeToggle` — no ALL-CAPS labels, no middle-dot spam) and sober footer with direct links. Both carry `no-print` class so `/curriculo` prints cleanly.

- [ ] **Step 4: Run tests and typecheck to verify they pass**

Run: `npm run test -- tests/theme.test.ts tests/ThemeToggle.test.tsx && npm run typecheck`
Expected: PASS (all theme & ThemeToggle tests green, 0 TS errors).

- [ ] **Step 5: Commit**

```bash
git add src/lib/theme.ts src/app/globals.css src/app/layout.tsx src/components/ThemeToggle.tsx src/components/SiteHeader.tsx src/components/SiteFooter.tsx tests/theme.test.ts tests/ThemeToggle.test.tsx
git commit -m "feat: add dual light/dark design system, anti-FOUC theme toggle and root shell"
```

---

### Task 4: Home Dossier (`/`), Inline Architectural SVG Diagrams & Direct Contact

**Files:**
- Create: `src/components/CaseDiagram.tsx`
- Create: `src/components/CopyEmailButton.tsx`
- Create: `src/app/page.tsx`
- Test: `tests/CopyEmailButton.test.tsx`
- Test: `tests/home.test.tsx`

**Interfaces:**
- Consumes: `profile` (`src/data/profile.ts`), `caseStudies` (`src/data/cases.ts`), `publicProjects` (`src/data/projects.ts`), `skillGroups` & `aiPillars` (`src/data/skills.ts`), `DiagramNode` (`src/data/types.ts`)
- Produces:
  - `CaseDiagram({ title, nodes, variant }: { title: string; nodes: readonly DiagramNode[]; variant: "compact" | "expanded" })` in `src/components/CaseDiagram.tsx`
  - `CopyEmailButton({ email }: { email: string })` in `src/components/CopyEmailButton.tsx`
  - Default export `HomePage` in `src/app/page.tsx`

- [ ] **Step 1: Write failing tests in `tests/CopyEmailButton.test.tsx` and `tests/home.test.tsx`**

`tests/CopyEmailButton.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CopyEmailButton } from "@/components/CopyEmailButton";

describe("CopyEmailButton", () => {
  it("copies email and announces confirmation politely", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    const user = userEvent.setup();
    render(<CopyEmailButton email="fcofilho0809@gmail.com" />);
    await user.click(screen.getByRole("button", { name: /copiar e-mail/i }));
    expect(writeText).toHaveBeenCalledWith("fcofilho0809@gmail.com");
    expect(screen.getByRole("status")).toHaveTextContent(/copiado/i);
  });

  it("handles clipboard rejection honestly without unhandled error", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) },
      configurable: true,
    });
    const user = userEvent.setup();
    render(<CopyEmailButton email="fcofilho0809@gmail.com" />);
    await user.click(screen.getByRole("button", { name: /copiar e-mail/i }));
    expect(screen.getByRole("status")).toHaveTextContent(/não foi possível copiar/i);
  });
});
```

`tests/home.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders lean hero, 3 metrics, 4 production cases with SVG diagrams, AI workflow, 4 projects, trajectory, certificate, and direct contact", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1, name: "Francisco Fernandes" })).toBeInTheDocument();
    expect(screen.getByText(/Desenvolvedor FullStack/i)).toBeInTheDocument();
    expect(screen.getByText(/presencial/i)).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(4);
    expect(screen.getAllByRole("link", { name: /ler estudo de caso/i })).toHaveLength(4);
    expect(screen.getByRole("link", { name: /baixar currículo/i })).toHaveAttribute("href", "/curriculo.pdf");
    expect(screen.getByRole("link", { name: /whatsapp/i })).toHaveAttribute("href", "https://wa.me/5584994980792");
    expect(screen.getByText(/curso\.dev/i)).toBeInTheDocument();
    expect(screen.getByText(/ProjetoEsigGroup/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/CopyEmailButton.test.tsx tests/home.test.tsx`
Expected: FAIL with module not found.

- [ ] **Step 3: Implement `CaseDiagram.tsx`, `CopyEmailButton.tsx`, and `src/app/page.tsx`**

- `src/components/CaseDiagram.tsx`: Pure inline SVG schematic rendering the ordered flow of `DiagramNode[]` using theme tokens (`var(--surface)`, `var(--border)`, `var(--ink)`, `var(--muted)`, `var(--accent)`), `IBM Plex Mono` for node labels, `role="img"`, and descriptive `aria-label` (`Fluxo arquitetural de ${title}: ${nodes.map(n => n.label).join(", ")}`). Supports `variant="compact"` (stacked flow box for Home rows) and `variant="expanded"` (wider multi-step schematic with step details for `/cases/[slug]`). Zero decorative arrows in buttons; connectors live strictly inside the schematic SVG.
- `src/components/CopyEmailButton.tsx`: Client button calling `navigator.clipboard?.writeText(email)` inside `try/catch`, updating `<span role="status" aria-live="polite">` with `"E-mail copiado"` on success or `"Não foi possível copiar automaticamente — use o link de e-mail"` on failure.
- `src/app/page.tsx`: Server Component implementing **Estrutura 1 — Dossiê Linear (Opção A simplificada)** from the spec:
  - Lean Hero: `<h1>Francisco Fernandes</h1>`, subtitle `Desenvolvedor FullStack`, location & presencial/relocation availability line, concise bio (`<= 68ch`), primary actions (`WhatsApp`, `Baixar currículo (PDF)` → `/curriculo.pdf`, `Ver currículo` → `/curriculo`). Zero portrait photo, zero long marketing slogan.
  - 3 real footprint metrics strip (`tabular-nums`).
  - Section `#cases`: 4 anonymized production cases separated by hairline `--rule` dividers (no identical rounded SaaS card boxes, no fake `01/02` numbers, no ALL-CAPS eyebrows), each showing summary, stack text, link `Ler estudo de caso` (`/cases/[slug]`), and `<CaseDiagram variant="compact" />` beside it on desktop.
  - Section `#ia`: 3 concrete engineering blocks on AI workflow (`AGENTS.md`, Skills, MCPs, stateless/context-window/non-determinism awareness).
  - Section `#projetos`: 4 curated public projects with clean links (`Live` for `clone-tabnews`, `Código` for all 4, discrete `Conta anterior` note on the 2 `FrankBROFC` repos).
  - Section `#stack`: 3 categorized skill groups (plain structured typography, zero progress bars or badge clouds).
  - Section `#trajetoria`: 5 career entries in chronological order (ESIG, Quark, Turing — Presidente & Dev, Yank, Salinor), UFERSA education (previsão 2027), and compact highlight of the verifiable `curso.dev` certificate (81h, 16 modules, external verify link).
  - Section `#contato`: Direct links for WhatsApp `(84) 99498-0792`, Email (`mailto:fcofilho0809@gmail.com` + `<CopyEmailButton />`), LinkedIn, and GitHub (`ffilho-dev`).

- [ ] **Step 4: Run tests and typecheck to verify they pass**

Run: `npm run test -- tests/CopyEmailButton.test.tsx tests/home.test.tsx && npm run typecheck`
Expected: PASS (all home & clipboard tests green).

- [ ] **Step 5: Commit**

```bash
git add src/components/CaseDiagram.tsx src/components/CopyEmailButton.tsx src/app/page.tsx tests/CopyEmailButton.test.tsx tests/home.test.tsx
git commit -m "feat: build linear dossier homepage with inline SVG case diagrams and direct contact"
```

---

### Task 5: Case Study Deep-Dive Pages (`/cases/[slug]`) & SEO/OpenGraph

**Files:**
- Create: `src/app/cases/[slug]/page.tsx`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Create: `src/app/opengraph-image.tsx`
- Test: `tests/case-page.test.tsx`

**Interfaces:**
- Consumes: `caseStudies`, `getCaseStudyBySlug` (`src/data/cases.ts`), `CaseDiagram` (`src/components/CaseDiagram.tsx`), `getSiteUrl` (`src/lib/site.ts`), `profile` (`src/data/profile.ts`)
- Produces:
  - Static routes `/cases/[slug]` (`generateStaticParams`, `generateMetadata`, default `CaseStudyPage`)
  - Static metadata routes `/sitemap.xml`, `/robots.txt`, `/opengraph-image`

- [ ] **Step 1: Write failing tests in `tests/case-page.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CaseStudyPage, { generateMetadata, generateStaticParams } from "@/app/cases/[slug]/page";
import sitemap from "@/app/sitemap";

const notFoundMock = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});

vi.mock("next/navigation", () => ({
  notFound: () => notFoundMock(),
}));

describe("CaseStudyPage", () => {
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
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /problema real/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /restrições e contexto operacional/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /solução e decisões técnicas/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /resultado prático/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /voltar para cases/i })).toHaveAttribute("href", "/#cases");
  });

  it("calls notFound() for unknown slugs", async () => {
    await expect(
      CaseStudyPage({ params: Promise.resolve({ slug: "inexistente" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFoundMock).toHaveBeenCalled();
  });

  it("generates metadata for valid slug and includes all routes in sitemap", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "apis-rest-sistema-academico" }),
    });
    expect(meta.title).toContain("APIs REST");
    const entries = sitemap();
    expect(entries.length).toBeGreaterThanOrEqual(6);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/case-page.test.tsx`
Expected: FAIL with module not found.

- [ ] **Step 3: Implement `/cases/[slug]/page.tsx`, `sitemap.ts`, `robots.ts`, and `opengraph-image.tsx`**

- `src/app/cases/[slug]/page.tsx`:
  - `generateStaticParams()` returns `{ slug }` for all 4 items in `caseStudies`.
  - `generateMetadata({ params })` resolves the slug (awaiting `params` per Next.js 15/16 async params API) and returns specific title/description.
  - Default page calls `notFound()` when `getCaseStudyBySlug(slug)` is undefined; otherwise renders breadcrumb (`Voltar para cases` → `/#cases`), `<h1>`, summary, structured metadata list (`Contexto`, `Período`, `Papel`, `Stack`), `<CaseDiagram variant="expanded" />`, the 4 factual headings (`Problema real`, `Restrições e contexto operacional`, `Solução e decisões técnicas`, `Resultado prático`), and a clean footer link to the next case study (wrapping around) plus CTA to `/curriculo`.
- `src/app/sitemap.ts` & `src/app/robots.ts`: Use `getSiteUrl()` to enumerate `/`, `/curriculo`, and all 4 `/cases/[slug]` routes cleanly.
- `src/app/opengraph-image.tsx`: Crisp 1200×630 `ImageResponse` using Option A's mineral + petrol palette (`#F7F8FA`, `#0F172A`, `#0F4C5C`), rendering `Francisco Fernandes`, `Desenvolvedor FullStack`, and factual highlights (`Java · PostgreSQL · React · Next.js · IA`) for clean LinkedIn/WhatsApp link previews.

- [ ] **Step 4: Run tests and typecheck to verify they pass**

Run: `npm run test -- tests/case-page.test.tsx && npm run typecheck`
Expected: PASS (4 tests passing, 0 TS errors).

- [ ] **Step 5: Commit**

```bash
git add src/app/cases/ src/app/sitemap.ts src/app/robots.ts src/app/opengraph-image.tsx tests/case-page.test.tsx
git commit -m "feat: add static case study pages, sitemap, robots and OpenGraph image"
```

---

### Task 6: Web Resume (`/curriculo`), Static ATS PDF Generator (`/curriculo.pdf`) & Full Browser Audit

**Files:**
- Create: `src/lib/pdf.ts`
- Create: `src/app/curriculo.pdf/route.ts`
- Create: `src/components/PrintButton.tsx`
- Create: `src/app/curriculo/page.tsx`
- Test: `tests/pdf.test.ts`
- Test: `tests/curriculo.test.tsx`

**Interfaces:**
- Consumes: `profile` (`src/data/profile.ts`), `caseStudies` (`src/data/cases.ts`), `publicProjects` (`src/data/projects.ts`), `skillGroups` & `aiPillars` (`src/data/skills.ts`), `getSiteUrl` (`src/lib/site.ts`)
- Produces:
  - `sanitizePdfText(input: string): string`, `buildResumeText(): string`, and `generateResumePdf(): Promise<Uint8Array>` in `src/lib/pdf.ts`
  - Static route `/curriculo.pdf` (`export const dynamic = "force-static"`, `GET(): Promise<Response>`) in `src/app/curriculo.pdf/route.ts`
  - Web resume route `/curriculo` in `src/app/curriculo/page.tsx`

- [ ] **Step 1: Write failing tests in `tests/pdf.test.ts` and `tests/curriculo.test.tsx`**

`tests/pdf.test.ts`:
```ts
import { PDFDocument } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { buildResumeText, generateResumePdf, sanitizePdfText } from "@/lib/pdf";
import { GET } from "@/app/curriculo.pdf/route";

describe("resume PDF generator", () => {
  it("normalizes non-WinAnsi symbols safely while preserving Portuguese diacritics", () => {
    expect(sanitizePdfText("Ação → Próximo ↳ “ok”")).toBe('Ação -> Próximo - "ok"');
  });

  it("includes key factual career info and zero confidential patterns in generated PDF text", () => {
    const text = buildResumeText();
    expect(text).toContain("Francisco Fernandes");
    expect(text).toContain("UFERSA");
    expect(text).toContain("2027");
    expect(text).toContain("curso.dev");
    assertNoConfidentialContent(text);
  });

  it("generates a valid multi-section A4 PDF from real src/data without encoding errors", async () => {
    const bytes = await generateResumePdf();
    const header = Buffer.from(bytes.slice(0, 5)).toString("ascii");
    expect(header).toBe("%PDF-");
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBeGreaterThanOrEqual(1);
    expect(doc.getPageCount()).toBeLessThanOrEqual(2);
    expect(doc.getTitle()).toContain("Francisco Fernandes");
  });

  it("serves /curriculo.pdf with PDF content-type and attachment filename", async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("application/pdf");
    expect(res.headers.get("content-disposition")).toContain(
      "curriculo-francisco-fernandes.pdf",
    );
    const buf = new Uint8Array(await res.arrayBuffer());
    expect(Buffer.from(buf.slice(0, 5)).toString("ascii")).toBe("%PDF-");
  });
});
```

`tests/curriculo.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CurriculoPage from "@/app/curriculo/page";

describe("CurriculoPage", () => {
  it("renders download PDF link, print button, full experience timeline, UFERSA 2027, and curso.dev certificate", () => {
    render(<CurriculoPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Francisco Fernandes" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /baixar pdf/i })).toHaveAttribute("href", "/curriculo.pdf");
    expect(screen.getByRole("button", { name: /imprimir/i })).toBeInTheDocument();
    expect(screen.getByText(/ESIG Software/i)).toBeInTheDocument();
    expect(screen.getByText(/Quark Tecnologia/i)).toBeInTheDocument();
    expect(screen.getByText(/Turing Tecnologia/i)).toBeInTheDocument();
    expect(screen.getByText(/Yank Solutions/i)).toBeInTheDocument();
    expect(screen.getByText(/Salinor/i)).toBeInTheDocument();
    expect(screen.getByText(/2027/)).toBeInTheDocument();
    expect(screen.getByText(/81\s*h/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/pdf.test.ts tests/curriculo.test.tsx`
Expected: FAIL with module not found.

- [ ] **Step 3: Implement `src/lib/pdf.ts`, `src/app/curriculo.pdf/route.ts`, `src/components/PrintButton.tsx`, and `src/app/curriculo/page.tsx`**

- `src/lib/pdf.ts`:
  - `sanitizePdfText(input: string): string`: Maps non-WinAnsi characters (`→` → `->`, `↳` → `-`, `•` → `-`, curly quotes `“`/`”` → `"`, `’` → `'`, `–`/`—` → `-`, `…` → `...`) and strips any remaining code points outside WinAnsi while preserving all Portuguese accented characters (`áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ`).
  - `buildResumeText(): string`: Concatenates all structured text rendered into the PDF (header, summary, 5 experiences, 4 anonymized production highlights, 3 skill groups, UFERSA 2027, English, and certifications including `curso.dev`) after `sanitizePdfText`, enabling direct NDA & completeness assertions in tests.
  - `generateResumePdf(): Promise<Uint8Array>`: Creates an A4 PDF (`595.28 × 841.89 pt`) using `pdf-lib` with `StandardFonts.Helvetica` and `StandardFonts.HelveticaBold`, clean petrol accent `#0F4C5C` headings, automatic line wrapping and clean pagination (targeting 1–2 pages A4, zero text clipping), rendered from the same sections as `buildResumeText()`. Sets PDF metadata (`title`, `author`, `subject`).
- `src/app/curriculo.pdf/route.ts`: Exports `export const dynamic = "force-static"` and `GET()` returning `new Response(new Uint8Array(bytes), { headers: { "Content-Type": "application/pdf", "Content-Disposition": 'attachment; filename="curriculo-francisco-fernandes.pdf"' } })`.
- `src/components/PrintButton.tsx`: Small client component rendering `<button type="button" onClick={() => window.print()}>Imprimir</button>`.
- `src/app/curriculo/page.tsx`: Clean A4-proportioned web view reusing `src/data/*`, with a `.no-print` action bar (`Voltar ao portfólio`, `<a href="/curriculo.pdf">Baixar PDF</a>`, `<PrintButton />`) and structured semantic sections ready for both screen reading and `@media print`.

- [ ] **Step 4: Run full automated suite (`test`, `typecheck`, `lint`, `build`)**

Run: `npm run test && npm run typecheck && npm run lint && npm run build`
Expected: All Vitest suites PASS, 0 TypeScript errors, 0 ESLint warnings/errors, Next.js static build succeeds including `/`, 4 `/cases/[slug]`, `/curriculo`, `/curriculo.pdf`, `/sitemap.xml`, `/robots.txt`, and `/opengraph-image`.

- [ ] **Step 5: Run live browser verification and `web-design-guidelines` audit**

Start the production server locally (`npm run start`) and inspect via Chrome DevTools MCP:
- Check `/`, `/cases/motor-socioeconomico-auxilios`, `/curriculo`, and `/curriculo.pdf` response headers.
- Verify desktop (`1280×800`) and mobile (`375×812`) with zero horizontal overflow, clean Light (A) and Dark (C) theme toggle, visible keyboard focus, zero console/network errors, and Lighthouse accessibility/performance/SEO check.
- Run a pass against `web-design-guidelines` (`~/.gemini/config/skills/web-design-guidelines/references/command.md`) on `src/app/**` and `src/components/**`, fixing any findings before final commit.

- [ ] **Step 6: Commit**

```bash
git add src/lib/pdf.ts src/app/curriculo.pdf/ src/components/PrintButton.tsx src/app/curriculo/ tests/pdf.test.ts tests/curriculo.test.tsx
git commit -m "feat: add printable web resume and build-time ATS PDF generator (/curriculo.pdf)"
```
