# Atualização do Portfólio — Novos Estudos de Caso e Histórico Completo (2023–2026)

**Data:** 2026-11-21  
**Escopo:** Atualização incremental de conteúdo, métricas e testes sobre a arquitetura existente do portfólio (`/home/franciscofilho/Projects/portfolio`).

---

## 1. Intenção e Porquê

Na primeira versão do portfólio, o levantamento de entregas na ESIG Software considerou apenas itens atribuídos diretamente ao usuário (`assignee`), cobrindo **120 demandas no ciclo 2024–2026** em **3 sistemas corporativos**.

Ao cruzar com o campo customizado de desenvolvedor do histórico de demandas (que concentra as entregas de 2023–2024 atribuídas a uma fila compartilhada), surgiram **138 novas entregas documentadas** sem duplicação — elevando o lastro real para **258 demandas mapeadas (253 concluídas — `250+ entregas`) no ciclo `2023–2026`**, abrangendo **4 sistemas corporativos** e **12 instituições públicas**.

Essa atualização incorpora essas frentes reais ao dossiê com **2 novos estudos de caso dedicados**, sincronizando automaticamente a home (`/`), as páginas `/cases/[slug]`, o currículo web (`/curriculo`), o PDF vetorial (`/curriculo.pdf`) e a imagem OpenGraph.

---

## 2. Objetivos, Não-Objetivos e Anti-Objetivos

### Objetivos
- Atualizar os números factuais em `src/data/profile.ts`, `src/data/cases.ts` e `src/app/curriculo/page.tsx` para **`250+ entregas`**, ciclo **`2023–2026`**, **4 sistemas corporativos** e **12 instituições públicas**.
- Adicionar **2 novos estudos de caso anonimizados** em `src/data/cases.ts` (elevando o total de 4 para **6 cases**), cada um com diagrama arquitetural inline em SVG (`diagramNodes`) e página estática `/cases/[slug]`:
  1. `acervo-marc21-biblioteca-catalogacao` — **Saneamento de acervo MARC21, catalogação e ficha catalográfica** (`2023–2024`)
  2. `fluxos-pesquisa-extensao-bolsas` — **Fluxos de Pesquisa, Extensão, bolsas e curricularização** (`2023–2024`)
- Refinar os 2 cases transversais existentes (`verificacao-digital-diplomas-documentos` e `sustentacao-multi-institucional-regras-criticas`) para refletir o ciclo `2023–2026`, eliminar sobreposições com o novo case de biblioteca e incorporar auditorias forenses em PostgreSQL, processamento de matrículas, pós-graduação e declarações docentes.
- Manter `/curriculo.pdf` legível, ATS-friendly e estritamente dentro de **até 2 páginas A4** mesmo com 6 destaques técnicos.
- Reforçar a guarda de confidencialidade (`tests/confidentiality-guard.ts`) com hashes SHA-256 opacos para cobrir integralmente as 12 instituições e os 4 sistemas corporativos.

### Não-Objetivos
- Não alterar a identidade visual, paleta Claro/Escuro, tipografia, estrutura linear da home ou rotas existentes (além dos 2 novos slugs gerados automaticamente por `generateStaticParams`).
- Não alterar os 4 projetos públicos selecionados, a trajetória profissional, a formação acadêmica nem as certificações.

### Anti-Objetivos
- Zero vazamento de confidencialidade/NDA: nenhum nome ou sigla de instituição cliente, sigla interna de sistema corporativo, número de OS/chamado, URL interna, nome de usuário final ou credencial em texto claro em código, conteúdo, testes, PDF ou histórico Git.
- Não inflar ou inventar métricas percentuais não documentadas.
- Não quebrar o limite de 2 páginas A4 do `/curriculo.pdf` nem reduzir a legibilidade tipográfica abaixo de padrões ATS.

---

## 3. Restrições

- Cumprir integralmente todas as convenções de `AGENTS.md`: 100% PT-BR, sem `i18n`, sem foto, autoria Git local `Francisco Filho <fcofilho0809@gmail.com>`, sem anti-padrões visuais proibidos, aspas tipográficas (`“”`) e reticências (`…`).
- Manter a camada única de dados tipados (`src/data/*.ts`) como fonte de verdade para `/`, `/cases/[slug]`, `/curriculo`, `/curriculo.pdf`, `sitemap.xml` e `opengraph-image`.
- Todos os testes (`npm run test`), checagem de tipos (`npm run typecheck`), lint (`npm run lint`) e build estático (`npm run build`) devem passar integralmente.

---

## 4. Abordagens Consideradas e Escolha

| Abordagem | Resumo | Trade-offs | Decisão |
|---|---|---|---|
| **1. +2 novos estudos de caso dedicados (total: 6 cases)** | Cria cases dedicados para *Acervo MARC21 / Biblioteca* e *Pesquisa, Extensão e Curricularização*, e consolida auditorias SQL e regras acadêmicas (2023–2026) nos cases existentes. | Home equilibrada com 6 domínios distintos e sem sobreposição; ajuste leve de espaçamento no `/curriculo.pdf` mantém o documento em 2 páginas A4. | **Escolhida por Francisco.** Dá protagonismo às duas frentes novas mais volumosas e tecnicamente distintas mantendo o dossiê enxuto. |
| **2. +3 novos estudos de caso dedicados (total: 7 cases)** | Separa também um 7º case só para regras acadêmicas, matrículas e auditorias forenses em PostgreSQL. | Alonga bastante a home linear, cria sobreposição com o case de Sustentação e obriga omitir cases no PDF de 2 páginas. | Descartada. |
| **3. +1 novo estudo de caso (total: 5 cases)** | Cria apenas o case de Biblioteca/MARC21 e absorve Pesquisa/Extensão no case de Sustentação. | Home e PDF ainda mais curtos, mas dilui uma frente completa (34 entregas de Pesquisa, Extensão e bolsas) em um case genérico. | Descartada. |

