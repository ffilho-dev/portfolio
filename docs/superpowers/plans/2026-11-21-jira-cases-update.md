# Atualização do Portfólio (Novos Estudos de Caso e Histórico 2023–2026) — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expandir o portfólio de 4 para 6 estudos de caso anonimizados com base no histórico completo de 2023–2026 (`250+ entregas`, 4 sistemas corporativos, 12 instituições públicas), mantendo `/`, `/cases/[slug]`, `/curriculo`, `/curriculo.pdf` (≤ 2 páginas A4) e a guarda de confidencialidade 100% sincronizados.

**Architecture:** Toda a alteração nasce na camada única tipada (`src/data/profile.ts` e `src/data/cases.ts`), que alimenta automaticamente a home, as rotas estáticas `/cases/[slug]` via `generateStaticParams`, `sitemap.ts`, `opengraph-image.tsx`, `/curriculo` e o gerador vetorial `/curriculo.pdf` (`src/lib/pdf.ts`). Ajustes complementares sincronizam a legenda de período em `/curriculo`, calibram o espaçamento do PDF para caber com 6 destaques em até 2 páginas A4 e fecham 100% da cobertura SHA-256 na guarda NDA.

**Tech Stack:** Next.js App Router (SSG), React 19, TypeScript (`strict: true`), Tailwind CSS v4, `pdf-lib`, Vitest + Testing Library + `jsdom`, ESLint.

**Spec:** `docs/superpowers/specs/2026-11-21-jira-cases-update-design.md`

## Global Constraints

- 100% PT-BR, sem internacionalização (`i18n`) e sem foto pessoal no site ou no currículo.
- Confidencialidade / NDA: zero nomes ou siglas de instituições clientes, zero siglas internas de sistemas proprietários, zero números de OS/chamado, zero URLs internas e zero credenciais em código, dados, testes, PDF ou histórico Git.
- Fidelidade factual: não inventar métricas percentuais ou resultados não documentados (números permitidos: `6+ anos`, `12 instituições`, `250+ entregas`, ciclo `2023–2026`, `4 sistemas corporativos`).
- Tipografia e escrita: aspas tipográficas (`“”`), reticências (`…`), sem anti-padrões proibidos (rótulos em CAIXA ALTA acima de títulos, numeração falsa, cadeias `A · B · C`, `→` em botões/links).
- Autoria Git local obrigatória: `Francisco Filho <fcofilho0809@gmail.com>`.
- `/curriculo.pdf` deve permanecer legível para ATS (fontes ≥ 8pt) e caber em **1–2 páginas A4**.

## Review Focus

1. **Estouro de paginação no `/curriculo.pdf` (passar de 4 para 6 cases pode empurrar para 3 páginas A4)** — coberto em Task 2 (`tests/pdf.test.ts` exige `doc.getPageCount() <= 2` e presença dos 6 títulos no texto extraído).
2. **Vazamento acidental da 12ª instituição ou do 4º sistema corporativo** (antes fora do conjunto de hashes) — coberto em Task 1 (`tests/confidentiality-guard.ts` adiciona os 2 hashes SHA-256 opacos faltantes e `tests/confidentiality.test.ts` + `tests/pdf.test.ts` validam todo o conteúdo e PDF).
3. **Textos excessivos em `diagramNodes` causando quebra feia ou corte no `CaseDiagram` SVG** — coberto em Task 1 (`tests/data-integrity.test.ts` valida limites razoáveis e presença de `label`/`detail` em cada nó) e Task 3 (inspeção visual real em desktop e mobile).
4. **Textos residuais desatualizados (`120+`, `2024–2026`, `3 sistemas`) em dados, página `/curriculo` ou PDF** — coberto em Tasks 1 e 2 (asserções explícitas por `250+ entregas`, `2023–2026`, `4 sistemas` e ausência de `120+`/`2024–2026`).
5. **Rotas estáticas ou `sitemap.xml` sem os 2 novos slugs de estudo de caso** — coberto em Task 2 (`tests/case-page.test.tsx` testa `generateStaticParams` com 6 slugs, renderiza os 2 novos cases e exige `sitemap()` com `>= 8` URLs) e Task 3 (`npm run build`).

