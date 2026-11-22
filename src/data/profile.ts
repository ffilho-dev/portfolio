import type { Profile } from "./types";

export const profile: Profile = {
  name: "Francisco Filho",
  handle: "ffilho.dev",
  title: "Desenvolvedor Full Stack",
  location: "Macau, RN — Brasil",
  availability:
    "Disponível para atuação presencial (preferência), híbrida ou remota, com disponibilidade para mudança de cidade.",
  bio: "Mais de 6 anos em desenvolvimento de software. Atuo em sistemas de gestão universitária em produção com Java EE, Spring Boot e PostgreSQL na ESIG Software, além de desenvolver aplicações web com React, Next.js, TypeScript e fluxo diário com IA.",
  resumeSummary:
    "Desenvolvedor Full Stack com mais de 6 anos de experiência em software (desde março de 2020). Atuo em sistemas corporativos de gestão universitária em produção com Java EE, Spring Boot, APIs REST e PostgreSQL, além de desenvolver aplicações web com React, Next.js, TypeScript e Angular em ambientes com Docker. Experiência em liderança e gestão de equipe, automação de processos (RPA) e uso estruturado de agentes de IA com revisão humana.",
  contact: {
    email: "contato@ffilho.dev",
    whatsappDisplay: "(84) 99498-0792",
    whatsappUrl: "https://wa.me/5584994980792",
    linkedinUrl: "https://www.linkedin.com/in/francisco-filho-41793411a/",
    githubUrl: "https://github.com/ffilho-dev",
    githubHandle: "ffilho-dev",
  },
  metrics: [
    {
      value: "6+ anos",
      label: "em desenvolvimento de software (desde mar/2020)",
    },
    {
      value: "12 instituições",
      label: "públicas de ensino atendidas na ESIG Software",
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
      period: "maio/2023 – atual",
      location: "Natal, RN",
      summary:
        "Desenvolvimento e evolução de módulos de sistemas de gestão universitária com Java EE, Spring Boot, APIs REST, PostgreSQL, frontend e sustentação com Git/GitLab em ambiente Linux.",
    },
    {
      company: "Quark Tecnologia",
      role: "Desenvolvedor Full Stack",
      period: "jun/2022 – abr/2023",
      location: "Natal, RN",
      summary:
        "Desenvolvimento Full Stack no QuarkClinic, atuando com Java, Spring Boot, Groovy, PostgreSQL, Angular, Jenkins e Grafana.",
    },
    {
      company: "Turing Tecnologia (Empresa Júnior da UFERSA)",
      role: "Presidente (jan/2022 – maio/2023) e Desenvolvedor (mar/2020 – dez/2021)",
      period: "mar/2020 – maio/2023",
      location: "Angicos, RN",
      summary:
        "Desenvolvimento de aplicações web com Java 11, Spring Boot, Thymeleaf e PostgreSQL, além de liderança de equipe e gestão da empresa júnior como Presidente.",
    },
    {
      company: "Yank Solutions",
      role: "Analista de Desenvolvimento",
      period: "jun/2021 – abr/2022",
      location: "Remoto",
      summary:
        "Criação de automações de processos (RPA) com Selenium, Java, Spring Boot e PostgreSQL.",
    },
    {
      company: "Salinor (Salinas do Nordeste)",
      role: "Estagiário de TI",
      period: "dez/2017 – maio/2019",
      location: "Macau, RN",
      summary: "Suporte técnico e rotinas de infraestrutura de TI.",
    },
  ],
  education: {
    institution: "Universidade Federal Rural do Semi-Árido (UFERSA)",
    degree: "Bacharelado em Sistemas de Informação",
    period: "mar/2020 – previsão 2027",
    expectedYear: "2027",
  },
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
      "Infraestrutura de E-mail",
      "API REST",
    ],
  },
  otherCertifications: [
    {
      title: "Fundamentos de Java",
      issuer: "Rocketseat",
      issuedAt: "fev/2026",
      verifyUrl:
        "https://app.rocketseat.com.br/certificates/64a9c287-e198-4351-9aba-fa6a4a26e51a",
    },
    {
      title: "Imersão Dev com Google Gemini",
      issuer: "Alura",
      issuedAt: "abr/2025",
      verifyUrl:
        "https://cursos.alura.com.br/immersion/certificate/27cb032e-7572-4378-842c-b0e5d39c63a0?lang=pt_BR",
    },
    {
      title: "ASP.NET Core MVC & EF Core",
      issuer: "balta.io",
      issuedAt: "jan/2020",
    },
  ],
};
