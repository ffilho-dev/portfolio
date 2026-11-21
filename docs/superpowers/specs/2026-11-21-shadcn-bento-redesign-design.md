# Redesign do Portfólio — Bento Modular Interativo com `shadcn/ui` (Opção C)

**Data:** 2026-11-21  
**Diretório do projeto:** `/home/franciscofilho/Projects/portfolio`  
**Documento:** `docs/superpowers/specs/2026-11-21-shadcn-bento-redesign-design.md`  
**Protótipo validado:** Opção C (*Bento Modular Interativo*) aprovada por Francisco em 2026-11-21.

---

## 1. Intenção e Porquê

O portfólio atual (`ffilho.dev`) já consolidou conteúdo factual sólido e anonimizado (`6+ anos`, `12 instituições`, `250+ entregas`, 6 estudos de caso em produção, 4 projetos públicos, 3 pilares de IA no fluxo, trajetória completa e geração de currículo web + PDF vetorial), mas apresenta toda a home em uma **coluna editorial vertical linear** com divisórias simples.

Como o posicionamento do site é voltado a **vagas FullStack no mercado brasileiro**, a interface precisa demonstrar domínio prático de padrões modernos de UI de produto — filtragem instantânea, inspeção em camadas (`Sheet`, `Dialog`, `Command ⌘K`, `Tabs`, `Accordion`) e cruzamento interativo de informações — sem perder a facilidade de leitura contínua esperada por recrutadores de RH nem a rastreabilidade estática de SEO para tech leads.

A migração para o design system **`shadcn/ui`** em arquitetura **Bento Modular Interativo (Opção C)** resolve esse objetivo: transforma a página inicial em uma vitrine viva de padrões de interface acessíveis e reutilizáveis, alinha visualmente as rotas secundárias (`/cases/[slug]` e `/curriculo`), e atualiza o link do LinkedIn para `https://www.linkedin.com/in/francisco-filho-41793411a/`.

---

## 2. Objetivos, Não-Objetivos e Anti-Objetivos

### Objetivos
- Adotar componentes reais do **`shadcn/ui`** instalados via CLI em `src/components/ui/` sobre Tailwind CSS v4, React 19 e Next.js 16 (App Router estático / SSG), mantendo `src/data/*.ts` como fonte única de verdade.
- Substituir o layout linear atual da Home (`/`) pela arquitetura **Bento Modular Interativo (Opção C)**:
  - Hero Bento assimétrico (8 + 4 colunas) com métricas tabulares e canais diretos.
  - Vitrine de 6 estudos de caso em grid Bento filtrável por tecnologia (`ToggleGroup`), com inspeção instantânea em `Sheet` lateral (incluindo diagrama interativo por etapas e navegação entre cases) e link estático direto para `/cases/[slug]`.
  - Bloco técnico lado a lado combinando **IA no fluxo** em `Tabs` interativas e **Projetos públicos selecionados** em `Card`.
  - **Stack técnica interativa** com cross-highlight: clicar em uma tecnologia exibe em quais cases e projetos públicos ela aparece.
  - **Trajetória** em `Accordion` (ESIG aberta por padrão, múltiplas entradas expansíveis) ao lado de **Formação** e **Certificações**, com os 16 módulos do `curso.dev` acessíveis em `Dialog` modal.
  - **Command Palette (`⌘K` / `Ctrl K`)** global no cabeçalho para navegação rápida, busca de cases/projetos, ações de contato e alternância de tema.
  - Feedback visual estilo **Sonner Toast** integrado à cópia de e-mail (sem remover a live region `role="status"` acessível).
- Alinhar visualmente as rotas `/cases/[slug]` e `/curriculo` aos mesmos tokens e primitivos `shadcn/ui`, preservando intactos o fluxo de impressão A4 (`@media print`) e o PDF vetorial `/curriculo.pdf` (até 2 páginas A4).
- Adotar a base neutra **Zinc** do `shadcn/ui` combinada com o acento semântico **Petróleo (`#0f4c5c`) no modo claro** e **Âmbar (`#e09f3e`) no modo escuro**, mapeados sobre o sistema anti-FOUC existente (`<meta name="color-scheme">` + `light-dark()`).
- Atualizar `profile.contact.linkedinUrl` em `src/data/profile.ts` para `https://www.linkedin.com/in/francisco-filho-41793411a/` (propagando para Home, Footer, `/curriculo`, `/curriculo.pdf` e testes).

