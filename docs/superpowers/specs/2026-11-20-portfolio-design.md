# Design do Portfólio — Francisco Fernandes (`ffilho-dev`)

**Data:** 2026-11-20  
**Diretório do projeto:** `/home/franciscofilho/Projects/portfolio`  
**Repositório alvo:** `https://github.com/ffilho-dev/portfolio`  
**Cópia versionada no repo (após aprovação):** `docs/superpowers/specs/2026-11-20-portfolio-design.md`  
**Hospedagem:** Vercel (SSG) com domínio próprio já adquirido por Francisco

---

## 1. Intenção e Porquê

Francisco Fernandes (`ffilho-dev`) soma **mais de 6 anos de atuação em desenvolvimento de software** (desde março de 2020 — passando por Turing Tecnologia, Yank Solutions, Quark Tecnologia e, desde maio de 2023, ESIG Software), além de estágio prévio em TI (2017–2019). Hoje combina **experiência sólida em produção com Java (Java EE, Spring Boot) e PostgreSQL** em sistemas corporativos de gestão universitária para milhares de usuários, **ecossistema web moderno (React, Next.js, TypeScript, Angular, Docker)** e **uso diário de IA** no fluxo de engenharia.

O problema que este portfólio resolve: o maior peso da carreira dele está em sistemas corporativos fechados (sob NDA), enquanto os repositórios públicos no GitHub (`ffilho-dev` ativo e `FrankBROFC` sem acesso, de 2019–2022) refletem majoritariamente estudos ou projetos antigos. Um recrutador que olha apenas o GitHub subestima sua maturidade técnica.

O site atende dois leitores no **mercado brasileiro (100% PT-BR)** mirando **vagas FullStack** (com destaque explícito para disponibilidade de mudança e preferência por atuação presencial, além de híbrido e remoto):
1. **Recrutadores (leitura de 15–30 segundos):** precisam identificar imediatamente quem ele é, sua trajetória real de 6+ anos, sua stack organizada, sua disponibilidade geográfica/presencial e os canais diretos de contato (WhatsApp, LinkedIn, e-mail e currículo em PDF).
2. **Tech Leads e Engineering Managers (leitura aprofundada de 2–4 minutos):** precisam encontrar evidências concretas de resolução de problemas reais — regras complexas de negócio, APIs em produção, auditoria de dados, geração de documentos oficiais, sustentação multi-institucional e uso criterioso de IA.

---

## 2. Objetivos, Não-Objetivos e Anti-Objetivos

### Objetivos
- Apresentar **4 estudos de caso reais de produção (100% anonimizados)**, derivados diretamente das 120 entregas mapeadas no Jira da ESIG (2024–2026, 3 sistemas corporativos, 12 instituições públicas atendidas), como peça central do portfólio.
- Complementar com **4 projetos públicos rigorosamente selecionados** (`clone-tabnews`, `ProjetoEsigGroup`, `BotRegistroImoveisBrasil` e o próprio `ffilho-dev/portfolio`) e a trajetória completa do LinkedIn (ESIG, Quark, Turing — inclusive como Presidente —, Yank e Salinor).
- Demonstrar uso prático e maduro de IA no fluxo de engenharia (sem buzzwords) como alavanca para atuar em qualquer stack FullStack.
- Entregar tanto uma página web limpa `/curriculo` quanto um **PDF real e selecionável (ATS-friendly) gerado diretamente pelo site (`/curriculo.pdf`)** em build time a partir dos mesmos dados tipados (`src/data/`), sem depender do PDF exportado do LinkedIn.
- Construir o próprio repositório `ffilho-dev/portfolio` como prova de engenharia moderna (TypeScript estrito, testes automatizados com guarda de confidencialidade, acessibilidade WCAG AA e performance alta na Vercel).

### Não-Objetivos
- Não haverá CMS, banco de dados, autenticação, blog completo ou formulário de contato com backend próprio.
- Não haverá integração em tempo real com a API do Jira da ESIG nem armazenamento de credenciais corporativas.
- Não haverá versão em inglês / sistema de i18n (mercado 100% nacional em PT-BR).
- Não haverá foto pessoal no portfólio nem no currículo (recrutadores visualizam a foto pelo LinkedIn).

