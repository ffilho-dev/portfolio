import type { AiPillar, SkillGroup } from "./types";

export const skillGroups: readonly SkillGroup[] = [
  {
    category: "Backend e Dados",
    items: [
      "Java (Java EE, Spring Boot)",
      "Groovy",
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
      "HTML semântico e CSS",
      "Thymeleaf",
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
      "Jenkins",
      "Grafana",
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
    id: "contexto",
    shortTitle: "Gestão de contexto",
    title: "Agentes com contexto estruturado (AGENTS.md, Skills e MCPs)",
    description:
      "Estruturo instruções persistentes do projeto (AGENTS.md), carrego Skills reutilizáveis sob demanda e conecto MCPs (Model Context Protocol) a ferramentas externas como navegador/DevTools e deploy, considerando execução sem estado, limites de janela de contexto e não determinismo de LLMs.",
    artifacts: [
      "AGENTS.md versionado",
      "Skills sob demanda",
      "MCPs (DevTools e deploy)",
    ],
  },
  {
    id: "multistack",
    shortTitle: "Múltiplas stacks",
    title: "Aceleração em múltiplas stacks com base de engenharia",
    description:
      "Uso agentes de codificação (como Claude Code, Codex e Antigravity) para investigar e evoluir bases Java legadas extensas e acelerar entregas em React, Next.js e TypeScript, mantendo controle sobre banco de dados, contratos de API e regras de negócio.",
    artifacts: [
      "Bases Java EE extensas",
      "React, Next.js e TypeScript",
      "Contratos de API e SQL",
    ],
  },
  {
    id: "verificacao",
    shortTitle: "Especificação e revisão",
    title: "Especificação antes do código e verificação humana",
    description:
      "Parto de especificação escrita e valido cada entrega com testes automatizados, revisão crítica de diff, conferência de dados e, em interfaces web, auditoria de acessibilidade e desempenho. A IA aumenta a velocidade; o critério técnico permanece humano.",
    artifacts: [
      "Especificação antes do código",
      "Testes automatizados",
      "Acessibilidade e desempenho",
    ],
  },
];