### Não-Objetivos
- Não introduzir banco de dados, CMS, autenticação, formulários com backend próprio ou carregamento remoto de dados em runtime.
- Não adicionar internacionalização (`i18n`) nem foto pessoal no site ou no currículo.
- Não alterar a estrutura textual/layout do gerador vetorial `/curriculo.pdf` além da atualização automática do link do LinkedIn vinda de `src/data/profile.ts`.
- Não inventar novos estudos de caso, métricas, percentuais ou projetos públicos além dos dados documentados em `src/data/*.ts`.

### Anti-Objetivos
- **Vazamento de confidencialidade/NDA:** zero nomes ou siglas de instituições clientes, siglas internas proprietárias, números de OS/chamado, URLs internas ou credenciais em texto claro em código, dados, testes, PDF ou histórico Git.
- **Violação das regras de `AGENTS.md`:** zero rótulos em CAIXA ALTA acima de títulos, numeração decorativa (`01 / 02`), cadeias `A · B · C`, setas `→` em botões ou links, barrinhas de porcentagem de skill, `transition: all` (`transition-all`) ou `100vw`.
- **Perda de acessibilidade ou SEO:** não esconder rotas `/cases/[slug]` atrás apenas de eventos `onClick` sem `<Link>` acessível no DOM; não quebrar navegação por teclado, `forced-colors`, `prefers-reduced-motion`, skip link ou anti-FOUC.
- **FOUC ou quebra de contraste no tema escuro/claro:** não introduzir `next-themes` com flash na hidratação nem colisão de nomes entre tokens legados (`--muted`, `--accent`) e tokens do `shadcn/ui`.

---

## 3. Restrições

- **Stack obrigatória (`AGENTS.md`):** Next.js App Router (estático, SSG), React 19, TypeScript (`strict: true`), Tailwind CSS v4, `pdf-lib`, Vitest + Testing Library + `jsdom`, ESLint, Node.js 24 (`npm`).
- **Idioma e tipografia:** 100% PT-BR, `Plus Jakarta Sans` (principal) e `IBM Plex Mono` (restrita a diagramas, rotas, atalhos e números tabulares); prosa `<= 68ch`; `text-wrap: balance` em títulos; `tabular-nums` em números; aspas tipográficas (`“”`) e reticências (`…`).
- **Tema e padrões web modernos:** `<meta name="color-scheme" content="light dark">` + script inline síncrono anti-FOUC resiliente a `SecurityError` no `localStorage`, `color-scheme: light dark` em `:root`, `light-dark()` com fallback `@media (prefers-color-scheme: dark)`, `overflow-x: clip`, propriedades lógicas de CSS, `@media (forced-colors: active)`, `@media (prefers-reduced-motion: reduce)`, `:focus-visible`, skip link e HTML semântico.
- **Auditoria de código gerado pelo CLI `shadcn/ui`:** qualquer `transition-all` emitido por templates padrão em `src/components/ui/*` deve ser substituído por propriedades explícitas (ex.: `transition-[color,background-color,border-color,box-shadow,opacity]`), e animações de entrada/saída devem respeitar `prefers-reduced-motion`.
- **Autoria Git:** manter `Francisco Filho <fcofilho0809@gmail.com>`.
- **Qualidade obrigatória:** `npm run lint`, `npm run typecheck`, `npm run test` e `npm run build` devem passar sem erros.

---

## 4. Abordagens Consideradas e Escolha

Antes de definir o redesign, foram prototipadas de forma interativa 3 arquiteturas distintas sobre o design system `shadcn/ui` com dados reais do portfólio:

| Abordagem | Resumo | Trade-offs | Decisão |
|---|---|---|---|
| **Opção A — App Shell (`Sidebar` colapsável + `Data Table` + `Sheet` + `⌘K`)** | Portfólio como aplicação corporativa com navegação lateral fixa/colapsável, breadcrumb, tabela filtrável de cases e views separadas. | Forte impacto visual de produto SaaS e triagem ultrarrápida para perfil técnico; porém quebra a expectativa de leitura vertical contínua de recrutadores de RH e segmenta conteúdo em abas de navegação. | Descartada. |
| **Opção B — Master-Detail Split Pane (`Resizable` + Inspetor)** | Workspace em duas colunas com divisor arrastável: lista selecionável à esquerda e leitor de case/diagrama à direita. | Excelente ergonomia para leitura técnica comparativa dos 6 cases sem trocar de tela; porém exige fluxo completamente diferente no mobile e soa menos convencional para triagem inicial de RH. | Descartada. |
| **Opção C — Bento Modular Interativo (`Bento Grid` + Filtros + `Sheet` + `Tabs` + `Accordion` + `Dialog` + `⌘K`)** | Página rolável em grid assimétrico modular combinada com camadas interativas (filtro por stack, `Sheet` de case, cross-highlight de tecnologias, `Tabs` de IA, `Accordion` de experiência, `Dialog` dos 16 módulos e `Command ⌘K`). | Equilibra familiaridade de leitura contínua para RH com demonstração concreta de padrões modernos de `shadcn/ui`, convivendo naturalmente com as rotas estáticas `/cases/[slug]`, `/curriculo` e `/curriculo.pdf`. | **Escolhida por Francisco.** |

---

## 5. Decisões de Arquitetura, Design System e Conteúdo

### 5.1 Configuração e Componentes `shadcn/ui`
- Inicializar `components.json` compatível com Next.js App Router + Tailwind CSS v4 (`rsc: true`, `tsx: true`, `baseColor: "zinc"`, `cssVariables: true`, `iconLibrary: "lucide"`, `tailwind.css: "src/app/globals.css"`, aliases `@/components`, `@/components/ui`, `@/lib/utils`).
- Utilitário `src/lib/utils.ts` com `cn(...inputs: ClassValue[])` (`clsx` + `tailwind-merge`).
- Instalar em `src/components/ui/` os componentes necessários para a Opção C:
  - `button.tsx`
  - `card.tsx`
  - `badge.tsx`
  - `tabs.tsx`
  - `sheet.tsx`
  - `dialog.tsx`
  - `accordion.tsx`
  - `command.tsx`
  - `toggle.tsx` e `toggle-group.tsx`
  - `separator.tsx`
  - `sonner.tsx` (`Toaster` montado no `RootLayout`, respeitando o tema resolvido pelo sistema de color-scheme do projeto, sem introduzir `next-themes`)
- Ícones padronizados via `lucide-react` (`strokeWidth` discreto), sem setas textuais `→` em botões ou links.
- Nenhum componente em `src/components/ui/` pode conter `transition-all` ou `100vw`.

### 5.2 Tokens Semânticos e Sistema de Tema Anti-FOUC
Para evitar colisão entre os tokens legados (`--muted` como texto e `--accent` como cor de marca) e a convenção oficial do `shadcn/ui` (`--muted` e `--accent` como superfícies neutras), todo o projeto migra para o conjunto semântico abaixo em `src/app/globals.css`, exposto ao Tailwind v4 via `@theme inline`:

| Token semântico | Claro (Zinc + Petróleo) | Escuro (Zinc + Âmbar) | Papel |
|---|---|---|---|
| `--background` | `#ffffff` | `#09090b` | Fundo da página |
| `--foreground` | `#09090b` | `#fafafa` | Texto principal |
| `--card` / `--popover` | `#ffffff` | `#0f0f12` / `#111114` | Superfície de cards e overlays |
| `--card-foreground` / `--popover-foreground` | `#09090b` | `#fafafa` | Texto em cards e overlays |
| `--primary` / `--primary-foreground` | `#18181b` / `#fafafa` | `#fafafa` / `#18181b` | Ações primárias de alto contraste |
| `--secondary` / `--secondary-foreground` | `#f4f4f5` / `#18181b` | `#27272a` / `#fafafa` | Ações secundárias e badges padrão |
| `--muted` / `--muted-foreground` | `#f4f4f5` / `#52525b` | `#1c1c20` / `#a1a1aa` | Superfícies suaves e texto secundário (contraste >= 4.5:1) |
| `--accent` / `--accent-foreground` | `#f4f4f5` / `#18181b` | `#27272a` / `#fafafa` | Estados de hover/seleção neutros |
| `--border` / `--input` | `#e4e4e7` / `#d4d4d8` | `#27272a` / `#3f3f46` | Divisórias e bordas de campos |
| `--ring` | `#18181b` | `#d4d4d8` | Anel de foco (`:focus-visible`) |
| `--signal` / `--signal-foreground` | `#0f4c5c` / `#ffffff` | `#e09f3e` / `#09090b` | Acento discreto de marca (cargos, indicadores ativos, links destacados e terminais do diagrama) |
| `--signal-soft` / `--signal-border` | `#ecfeff` / `#a5f3fc` | `#271f12` / `#5c431a` | Fundo suave e borda de destaque contextual (resultado prático, cross-highlight) |
| `--radius` | `0.625rem` | `0.625rem` | Raio base do design system |