---

### Task 1: Reforçar guarda NDA e atualizar `src/data/profile.ts` e `src/data/cases.ts`

**Files:**
- Modify: `tests/confidentiality-guard.ts:5-22`
- Modify: `tests/data-integrity.test.ts:17-42`
- Modify: `src/data/profile.ts:21-34`
- Modify: `src/data/cases.ts:1-179`
- Test: `tests/confidentiality.test.ts`, `tests/data-integrity.test.ts`

**Interfaces:**
- Consumes: `Profile`, `CaseStudy`, `DiagramNode` de `src/data/types.ts`.
- Produces:
  - `profile.metrics` atualizado com `{ value: "250+ entregas", label: "mapeadas no ciclo 2023–2026" }`.
  - `caseStudies` com exatamente 6 `CaseStudy` na ordem:
    1. `motor-socioeconomico-auxilios` (`2026`)
    2. `apis-rest-sistema-academico` (`2026`)
    3. `verificacao-digital-diplomas-documentos` (`2023–2026`)
    4. `acervo-marc21-biblioteca-catalogacao` (`2023–2024`)
    5. `fluxos-pesquisa-extensao-bolsas` (`2023–2024`)
    6. `sustentacao-multi-institucional-regras-criticas` (`2023–2026`)
  - `BLOCKED_TOKEN_HASHES` cobrindo todos os 16 identificadores (12 clientes + 4 sistemas).

- [ ] **Step 1: Atualizar `tests/confidentiality-guard.ts` com os 2 hashes SHA-256 opacos faltantes**

Adicionar em ordem lexicográfica dentro de `BLOCKED_TOKEN_HASHES`:
- `"5c7c3ec38861f8c292f990f55280d6e2bac28bb4a157951f2b67998cb4b2805f"`
- `"fce5de4d28cd57202c019279bca4b8b336e8a3f7ec30de04e56cf84993f2cec5"`

- [ ] **Step 2: Escrever os testes que falham em `tests/data-integrity.test.ts`**

Atualizar as asserções em `tests/data-integrity.test.ts` para exigir:
- `profile.metrics` contém `{ value: "250+ entregas", label: "mapeadas no ciclo 2023–2026" }` e não contém `"120+"` nem `"2024–2026"`;
- `caseStudies` tem comprimento `6` com slugs únicos exatamente iguais a:
  `["motor-socioeconomico-auxilios", "apis-rest-sistema-academico", "verificacao-digital-diplomas-documentos", "acervo-marc21-biblioteca-catalogacao", "fluxos-pesquisa-extensao-bolsas", "sustentacao-multi-institucional-regras-criticas"]`;
- Cada item possui `diagramNodes` com `length >= 4`, `label.length <= 40` e `detail.length <= 90`;
- O case `sustentacao-multi-institucional-regras-criticas` referencia `250` entregas, `2023–2026` e `4 sistemas corporativos`, sem menção residual a `120` ou `3 sistemas`.

- [ ] **Step 3: Rodar os testes de integridade para confirmar falha esperada**

Run: `npx vitest run tests/data-integrity.test.ts tests/confidentiality.test.ts`
Expected: FAIL em `tests/data-integrity.test.ts` (esperava 6 cases e `250+ entregas`, encontrou 4 cases e `120+ entregas`).

- [ ] **Step 4: Atualizar `src/data/profile.ts` e `src/data/cases.ts`**

