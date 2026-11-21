# Redesign do Portfólio — Bento Modular Interativo com `shadcn/ui` — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar a interface de `ffilho.dev` para o design system `shadcn/ui` em arquitetura **Bento Modular Interativo (Opção C)** na Home, alinhar `/cases/[slug]`, `/curriculo` e `/opengraph-image` aos novos tokens semânticos Zinc + Petróleo/Âmbar, e atualizar o link do LinkedIn para `https://www.linkedin.com/in/francisco-filho-41793411a/`.

**Architecture:** `src/data/*.ts` segue como fonte única tipada (enriquecida com `domain`/`shortTitle` em `CaseStudy` e `id`/`shortTitle`/`artifacts` em `AiPillar`). Componentes reais do `shadcn/ui` vivem em `src/components/ui/` sobre Tailwind CSS v4 + tokens semânticos mapeados no sistema anti-FOUC existente (`<meta name="color-scheme">` + `light-dark()` + classe `.dark` sincronizada, sem `next-themes`). Um `PortfolioOverlayProvider` leve no `RootLayout` coordena o `CommandMenu` (`⌘K`), o `CertificationDialog` (16 módulos) e a abertura do `CaseSheet` (na Home) com fallback para navegação direta `/cases/[slug]` nas demais rotas.

**Tech Stack:** Next.js 16 App Router (SSG), React 19, TypeScript (`strict: true`), Tailwind CSS v4, `shadcn/ui` (`radix-ui`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `cmdk`, `sonner`), `pdf-lib`, Vitest + Testing Library + `jsdom`, ESLint.

**Spec:** `docs/superpowers/specs/2026-11-21-shadcn-bento-redesign-design.md`

## Global Constraints

- 100% PT-BR, mercado brasileiro, foco em vagas FullStack, sem `i18n` e sem foto pessoal no site ou no currículo.
- Confidencialidade / NDA: zero nomes ou siglas de instituições clientes, siglas internas proprietárias, números de OS/chamado, URLs internas ou credenciais em texto claro em código, dados, testes, PDF ou histórico Git.
- Fidelidade factual: não inventar métricas, percentuais ou entregas; novo LinkedIn obrigatório: `https://www.linkedin.com/in/francisco-filho-41793411a/`.
- Tipografia e escrita (`AGENTS.md`): `Plus Jakarta Sans` (principal) e `IBM Plex Mono` (diagramas, rotas, atalhos e números tabulares); prosa `<= 68ch`; `text-wrap: balance` em títulos; `tabular-nums` em números; aspas tipográficas (`“”`) e reticências (`…`).
- Anti-padrões estritamente proibidos: rótulos em CAIXA ALTA acima de títulos, numeração falsa (`01 / 02`), cadeias decorativas `A · B · C`, `→` em botões ou links, barrinhas de porcentagem de skill, `transition: all` (`transition-all`) e `100vw`.
- Tema e acessibilidade: `<meta name="color-scheme" content="light dark">` + script inline síncrono anti-FOUC resiliente a `SecurityError`, `light-dark()` com fallback `@media (prefers-color-scheme: dark)`, `suppressHydrationWarning` em `<html>`, sem `next-themes`, `overflow-x: clip`, `@media (forced-colors: active)`, `@media (prefers-reduced-motion: reduce)`, `:focus-visible`, skip link e HTML semântico.
- Autoria Git local: `Francisco Filho <fcofilho0809@gmail.com>`.
- Validação final obrigatória: `npm run lint`, `npm run typecheck`, `npm run test` e `npm run build` passando integralmente.

## Review Focus

1. **Desincronização entre `<meta name="color-scheme">` e a classe `.dark` (em OS escuro sem override salvo, em alternância manual ou durante `@media print`)** — `.dark` precisa acompanhar exatamente o tema resolvido no init síncrono, no toggle e no evento `prefers-color-scheme`, e `@media print` não pode sofrer interferência de utilitários `dark:*`. Coberto na Task 2 (`tests/theme.test.ts` e `tests/ThemeToggle.test.tsx`).
2. **Acionamento de um estudo de caso via `CommandMenu` (`⌘K`) fora da Home (ex.: em `/cases/[slug]` ou `/curriculo`)** — na Home deve abrir o `CaseSheet` lateral; fora da Home deve navegar para `/cases/[slug]` via `router.push` sem erro nem silêncio. Coberto na Task 3 (`tests/overlays.test.tsx`).
3. **Correspondência de tecnologias com nomes compostos no filtro de cases e no cross-highlight (`PostgreSQL/SQL`, `Java (Java EE, Spring Boot)`, `Hibernate/JPA`, `JSF/JSP`, `Selenium (RPA/testes)`)** — filtro literal esconderia cases reais (como `sustentacao-multi-institucional-regras-criticas` ao filtrar `PostgreSQL`). Coberto na Task 1 (`tests/stack-match.test.ts`) e Task 4 (`tests/home.test.tsx`).
4. **Regressões de `AGENTS.md` e acessibilidade introduzidas por templates do CLI `shadcn/ui` (`transition-all`, `100vw`, remoção da live region `role="status"` em `CopyEmailButton`, ou remoção dos 6 links estáticos `/cases/[slug]` na Home)** — coberto nas Tasks 2, 3, 4 e 6.
5. **Referência residual ao LinkedIn antigo (`francisco-fernandes-41793411a`) ou estouro de `/curriculo.pdf` acima de 2 páginas A4** — coberto na Task 1 (`tests/data-integrity.test.ts`, `tests/pdf.test.ts`) e Task 5 (`tests/curriculo.test.tsx`).

---

### Task 1: Camada única de dados (`src/data/*`), LinkedIn atualizado e helper de correspondência de stack

