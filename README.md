# Portfólio — Francisco Filho (`ffilho.dev`)

Portfólio profissional e currículo web de **Francisco Filho**, Desenvolvedor FullStack com mais de 6 anos de experiência em desenvolvimento de software — combinando sistemas corporativos em produção com Java (Java EE, Spring Boot) e PostgreSQL, ecossistema web moderno (React, Next.js, TypeScript) e engenharia assistida por agentes de IA.

## O que este projeto entrega

- **Dossiê linear (`/`)**: abertura enxuta, lastro real em produção, 6 estudos de caso anonimizados com diagramas arquiteturais inline em SVG, práticas concretas de engenharia com IA (`AGENTS.md`, Skills e MCPs), 4 projetos públicos curados, stack por categoria, trajetória e contato direto.
- **Estudos de caso aprofundados (`/cases/[slug]`)**: páginas geradas estaticamente (SSG) com diagrama expandido, problema real, restrições operacionais, decisões técnicas e resultado.
- **Currículo web e PDF ATS-friendly (`/curriculo` e `/curriculo.pdf`)**: página otimizada para leitura e impressão A4 (`@media print`) + gerador estático de PDF vetorial via `pdf-lib` em build time, sempre sincronizado com os dados tipados de `src/data/`.
- **Tema Claro / Escuro sem FOUC**: respeita `prefers-color-scheme` via `color-scheme: light dark` e `light-dark()` (com fallback), além de alternador manual com contraste WCAG AA/AAA e suporte a `forced-colors`.
- **Qualidade verificada**: testes automatizados com Vitest + Testing Library (incluindo guarda de confidencialidade), TypeScript estrito, ESLint e Lighthouse 100 em Acessibilidade, Boas Práticas e SEO.

## Stack

- **Framework:** Next.js (App Router, SSG) + React 19 + TypeScript (`strict: true`)
- **Estilos:** Tailwind CSS v4 + CSS tokens nativos (`light-dark()`, `@media print`)
- **PDF estático:** `pdf-lib`
- **Testes:** Vitest + Testing Library + jsdom
- **Deploy:** Vercel

## Como rodar localmente

Requer Node.js 20+ (desenvolvido em Node.js 24).

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000` (e `/curriculo`, `/curriculo.pdf` e `/cases/motor-socioeconomico-auxilios`).

## Scripts

```bash
npm run dev        # Servidor de desenvolvimento
npm run test       # Suíte de testes automatizados (Vitest)
npm run typecheck  # Checagem estrita de tipos (tsc --noEmit)
npm run lint       # Lint (ESLint)
npm run build      # Build estático de produção (Next.js)
```

## Variáveis de ambiente (Vercel)

- `NEXT_PUBLIC_SITE_URL`: URL canônica opcional para sobrescrever o domínio padrão (`https://ffilho.dev`), usada em metadados OpenGraph, `sitemap.xml`, `robots.txt` e no PDF. Em ambientes de preview na Vercel, `VERCEL_URL` é usado automaticamente quando a variável não está definida.

## Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