**Integração com anti-FOUC (`src/lib/theme.ts`, `src/app/globals.css` e `src/components/ThemeToggle.tsx`):**
- Atualizar `THEME_COLOR_LIGHT = "#FFFFFF"` e `THEME_COLOR_DARK = "#09090B"`.
- Manter `<meta name="color-scheme" content="light dark">`, `color-scheme: light dark` em `:root`, `light-dark()` com fallback `@media (prefers-color-scheme: dark)` e os seletores `:root:where(:has(> head > meta[name="color-scheme"][content="dark" | "light"]))` — garantindo funcionamento completo mesmo sem JavaScript.
- Sincronizar a classe `.dark` em `document.documentElement` (usada pelo `@custom-variant dark (&:where(.dark, .dark *));` para utilitários `dark:*` dos componentes `shadcn/ui`) no mesmo script inline síncrono `THEME_INIT_SCRIPT`, em `applySchemeToDocument` e no listener de `prefers-color-scheme` em `ThemeToggle` — mantendo resiliência a `SecurityError` no `localStorage`, zero FOUC e `suppressHydrationWarning` em `<html>`.
- Evitar mapeamento circular de fontes no `@theme inline` do Tailwind v4 (usar variáveis distintas vindas de `next/font/google`, ex.: `--font-jakarta` e `--font-plex-mono`, mapeadas para `--font-sans` e `--font-mono`).
- Preservar `@media (forced-colors: active)`, `@media (prefers-reduced-motion: reduce)` e `@media print` (forçando tema claro de alto contraste na impressão A4 e garantindo que utilitários `dark:*` não afetem o modo de impressão).
- Atualizar `CaseDiagram.tsx` para consumir os novos tokens (`var(--card)`, `var(--background)`, `var(--foreground)`, `var(--muted-foreground)`, `var(--border)`, `var(--signal)`), mantendo intacta a geometria, `viewBox`, acessibilidade (`role="img"`, `aria-label`) e quebra de tokens longos.

### 5.3 Atualizações na Camada Única de Dados (`src/data/*.ts`)
- **`src/data/profile.ts`:** alterar `contact.linkedinUrl` para `"https://www.linkedin.com/in/francisco-filho-41793411a/"`.
- **`src/data/types.ts` e `src/data/cases.ts`:** adicionar a cada `CaseStudy`:
  - `domain: string` — rótulo funcional conciso para o badge de domínio no card e no cabeçalho do `Sheet` (`"Assistência estudantil"`, `"Integrações & APIs"`, `"Documentos oficiais"`, `"Biblioteca & Dados"`, `"Pesquisa & Extensão"`, `"Sustentação crítica"`).
  - `shortTitle: string` — título resumido para controles compactos (próximo case no `Sheet`, chips do cross-highlight e paleta `⌘K`).
- **`src/data/types.ts` e `src/data/skills.ts`:** adicionar a cada `AiPillar`:
  - `id: string` (`"contexto"`, `"multistack"`, `"verificacao"`).
  - `shortTitle: string` (`"Contexto disciplinado"`, `"Aceleração multi-stack"`, `"Especificação e revisão"`).
  - `artifacts: readonly string[]` (3 itens factuais resumindo os artefatos já descritos no pilar, sem inventar ferramentas novas).
- Todos os novos campos permanecem sob a guarda automatizada de confidencialidade (`tests/confidentiality.test.ts`).