1. Em `src/data/profile.ts`: alterar a 3ª métrica para `{ value: "250+ entregas", label: "mapeadas no ciclo 2023–2026" }`.
2. Em `src/data/cases.ts`:
   - Manter `motor-socioeconomico-auxilios` e `apis-rest-sistema-academico`.
   - Refinar `verificacao-digital-diplomas-documentos` para `period: "2023–2026"`, incorporando reconhecimento e diplomas de Lato/Stricto Sensu e a emissão da Declaração de Orientações Ministradas no portal docente, e removendo a menção isolada a biblioteca/etiquetas/código de barras (agora no case dedicado).
   - Adicionar `acervo-marc21-biblioteca-catalogacao` (`2023–2024`, 5 nós SVG conforme Seção 5 da spec, cobrindo saneamento SQL em lote de registros MARC21, classificação CDU/CNPq, conflito de `sequence` em cache MARC com batch JDBC/Hibernate, restauração de timer de reservas vencidas no módulo de administração, regras parametrizadas de multas/suspensão, ficha catalográfica ponta a ponta e impressão de etiquetas/lombada).
   - Adicionar `fluxos-pesquisa-extensao-bolsas` (`2023–2024`, 5 nós SVG conforme Seção 5 da spec, cobrindo cadastro externo de projetos de pesquisa com validação pela pró-reitoria e anexos PDF, ciclo de avaliação/prorrogação/distribuição manual/notificações, extensão e creditação com cálculo de frequência, anti-acúmulo de bolsas e homologação integrada ao módulo administrativo, além de correções de batch JDBC/Hibernate e certificados).
   - Atualizar `sustentacao-multi-institucional-regras-criticas` para `period: "2023–2026"`, `250+ entregas`, `4 sistemas corporativos` (acadêmico, administrativo/protocolo, RH e administração/rotinas agendadas), incorporando as 12 auditorias forenses em PostgreSQL, apoio ao processamento de matrículas e regras acadêmicas (Guarda Religiosa na frequência, desmembramento de avaliações por componente curricular, equivalências com grau acadêmico e calendário/plano de matrícula de ingressantes).

- [ ] **Step 5: Rodar os testes de integridade e confidencialidade para confirmar aprovação**

Run: `npx vitest run tests/data-integrity.test.ts tests/confidentiality.test.ts`
Expected: PASS em todos os testes (zero padrões proibidos, zero hashes confidenciais).

- [ ] **Step 6: Commit**

```bash
git add tests/confidentiality-guard.ts tests/data-integrity.test.ts src/data/profile.ts src/data/cases.ts
git commit -m "feat: add MARC21 and research/extension case studies and update 2023-2026 metrics"
```

---

### Task 2: Sincronizar `/curriculo`, calibrar `/curriculo.pdf` para ≤ 2 páginas A4 e atualizar testes de páginas e `README.md`

**Files:**
- Modify: `src/app/curriculo/page.tsx:180-187`
- Modify: `src/lib/pdf.ts:10-202` (apenas ajustes de espaçamento vertical caso 6 cases ultrapassem 2 páginas A4)
- Modify: `README.md:5-10`
- Test: `tests/home.test.tsx`, `tests/case-page.test.tsx`, `tests/curriculo.test.tsx`, `tests/pdf.test.ts`

**Interfaces:**
- Consumes: `caseStudies` (6 itens) e `profile.metrics` (`250+ entregas`) de Task 1.
- Produces:
  - `/curriculo` sincronizado com legenda `(2023–2026)` e os 6 destaques.
  - `/curriculo.pdf` contendo os 6 destaques técnicos em **≤ 2 páginas A4** com tipografia ATS legível (fontes ≥ 8pt).
  - Suíte completa de testes de página, rotas estáticas, sitemap e PDF verde.

- [ ] **Step 1: Atualizar os testes que falham em `tests/home.test.tsx`, `tests/case-page.test.tsx`, `tests/curriculo.test.tsx` e `tests/pdf.test.ts`**

1. `tests/home.test.tsx`:
   - Atualizar asserções de `6` diagramas (`getAllByRole("img")`) e `6` links `ler estudo de caso`;
   - Verificar presença de `250+ entregas` e `2023–2026` na home.
2. `tests/case-page.test.tsx`:
   - `generateStaticParams()` retorna `6` itens contendo `acervo-marc21-biblioteca-catalogacao` e `fluxos-pesquisa-extensao-bolsas`;
   - Adicionar teste renderizando ambos os novos slugs (heading nível 1, diagrama SVG `viewBox` `0 0 720 ...`, 4 seções factuais);
   - `sitemap()` retorna `>= 8` entradas.
3. `tests/curriculo.test.tsx`:
   - Verificar legenda `(2023–2026)` (sem `2024–2026`) e presença dos 6 títulos de estudos de caso na página `/curriculo`.