### Anti-Objetivos
- **Parecer vitrine de clones de tutoriais:** exercícios introdutórios (`projeto-receita`, `projeto-travelgram`, `projeto-turistico`, `ToDoReact`, `IMCDAZUEIRA`, etc.) ficam estritamente fora do site.
- **Vazamento de confidencialidade/NDA:** nenhum nome de universidade/cliente da ESIG, número de OS ou chamado, URL interna, credencial, nome de aluno/servidor ou código proprietário pode aparecer em conteúdo, código, testes em texto claro, comentários ou histórico Git.
- **Visual genérico de “página gerada por IA”:** sem rótulos em CAIXA ALTA acima de títulos, sem numeração falsa (`01 / 02 / 03`) em itens não sequenciais, sem cadeias com ponto mediano (`A · B · C`), sem setas `→` anexadas em botões/links, sem barrinhas de porcentagem de skill, sem animações de entrada em cascata por seção e sem tema preto absoluto com neon.
- **Slogan inflado no topo:** abertura curta e direta (`Francisco Fernandes` / `Desenvolvedor FullStack`).

---

## 3. Restrições

- **Hospedagem e domínio:** Deploy estático (SSG) na **Vercel**. A URL canônica vem de `NEXT_PUBLIC_SITE_URL` com fallback seguro para `VERCEL_URL` / `http://localhost:3000`, pronta para ativação do domínio próprio.
- **Contas GitHub:** O portfólio vive em `github.com/ffilho-dev/portfolio`. Os dois projetos selecionados da conta anterior (`FrankBROFC`, sem acesso) permanecem como links somente leitura, identificados discretamente como *repositório histórico*.
- **Padrões técnicos obrigatórios:**
  - `frontend-design`: identidade visual intencional com um único elemento visual marcante (diagramas esquemáticos inline dos cases) e disciplina tipográfica no restante.
  - `modern-web-guidance`: `color-scheme: light dark`, `light-dark()` com fallback `@media (prefers-color-scheme: dark)`, prevenção de FOUC via `<meta name="color-scheme">` + script inline mínimo, `overflow: clip`, propriedades lógicas de CSS, contraste WCAG ≥ 4,5:1 (texto) e ≥ 3:1 (bordas/UI), suporte a `@media (forced-colors: active)`.
  - `web-design-guidelines`: HTML semântico, skip link, `:focus-visible`, `font-variant-numeric: tabular-nums`, `text-wrap: balance` / `text-wrap: pretty`, `prefers-reduced-motion`, zero `transition: all`, aspas tipográficas (`“”`) e reticências (`…`).

---

## 4. Abordagens Consideradas e Escolha

| Abordagem | Resumo | Trade-offs | Decisão |
|---|---|---|---|
| **1. Next.js (App Router) + TypeScript + Tailwind CSS v4 (SSG na Vercel)** | Páginas geradas estaticamente em build time, conteúdo tipado em `src/data/*.ts`, páginas dedicadas `/cases/[slug]` e `/curriculo`, OpenGraph e sitemap via Metadata API. | Mais estrutura que HTML puro ou Astro, mas com Server Components + SSG o JS enviado ao cliente fica mínimo (apenas alternador de tema, cópia de contato e impressão). | **Escolhida por Francisco.** Alinha com o que já usa no `ffilho-dev`, tem deploy direto na Vercel e transforma o repositório em prova viva de FullStack moderno. |
| **2. Astro + TypeScript + Markdown/MDX** | Estático puro com Content Collections e quase zero JS no navegador. | Excelente leveza editorial, mas adiciona tecnologia fora da stack recente do `ffilho-dev` e não demonstra React/Next.js no código do repo. | Descartada. |
| **3. HTML + CSS + JS puro** | Arquivos estáticos diretos na CDN da Vercel, sem build step. | Simplicidade máxima inicial, mas gera repetição manual entre páginas de cases/currículo, não traz tipagem nem demonstra engenharia FullStack moderna no repo. | Descartada. |

---

## 5. Direção Visual e Sistema de Design

### Decisões de Francisco vs. Decisões Nossa Chamada
- **Decidido por Francisco:**
  - **Estrutura 1 — Dossiê Linear (Opção A simplificada):** leitura de cima para baixo, largura confortável para os diagramas ao lado dos cases e impressão limpa em PDF.
  - **Abertura enxuta da Opção C:** `Francisco Fernandes` / `Desenvolvedor FullStack` + bio direta, sem slogan longo.
  - **Paleta dupla (A + C):** Claro (**A**: branco mineral + petróleo profundo) e Escuro (**C**: ardósia real + âmbar contido).
  - **Sem foto** no site e no currículo.