### 5.4 Arquitetura de Componentes da Home (`/`) — Opção C
A Home permanece um Server Component (`src/app/page.tsx`) que importa os dados tipados de `src/data/*` e compõe blocos client-side granulares apenas onde há interatividade (respeitando `section#cases`, `section#ia`, `section#projetos`, `section#stack`, `section#trajetoria` e `section#contato` no HTML renderizado):

1. **Cabeçalho compartilhado (`SiteHeader`) + Paleta global (`CommandMenu`):**
   - Sticky no topo (`bg-background/95 backdrop-blur border-b border-border`), oculto em impressão (`.no-print`).
   - Identidade `ffilho.dev` (link para `/`), `<nav aria-label="Principal">` com âncoras (`Cases`, `IA no fluxo`, `Projetos`, `Trajetória`, `Currículo`), botão discreto de busca rápida (`⌘K` / `Ctrl K` abrindo o `CommandDialog`), `ThemeToggle` e CTA direto (`WhatsApp` em desktop ou acesso rápido).
   - O `CommandMenu` funciona em **todas as rotas** (montado no layout ou header, junto ao `Dialog` compartilhado dos 16 módulos da certificação para funcionar em qualquer página): permite buscar e navegar para os 6 estudos de caso (abre o `Sheet` quando o usuário está na Home, ou navega para `/cases/[slug]` em qualquer rota), abrir projetos públicos, saltar para `/curriculo`, baixar `/curriculo.pdf`, copiar `contato@ffilho.dev`, abrir o modal dos 16 módulos da certificação ou alternar o tema Claro/Escuro.

2. **Bloco 1 — Bento Hero (Grid 12 colunas em `lg:`):**
   - **Card principal (`lg:col-span-8`):** `Badge` com `profile.title` (estilo `--signal-soft`/`--signal`), localização com ícone `MapPin`, `<h1>` (`Francisco Filho`), `profile.bio` (`<= 68ch`), `profile.availability` e grupo de ações: `Button` primário **WhatsApp**, `Button` outline **Baixar currículo (PDF)** (`/curriculo.pdf`), link/button **Ver currículo** (`/curriculo`) e `CopyEmailButton`.
   - **Coluna lateral (`lg:col-span-4`, empilhada):**
     - **Card de números em produção:** `<dl>` com as 3 métricas de `profile.metrics` (`6+ anos`, `12 instituições`, `250+ entregas`) em `IBM Plex Mono` + `tabular-nums`.
     - **Card de canais diretos:** links rápidos para GitHub (`ffilho-dev`), LinkedIn (`francisco-filho-41793411a`) e e-mail `contato@ffilho.dev`.