---

## 5. Decisões de Conteúdo e Estrutura

### Métricas (`src/data/profile.ts`)
- `6+ anos` — em desenvolvimento de software (desde Mar/2020)
- `12 instituições` — públicas de ensino atendidas na ESIG
- `250+ entregas` — mapeadas no ciclo 2023–2026

### Os 6 Estudos de Caso (`src/data/cases.ts`)
1. **`motor-socioeconomico-auxilios`** (`2026`) — mantido integralmente.
2. **`apis-rest-sistema-academico`** (`2026`) — mantido integralmente.
3. **`verificacao-digital-diplomas-documentos`** (`2023–2026`) — refinado para focar exclusivamente em diplomas, certificados, declarações e dossiês oficiais: incorpora cadastro de reconhecimento e diplomas de pós-graduação (Lato e Stricto Sensu) e emissão da Declaração de Orientações Ministradas no portal docente; remove a menção isolada a etiquetas físicas de biblioteca (movida para o case dedicado).
4. **`acervo-marc21-biblioteca-catalogacao`** (`2023–2024`, **novo**) — saneamento e padronização em lote de acervo bibliográfico MARC21 no PostgreSQL (campos de cabeçalho/publicação/catalogação, limpeza de tags locais obsoletas, sincronização de classificação CDU e áreas CNPq), correção de conflito de `sequence` em cache MARC com batch JDBC/Hibernate, restauração de rotina agendada de reservas vencidas no módulo de administração, regras parametrizadas de multas/suspensão e fluxo ponta a ponta de ficha catalográfica e impressão de etiquetas com código de barras e lombada.
   - **Diagrama SVG (5 nós):** `Acervo migrado (MARC21)` → `Saneamento SQL em lote` → `Cache MARC e rotinas` → `Catalogação e multas` → `Ficha e etiquetas`.
5. **`fluxos-pesquisa-extensao-bolsas`** (`2023–2024`, **novo**) — reestruturação do cadastro externo de projetos de pesquisa (financiamento customizado, obrigatoriedade de PDF, currículo docente e validação dedicada pela pró-reitoria), ciclo de avaliação e prorrogação (novos status, seção de prorrogação, distribuição manual de projetos/relatórios e notificações multiperfil), submissão e creditação de extensão com cálculo de frequência, bloqueio de acúmulo de bolsas e enriquecimento da homologação integrada ao módulo administrativo, além de correções em produção de batch JDBC/Hibernate e certificados.
   - **Diagrama SVG (5 nós):** `Submissão e projetos externos` → `Autorização e avaliação` → `Notificações e parecer` → `Bolsas e homologação` → `Curricularização e certificados`.
6. **`sustentacao-multi-institucional-regras-criticas`** (`2023–2026`) — atualizado para **250+ entregas**, **4 sistemas corporativos** (acadêmico, administrativo/protocolo, RH e administração/rotinas agendadas) e **12 instituições públicas**, incorporando as **12 auditorias forenses em PostgreSQL** (matrículas, histórico, auxílios e carga docente), apoio ao processamento de matrículas e regras acadêmicas críticas (Guarda Religiosa com reflexo na frequência, desmembramento de avaliações por componente curricular, equivalências com grau acadêmico e calendário/plano de matrícula de ingressantes).

### Currículo Web e PDF (`/curriculo` e `/curriculo.pdf`)
- `src/app/curriculo/page.tsx`: atualizar legenda da seção de destaques para `(2023–2026)`.
- `src/lib/pdf.ts`: calibrar espaçamentos verticais (mantendo fontes legíveis para ATS) para renderizar todos os 6 destaques técnicos em **até 2 páginas A4** sem cabeçalhos órfãos.

### Guarda de Confidencialidade e Documentação
- `tests/confidentiality-guard.ts`: acrescentar hashes SHA-256 opacos faltantes para fechar 100% de cobertura sobre as 12 instituições e os 4 sistemas corporativos.
- Atualizar `README.md` e a suíte de testes (`data-integrity`, `home`, `case-page`, `pdf`, `confidentiality`) para validar os 6 cases, as métricas atualizadas e o limite de 2 páginas do PDF.

---

## 6. O que fica a critério da implementação

- Ajuste fino de espaçamento e line-height em `src/lib/pdf.ts` para manter equilíbrio visual em 2 páginas A4.
- Redação final de cada campo (`summary`, `problem`, `constraints`, `solution`, `result`, `diagramNodes`) mantendo rigor factual, tom técnico direto e medida confortável de leitura.
- Verificação visual no navegador real (desktop e mobile, temas Claro e Escuro) após o build estático.