- **Nossas escolhas (para conferência):**
  - **Um único elemento marcante:** diagramas arquiteturais inline em SVG (resumo na home, versão expandida em `/cases/[slug]`), estilizados diretamente com os tokens CSS do tema ativo e nítidos em impressão.
  - **Nome exibido:** usar **Francisco Fernandes** como nome principal (alinhado ao LinkedIn e ao currículo formal), com o identificador `ffilho-dev` no cabeçalho/GitHub.
  - **Tema padrão e alternador:** segue o tema do sistema operacional via `color-scheme: light dark` + botão discreto de 2 estados no cabeçalho (alterna entre o tema oposto ao atual e retorno ao padrão do sistema, persistido em `localStorage` e refletido em `<meta name="color-scheme">`).
  - **Ajuste de contraste das bordas (`--border`):** ajustadas para `#64748B` (claro) e `#6E7F94` (escuro) para garantir contraste WCAG 1.4.11 acima de 3,7:1 em todas as superfícies e diagramas SVG.
  - **Nomeação genérica dos sistemas:** descrever os sistemas corporativos da ESIG como *ecossistema SIG de gestão universitária (módulos acadêmico, administrativo e de RH)*, sem citar siglas internas nem clientes específicos.

### Tokens de Cor (Contrastes Verificados — WCAG AA/AAA)

| Token | Tema Claro (Opção A) | Tema Escuro (Opção C) | Contraste mínimo verificado |
|---|---|---|---|
| `--bg` | `#F7F8FA` (Branco mineral) | `#161B22` (Ardósia real) | Base |
| `--surface` | `#FFFFFF` | `#1F2630` | Superfície elevada / diagramas |
| `--ink` | `#0F172A` | `#F8FAFC` | 16,80:1 (claro) · 14,56:1 (escuro) |
| `--muted` | `#334155` | `#CBD5E1` | 9,74:1 (claro) · 10,26:1 (escuro) |
| `--border` | `#64748B` | `#6E7F94` | 4,48:1 (claro) · 3,72:1 (escuro) — ≥ 3:1 |
| `--rule` | `#CBD5E1` | `#3B4654` | Linhas divisórias estruturais |
| `--accent` | `#0F4C5C` (Petróleo profundo) | `#E09F3E` (Âmbar de instrumentação) | 8,95:1 (claro) · 6,67:1 (escuro) |
| `--accent-ink` | `#FFFFFF` | `#161B22` | 9,51:1 (claro) · 7,58:1 (escuro) |

### Tipografia
- **Principal (`next/font/google`):** `Plus Jakarta Sans` (pesos 400, 500, 600, 700, 800) para títulos, interface e corpo.
- **Técnica (`next/font/google`):** `IBM Plex Mono` (pesos 400, 500) restrita a diagramas arquiteturais, nomes de rotas/artefatos técnicos e métricas tabulares.
- **Disciplina tipográfica:** prosa ≤ `68ch`, `text-wrap: balance` em títulos, `text-wrap: pretty` em parágrafos, `font-variant-numeric: tabular-nums` em números/datas/métricas, `scroll-margin-top` nas âncoras de seção.

### Wireframes Conceituais

**Home (`/` — Desktop, container centralizado `max-inline-size: 1040px`, conteúdo alinhado à esquerda):**
```text
+----------------------------------------------------------------------+
| [Pular para o conteúdo]                                              |
| ffilho-dev         Cases   IA no fluxo   Projetos   Trajetória  [☀/☾]|
+----------------------------------------------------------------------+
|                                                                      |
| Francisco Fernandes                                [WhatsApp]        |
| Desenvolvedor FullStack                            [Ver currículo]   |
| Macau, RN · Presencial (preferência), híbrido ou remoto · Mudança ok |
|                                                                      |
| Mais de 6 anos construindo software — hoje em Java EE, Spring Boot   |
| e PostgreSQL na ESIG Software, unindo sistemas críticos de gestão    |
| universitária com React, Next.js, TypeScript e fluxo diário com IA.  |
|                                                                      |
|----------------------------------------------------------------------|
| 6+ anos                  12 instituições         120+ entregas       |
| em desenvolvimento       atendidas na ESIG       mapeadas (2024–26)  |
|----------------------------------------------------------------------|
|                                                                      |
| Cases em produção                                                    |
| Entregas reais na ESIG Software (anonimizadas por confidencialidade) |
|                                                                      |
| Motor de seleção socioeconômica    +-------------------------------+ |
| e folha de auxílios                | [Diagrama SVG enxuto:         | |
| Contexto, solução e impacto.       |  Questionário → Motor de      | |
| Java · JSF · PostgreSQL · Jasper   |  regras → Espelho + Folha]    | |
| [Ler estudo de caso]               +-------------------------------+ |
| -------------------------------------------------------------------- |
| (+ 3 cases com divisórias hairline limpas e diagramas inline)        |
|                                                                      |
|----------------------------------------------------------------------|
| Como trabalho com IA no dia a dia                                    |
| 3 pilares diretos: Spec antes de codar | Navegação em legado e       |
| agilidade multi-stack | Revisão humana, testes e contratos.          |
|                                                                      |
|----------------------------------------------------------------------|
| Projetos públicos selecionados (4 itens)                             |
| clone-tabnews (Live + GitHub) | ProjetoEsigGroup (conta anterior)    |
| BotRegistroImoveisBrasil (conta anterior) | ffilho-dev/portfolio     |
|                                                                      |
|----------------------------------------------------------------------|
| Stack técnica (3 grupos: Backend & Dados | Frontend | Infra & IA)    |
|----------------------------------------------------------------------|
| Trajetória e formação                                                |
| ESIG Software | Quark | Turing (Presidente & Dev) | Yank | Salinor   |
| UFERSA — Bacharelado em Sistemas de Informação (previsão 2027)       |
|----------------------------------------------------------------------|
| Contato                                                              |
| WhatsApp (84) 99498-0792 · E-mail (+ Copiar) · LinkedIn · GitHub     |
+----------------------------------------------------------------------+
```