3. **Bloco 2 — Vitrine de Cases (`section#cases`) + `CaseSheet`:**
   - Cabeçalho da seção com título **Cases em produção**, subtítulo anonimizado e `ToggleGroup` (seleção única com opção padrão `Todos`) filtrando pelos agrupamentos reais da stack (`Todos`, `Java`, `PostgreSQL`, `APIs REST/JSON`, `JasperReports`, `Hibernate/JPA`) com correspondência por substring normalizada (garantindo que `PostgreSQL/SQL` case com `PostgreSQL`).
   - Grid Bento responsivo (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`) exibindo os cards filtrados.
   - Cada card apresenta: `Badge` de `domain`, período (`tabular-nums`), título (`<h3>`), resumo, badges de stack e rodapé com **dois controles irmãos não aninhados**:
     - `Button` (`variant="outline"`): **Inspecionar case** (abre o `Sheet` lateral para aquele `slug`).
     - `<Link href="/cases/${slug}">` com `aria-labelledby` associado ao `<h3>`: **Ler estudo de caso** (garante SEO, abertura em nova aba e navegação estática direta).
   - **`CaseSheet` (`Sheet` lateral à direita):** exibe `domain`, período, título completo, papel, resumo, badges da stack, **diagrama interativo por etapas** (lista clicável dos `diagramNodes` exibindo o `detail` da etapa selecionada, adaptado à largura estreita do drawer sem rolagem horizontal), as 4 seções factuais (`Problema real`, `Restrições e contexto operacional`, `Solução e decisões técnicas` e destaque `--signal-soft` em `Resultado prático`), além de rodapé com **Abrir página completa** (`/cases/[slug]`), **Próximo case** (troca o conteúdo dentro do próprio `Sheet`) e **Currículo PDF**.

4. **Bloco 3 — Bento Técnico (Grid 12 colunas em `lg:`):**
   - **`section#ia` (`lg:col-span-6`, `Card`):** título **Como trabalho com IA no dia a dia** + `Tabs` do `shadcn/ui` para os 3 pilares (`shortTitle` nas abas; `title`, `description` e chips de `artifacts` no `TabsContent`). O indicador visual da aba ativa usa borda/forma além de cor para manter legibilidade em `forced-colors`.
   - **`section#projetos` (`lg:col-span-6`, `Card`):** título **Projetos públicos selecionados** + lista compacta dos 4 projetos (`publicProjects`), indicando `conta anterior` nos 2 repositórios de `FrankBROFC`, resumo, stack e botões/links `Live` (quando `liveUrl` existir) e `Código` com `aria-labelledby` ligado ao nome do repositório.

5. **Bloco 4 — Stack técnica interativa (`section#stack`, `Card`):**
   - Exibe as 3 categorias de `skillGroups` (`Backend e Dados`, `Frontend e Web`, `Qualidade, Infra e IA`) como botões toggle (`aria-pressed`).
   - Ao clicar em uma tecnologia, ativa o painel contextual **Onde “<tecnologia>” aparece no portfólio** listando:
     - Botões dos cases correspondentes (que abrem diretamente o `CaseSheet` daquele case).
     - Links dos projetos públicos correspondentes (abrindo o repositório).
     - Mensagem honesta quando a tecnologia é de uso transversal/formação sem tag literal nos arrays de case/projeto.
     - Botão **Limpar seleção** para recolher o painel.
   - O algoritmo de correspondência usa tokens normalizados (lidando com strings compostas como `Java (Java EE, Spring Boot)`, `Hibernate/JPA`, `JSF/JSP`, `Selenium (RPA/testes)`).

6. **Bloco 5 — Trajetória, Formação e Certificações (`section#trajetoria`, Grid 12 colunas em `lg:`):**
   - **Experiência profissional (`lg:col-span-7`, `Card`):** `Accordion` em modo `type="multiple"` com a primeira entrada (`ESIG Software`) aberta por padrão (`defaultValue={[firstKey]}`), exibindo empresa + período tabular no trigger (sem headings aninhados de forma inválida) e cargo, cidade e resumo no conteúdo.
   - **Formação e Certificações (`lg:col-span-5`, empilhados):**
     - `Card` **Formação acadêmica:** UFERSA, Bacharelado em Sistemas de Informação, período (`Mar/2020 – Previsão 2027`) e idioma (`Inglês`).
     - `Card` **Certificações:** destaque `curso.dev` (`81h`, `16 módulos`, `06/04/2026`), botão que abre **`Dialog` modal** exibindo a lista completa dos 16 módulos concluídos (numerados de `1.` a `16.`, sem zeros decorativos), link **Verificar certificado** e lista de **Outras certificações**.

7. **Bloco 6 — Contato direto (`section#contato`, `Card`):**
   - Consolida WhatsApp (`(84) 99498-0792`), E-mail (`contato@ffilho.dev`) com `CopyEmailButton` (mantendo a live region `role="status"` testada + disparo de `toast` Sonner), LinkedIn (`linkedin.com/in/francisco-filho-41793411a`) e GitHub (`github.com/ffilho-dev`).

8. **Rodapé (`SiteFooter`):**
   - Alinhado aos novos tokens semânticos (`border-border`, `bg-background`, `text-foreground`, `text-muted-foreground`), oculto em impressão (`.no-print`).

### 5.5 Rotas Secundárias e Ativos Compartilhados
- **`/cases/[slug]` (`src/app/cases/[slug]/page.tsx`):**
  - Mantém SSG (`generateStaticParams`, `dynamicParams = false`), `generateMetadata`, `notFound()`, link `Voltar para cases` (`/#cases`), os 4 headings obrigatórios (`Problema real`, `Restrições e contexto operacional`, `Solução e decisões técnicas`, `Resultado prático`), link circular `Próximo estudo de caso`, CTAs para `/curriculo` e `/curriculo.pdf` e o `CaseDiagram` SVG `variant="expanded"`.
  - Adota o sistema visual `shadcn/ui`: cabeçalho e metadados (`Contexto`, `Período`, `Papel`, `Stack`) em `Card` + `Badge`s (`domain` e stack), seção do diagrama em `Card`, seções de análise em blocos bem estruturados (com destaque `--signal-soft` em `Resultado prático`) e ações com `Button`.
- **`/curriculo` (`src/app/curriculo/page.tsx`):**
  - Barra de controle superior (`.no-print`) com `Button` do `shadcn/ui` (`Voltar ao portfólio`, `Baixar PDF`, `Imprimir` via `PrintButton`).
  - Folha de currículo em tela usando `Card` e tokens semânticos do `shadcn/ui` (exibindo o novo LinkedIn via `profile.contact.linkedinUrl`).
  - Regras `@media print` preservadas integralmente para saída A4 limpa sem sombras, bordas externas nem elementos `.no-print`.
- **`/curriculo.pdf` (`src/lib/pdf.ts`):**
  - Sem mudança estrutural; consome `profile.contact.linkedinUrl` atualizado e mantém limite rigoroso de até 2 páginas A4 e texto selecionável ATS-friendly.
- **`src/app/opengraph-image.tsx`:**
  - Alinha cores da imagem OG para Zinc claro (`#FFFFFF`, `#09090B`, `#E4E4E7`, `#52525B`) mantendo a faixa superior e destaque em Petróleo (`#0F4C5C`).

### 5.6 Estratégia de Testes
- Preservar todos os testes existentes e expandi-los para cobrir os novos comportamentos:
  - `tests/data-integrity.test.ts`: atualizar asserção do LinkedIn para `francisco-filho-41793411a` e validar `domain`/`shortTitle` dos cases e `id`/`shortTitle`/`artifacts` dos pilares de IA.
  - `tests/confidentiality.test.ts`: segue varrendo integralmente `profile`, `caseStudies`, `publicProjects`, `skillGroups` e `aiPillars` (incluindo novos campos).
  - `tests/theme.test.ts` e `tests/ThemeToggle.test.tsx`: cobrir também a sincronização da classe `.dark` em `document.documentElement` junto com `<meta name="color-scheme">` e novos `THEME_COLOR_LIGHT`/`THEME_COLOR_DARK`.
  - `tests/home.test.tsx`: verificar hero Bento, 3 métricas, 6 âncoras, 6 links `/cases/[slug]`, filtro de cases por tecnologia, abertura e navegação no `CaseSheet`, `Tabs` de IA, cross-highlight da stack técnica, `Accordion` de experiência, abertura do `Dialog` com os 16 módulos e acionamento do `CommandMenu` (`⌘K`).
  - `tests/case-page.test.tsx`, `tests/curriculo.test.tsx`, `tests/CopyEmailButton.test.tsx`, `tests/pdf.test.ts`, `tests/site.test.ts`: todos verdes com o novo LinkedIn e os novos tokens.

---

## 6. O que fica a critério do implementador

- Organização modular dos Client Components da Home (por exemplo, `src/components/home/CasesBentoSection.tsx`, `CaseSheet.tsx`, `AiTabsCard.tsx`, `InteractiveStackCard.tsx`, `TrajectorySection.tsx`, `CommandMenu.tsx`) e compartilhamento de estado mínimo entre o cross-highlight de stack, o `CommandMenu` e o `CaseSheet` (via estado local em um wrapper client da Home ou evento/contexto leve).
- Detalhes finos de espaçamento, tipografia responsiva e tamanhos de padding dentro do grid Bento, desde que respeitem `<= 68ch` na prosa, contraste WCAG AA, toque mínimo em `pointer: coarse` e zero `100vw` / `transition-all`.
- Configuração de setup de testes em `vitest.setup.ts` (por exemplo, polyfills leves de `ResizeObserver` / `scrollIntoView` / `matchMedia` exigidos por primitivos Radix UI e `cmdk` no ambiente `jsdom`).
- Escolha entre instalar o pacote unificado `radix-ui` ou pacotes `@radix-ui/react-*` individuais conforme o output oficial do CLI `npx shadcn@latest` na versão corrente compatível com React 19 e Tailwind CSS v4.