**Files:**
- Modify: `src/data/types.ts`
- Modify: `src/data/profile.ts`
- Modify: `src/data/cases.ts`
- Modify: `src/data/skills.ts`
- Create: `src/lib/stack-match.ts`
- Modify: `tests/data-integrity.test.ts`
- Create: `tests/stack-match.test.ts`
- Test: `tests/data-integrity.test.ts`, `tests/confidentiality.test.ts`, `tests/stack-match.test.ts`, `tests/pdf.test.ts`

**Interfaces:**
- Consumes: `CaseStudy`, `PublicProject`, `AiPillar`, `Profile` em `src/data/types.ts`.
- Produces:
  - `CaseStudy` com novos campos `readonly domain: string` e `readonly shortTitle: string`.
  - `AiPillar` com novos campos `readonly id: string`, `readonly shortTitle: string` e `readonly artifacts: readonly string[]`.
  - `profile.contact.linkedinUrl === "https://www.linkedin.com/in/francisco-filho-41793411a/"`.
  - `CASE_STACK_FILTERS = ["Todos", "Java", "PostgreSQL", "APIs REST/JSON", "JasperReports", "Hibernate/JPA"] as const` e tipo `CaseStackFilter` em `src/lib/stack-match.ts`.
  - `caseMatchesStackFilter(study: CaseStudy, filter: CaseStackFilter): boolean` em `src/lib/stack-match.ts`.
  - `findPortfolioMatchesForSkill(skillLabel: string, cases: readonly CaseStudy[], projects: readonly PublicProject[]): { cases: readonly CaseStudy[]; projects: readonly PublicProject[] }` em `src/lib/stack-match.ts`.

- [ ] **Step 1: Escrever os testes que falham em `tests/data-integrity.test.ts` e `tests/stack-match.test.ts`**

1. Em `tests/data-integrity.test.ts`:
   - Alterar a asserção de `profile.contact.linkedinUrl` para exigir `"https://www.linkedin.com/in/francisco-filho-41793411a/"` e negar `"francisco-fernandes-41793411a"`.
   - Para cada item de `caseStudies`, exigir `item.domain.trim().length > 0` e `item.shortTitle.trim().length > 0` (com `item.shortTitle.length <= 48`).
   - Para cada item de `aiPillars`, exigir `pillar.id.trim().length > 0`, `pillar.shortTitle.trim().length > 0` e `pillar.artifacts.length === 3`.
2. Criar `tests/stack-match.test.ts` verificando:
   - `caseMatchesStackFilter(study, "Todos")` retorna `true` para todos os 6 cases.
   - `caseMatchesStackFilter` com `"PostgreSQL"` inclui `sustentacao-multi-institucional-regras-criticas` (cuja stack contém `"PostgreSQL/SQL"`).
   - `caseMatchesStackFilter` com `"APIs REST/JSON"` retorna apenas `apis-rest-sistema-academico`.
   - `findPortfolioMatchesForSkill("Java (Java EE, Spring Boot)", caseStudies, publicProjects)` encontra todos os 6 cases e os projetos `ProjetoEsigGroup` e `BotRegistroImoveisBrasil`.
   - `findPortfolioMatchesForSkill("Hibernate/JPA", caseStudies, publicProjects)` encontra `ProjetoEsigGroup` (que usa `"JPA/Hibernate"`) e os cases com `"Hibernate/JPA"`.
   - `findPortfolioMatchesForSkill("JSF/JSP", caseStudies, publicProjects)` encontra os cases com `"JSF"` e `"JSF/JSP"`.
   - `findPortfolioMatchesForSkill("Selenium (RPA/testes)", caseStudies, publicProjects)` encontra `BotRegistroImoveisBrasil`.

- [ ] **Step 2: Rodar os testes para confirmar falha esperada**

Run: `npx vitest run tests/data-integrity.test.ts tests/stack-match.test.ts`
Expected: FAIL (LinkedIn ainda antigo, campos `domain`/`shortTitle`/`artifacts` ausentes e módulo `@/lib/stack-match` inexistente).

- [ ] **Step 3: Atualizar `src/data/types.ts`, `src/data/profile.ts`, `src/data/cases.ts`, `src/data/skills.ts` e implementar `src/lib/stack-match.ts`**

1. `src/data/types.ts`: adicionar `domain: string` e `shortTitle: string` a `CaseStudy`; adicionar `id: string`, `shortTitle: string` e `artifacts: readonly string[]` a `AiPillar`.
2. `src/data/profile.ts`: atualizar `contact.linkedinUrl` para `"https://www.linkedin.com/in/francisco-filho-41793411a/"`.
3. `src/data/cases.ts`: preencher `domain` e `shortTitle` anonimizados conforme a Seção 5.3 da spec:
   - `motor-socioeconomico-auxilios`: `domain: "Assistência estudantil"`, `shortTitle: "Motor socioeconômico e folha de auxílios"`
   - `apis-rest-sistema-academico`: `domain: "Integrações & APIs"`, `shortTitle: "APIs REST de matrícula e frequência"`
   - `verificacao-digital-diplomas-documentos`: `domain: "Documentos oficiais"`, `shortTitle: "Verificação digital de diplomas (QR Code)"`
   - `acervo-marc21-biblioteca-catalogacao`: `domain: "Biblioteca & Dados"`, `shortTitle: "Saneamento MARC21 e biblioteca"`
   - `fluxos-pesquisa-extensao-bolsas`: `domain: "Pesquisa & Extensão"`, `shortTitle: "Pesquisa, Extensão e bolsas"`
   - `sustentacao-multi-institucional-regras-criticas`: `domain: "Sustentação crítica"`, `shortTitle: "Sustentação para 12 instituições"`
4. `src/data/skills.ts`: preencher `id`, `shortTitle` e `artifacts` (3 itens factuais por pilar conforme Seção 5.3 da spec):
   - `"contexto"` / `"Contexto disciplinado"` / `["AGENTS.md versionado", "Skills sob demanda", "MCPs (DevTools e deploy)"]`
   - `"multistack"` / `"Aceleração multi-stack"` / `["Bases Java EE extensas", "React, Next.js e TypeScript", "Contratos de API e SQL"]`
   - `"verificacao"` / `"Especificação e revisão"` / `["Spec antes do diff", "Testes automatizados", "Auditoria a11y e performance"]`