**Mobile (`< 768px`):**
- Barra superior enxuta com marca, botão de tema e faixa horizontal de links com quebra limpa (zero menu hambúrguer frágil e zero overflow horizontal).
- Hero empilha os CTAs abaixo da bio; métricas em grade compacta; cada case empilha descrição acima do diagrama SVG responsivo.

**Página de Estudo de Caso (`/cases/[slug]`):**
- Link `Voltar para cases`, título, subtítulo objetivo, linha de metadados (Contexto, Período, Papel, Stack), **diagrama arquitetural SVG expandido** (`role="img"` + `aria-label` descritivo), e 4 blocos factuais: *Problema real*, *Restrições e contexto operacional*, *Solução e decisões técnicas* e *Resultado prático*. Rodapé com navegação para o próximo case.

**Currículo Web e Download PDF (`/curriculo` e `/curriculo.pdf`):**
- Rota `/curriculo` para leitura rápida no navegador (com barra superior não imprimível contendo `Voltar ao portfólio`, botão `Baixar PDF` apontando para `/curriculo.pdf` e `Imprimir` via `@media print`).
- Rota estática `/curriculo.pdf` (`Route Handler` com `export const dynamic = "force-static"` usando `pdf-lib`) que gera automaticamente um **arquivo PDF A4 vetorial, limpo e selecionável (100% compatível com ATS)** em build time a partir de `src/data/` — garantindo que o PDF baixado pelo recrutador esteja sempre sincronizado com o portfólio, sem usar o PDF antigo do LinkedIn. Contém: nome, cargo, localização/disponibilidade presencial + mudança, contatos completos, resumo objetivo, experiência profissional completa (ESIG, Quark, Turing, Yank, Salinor), destaques técnicos em produção, stack categorizada, formação (UFERSA, previsão 2027), idioma (Inglês) e certificações (com destaque para o certificado verificável do `curso.dev`).

---

## 6. Conteúdo Factual Verificado

### A. Perfil, Disponibilidade e Contato (`src/data/profile.ts`)
- **Nome:** Francisco Fernandes (`ffilho-dev`)
- **Título:** Desenvolvedor FullStack
- **Localização e mobilidade:** Macau, RN — Brasil. Disponível para vagas **presenciais (preferência)**, híbridas ou remotas, **apto para mudança de cidade**.
- **Contatos:**
  - WhatsApp: `(84) 99498-0792` (`https://wa.me/5584994980792`)
  - E-mail: `fcofilho0809@gmail.com` (com botão copiar e feedback acessível `aria-live="polite"`)
  - LinkedIn: `https://www.linkedin.com/in/francisco-fernandes-41793411a/`
  - GitHub ativo: `https://github.com/ffilho-dev`
- **Métricas reais da faixa de lastro:**
  - `6+ anos` — em desenvolvimento de software (desde Mar/2020)
  - `12 instituições` — públicas de ensino atendidas na ESIG
  - `120+ entregas` — mapeadas no ciclo 2024–2026

### B. Os 4 Estudos de Caso em Produção (`src/data/cases.ts` — estritamente factuais e anonimizados)

> **Regra factual:** nenhum percentual ou número de performance será inventado. Toda descrição permanece 100% fiel às entregas reais mapeadas no histórico do Jira (2024–2026).

