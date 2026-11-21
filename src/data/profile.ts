import type { Profile } from "./types";

export const profile: Profile = {
  name: "Francisco Filho",
  handle: "ffilho-dev",
  title: "Desenvolvedor FullStack",
  location: "Macau, RN — Brasil",
  availability:
    "Disponível para atuação presencial (preferência), híbrida ou remota — apto para mudança de cidade.",
  bio: "Mais de 6 anos construindo software — hoje em Java EE, Spring Boot e PostgreSQL na ESIG Software, unindo sistemas críticos de gestão universitária com React, Next.js, TypeScript e fluxo diário com IA.",
  resumeSummary:
    "Desenvolvedor FullStack com mais de 6 anos de experiência (desde março de 2020), atuando em sistemas corporativos de gestão universitária em produção com Java EE, Spring Boot, APIs REST e PostgreSQL, além de aplicações modernas com React, Next.js, TypeScript, Angular e Docker. Experiência em liderança técnica e gestão de equipe, automações RPA e uso disciplinado de agentes de IA no fluxo de engenharia. Disponibilidade para atuação presencial (preferência), híbrida ou remota, com facilidade para mudança de cidade.",
  contact: {
    email: "contato@ffilho.dev",
    whatsappDisplay: "(84) 99498-0792",
    whatsappUrl: "https://wa.me/5584994980792",
    linkedinUrl: "https://www.linkedin.com/in/francisco-fernandes-41793411a/",
    githubUrl: "https://github.com/ffilho-dev",
    githubHandle: "ffilho-dev",
  },
  metrics: [
    {
      value: "6+ anos",
      label: "em desenvolvimento de software (desde Mar/2020)",
    },
    {
      value: "12 instituições",
      label: "públicas de ensino atendidas na ESIG",
    },
    {
      value: "250+ entregas",
      label: "mapeadas no ciclo 2023–2026",
    },
  ],
  experiences: [
    {
      company: "ESIG Software e Consultoria em TI",
      role: "Desenvolvedor de Software Java EE",
      period: "Mai/2023 – Atual",
      location: "Natal, RN",
      summary:
        "Desenvolvimento e evolução de módulos de sistemas de gestão universitária (Java EE / Spring Boot, APIs REST, PostgreSQL, frontend e sustentação em ambiente Linux com Git/GitLab).",
    },
    {
      company: "Quark Tecnologia",
      role: "Desenvolvedor Full Stack",
      period: "Jun/2022 – Abr/2023",
      location: "Natal, RN",
      summary: "Desenvolvimento full stack em aplicações web corporativas.",
    },
    {
      company: "Turing Tecnologia",
      role: "Presidente (Jan/2022 – Mai/2023) e Desenvolvedor (Mar/2020 – Fev/2022)",
      period: "Mar/2020 – Mai/2023",
      location: "Angicos, RN",
      summary:
        "Mais de 3 anos atuando no desenvolvimento de soluções tecnológicas e na liderança de equipe e gestão como Presidente.",
    },
    {
      company: "Yank Solutions",
      role: "Analista de Desenvolvimento",
      period: "Jun/2021 – Abr/2022",
      summary: "Criação de RPAs com Selenium, Java, Spring Boot e PostgreSQL.",
    },
    {
      company: "Salinor – Salinas do Nordeste",
      role: "Estagiário de TI",
      period: "Dez/2017 – Mai/2019",
      location: "Macau, RN",
      summary: "Suporte e rotinas de infraestrutura/TI.",
    },
  ],
  education: {
    institution: "Universidade Federal Rural do Semi-Árido (UFERSA)",
    degree: "Bacharelado em Sistemas de Informação",
    period: "Mar/2020 – Previsão 2027",
    expectedYear: "2027",
  },
  languages: ["Inglês"],
  featuredCertification: {
    title: "Desenvolvimento Web Full Stack",
    issuer: "curso.dev (Filipe Deschamps)",
    hours: 81,
    issuedAt: "06/04/2026",
    verifyUrl: "https://curso.dev/certificados/19acb84f-0036-43b6-bc20-fc39d7e4fa29",
    modules: [
      "Git e Controle de Versão",
      "GitHub e Gestão de Projetos",
      "JavaScript e Node.js",
      "Next.js",
      "Banco de Dados com PostgreSQL",
      "Migrations",
      "Docker",
      "Testes Automatizados e TDD",
      "CI/CD e Deploy",
      "Qualidade e Estilo de Código",
      "Padronização de Commits",
      "Segurança de Senhas e Criptografia",
      "Autenticação e Autorização",
      "DNS e Protocolos de Rede",
      "Infraestrutura de Email",
      "API REST",
    ],
  },
  otherCertifications: [
    "Fundamentos de Java",
    "Imersão Dev com Google Gemini",
    "ASP.NET Core MVC & EF Core",
  ],
};
