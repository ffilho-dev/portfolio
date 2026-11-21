import type { PublicProject } from "./types";

export const publicProjects: readonly PublicProject[] = [
  {
    name: "clone-tabnews",
    owner: "ffilho-dev",
    isLegacyAccount: false,
    liveUrl: "https://clone-tabnews-gamma-wheat.vercel.app",
    repoUrl: "https://github.com/ffilho-dev/clone-tabnews",
    description:
      "Engenharia fullstack construída do zero — Next.js, PostgreSQL, Docker Compose, migrations versionadas (node-pg-migrate), testes de integração com Jest, ESLint, Prettier, Husky, Conventional Commits e deploy contínuo na Vercel.",
    stack: ["Next.js", "PostgreSQL", "Docker Compose", "Migrations", "Jest", "Vercel"],
  },
  {
    name: "ProjetoEsigGroup",
    owner: "FrankBROFC",
    isLegacyAccount: true,
    legacyNote: "conta anterior",
    repoUrl: "https://github.com/FrankBROFC/ProjetoEsigGroup",
    description:
      "Aplicação fullstack de gerenciamento de tarefas construída com Java 11, Spring Boot, JPA/Hibernate, PostgreSQL, documentação Swagger 3 e front-end Angular com lazy loading e resolvers.",
    stack: ["Java 11", "Spring Boot", "JPA/Hibernate", "PostgreSQL", "Swagger 3", "Angular"],
  },
  {
    name: "BotRegistroImoveisBrasil",
    owner: "FrankBROFC",
    isLegacyAccount: true,
    legacyNote: "conta anterior",
    repoUrl: "https://github.com/FrankBROFC/BotRegistroImoveisBrasil",
    description:
      "Automação prática (RPA) em Java combinando Selenium para captura de estados e municípios, Unirest para consumo de endpoints JSON e Apache POI para geração automática de planilhas.",
    stack: ["Java", "Selenium", "Unirest", "Apache POI"],
  },
  {
    name: "ffilho-dev/portfolio",
    owner: "ffilho-dev",
    isLegacyAccount: false,
    repoUrl: "https://github.com/ffilho-dev/portfolio",
    description:
      "Este próprio portfólio — Next.js App Router, TypeScript estrito, Tailwind CSS v4, tema Claro/Escuro sem FOUC seguindo padrões modernos da web, testes automatizados e currículo imprimível A4.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS v4", "Vitest"],
  },
];