1. **`motor-socioeconomico-auxilios` — Motor de seleção socioeconômica, pontuação auditável e folha de auxílios**
   - **Contexto:** Módulo de assistência estudantil em sistema corporativo de gestão universitária (ESIG Software).
   - **Período:** 2026 · **Papel:** Desenvolvedor Full Stack (Java EE / JSF / PostgreSQL).
   - **Stack:** Java, JSF, PostgreSQL, SQL, JasperReports.
   - **Problema real:** Processos seletivos de bolsas e auxílios variavam por unidade e edital — exigindo questionários com pesos ou percentuais, perguntas/alternativas eliminatórias condicionadas ao tipo de auxílio, critérios próprios de desempate e janelas de recurso. Além disso, quando o período de respostas era reaberto e o estudante editava uma resposta, perdia-se a referência original da pontuação usada na análise anterior.
   - **Restrições e contexto operacional:** Fluxo com impacto financeiro direto (folha de pagamento e regras de inacumulação de bolsas), necessidade de configuração por unidade sem quebrar regras de outras unidades e exigência de rastreabilidade para auditoria e análise de recursos.
   - **Solução e decisões técnicas:** Desenvolvimento incremental em blocos integrados — configuração do cadastro único por unidade, questionários com flag opcional de cálculo percentual por peso, marcação de critérios eliminatórios e de desempate parametrizáveis, criação do **espelho imutável da pontuação** preservando o histórico da avaliação inicial, fluxo de solicitação e análise de recursos, controle de inacumulação/folha de pagamento e relatórios. Também foram corrigidos estados residuais de listagem ao alternar períodos com e sem cálculo percentual.
   - **Diagrama SVG (fluxo):** `Configuração por unidade (pesos / %)` → `Adesão & Questionário` → `Motor de análise (eliminatórias + desempate)` → `Espelho imutável de pontuação` → `Recursos + Folha de pagamento & Relatórios`.
   - **Resultado prático:** Processo completo de seleção, auditoria e geração de folha operando em produção com regras configuráveis por unidade e preservação íntegra do histórico de pontuação.

2. **`apis-rest-sistema-academico` — APIs REST para matrícula, frequência e integração em sistema acadêmico**
   - **Contexto:** Camada de APIs REST em sistema corporativo de gestão universitária de grande porte (ESIG Software).
   - **Período:** 2026 · **Papel:** Desenvolvedor Backend / Full Stack.
   - **Stack:** Java, APIs REST/JSON, Hibernate/JPA, PostgreSQL, GitLab CI.
   - **Problema real:** Aplicações integradas e fluxos críticos do calendário acadêmico (rematrícula, validação de matrícula em turmas, consulta de turmas abertas, listagem de frequência e publicação de notícias) precisavam de endpoints REST consistentes sobre regras legadas complexas, ao mesmo tempo em que erros em produção (como `NullPointerException` em datas de aula e retorno indevido de frequências de alunos não matriculados) quebravam integrações ativas.
   - **Restrições e contexto operacional:** Alta criticidade em janelas de matrícula com grande volume de estudantes simultâneos, contratos JSON consumidos por sistemas externos e obrigatoriedade de manter compatibilidade com validações existentes no núcleo Java/Hibernate.
   - **Solução e decisões técnicas:** Construção e evolução de endpoints REST (`/matricula/validar_matricula_turma`, rematrícula, listagem de turmas abertas enriquecida com flags de nível e situação de matrícula, e rota `v1` de notícias com validação de payload JSON obrigatório), somadas à atuação direta em sustentação: proteção defensiva contra `NullPointerException` em consultas de frequência e filtragem rigorosa no backend para excluir registros de frequência sem vínculo válido de matrícula.
   - **Diagrama SVG (fluxo):** `Cliente / App integrado` → `Endpoints REST (JSON)` → `Validação de contrato & regras acadêmicas` → `Hibernate / PostgreSQL` → `Resposta consistente (sem vazamento de registros inválidos)`.
   - **Resultado prático:** Contratos REST mais seguros e previsíveis em produção durante períodos críticos de matrícula e acompanhamento de frequência.

