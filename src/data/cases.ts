import type { CaseStudy } from "./types";

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "motor-socioeconomico-auxilios",
    title: "Motor de seleção socioeconômica, pontuação auditável e folha de auxílios",
    summary:
      "Motor parametrizável por unidade para questionários, critérios eliminatórios, espelho imutável de pontuação, recursos e folha de pagamento.",
    context: "Módulo de assistência estudantil em sistema corporativo de gestão universitária (ESIG Software).",
    period: "2026",
    role: "Desenvolvedor Full Stack (Java EE / JSF / PostgreSQL)",
    stack: ["Java", "JSF", "PostgreSQL", "SQL", "JasperReports"],
    diagramTitle: "Fluxo do motor de seleção socioeconômica e folha de auxílios",
    diagramSummary:
      "Configuração por unidade (pesos e percentuais), adesão e questionário, motor de análise com eliminatórias e desempate, espelho imutável de pontuação, recursos e folha de pagamento.",
    diagramNodes: [
      {
        label: "Configuração por unidade",
        detail: "Pesos, percentual opcional, eliminatórias e desempate",
      },
      {
        label: "Adesão e questionário",
        detail: "Cadastro único parametrizado por edital",
      },
      {
        label: "Motor de análise",
        detail: "Pontuação, regras eliminatórias e critérios de desempate",
      },
      {
        label: "Espelho imutável",
        detail: "Preservação histórica da pontuação original em reaberturas",
      },
      {
        label: "Recursos e folha",
        detail: "Análise de recursos, inacumulação, folha e relatórios",
      },
    ],
    problem:
      "Processos seletivos de bolsas e auxílios variavam por unidade e edital — exigindo questionários com pesos ou percentuais, perguntas e alternativas eliminatórias condicionadas ao tipo de auxílio, critérios próprios de desempate e janelas de recurso. Além disso, quando o período de respostas era reaberto e o estudante editava uma resposta, perdia-se a referência original da pontuação usada na análise anterior.",
    constraints:
      "Fluxo com impacto financeiro direto (folha de pagamento e regras de inacumulação de bolsas), necessidade de configuração por unidade sem quebrar regras de outras unidades e exigência de rastreabilidade para auditoria e análise de recursos.",
    solution:
      "Desenvolvimento incremental em blocos integrados: configuração do cadastro único por unidade, questionários com flag opcional de cálculo percentual por peso, marcação de critérios eliminatórios e de desempate parametrizáveis, criação do espelho imutável da pontuação preservando o histórico da avaliação inicial, fluxo de solicitação e análise de recursos, controle de inacumulação/folha de pagamento e relatórios. Também foram corrigidos estados residuais de listagem ao alternar períodos com e sem cálculo percentual.",
    result:
      "Processo completo de seleção, auditoria e geração de folha operando em produção com regras configuráveis por unidade e preservação íntegra do histórico de pontuação.",
  },
  {
    slug: "apis-rest-sistema-academico",
    title: "APIs REST para matrícula, frequência e integração em sistema acadêmico",
    summary:
      "Evolução de contratos REST/JSON para matrícula, turmas e notícias somada à blindagem contra erros e vazamento de registros inválidos.",
    context:
      "Camada de APIs REST em sistema corporativo de gestão universitária de grande porte (ESIG Software).",
    period: "2026",
    role: "Desenvolvedor Backend / Full Stack",
    stack: ["Java", "APIs REST/JSON", "Hibernate/JPA", "PostgreSQL", "GitLab CI"],
    diagramTitle: "Arquitetura da camada de APIs REST do sistema acadêmico",
    diagramSummary:
      "Cliente ou app integrado, endpoints REST JSON, validação de contrato e regras acadêmicas, camada Hibernate/PostgreSQL e resposta consistente sem vazamento de registros inválidos.",
    diagramNodes: [
      {
        label: "Cliente / App integrado",
        detail: "Aplicações consumidoras dos fluxos acadêmicos",
      },
      {
        label: "Endpoints REST (JSON)",
        detail: "Rotas de matrícula, turmas abertas, frequência e notícias v1",
      },
      {
        label: "Validação e regras",
        detail: "Contratos JSON obrigatórios e flags de nível/matrícula",
      },
      {
        label: "Hibernate / PostgreSQL",
        detail: "Consultas com filtragem estrita de vínculo ativo",
      },
      {
        label: "Resposta consistente",
        detail: "Proteção defensiva e bloqueio de registros sem vínculo",
      },
    ],
    problem:
      "Aplicações integradas e fluxos críticos do calendário acadêmico (rematrícula, validação de matrícula em turmas, consulta de turmas abertas, listagem de frequência e publicação de notícias) precisavam de endpoints REST consistentes sobre regras legadas complexas, ao mesmo tempo em que erros em produção (como NullPointerException em datas de aula e retorno indevido de frequências de alunos não matriculados) quebravam integrações ativas.",
    constraints:
      "Alta criticidade em janelas de matrícula com grande volume de estudantes simultâneos, contratos JSON consumidos por sistemas externos e obrigatoriedade de manter compatibilidade com validações existentes no núcleo Java/Hibernate.",
    solution:
      "Construção e evolução de endpoints REST (/matricula/validar_matricula_turma, rematrícula, listagem de turmas abertas enriquecida com flags de nível e situação de matrícula, e rota v1 de notícias com validação de payload JSON obrigatório), somadas à atuação direta em sustentação: proteção defensiva contra NullPointerException em consultas de frequência e filtragem rigorosa no backend para excluir registros de frequência sem vínculo válido de matrícula.",
    result:
      "Contratos REST mais seguros e previsíveis em produção durante períodos críticos de matrícula e acompanhamento de frequência.",
  },
  {
    slug: "verificacao-digital-diplomas-documentos",
    title: "Verificação digital de diplomas via QR Code e geração de documentos oficiais",
    summary:
      "Autenticidade digital via código verificador e QR Code, ampliação para Residência em Saúde, pré-visualização de históricos e exportação documental.",
    context:
      "Módulos de diplomas, históricos, documentação administrativa e biblioteca em sistemas corporativos (ESIG Software).",
    period: "2024–2026",
    role: "Desenvolvedor Full Stack",
    stack: ["Java", "JasperReports", "PDF/HTML", "QR Code", "Código de Barras", "JSF/JSP", "PostgreSQL"],
    diagramTitle: "Fluxo de emissão e autenticação digital de diplomas e documentos",
    diagramSummary:
      "Registro e assinaturas (Graduação, Pós e Residência), motor JasperReports/PDF, geração de código verificador com QR Code e conferência no portal público de autenticidade.",
    diagramNodes: [
      {
        label: "Registro e assinaturas",
        detail: "Graduação, pós-graduação e Residência em Saúde",
      },
      {
        label: "Motor JasperReports / PDF",
        detail: "Layouts oficiais, observações legais e pré-visualização HTML",
      },
      {
        label: "Código Verificador + QR Code",
        detail: "Estampa digital e geração de etiquetas com código de barras",
      },
      {
        label: "Portal público de autenticidade",
        detail: "Conferência self-service de documentos emitidos",
      },
    ],
    problem:
      "Certificados e diplomas de diferentes níveis de ensino (graduação, pós-graduação lato/stricto sensu e residência em saúde) careciam de verificação digital padronizada acessível pelo portal público; além disso, operadores precisavam pré-visualizar históricos antes da emissão definitiva, exportar dossiês completos de documentos administrativos em PDF e imprimir etiquetas físicas com código de barras.",
    constraints:
      "Documentos com validade legal e regras distintas por nível de ensino e instituição, layouts rígidos de impressão em JasperReports/PDF e necessidade de manter o mesmo mecanismo confiável de autenticação pública já consolidado na graduação.",
    solution:
      "Reaproveitamento e adaptação do fluxo de validação digital para incluir código verificador e QR Code nos diplomas e certificados com rota de conferência no portal público, ampliação do registro e das assinaturas de diploma para o nível Residência em Saúde, exibição condicional de observações legais no histórico definitivo e no diploma, criação de pré-visualização HTML de históricos, funcionalidade de exportação completa de documentos em PDF no módulo administrativo e novo formato de etiquetas com código de barras e lombada.",
    result:
      "Emissão padronizada e conferência pública self-service de documentos oficiais em múltiplas instituições, reduzindo conferências manuais e retrabalho documental.",
  },
  {
    slug: "sustentacao-multi-institucional-regras-criticas",
    title: "Customizações, regras críticas e sustentação para 12 instituições",
    summary:
      "Mais de 120 demandas entregues atravessando módulos acadêmico, administrativo e de RH para 12 instituições públicas com isolamento por branch.",
    context:
      "Atuação transversal em 3 sistemas corporativos do ecossistema SIG — gestão acadêmica, administrativo/protocolo e RH (ESIG Software).",
    period: "2024–2026",
    role: "Desenvolvedor Java EE / Full Stack",
    stack: ["Java", "PostgreSQL/SQL", "Hibernate/JPA", "JSF/JSP", "Apache Ant", "Git/GitLab", "JBoss/Tomcat"],
    diagramTitle: "Ciclo de evolução e sustentação multi-institucional",
    diagramSummary:
      "Demanda institucional, análise de regras e SQL no PostgreSQL, implementação isolada em branch, validação/ateste e entrega em produção para 12 instituições.",
    diagramNodes: [
      {
        label: "Demanda institucional",
        detail: "Regras regulatórias, ordens judiciais e importação em lote",
      },
      {
        label: "Análise de regras e SQL",
        detail: "Diagnóstico de consistência e integridade no PostgreSQL",
      },
      {
        label: "Implementação isolada",
        detail: "Customizações em branch sem regressão no núcleo",
      },
      {
        label: "Validação e ateste",
        detail: "Homologação com fluxo de avaliação e moderação",
      },
      {
        label: "Entrega em produção",
        detail: "120+ entregas sustentando 12 instituições públicas",
      },
    ],
    problem:
      "Manter e evoluir módulos sensíveis para 12 instituições públicas com regras regulatórias próprias — abrangendo determinações judiciais de aproveitamento e conclusão de curso, importação em lote de alunos, avaliação institucional para pós-graduação e bugs intermitentes de sessão e consistência de dados em produção.",
    constraints:
      "Bases de código extensas e compartilhadas com customizações isoladas por branch e instituição, validação rigorosa em ambiente de homologação e ateste do cliente e tolerância mínima a regressões em outros casos de uso.",
    solution:
      "Implementação de novo tipo de aproveitamento por ordem judicial integrado às regras de integralização curricular e conclusão de programa; configuração de importação em lote de discentes com definição e gerenciamento de layouts; expansão do módulo de avaliação institucional (formulários, dimensões estatísticas e moderação) para Lato e Stricto Sensu; diagnóstico direto de consistência em PostgreSQL e eliminação de vazamento de variável de sessão que impactava casos de uso adjacentes.",
    result:
      "Mais de 120 demandas entregues e rastreadas no ciclo 2024–2026 atravessando 3 sistemas corporativos, com estabilidade preservada entre módulos compartilhados.",
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((item) => item.slug === slug);
}
