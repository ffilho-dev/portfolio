import type { PublicProject } from "./types";

export const publicProjects: readonly PublicProject[] = [
  {
    name: "clone-tabnews",
    owner: "ffilho-dev",
    isLegacyAccount: false,
    liveUrl: "https://clone-tabnews-gamma-wheat.vercel.app",
    repoUrl: "https://github.com/ffilho-dev/clone-tabnews",
    description:
      "Clone funcional do TabNews (projeto prático do curso.dev) construído do zero em arquitetura Full Stack com Next.js, PostgreSQL, Docker Compose, migrations versionadas (node-pg-migrate), testes de integração com Jest, ESLint, Prettier, Husky, Conventional Commits e deploy contínuo na Vercel.",
    stack: ["Next.js", "PostgreSQL", "Docker Compose", "Migrations", "Jest", "Vercel"],
  },
  {
    name: "ProjetoEsigGroup",
    owner: "FrankBROFC",
    isLegacyAccount: true,
    legacyNote: "conta anterior no GitHub",
    repoUrl: "https://github.com/FrankBROFC/ProjetoEsigGroup",
    description:
      "Desafio técnico público desenvolvido para o processo seletivo da Quark Tecnologia: aplicação Full Stack de gerenciamento de tarefas com Java 11, Spring Boot, Hibernate/JPA, PostgreSQL, documentação Swagger 3 e frontend Angular com lazy loading e resolvers.",
    stack: ["Java 11", "Spring Boot", "Hibernate/JPA", "PostgreSQL", "Swagger 3", "Angular"],
  },
  {
    name: "BotRegistroImoveisBrasil",
    owner: "FrankBROFC",
    isLegacyAccount: true,
    legacyNote: "conta anterior no GitHub",
    repoUrl: "https://github.com/FrankBROFC/BotRegistroImoveisBrasil",
    description:
      "Automação (RPA) em Java que percorre estados e municípios com Selenium, consome endpoints JSON com Unirest e exporta os dados coletados de registros de imóveis para planilhas com Apache POI.",
    stack: ["Java", "Selenium", "Unirest", "Apache POI"],
  },
  {
    name: "portfolio",
    owner: "ffilho-dev",
    isLegacyAccount: false,
    repoUrl: "https://github.com/ffilho-dev/portfolio",
    description:
      "Este portfólio, construído com Next.js App Router, TypeScript estrito, Tailwind CSS v4, tema claro/escuro sem flash de tema no carregamento (FOUC), HTML semântico, light-dark(), testes automatizados, currículo imprimível em A4 e PDF vetorial.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS v4", "Vitest"],
  },
];