3. **`verificacao-digital-diplomas-documentos` — Verificação digital de diplomas via QR Code e geração de documentos oficiais**
   - **Contexto:** Módulos de diplomas, históricos, documentação administrativa e biblioteca em sistemas corporativos (ESIG Software).
   - **Período:** 2024–2026 · **Papel:** Desenvolvedor Full Stack.
   - **Stack:** Java, JasperReports, PDF/HTML, QR Code, Código de Barras, JSF/JSP, PostgreSQL.
   - **Problema real:** Certificados e diplomas de diferentes níveis de ensino (graduação, pós-graduação lato/stricto sensu e residência em saúde) careciam de verificação digital padronizada acessível pelo portal público; além disso, operadores precisavam pré-visualizar históricos antes da emissão definitiva, exportar dossiês completos de documentos administrativos em PDF e imprimir etiquetas físicas com código de barras.
   - **Restrições e contexto operacional:** Documentos com validade legal e regras distintas por nível de ensino e instituição, layouts rígidos de impressão em JasperReports/PDF e necessidade de manter o mesmo mecanismo confiável de autenticação pública já consolidado na graduação.
   - **Solução e decisões técnicas:** Reaproveitamento e adaptação do fluxo de validação digital para incluir **código verificador e QR Code** nos diplomas e certificados com rota de conferência no portal público, ampliação do registro e das assinaturas de diploma para o nível Residência em Saúde, exibição condicional de observações legais no histórico definitivo e no diploma, criação de pré-visualização HTML de históricos, funcionalidade de exportação completa de documentos em PDF no módulo administrativo e novo formato de etiquetas com código de barras e lombada.
   - **Diagrama SVG (fluxo):** `Registro & Assinaturas (Graduação / Pós / Residência)` → `Motor JasperReports / PDF` → `Código Verificador + QR Code` → `Portal Público de Autenticidade`.
   - **Resultado prático:** Emissão padronizada e conferência pública self-service de documentos oficiais em múltiplas instituições, reduzindo conferências manuais e retrabalho documental.

4. **`sustentacao-multi-institucional-regras-criticas` — Customizações, regras críticas e sustentação para 12 instituições**
   - **Contexto:** Atuação transversal em 3 sistemas corporativos do ecossistema SIG — gestão acadêmica, administrativo/protocolo e RH (ESIG Software).
   - **Período:** 2024–2026 · **Papel:** Desenvolvedor Java EE / Full Stack.
   - **Stack:** Java, PostgreSQL/SQL, Hibernate/JPA, JSF/JSP, Apache Ant, Git/GitLab, JBoss/Tomcat.
   - **Problema real:** Manter e evoluir módulos sensíveis para 12 instituições públicas com regras regulatórias próprias — abrangendo determinações judiciais de aproveitamento e conclusão de curso, importação em lote de alunos, avaliação institucional para pós-graduação e bugs intermitentes de sessão e consistência de dados em produção.
   - **Restrições e contexto operacional:** Bases de código extensas e compartilhadas com customizações isoladas por branch/instituição, validação rigorosa em ambiente de homologação/ateste do cliente e tolerância mínima a regressões em outros casos de uso.
   - **Solução e decisões técnicas:** Implementação de novo tipo de aproveitamento por ordem judicial integrado às regras de integralização curricular e conclusão de programa; configuração de importação em lote de discentes com definição e gerenciamento de layouts; expansão do módulo de avaliação institucional (formulários, dimensões estatísticas e moderação) para Lato e Stricto Sensu; diagnóstico direto de consistência em PostgreSQL e eliminação de vazamento de variável de sessão que impactava casos de uso adjacentes.
   - **Diagrama SVG (fluxo):** `Demanda institucional` → `Análise de regras & SQL (PostgreSQL)` → `Implementação isolada em branch` → `Validação / Ateste` → `Entrega em produção (12 instituições)`.
   - **Resultado prático:** Mais de 120 demandas entregues e rastreadas no ciclo 2024–2026 atravessando 3 sistemas corporativos, com estabilidade preservada entre módulos compartilhados.

### C. Como Trabalho com IA no Dia a Dia (`src/data/skills.ts`)
3 blocos concisos e tecnicamente concretos (sem linguagem de “ementa de curso”, mas provando domínio real de agentes de codificação):
1. **Agentes com contexto disciplinado (`AGENTS.md`, Skills e MCPs):** estruturo instruções persistentes do projeto (`AGENTS.md`), carrego *Skills* reutilizáveis sob demanda e conecto *MCPs* a ferramentas externas (como navegador/DevTools e deploy) — lidando de forma consciente com execução *stateless*, limites de janela de contexto e não-determinismo de LLMs.
2. **Aceleração multi-stack com base de engenharia:** uso agentes de codificação (como Claude Code, Codex e Antigravity) tanto para investigar e evoluir bases Java legadas extensas quanto para entregar com agilidade em React, Next.js e TypeScript — mantendo domínio sobre banco de dados, contratos de API e regras de negócio.
3. **Especificação antes do código e verificação humana:** toda entrega nasce de especificação clara e passa por testes automatizados, revisão crítica de diff, validação de dados e auditoria de acessibilidade/performance. IA aumenta a velocidade; o critério técnico permanece humano.

