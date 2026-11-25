# AGENTS.md

Regras e convenções obrigatórias para qualquer alteração neste repositório.

## Idioma, público e posicionamento

- **100% PT-BR**, voltado ao mercado brasileiro e focado em vagas **FullStack**.
- Sem internacionalização (`i18n`) e sem foto pessoal no site ou no currículo.
- Fidelidade factual: não inventar métricas, percentuais ou resultados não documentados.

## Confidencialidade / NDA

- **Zero** nomes ou siglas de instituições clientes em código, dados, testes, PDF ou histórico Git.
- **Zero** siglas internas de sistemas acadêmicos/administrativos proprietários, números de OS/chamado, URLs internas ou credenciais em texto claro.
- Todos os estudos de caso devem ser apresentados de forma anonimizada por domínio funcional.

## Git e autoria local

- Manter a autoria local do repositório como `Francisco Filho <fcofilho0809@gmail.com>`.
- Nunca realizar commits com e-mail corporativo.

## Stack e ferramentas

- Next.js App Router (estático, SSG, sem banco de dados ou CMS), React 19, TypeScript (`strict: true`), Tailwind CSS v4, `pdf-lib`, Vitest + Testing Library + `jsdom`, ESLint, Node.js 24 (`npm`).
- Camada única de dados tipados em `src/data/*.ts` alimentando a home (`/`), estudos de caso (`/cases/[slug]`), currículo web (`/curriculo`) e PDF vetorial (`/curriculo.pdf`).
- Sempre que atualizar conteúdo do portfólio (`src/data/*.ts`, páginas ou estudos de caso), atualizar `SITE_LAST_MODIFIED` (`YYYY-MM-DD`) em `src/lib/site.ts` para manter o `<lastmod>` de `sitemap.xml` e o `dateModified` do JSON-LD sincronizados.

## Design e padrões web (`frontend-design` + `modern-web-guidance`)

- **Tipografia:** `Plus Jakarta Sans` (principal) e `IBM Plex Mono` (restrita a diagramas, rotas e números tabulares); prosa com largura máxima `<= 68ch`; `text-wrap: balance` em títulos; `tabular-nums` em números; usar aspas tipográficas (`“”`) e reticências (`…`).
- **Anti-padrões proibidos:** rótulos em CAIXA ALTA acima de títulos, numeração falsa (`01 / 02`), cadeias decorativas `A · B · C`, `→` em botões ou links, barrinhas de porcentagem de skill, `transition: all` e `100vw`.
- **Tema e acessibilidade:** `<meta name="color-scheme" content="light dark">` + script inline síncrono anti-FOUC resiliente a `SecurityError` no `localStorage`, `color-scheme: light dark` em `:root`, `light-dark()` com fallback `@media (prefers-color-scheme: dark)`, `overflow: clip`, propriedades lógicas de CSS, `@media (forced-colors: active)`, `@media (prefers-reduced-motion: reduce)`, `:focus-visible`, skip link e HTML semântico.