5. `src/lib/stack-match.ts`: implementar `CASE_STACK_FILTERS`, `caseMatchesStackFilter` (substring normalizada case-insensitive) e `findPortfolioMatchesForSkill` (tokenização em `[\s/(),]+` removendo conectores curtos/genéricos e checando correspondência por token nas entradas de `stack`).

- [ ] **Step 4: Rodar testes de dados, confidencialidade, stack-match e PDF**

Run: `npx vitest run tests/data-integrity.test.ts tests/confidentiality.test.ts tests/stack-match.test.ts tests/pdf.test.ts`
Expected: PASS em todas as suítes (incluindo guarda NDA e `/curriculo.pdf` com o novo LinkedIn dentro de 1–2 páginas A4).

- [ ] **Step 5: Commit**

```bash
git add src/data/types.ts src/data/profile.ts src/data/cases.ts src/data/skills.ts src/lib/stack-match.ts tests/data-integrity.test.ts tests/stack-match.test.ts
git commit -m "feat: update LinkedIn URL, enrich case/AI metadata, and add stack matching helper"
```

---

### Task 2: Fundação `shadcn/ui`, tokens semânticos Zinc + Petróleo/Âmbar, tema anti-FOUC + `.dark` e `CaseDiagram`

**Files:**
- Create: `components.json`
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/tabs.tsx`
- Create: `src/components/ui/sheet.tsx`
- Create: `src/components/ui/dialog.tsx`
- Create: `src/components/ui/accordion.tsx`
- Create: `src/components/ui/command.tsx`
- Create: `src/components/ui/toggle.tsx`
- Create: `src/components/ui/toggle-group.tsx`
- Create: `src/components/ui/separator.tsx`
- Create: `src/components/ui/sonner.tsx`
- Modify: `package.json`, `package-lock.json`
- Modify: `vitest.setup.ts`
- Modify: `src/lib/theme.ts`
- Modify: `src/components/ThemeToggle.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/CaseDiagram.tsx`
- Modify: `tests/theme.test.ts`, `tests/ThemeToggle.test.tsx`, `tests/home.test.tsx` (apenas assertions de tokens do `CaseDiagram` se necessário)

**Interfaces:**
- Consumes: `THEME_STORAGE_KEY`, `ColorSchemePreference` de `src/lib/theme.ts`.
- Produces:
  - `cn(...inputs: ClassValue[]): string` em `src/lib/utils.ts`.
  - Primitivos `shadcn/ui` em `src/components/ui/*` (zero `transition-all`, zero `100vw`, `Toaster` em `sonner.tsx` consumindo `useResolvedTheme()`).
  - Em `src/lib/theme.ts`: `THEME_COLOR_LIGHT = "#FFFFFF"`, `THEME_COLOR_DARK = "#09090B"`, `applySchemeToDocument(stored: ColorSchemePreference | null, doc?: Document, systemPrefersDark?: boolean): void` sincronizando `<meta name="color-scheme">`, `<meta name="theme-color">` **e** `documentElement.classList.toggle("dark", resolved === "dark")`.
  - Em `src/components/ThemeToggle.tsx`: `ThemeToggle`, `useResolvedTheme(): ColorSchemePreference` e `toggleDocumentTheme(): ColorSchemePreference`.
  - Em `src/app/globals.css`: tokens semânticos `shadcn/ui` (`--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--border`, `--input`, `--ring`, `--signal`, `--signal-foreground`, `--signal-soft`, `--signal-border`, `--radius`) via `light-dark()` + fallback `@media (prefers-color-scheme: dark)` + `:root:where(:has(> head > meta[name="color-scheme"][...]))` + `@custom-variant dark (&:where(.dark, .dark *));` (neutralizado sob `@media print`).

- [ ] **Step 1: Instalar e inicializar `shadcn/ui` + componentes oficiais via CLI e configurar polyfills de teste**

1. Inicializar `shadcn/ui` compatível com Next.js App Router + Tailwind CSS v4 (`baseColor: "zinc"`, `iconLibrary: "lucide"`, `cssVariables: true`, `rsc: true`) e adicionar os componentes:
   `button card badge tabs sheet dialog accordion command toggle toggle-group separator sonner`.
2. Remover `next-themes` caso o CLI o instale junto ao `sonner`, pois o projeto usa o sistema anti-FOUC nativo em `src/lib/theme.ts`.
3. Auditar todos os arquivos criados em `src/components/ui/*.tsx`:
   - Substituir toda ocorrência de `transition-all` por transições explícitas (`transition-[color,background-color,border-color,box-shadow,opacity]` ou `transition-[transform,opacity]`).
   - Garantir ausência de `100vw` e de `uppercase` decorativo acima de títulos.
   - Em `src/components/ui/sonner.tsx`: usar `useResolvedTheme()` de `@/components/ThemeToggle` para passar `theme={resolvedTheme}` ao `Sonner`.
4. Em `vitest.setup.ts`: adicionar guards leves para `ResizeObserver` e `Element.prototype.scrollIntoView` (necessários para Radix UI e `cmdk` em `jsdom`).

- [ ] **Step 2: Escrever os testes que falham em `tests/theme.test.ts` e `tests/ThemeToggle.test.tsx`**

1. Em `tests/theme.test.ts`:
   - Verificar `THEME_COLOR_LIGHT === "#FFFFFF"` e `THEME_COLOR_DARK === "#09090B"`.
   - Verificar que `applySchemeToDocument("dark", document)` adiciona a classe `"dark"` em `document.documentElement`; `applySchemeToDocument("light", document)` remove `"dark"`; `applySchemeToDocument(null, document, true)` adiciona `"dark"` e `applySchemeToDocument(null, document, false)` remove `"dark"`.
   - Verificar que `THEME_INIT_SCRIPT` contém `classList.toggle("dark"` além de `try`, `meta[name="color-scheme"]` e `meta[name="theme-color"]`.
2. Em `tests/ThemeToggle.test.tsx`:
   - Verificar que clicar no `ThemeToggle` sincroniza `document.documentElement.classList.contains("dark")` com `<meta name="color-scheme">`, inclusive quando o evento `prefers-color-scheme` muda sem override salvo.

- [ ] **Step 3: Rodar os testes de tema para confirmar falha esperada**

Run: `npx vitest run tests/theme.test.ts tests/ThemeToggle.test.tsx`
Expected: FAIL (cores antigas e `.dark` ainda não sincronizada em `document.documentElement`).

- [ ] **Step 4: Implementar `src/lib/theme.ts`, `src/components/ThemeToggle.tsx`, `src/app/globals.css`, `src/app/layout.tsx` e atualizar tokens em `src/components/CaseDiagram.tsx`**

1. `src/lib/theme.ts`:
   - Atualizar `THEME_COLOR_LIGHT = "#FFFFFF"` e `THEME_COLOR_DARK = "#09090B"`.
   - Atualizar `THEME_INIT_SCRIPT` para resolver `isDark = v === "dark" || (v === "light dark" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)` e aplicar `document.documentElement.classList.toggle("dark", isDark)` sincronamente no `<head>`.
   - Atualizar `applySchemeToDocument(stored, doc, systemPrefersDark)` para sincronizar também `targetDoc.documentElement.classList.toggle("dark", resolved === "dark")`.
2. `src/components/ThemeToggle.tsx`:
   - Exportar `useResolvedTheme(): ColorSchemePreference` e `toggleDocumentTheme(): ColorSchemePreference` usando o store já existente.
   - No `handleMediaChange`, sincronizar `applySchemeToDocument(readEffectiveOverride(), document, readSystemPrefersDark())` quando `stored === null`.
   - Estilizar o botão usando `Button` (`variant="outline"`, `size="icon"`) do `shadcn/ui` mantendo as classes `.theme-toggle-btn`, `.theme-icon-to-dark` e `.theme-icon-to-light` (sem flicker na hidratação) com ícones `Moon` e `Sun` de `lucide-react`.
3. `src/app/globals.css`:
   - Definir `@custom-variant dark (&:where(.dark, .dark *));` e `@theme inline` mapeando todas as cores semânticas do `shadcn/ui`, `--color-signal`, `--color-signal-foreground`, `--color-signal-soft`, `--color-signal-border`, `--font-sans: var(--font-jakarta), ui-sans-serif, system-ui, -apple-system, sans-serif` e `--font-mono: var(--font-plex-mono), ui-monospace, SFMono-Regular, Menlo, monospace` (sem mapeamento circular!).
   - Definir os valores claro/escuro da tabela da Seção 5.2 da spec em `:root` com `color-scheme: light dark`, fallback `@media (prefers-color-scheme: dark)`, `@supports (color: light-dark(white, black))` e overrides `:root:where(:has(> head > meta[name="color-scheme"][content="dark" | "light"]))`.
   - Preservar `.site-container` (`min(100% - 2rem, 72rem)` para acomodar o grid Bento de 12 colunas), `.prose-measure` (`68ch`), `.tabular-data`, `.skip-link`, `.theme-toggle-btn`, `@media (forced-colors: active)`, `@media (prefers-reduced-motion: reduce)` (anulando animações) e `@media print` (forçando tokens claros de alto contraste e garantindo que `.dark` não escureça a impressão).
4. `src/app/layout.tsx`:
   - Renomear variáveis das fontes para `variable: "--font-jakarta"` e `variable: "--font-plex-mono"`.
   - Adicionar `suppressHydrationWarning` em `<html lang="pt-BR" ...>`.
5. `src/components/CaseDiagram.tsx`:
   - Migrar as referências de variáveis CSS inline para `var(--card)`, `var(--background)`, `var(--foreground)`, `var(--muted-foreground)`, `var(--border)` e `var(--signal)`.

- [ ] **Step 5: Rodar testes de tema, `CaseDiagram` e auditoria anti-`transition-all`**

Run: `npx vitest run tests/theme.test.ts tests/ThemeToggle.test.tsx tests/home.test.tsx && ! grep -rn "transition-all\|100vw" src/components/ui/`
Expected: PASS nos testes de tema e `CaseDiagram` (nota: `tests/home.test.tsx` passa integralmente se `page.tsx` ainda não mudou ou apenas se os tokens legados não foram removidos antes da Task 4 — caso `page.tsx` ainda referencie variáveis antigas neste commit, manter aliases temporários ou rodar o bloco `CaseDiagram` via `-t "CaseDiagram"` e remover qualquer alias temporário na Task 5) e saída vazia na auditoria de `src/components/ui/`.

> **Nota para o executor:** Para manter `tests/home.test.tsx`, `tests/case-page.test.tsx` e `tests/curriculo.test.tsx` 100% verdes entre a Task 2 e a Task 5, mantenha aliases temporários `--bg: var(--background); --surface: var(--card); --ink: var(--foreground); --muted-legacy: var(--muted-foreground); --rule: var(--border);` apenas se necessário — mas **não** sob o nome `--muted` ou `--accent` (que já pertencem ao `shadcn/ui`). Na Task 5, remova qualquer alias temporário quando todas as rotas estiverem migradas.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json components.json vitest.setup.ts src/lib/utils.ts src/lib/theme.ts src/components/ui src/components/ThemeToggle.tsx src/components/CaseDiagram.tsx src/app/globals.css src/app/layout.tsx tests/theme.test.ts tests/ThemeToggle.test.tsx
git commit -m "feat: add shadcn/ui foundation, Zinc + signal semantic tokens, and .dark anti-FOUC sync"
```

---

### Task 3: Overlays globais (`PortfolioOverlayProvider`, `CommandMenu`, `CertificationDialog`) e Shell (`SiteHeader`, `SiteFooter`, `CopyEmailButton`)

**Files:**
- Create: `src/components/PortfolioOverlayProvider.tsx`
- Create: `src/components/CertificationDialog.tsx`
- Create: `src/components/CommandMenu.tsx`
- Modify: `src/components/CopyEmailButton.tsx`
- Modify: `src/components/SiteHeader.tsx`
- Modify: `src/components/SiteFooter.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `tests/CopyEmailButton.test.tsx`
- Create: `tests/overlays.test.tsx`
- Test: `tests/CopyEmailButton.test.tsx`, `tests/overlays.test.tsx`

**Interfaces:**
- Consumes: `Button`, `Dialog*`, `Command*`, `Badge`, `Separator`, `Toaster` de `src/components/ui/*`; `toggleDocumentTheme` de `src/components/ThemeToggle.tsx`; `profile`, `caseStudies`, `publicProjects` de `src/data/*`; `toast` de `sonner`.
- Produces:
  - `PortfolioOverlayProvider({ children })` e hook `usePortfolioOverlays()` retornando:
    - `commandOpen: boolean`, `setCommandOpen: (open: boolean) => void`, `openCommand: () => void`
    - `certDialogOpen: boolean`, `setCertDialogOpen: (open: boolean) => void`, `openCertDialog: () => void`
    - `openCase: (slug: string) => void` (chama o handler registrado pela Home para abrir `CaseSheet`; se nenhum handler estiver registrado, chama `router.push(\`/cases/\${slug}\`)`)
    - `registerCaseHandler: (handler: ((slug: string) => void) | null) => void`
  - `CertificationDialog`: `Dialog` com os 16 módulos de `profile.featuredCertification.modules` numerados de `1.` a `16.` e link externo `Verificar certificado`.
  - `CommandMenu`: `CommandDialog` ativado por `Ctrl+K` / `⌘K` ou botão do header, listando os 6 cases, 4 projetos, rotas (`/`, `/curriculo`, `/curriculo.pdf`) e ações rápidas (copiar e-mail, ver 16 módulos, alternar tema Claro/Escuro).

- [ ] **Step 1: Escrever os testes que falham em `tests/CopyEmailButton.test.tsx` e `tests/overlays.test.tsx`**

1. Em `tests/CopyEmailButton.test.tsx`:
   - Atualizar a checagem de classe de borda (`border-[var(--border)]` -> verificar presença de botão acessível do `shadcn/ui` mantendo todas as asserções de cópia, `role="status"`, tratamento de rejeição/indisponibilidade, re-anúncio `\u00A0` e reset em 3500ms).
2. Criar `tests/overlays.test.tsx` (mockando `next/navigation` `useRouter` com `push`):
   - Monta `PortfolioOverlayProvider` + `SiteHeader` + `CommandMenu` + `CertificationDialog`.
   - Verifica abertura do `CommandMenu` clicando no botão de busca rápida e via atalho `Ctrl+K`.
   - Verifica que selecionar a ação “Ver os 16 módulos da certificação curso.dev” fecha o `CommandMenu` e abre o `CertificationDialog` listando todos os 16 módulos e o link `Verificar certificado`.
   - Verifica que selecionar um estudo de caso no `CommandMenu` **sem** handler da Home registrado chama `router.push("/cases/motor-socioeconomico-auxilios")`.
   - Verifica que selecionar um estudo de caso **com** handler registrado via `registerCaseHandler` invoca o handler com o `slug` e não chama `router.push`.

- [ ] **Step 2: Rodar os testes para confirmar falha esperada**

Run: `npx vitest run tests/CopyEmailButton.test.tsx tests/overlays.test.tsx`
Expected: FAIL (`PortfolioOverlayProvider`, `CommandMenu` e `CertificationDialog` ainda não existem).

- [ ] **Step 3: Implementar `PortfolioOverlayProvider.tsx`, `CertificationDialog.tsx`, `CommandMenu.tsx` e atualizar `CopyEmailButton.tsx`, `SiteHeader.tsx`, `SiteFooter.tsx` e `layout.tsx`**

1. `src/components/PortfolioOverlayProvider.tsx`: implementar contexto + atalho global `keydown` (`(e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k"`), registro de `caseHandlerRef` para `CaseSheet` da Home com fallback `router.push(\`/cases/\${slug}\`)`.
2. `src/components/CertificationDialog.tsx`: renderizar `Dialog` / `DialogContent` / `DialogHeader` / `DialogTitle` / `DialogDescription` + `<ol>` com os 16 módulos (`1.`..`16.`) e botão-link `Verificar certificado`.
3. `src/components/CommandMenu.tsx`: implementar `CommandDialog` com `CommandInput`, `CommandList`, `CommandEmpty` (“Nenhum resultado encontrado.”) e `CommandGroup`s (`Cases em produção`, `Projetos públicos`, `Navegação`, `Ações rápidas`).
4. `src/components/CopyEmailButton.tsx`: migrar para `Button` (`variant="outline"`, `size="sm"`) + ícones `Check`/`Copy` de `lucide-react`, preservando intacta a live region `<span role="status" aria-live="polite">` e disparando `toast.success("E-mail copiado", { description: email })` ou `toast.error(...)`.
5. `src/components/SiteHeader.tsx`: header sticky `no-print border-b border-border bg-background/95 backdrop-blur`, brand `ffilho.dev`, links de navegação (`Cases`, `IA no fluxo`, `Projetos`, `Trajetória`, `Currículo`), botão `CommandTrigger` (`Buscar` + `<kbd>⌘K</kbd>`), `ThemeToggle` e `Button` direto para WhatsApp em telas médias/grandes.
6. `src/components/SiteFooter.tsx`: migrar classes para tokens `shadcn/ui` (`border-border`, `bg-background`, `text-foreground`, `text-muted-foreground`), mantendo `no-print` e todos os links diretos.
7. `src/app/layout.tsx`: envolver conteúdo em `<PortfolioOverlayProvider>` e montar `<CommandMenu />`, `<CertificationDialog />` e `<Toaster />` dentro do provider (ocultando overlays em impressão via `no-print`).

- [ ] **Step 4: Rodar os testes de `CopyEmailButton` e overlays**

Run: `npx vitest run tests/CopyEmailButton.test.tsx tests/overlays.test.tsx`
Expected: PASS em todos os testes.

- [ ] **Step 5: Commit**

```bash
git add src/components/PortfolioOverlayProvider.tsx src/components/CertificationDialog.tsx src/components/CommandMenu.tsx src/components/CopyEmailButton.tsx src/components/SiteHeader.tsx src/components/SiteFooter.tsx src/app/layout.tsx tests/CopyEmailButton.test.tsx tests/overlays.test.tsx
git commit -m "feat: add global command menu, certification dialog, and shadcn/ui header/footer shell"
```

---

### Task 4: Home Bento Modular Interativo (`src/components/home/*` e `src/app/page.tsx`)

**Files:**
- Create: `src/components/home/CaseSheet.tsx`
- Create: `src/components/home/CasesBentoSection.tsx`
- Create: `src/components/home/AiTabsCard.tsx`
- Create: `src/components/home/InteractiveStackCard.tsx`
- Create: `src/components/home/TrajectorySection.tsx`
- Modify: `src/app/page.tsx`
- Modify: `tests/home.test.tsx`
- Test: `tests/home.test.tsx`

**Interfaces:**
- Consumes: `usePortfolioOverlays` de `src/components/PortfolioOverlayProvider.tsx`; `CASE_STACK_FILTERS`, `caseMatchesStackFilter`, `findPortfolioMatchesForSkill` de `src/lib/stack-match.ts`; primitivos `shadcn/ui` (`Card*`, `Button`, `Badge`, `Tabs*`, `Sheet*`, `Accordion*`, `ToggleGroup*`, `Toggle`, `Separator`); dados de `src/data/*`.
- Produces:
  - `CaseSheet({ study, onSelectSlug, onOpenChange })`: drawer direito do `shadcn/ui` com metadados, diagrama interativo clicável por etapa (`diagramNodes`), as 4 seções factuais, link **Abrir página completa** (`/cases/[slug]`), botão **Próximo case** e link **Baixar PDF**.
  - `CasesBentoSection({ studies })`: `section#cases` com filtro `ToggleGroup`, grid Bento (`1 / 2 / 3` cols), 2 ações não aninhadas por card (**Inspecionar case** + `<Link href="/cases/${slug}">Ler estudo de caso</Link>`) e registro no `PortfolioOverlayProvider` via `registerCaseHandler`.
  - `AiTabsCard({ pillars })`: `section#ia` com `Tabs` do `shadcn/ui` e indicador visual não dependente apenas de cor (`border-b-2` em ativo).
  - `InteractiveStackCard({ skillGroups, cases, projects })`: `section#stack` com toggles por tecnologia + painel contextual **Onde “<tech>” aparece no portfólio** abrindo `openCase(slug)` ou link do repositório + **Limpar seleção**.
  - `TrajectorySection({ experiences, education, languages, featuredCertification, otherCertifications })`: `section#trajetoria` com `Accordion` (`type="multiple"`, ESIG aberta por padrão) + cards de Formação e Certificações (acionando `openCertDialog()`).
  - `HomePage` (`src/app/page.tsx`): Server Component compondo os 6 blocos da Opção C com todas as âncoras (`#cases`, `#ia`, `#projetos`, `#stack`, `#trajetoria`, `#contato`).

- [ ] **Step 1: Atualizar `tests/home.test.tsx` com as asserções da arquitetura Opção C**

Manter o bloco `describe("CaseDiagram")` intacto e atualizar `describe("HomePage")` (envelopando `<HomePage />` em `<PortfolioOverlayProvider>` + `<CertificationDialog />` para testar integrações reais) para exigir:
- Heading `h1` `"Francisco Filho"`, título `"Desenvolvedor FullStack"`, disponibilidade (`presencial`), 3 métricas (`6+ anos`, `12 instituições`, `250+ entregas` / `ciclo 2023–2026`), links WhatsApp, `/curriculo.pdf`, `/curriculo`, `contato@ffilho.dev`, novo LinkedIn (`https://www.linkedin.com/in/francisco-filho-41793411a/`) e ausência de `@gmail.com`.
- Todas as 6 âncoras `section#cases`, `section#ia`, `section#projetos`, `section#stack`, `section#trajetoria`, `section#contato`.
- Todos os 6 links diretos `Ler estudo de caso` apontando exatamente para `/cases/${slug}` na ordem de `caseStudies`, além de 6 botões `Inspecionar case`.
- **Interação filtro de cases:** clicar no filtro `PostgreSQL` mantém visível o case `sustentacao-multi-institucional-regras-criticas` (`PostgreSQL/SQL`); clicar em `APIs REST/JSON` filtra para 1 case (`APIs REST para matrícula...`); voltar para `Todos` restaura os 6.
- **Interação `CaseSheet`:** clicar em `Inspecionar case` no primeiro card abre o `Sheet` exibindo título, problema, restrições, solução, resultado, link `Abrir página completa` (`/cases/motor-socioeconomico-auxilios`), permite clicar na etapa 2 do diagrama e ver seu `detail`, e clicar no botão de próximo case alterna para `apis-rest-sistema-academico`.
- **Interação `Tabs` de IA:** alternar para `"Especificação e revisão"` exibe a descrição completa correspondente e seus artefatos.
- **Interação cross-highlight de stack:** clicar em `"PostgreSQL"` renderiza o painel contextual com cases e projetos correspondentes (`clone-tabnews`, `ProjetoEsigGroup`, etc.); clicar em `"Limpar seleção"` recolhe o painel.
- **Interação `Accordion` e `Dialog` de certificação:** ESIG Software inicia expandida na trajetória; clicar em `"Abrir os 16 módulos"` abre o `Dialog` com todos os 16 módulos do `curso.dev`.
- Projetos públicos: `clone-tabnews` com link `Live`, `ProjetoEsigGroup`, `BotRegistroImoveisBrasil` e 2 ocorrências de `conta anterior`.

- [ ] **Step 2: Rodar `tests/home.test.tsx` para confirmar falha esperada**

Run: `npx vitest run tests/home.test.tsx`
Expected: FAIL (Home ainda no layout linear antigo sem filtros, `Sheet`, `Tabs`, cross-highlight nem `Dialog`).

- [ ] **Step 3: Implementar `src/components/home/*` e redesenhar `src/app/page.tsx`**

1. Criar `src/components/home/CaseSheet.tsx`:
   - `Sheet` (`side="right"`), largura responsiva (`w-full sm:max-w-xl`), `overflow-y-auto`.
   - Exibir `Badge` de `domain`, período (`tabular-data font-mono`), `SheetTitle` (`study.title`), `SheetDescription` (`study.role`), resumo, badges de stack, diagrama interativo por etapas (lista ordenada `<ol>` de botões `aria-pressed` exibindo o `detail` da etapa ativa em um painel destacado), as 4 seções factuais (`Problema real`, `Restrições e contexto operacional`, `Solução e decisões técnicas` e card `--signal-soft` para `Resultado prático`) e `SheetFooter` com `<Link href="/cases/${study.slug}">Abrir página completa</Link>`, botão `Próximo: ${nextStudy.shortTitle}` e link `/curriculo.pdf`.
2. Criar `src/components/home/CasesBentoSection.tsx`:
   - Registrar handler `setActiveSlug` via `registerCaseHandler` em `useEffect` (limpando no unmount).
   - Renderizar `section#cases` com `ToggleGroup` (`type="single"`, ignorando valor vazio para manter sempre um filtro ativo, padrão `"Todos"`), grid `grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3` de `Card`s filtrados por `caseMatchesStackFilter`, cada card contendo `Button` (`Inspecionar case`) + `<Link href="/cases/${item.slug}" aria-labelledby={...}>Ler estudo de caso</Link>`, e montar `<CaseSheet />`.
3. Criar `src/components/home/AiTabsCard.tsx`:
   - Renderizar `section#ia` dentro de `Card` usando `Tabs`, `TabsList`, `TabsTrigger` (com indicador inferior `border-b-2` no estado ativo para `forced-colors`) e `TabsContent` com `title`, `description` (`prose-measure`) e badges de `artifacts`.
4. Criar `src/components/home/InteractiveStackCard.tsx`:
   - Renderizar `section#stack` dentro de `Card`, 3 colunas de `skillGroups` com `Toggle` (`aria-pressed`), painel contextual condicional usando `findPortfolioMatchesForSkill` (botões de case chamando `openCase(c.slug)` + links de repositório + fallback textual honesto) e botão `Limpar seleção`.
5. Criar `src/components/home/TrajectorySection.tsx`:
   - Renderizar `section#trajetoria` em grid `lg:grid-cols-12`:
     - `lg:col-span-7`: `Card` com `Accordion` (`type="multiple"`, `defaultValue={[firstKey]}`) das 5 experiências (trigger exibindo empresa e período `tabular-nums`, conteúdo exibindo cargo em `--signal`, localização e resumo `<= 68ch`).
     - `lg:col-span-5`: `Card` Formação acadêmica (UFERSA + idiomas) e `Card` Certificações (`curso.dev`, botão `Abrir os 16 módulos` chamando `openCertDialog()`, link `Verificar certificado` e `otherCertifications`).
6. Atualizar `src/app/page.tsx`:
   - Compor o Bento Hero (`lg:grid-cols-12`: card principal `lg:col-span-8` + coluna empilhada `lg:col-span-4` com métricas e canais diretos), `CasesBentoSection`, grid técnico `lg:grid-cols-12` (`AiTabsCard` `lg:col-span-6` + `section#projetos` `Card` `lg:col-span-6`), `InteractiveStackCard`, `TrajectorySection` e `section#contato` (`Card` consolidado).

- [ ] **Step 4: Rodar `tests/home.test.tsx`**

Run: `npx vitest run tests/home.test.tsx`
Expected: PASS em todos os testes da Home e `CaseDiagram`.

- [ ] **Step 5: Commit**

```bash
git add src/components/home src/app/page.tsx tests/home.test.tsx
git commit -m "feat: implement Option C interactive Bento homepage with shadcn/ui"
```

---

### Task 5: Alinhamento visual de `/cases/[slug]`, `/curriculo`, `PrintButton`, `/opengraph-image` e limpeza de tokens legados

**Files:**
- Modify: `src/app/cases/[slug]/page.tsx`
- Modify: `src/app/curriculo/page.tsx`
- Modify: `src/components/PrintButton.tsx`
- Modify: `src/app/opengraph-image.tsx`
- Modify: `src/app/globals.css` (remover eventuais aliases temporários legados `--bg`/`--surface`/`--ink`/`--rule`)
- Modify: `tests/curriculo.test.tsx` (adicionar asserção do novo LinkedIn em `/curriculo`)
- Test: `tests/case-page.test.tsx`, `tests/curriculo.test.tsx`, `tests/pdf.test.ts`, `tests/site.test.ts`

**Interfaces:**
- Consumes: `Card*`, `Button`, `Badge`, `Separator` de `src/components/ui/*`; `CaseDiagram` de `src/components/CaseDiagram.tsx`; `profile`, `caseStudies`, `publicProjects`, `skillGroups`, `aiPillars` de `src/data/*`.
- Produces:
  - Rotas `/cases/[slug]`, `/curriculo` e `/opengraph-image` 100% alinhadas aos tokens `shadcn/ui` Zinc + Petróleo/Âmbar, sem dependência de variáveis legadas (`--bg`, `--surface`, `--ink`, `--rule`).

- [ ] **Step 1: Atualizar `tests/curriculo.test.tsx` para garantir o novo link do LinkedIn na página `/curriculo`**

Adicionar asserção verificando que o link do LinkedIn em `/curriculo` aponta para `"https://www.linkedin.com/in/francisco-filho-41793411a/"`.

- [ ] **Step 2: Alinhar `src/app/cases/[slug]/page.tsx`, `src/app/curriculo/page.tsx`, `src/components/PrintButton.tsx`, `src/app/opengraph-image.tsx` e limpar `src/app/globals.css`**

1. `src/app/cases/[slug]/page.tsx`:
   - Manter `generateStaticParams`, `dynamicParams = false`, `generateMetadata`, `notFound()`, link `Voltar para cases` (`/#cases`), os 4 headings exatos (`Problema real`, `Restrições e contexto operacional`, `Solução e decisões técnicas`, `Resultado prático`), `CaseDiagram variant="expanded"` e link circular para o próximo case.
   - Reestruturar visualmente com `Card`, `Badge` (`study.domain` + stack), `Button` (`asChild` com `Link`/`a`) e destaque `--signal-soft`/`--signal-border` em `Resultado prático`.
2. `src/components/PrintButton.tsx`:
   - Migrar para `Button` (`variant="outline"`) + ícone `Printer` de `lucide-react`, preservando o rótulo `"Imprimir"` e `window.print()`.
3. `src/app/curriculo/page.tsx`:
   - Barra `.no-print` usando `Button` (`asChild`) para `Voltar ao portfólio` e `Baixar PDF` + `<PrintButton />`.
   - Folha web dentro de `Card` usando tokens `shadcn/ui` (`text-foreground`, `text-muted-foreground`, `text-signal`, `border-border`) e preservando integralmente todas as classes `print:*`, `.print-entry`, `.print-avoid-break` e `.print-allow-break`.
4. `src/app/opengraph-image.tsx`:
   - Alinhar cores para Zinc claro (`#FFFFFF`, `#09090B`, `#E4E4E7`, `#52525B`, `#F4F4F5`) com faixa superior e acento Petróleo (`#0F4C5C`).
5. `src/app/globals.css`:
   - Remover quaisquer variáveis/aliases legados não mais utilizados (`--bg`, `--surface`, `--ink`, `--rule`, `--accent-ink`) após confirmar via busca que nenhum arquivo em `src/` os referencia.

- [ ] **Step 3: Rodar os testes de rotas secundárias, PDF e site**

Run: `npx vitest run tests/case-page.test.tsx tests/curriculo.test.tsx tests/pdf.test.ts tests/site.test.ts`
Expected: PASS em todas as suítes.

- [ ] **Step 4: Commit**

```bash
git add src/app/cases/[slug]/page.tsx src/app/curriculo/page.tsx src/components/PrintButton.tsx src/app/opengraph-image.tsx src/app/globals.css tests/curriculo.test.tsx
git commit -m "feat: align case study, resume, and OpenGraph routes with shadcn/ui tokens"
```

---

### Task 6: Auditoria final de `AGENTS.md`, suíte completa, build estático e verificação visual real

**Files:**
- Verify only (eventuais ajustes cirúrgicos apenas se a verificação encontrar defeito real).

**Interfaces:**
- Consumes: Todas as rotas e componentes entregues nas Tasks 1–5.
- Produces: Evidência completa de `lint`, `typecheck`, `test`, `build`, auditoria de anti-padrões e inspeção visual em navegador (Desktop + Mobile, Claro + Escuro).

- [ ] **Step 1: Rodar auditoria automatizada de anti-padrões (`AGENTS.md`) e referências legadas**

Run:
```bash
! grep -rn "transition-all\|100vw\|next-themes\|francisco-fernandes-41793411a\|var(--bg)\|var(--surface)\|var(--ink)\|var(--rule)" src/
```
Expected: Comando sai com código 0 (zero ocorrências em `src/`).

- [ ] **Step 2: Rodar `lint`, `typecheck`, toda a suíte Vitest e `next build`**

Run:
```bash
npm run lint && npm run typecheck && npm run test && npm run build
```
Expected: Todos passam com código 0; `next build` gera estaticamente `/`, os 6 slugs `/cases/[slug]`, `/curriculo`, `/curriculo.pdf`, `/opengraph-image`, `/robots.txt` e `/sitemap.xml`.

- [ ] **Step 3: Verificação visual real em navegador local**

Subir `npm run start` em porta local e validar visualmente (Desktop e Mobile, tema Claro e Escuro):
- Home (`/`): Bento Hero, filtro `ToggleGroup` nos 6 cases, `CaseSheet` (diagrama clicável + próximo case + link completo), `Tabs` de IA, cross-highlight da stack técnica, `Accordion` da trajetória, `Dialog` dos 16 módulos, `CommandMenu` (`⌘K`) e toast de cópia de e-mail.
- `/cases/motor-socioeconomico-auxilios`: layout `shadcn/ui`, `CaseDiagram` SVG expandido nos dois temas e navegação circular.
- `/curriculo`: visual `shadcn/ui` em tela, novo link do LinkedIn (`francisco-filho-41793411a`) e simulação de `@media print` A4 em tema claro.
- Sem overflow horizontal, sem erros no console e sem FOUC ao recarregar nos dois temas.

- [ ] **Step 4: Commit final (somente se algum ajuste foi necessário no Step 3) e checagem de `git status`**

Run: `git status --short && git log -n 6 --oneline`
Expected: Árvore limpa e histórico com autoria `Francisco Filho <fcofilho0809@gmail.com>`.