### D. Projetos Públicos Selecionados (`src/data/projects.ts` — exatamente 4 itens)
1. **`clone-tabnews`** (`ffilho-dev`)
   - **Links:** Live (`https://clone-tabnews-gamma-wheat.vercel.app`) · Código (`https://github.com/ffilho-dev/clone-tabnews`)
   - **Enquadramento:** Engenharia fullstack construída do zero — Next.js, PostgreSQL, Docker Compose, migrations versionadas (`node-pg-migrate`), testes de integração com Jest, ESLint/Prettier/Husky/Conventional Commits e deploy contínuo na Vercel.
2. **`ProjetoEsigGroup`** (`FrankBROFC` — tag discreta: *conta anterior*)
   - **Links:** Código (`https://github.com/FrankBROFC/ProjetoEsigGroup`)
   - **Enquadramento:** Aplicação fullstack de gerenciamento de tarefas construída com Java 11, Spring Boot, JPA/Hibernate, PostgreSQL, documentação Swagger 3 e front-end Angular com lazy loading e resolvers.
3. **`BotRegistroImoveisBrasil`** (`FrankBROFC` — tag discreta: *conta anterior*)
   - **Links:** Código (`https://github.com/FrankBROFC/BotRegistroImoveisBrasil`)
   - **Enquadramento:** Automação prática (RPA) em Java combinando Selenium para captura de estados/municípios, Unirest para consumo de endpoints JSON e Apache POI para geração automática de planilhas.
4. **`ffilho-dev/portfolio`** (`ffilho-dev`)
   - **Links:** Código (`https://github.com/ffilho-dev/portfolio`)
   - **Enquadramento:** Este próprio portfólio — Next.js App Router, TypeScript estrito, Tailwind CSS v4, tema Claro/Escuro sem FOUC seguindo padrões modernos da web, testes automatizados e currículo imprimível A4.

### E. Stack Organizada por Categoria (`src/data/skills.ts`)
- **Backend e Dados:** Java (Java EE, Spring Boot), APIs REST, PostgreSQL, SQL, Hibernate/JPA, Node.js, JasperReports, ASP.NET Core (MVC / EF Core)
- **Frontend e Web:** TypeScript, JavaScript, React, Next.js, Angular, Tailwind CSS, HTML/CSS semântico, JSF/JSP
- **Qualidade, Infra e IA:** Linux, Docker, Git, GitLab CI, GitHub Actions, Jest, JUnit, Selenium (RPA/testes), Vercel, agentes de codificação (`AGENTS.md`, Skills e MCPs)

### F. Trajetória, Formação e Certificações (`src/data/profile.ts`)
- **Experiência profissional:**
  1. **ESIG Software e Consultoria em TI** — Desenvolvedor de Software Java EE · *Mai/2023 – Atual* · Natal, RN
     - Desenvolvimento e evolução de módulos de sistemas de gestão universitária (Java EE / Spring Boot, APIs REST, PostgreSQL, frontend e sustentação em ambiente Linux com Git/GitLab).
  2. **Quark Tecnologia** — Desenvolvedor Full Stack · *Jun/2022 – Abr/2023* · Natal, RN
     - Desenvolvimento full stack em aplicações web corporativas.
  3. **Turing Tecnologia** — Presidente (*Jan/2022 – Mai/2023*) e Desenvolvedor (*Mar/2020 – Fev/2022*) · Angicos, RN
     - Mais de 3 anos atuando no desenvolvimento de soluções tecnológicas e na liderança de equipe e gestão como Presidente.
  4. **Yank Solutions** — Analista de Desenvolvimento · *Jun/2021 – Abr/2022*
     - Criação de RPAs com Selenium, Java, Spring Boot e PostgreSQL.
  5. **Salinor – Salinas do Nordeste** — Estagiário de TI · *Dez/2017 – Mai/2019* · Macau, RN
     - Suporte e rotinas de infraestrutura/TI.
- **Formação acadêmica:**
  - **Universidade Federal Rural do Semi-Árido (UFERSA)** — Bacharelado em Sistemas de Informação · *Mar/2020 – Previsão 2027*
- **Idiomas e certificações relevantes (exibidos na home em bloco enxuto e detalhados em `/curriculo` e `/curriculo.pdf`):**
  - **Idioma:** Inglês
  - **Certificação principal verificável:** **Desenvolvimento Web Full Stack — `curso.dev` (Filipe Deschamps)** · 81h · Emitido em 06/04/2026 · Link oficial de verificação: `https://curso.dev/certificados/19acb84f-0036-43b6-bc20-fc39d7e4fa29`
    - *Módulos concluídos (16):* Git e Controle de Versão, GitHub e Gestão de Projetos, JavaScript e Node.js, Next.js, Banco de Dados com PostgreSQL, Migrations, Docker, Testes Automatizados e TDD, CI/CD e Deploy, Qualidade e Estilo de Código, Padronização de Commits, Segurança de Senhas e Criptografia, Autenticação e Autorização, DNS e Protocolos de Rede, Infraestrutura de Email e API REST.
  - **Outras certificações:** Fundamentos de Java, Imersão Dev com Google Gemini, ASP.NET Core MVC & EF Core.

