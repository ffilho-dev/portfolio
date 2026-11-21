import type { AiPillar, SkillGroup } from "./types";

export const skillGroups: readonly SkillGroup[] = [
  {
    category: "Backend e Dados",
    items: [
      "Java (Java EE, Spring Boot)",
      "APIs REST",
      "PostgreSQL",
      "SQL",
      "Hibernate/JPA",
      "Node.js",
      "JasperReports",
      "ASP.NET Core (MVC / EF Core)",
    ],
  },
  {
    category: "Frontend e Web",
    items: [
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "Angular",
      "Tailwind CSS",
      "HTML/CSS semântico",
      "JSF/JSP",
    ],
  },
  {
    category: "Qualidade, Infra e IA",
    items: [
      "Linux",
      "Docker",
      "Git",
      "GitLab CI",
      "GitHub Actions",
      "Jest",
      "JUnit",
      "Selenium (RPA/testes)",
      "Vercel",
      "Agentes de codificação (AGENTS.md, Skills e MCPs)",
    ],
  },
];

export const aiPillars: readonly AiPillar[] = [
  {
    title: "Agentes com contexto disciplinado (AGENTS.md, Skills e MCPs)",
    description:
      "Estruturo instruções persistentes do projeto (AGENTS.md), carrego Skills reutilizáveis sob demanda e conecto MCPs a ferramentas externas (como navegador/DevTools e deploy) — lidando de forma consciente com execução stateless, limites de janela de contexto e não-determinismo de LLMs.",
  },
  {
    title: "Aceleração multi-stack com base de engenharia",
    description:
      "Uso agentes de codificação (como Claude Code, Codex e Antigravity) tanto para investigar e evoluir bases Java legadas extensas quanto para entregar com agilidade em React, Next.js e TypeScript — mantendo domínio sobre banco de dados, contratos de API e regras de negócio.",
  },
  {
    title: "Especificação antes do código e verificação humana",
    description:
      "Toda entrega nasce de especificação clara e passa por testes automatizados, revisão crítica de diff, validação de dados e auditoria de acessibilidade e performance. IA aumenta a velocidade; o critério técnico permanece humano.",
  },
];