4. `tests/pdf.test.ts`:
   - Verificar que `buildResumeText()` contém os títulos de todos os 6 estudos de caso, não contém `120+` nem `2024–2026`, passa em `assertNoConfidentialContent(text)` e que `generateResumePdf()` mantém `doc.getPageCount() <= 2`.

- [ ] **Step 2: Rodar os testes de páginas e PDF para confirmar falhas esperadas**

Run: `npx vitest run tests/home.test.tsx tests/case-page.test.tsx tests/curriculo.test.tsx tests/pdf.test.ts`
Expected: FAIL em `curriculo.test.tsx` (legenda ainda `2024–2026`) e potencialmente em `pdf.test.ts` se os 6 cases empurrarem o PDF para 3 páginas A4.

- [ ] **Step 3: Atualizar `src/app/curriculo/page.tsx`, calibrar `src/lib/pdf.ts` (se necessário) e atualizar `README.md`**

1. Em `src/app/curriculo/page.tsx`: trocar `(2024–2026)` por `(2023–2026)`.
2. Em `src/lib/pdf.ts`: caso `generateResumePdf()` produza mais de 2 páginas A4 com 6 cases, calibrar margens verticais (`MARGIN_TOP`/`MARGIN_BOTTOM`), `spaceAfter`, `spaceBefore` e `lineHeight` de forma proporcional preservando todas as fontes ≥ `8pt` e mantendo `keepTogether` / `ensureSpace` intactos (sem títulos órfãos).
3. Em `README.md`: atualizar `4 estudos de caso anonimizados` para `6 estudos de caso anonimizados`.

- [ ] **Step 4: Rodar toda a suíte de testes para confirmar aprovação**

Run: `npm run test`
Expected: PASS em todos os arquivos de teste (incluindo `doc.getPageCount() <= 2` em `tests/pdf.test.ts` e zero violações de NDA).

- [ ] **Step 5: Commit**

```bash
git add src/app/curriculo/page.tsx src/lib/pdf.ts README.md tests/home.test.tsx tests/case-page.test.tsx tests/curriculo.test.tsx tests/pdf.test.ts
git commit -m "feat: sync resume page, keep 6-case A4 PDF within 2 pages and update tests"
```

---

### Task 3: Verificação final (typecheck, lint, build estático e inspeção visual real)

**Files:**
- Verify only (nenhum arquivo alterado a menos que a inspeção revele algum defeito real)

- [ ] **Step 1: Executar pipeline completa de qualidade e build estático**

Run: `npm run test && npm run typecheck && npm run lint && npm run build`
Expected: exit code `0`; output do build lista as 6 rotas estáticas `/cases/[slug]`, `/`, `/curriculo`, `/curriculo.pdf`, `/sitemap.xml`, `/robots.txt` e `/opengraph-image`.

- [ ] **Step 2: Inspecionar visualmente no navegador (via Chrome DevTools MCP) em servidor de produção local**

Subir `npm run start` em background, verificar com `chrome-devtools` MCP:
- `/` em desktop (`1440×900`) e mobile (`390×844`), tema Claro e Escuro: checar métrica `250+ entregas`, os 6 cases + 6 diagramas SVG sem cortes, zero overflow horizontal (`document.documentElement.scrollWidth <= window.innerWidth`), zero erros de console.
- `/cases/acervo-marc21-biblioteca-catalogacao` e `/cases/fluxos-pesquisa-extensao-bolsas`: checar diagrama expandido, metadados, 4 seções factuais e navegação para o próximo case.
- `/curriculo` e `/curriculo.pdf`: checar legenda `2023–2026`, 6 destaques e confirmar contagem exata de páginas do PDF gerado (≤ 2 páginas A4).
Encerrar o servidor local após a verificação.

- [ ] **Step 3: Conferir autoria e estado limpo do Git**

Run: `git status && git log -n 5 --format="%h %an <%ae> %s"`
Expected: working tree clean (exceto spec/plan já commitados ou commitados antes das tasks) e todos os commits sob `Francisco Filho <fcofilho0809@gmail.com>`.