---

## 7. Arquitetura Técnica e Qualidade

- **Stack do projeto:** Next.js (App Router, versão estável mais recente), React 19, TypeScript (`strict: true`), Tailwind CSS v4.
- **Rotas estáticas (SSG via `generateStaticParams`):**
  - `/` — Dossiê principal
  - `/cases/[slug]` — Estudo de caso aprofundado (4 slugs pré-renderizados estaticamente + `notFound()` para slugs inválidos)
  - `/curriculo` — Versão web do currículo com botão de download do PDF e impressão A4 (`@media print`)
  - `/curriculo.pdf` — Route Handler estático (`force-static`) gerando o PDF A4 vetorial e ATS-friendly via `pdf-lib` diretamente de `src/data/`
  - `src/app/sitemap.ts`, `src/app/robots.ts` e `src/app/opengraph-image.tsx` (preview limpo no LinkedIn/WhatsApp)
- **Tema Claro/Escuro sem FOUC (padrão `modern-web-guidance`):**
  - `<meta name="color-scheme" content="light dark">` + script inline síncrono mínimo no `<head>` aplicando `localStorage.getItem("color-scheme")` dentro de `try/catch`.
  - Tokens CSS declarados em `globals.css` com `color-scheme: light dark`, `light-dark()` + fallback `@media (prefers-color-scheme: dark)` + regras `:root:has(> head > meta[name="color-scheme"][content="dark"|"light"])`.
  - Alternador de 2 estados (`ThemeToggle`) sincronizado entre abas via evento `storage`.
- **Estratégia de testes (TDD com Vitest + Testing Library):**
  1. **Guarda de confidencialidade/NDA (`tests/confidentiality.test.ts` — nossa escolha técnica):** varre todos os dados de `src/data/` e textos renderizados aplicando:
     - Regexes genéricas que bloqueiam chaves de ticket (`[A-Z]{2,8}-\d{3,}`), números de OS (`\bOS[_ -]?\d+\b`), domínios/URLs internos (`esig\.com\.br`, `gitlab\.`, `postgres://`, `jdbc:`) e padrões de credenciais/tokens;
     - Blocklist de siglas institucionais armazenada exclusivamente como **hashes SHA-256** (normalizados em minúsculas) — garantindo que **nenhum nome ou sigla de cliente exista em texto claro no repositório, nos testes ou no histórico Git**;
     - Allowlist explícita de termos públicos legítimos (`ESIG Software`, `UFERSA`, `ProjetoEsigGroup`, `Quark Tecnologia`, `Turing Tecnologia`, `Yank Solutions`, `Salinor`).
  2. **Integridade de dados, rotas e PDF:** verifica que os 4 cases possuem slugs únicos, seções obrigatórias preenchidas e nós de diagrama válidos; verifica os 4 projetos públicos, links de contato/certificado válidos e que o gerador de `/curriculo.pdf` produz um PDF válido (`%PDF-`) com páginas não vazias.
  3. **Interações do cliente:** testes do `ThemeToggle` (transição entre sistema e override sem limpar preferência ao mudar OS, sincronização via `storage`) e do botão `Copiar e-mail` (feedback `aria-live="polite"`).
  4. **Verificação real antes de concluir:** `npm run test`, `npm run lint`, `npm run build`, inspeção visual no navegador real via **Chrome DevTools MCP** (desktop e mobile, temas Claro e Escuro, foco por teclado, preview de impressão de `/curriculo`, revisão completa com `web-design-guidelines` e checagem de performance/acessibilidade).

---

## 8. O que fica a critério do implementador

- Divisão interna de componentes em `src/components/` e uso de ícones SVG inline mínimos (evitando dependências pesadas desnecessárias).
- Desenho detalhado dos 4 diagramas SVG (obedecendo aos fluxos definidos na Seção 6B, usando exclusivamente os tokens de cor verificados e atributos `role="img"` / `aria-label`).
- Organização das regras `@media print` para caber de forma equilibrada em 1–2 páginas A4 sem quebras órfãs.
- Scripts auxiliares de qualidade (`test`, `lint`, `typecheck`, `build`).
