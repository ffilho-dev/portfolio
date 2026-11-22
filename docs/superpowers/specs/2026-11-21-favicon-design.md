# Redesign do Favicon — Terminal Prompt `>F_` (Opção C)

**Data:** 2026-11-21  
**Escopo:** Mudança pequena — atualização de `src/app/icon.svg`, `src/app/favicon.ico`, marca visual ao lado de `ffilho.dev` em `src/components/SiteHeader.tsx` e testes de integridade para representar visualmente o portfólio de desenvolvedor (`ffilho.dev`).

---

## 1. Intenção e Porquê

O favicon anterior exibia apenas o monograma **“FF”** (além de ainda usar o tom escuro legado `#161B22` anterior à migração para a base neutra `Zinc #09090B`). Embora identificasse as iniciais de Francisco Filho, não comunicava a natureza do site ao olhar para a aba do navegador.

O novo favicon (**Opção C — Terminal Prompt `>F_`**) funde o símbolo universal de desenvolvimento/terminal (`>_`) com a inicial `F` de `ffilho.dev`, permitindo que qualquer recrutador ou tech lead reconheça imediatamente na aba de `16×16 px` que se trata do **portfólio de um desenvolvedor**, sem perder a assinatura pessoal.

---

## 2. Objetivos, Não-Objetivos e Anti-Objetivos

### Objetivos
- Substituir `src/app/icon.svg` pelo novo símbolo **`>F_`** em `viewBox="0 0 32 32"`, com adaptação automática via `@media (prefers-color-scheme: dark)` alinhada aos tokens atuais do design system (`Zinc` + Petróleo `#0F4C5C` no claro; `Zinc #09090B` + Âmbar `#E09F3E` no escuro).
- Regenerar `src/app/favicon.ico` (contendo os frames `16×16` e `32×32` em RGBA 32-bit) com a mesma geometria **`>F_`**, garantindo consistência em navegadores e agregadores que requisitam `/favicon.ico`.
- Exibir o ícone **`>F_`** inline (`aria-hidden="true"`, `size-5` / `20×20 px`) ao lado esquerdo de `ffilho.dev` no link principal de `src/components/SiteHeader.tsx`, sincronizado tanto com a preferência do sistema quanto com o `ThemeToggle` manual (`Claro` / `Escuro`).
- Adicionar verificação automatizada em `tests/site.test.ts` e `tests/home.test.tsx` garantindo a presença dos 3 elementos gráficos (`>`, `F`, `_`), adaptação `prefers-color-scheme: dark`, validade do header ICO multi-resolução e renderização acessível da marca no `SiteHeader`.

### Não-Objetivos
- Não alterar layout das seções da Home, páginas de estudo de caso, currículo ou conteúdo textual do portfólio.

### Anti-Objetivos
- Não usar traços finos ou detalhes excessivos que virem ruído ilegível em `16×16 px`.
- Não violar nenhuma regra de `AGENTS.md`.

---

## 3. Restrições

- Manter compatibilidade nativa com a convenção de arquivos de metadados do Next.js App Router (`src/app/icon.svg` e `src/app/favicon.ico`).
- Garantir contraste elevado tanto sobre barras de abas claras quanto escuras.
- Passar integralmente em `npm run lint`, `npm run typecheck`, `npm run test` e `npm run build`.
- Manter autoria Git local `Francisco Filho <fcofilho0809@gmail.com>`.

---

## 4. Abordagens Consideradas e Escolha

| Abordagem | Resumo | Trade-offs | Decisão |
|---|---|---|---|
| **Opção A — Bento Code Grid** | Mosaico modular Bento (espelhando o layout 8+4 da Home) com prompt `>_` no bloco principal. | Muito fiel à arquitetura da Home, porém divide a área de `16×16 px` em 4 blocos menores. | Descartada. |
| **Opção B — Janela Web Full Stack (`</>`)** | Janela com barra de título superior e emblema `</>` centralizado. | Leitura universal de aplicação/desenvolvedor web, mas genérica e sem vínculo com a identidade `ffilho.dev`. | Descartada. |
| **Opção C — Terminal Prompt `>F_`** | Prompt de execução `>_` integrado à inicial `F` (`>F_`). | Apenas 3 formas geométricas largas e espaçadas; leitura instantânea de “dev” + identidade `F` em `16×16 px`. | **Escolhida por Francisco.** |
| **Opção D — Code Tag `<F>`** | Inicial `F` envolvida por brackets `<` e `>`. | Simétrico, mas comprime 3 glifos na mesma faixa horizontal em `16×16 px`. | Descartada. |

---

## 5. Decisões do Como Construir

- **Geometria (`viewBox="0 0 32 32"`):**
  - Base arredondada `32×32` com `rx="6"`.
  - **Chevron `>`** à esquerda (`M 5.5 11 L 11.5 16 L 5.5 21`, `stroke-width="3"`, `stroke-linecap="round"`, `stroke-linejoin="round"`).
  - **Monograma `F`** geométrico ao centro (`M 15 9 H 24 V 12.5 H 18.5 V 15 H 23 V 18.5 H 18.5 V 23 H 15 V 9 Z`).
  - **Cursor `_`** de terminal à direita inferior (`x="22" y="20.5" width="5.5" height="3" rx="1"`).
- **Paleta adaptativa (`src/app/icon.svg`):**
  - **Claro (padrão):** fundo Petróleo `#0F4C5C`, letra `F` em branco `#FFFFFF`, prompt `>` e cursor `_` em ciano claro `#A5F3FC` (`--signal-border-light`) para diferenciar claramente o símbolo de terminal da letra `F`.
  - **Escuro (`@media (prefers-color-scheme: dark)`):** fundo Zinc `#09090B` com moldura interna de `2px` (`rx="5"`) em Âmbar `#E09F3E` (destacando o ícone mesmo sobre abas escuras), letra `F` em `#FAFAFA`, prompt `>` e cursor `_` em Âmbar `#E09F3E` (`--signal-dark`).
- **Fallback raster (`src/app/favicon.ico`):**
  - Arquivo `.ico` válido contendo exatamente 2 imagens PNG/BMP (`16×16` e `32×32`, 32 bits/pixel) renderizadas com anti-aliasing limpo a partir da geometria `>F_`.
- **Marca no cabeçalho (`src/components/SiteHeader.tsx`):**
  - SVG inline decorativo (`aria-hidden="true"`, `viewBox="0 0 32 32"`, `className="size-5 shrink-0"`) posicionado imediatamente antes de `{profile.handle}` dentro do `<Link href="/">` (com `gap-2`), preservando o nome acessível `"ffilho.dev"` do link e reagindo instantaneamente ao tema ativo (claro/escuro) do documento.

---

## 6. O que fica a critério do implementador

- Script utilitário de geração binária do `src/app/favicon.ico` (16×16 e 32×32) sem adicionar dependências pesadas de runtime ao `package.json`.
- Estrutura das asserções unitárias em `tests/site.test.ts`.
