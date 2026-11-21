import type { CaseStudy } from "./types";

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "motor-socioeconomico-auxilios",
    domain: "Assistência estudantil",
    shortTitle: "Motor socioeconômico e folha de auxílios",
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
    domain: "Integrações & APIs",
    shortTitle: "APIs REST de matrícula e frequência",
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
    domain: "Documentos oficiais",
    shortTitle: "Verificação digital de diplomas (QR Code)",
    title: "Verificação digital de diplomas via QR Code e geração de documentos oficiais",
    summary:
      "Autenticidade digital via código verificador e QR Code, diplomas de pós-graduação e Residência em Saúde, declarações docentes e dossiês em PDF.",
    context:
      "Módulos de diplomas, históricos, declarações docentes e documentação administrativa em sistemas corporativos (ESIG Software).",
    period: "2023–2026",
    role: "Desenvolvedor Full Stack",
    stack: ["Java", "JasperReports", "PDF/HTML", "QR Code", "JSF/JSP", "PostgreSQL"],
    diagramTitle: "Fluxo de emissão e autenticação digital de diplomas e documentos",
    diagramSummary:
      "Registro, reconhecimento e assinaturas (Graduação, Pós e Residência), motor JasperReports/PDF, código verificador com QR Code e conferência no portal público de autenticidade.",
    diagramNodes: [
      {
        label: "Registro e reconhecimento",
        detail: "Graduação, Lato/Stricto Sensu e Residência em Saúde",
      },
      {
        label: "Motor JasperReports / PDF",
        detail: "Diplomas, declarações docentes, dossiês e prévia HTML",
      },
      {
        label: "Código Verificador + QR Code",
        detail: "Estampa digital e observações legais condicionais",
      },
      {
        label: "Portal público de autenticidade",
        detail: "Conferência self-service de documentos emitidos",
      },
    ],
    problem:
      "Certificados e diplomas de diferentes níveis de ensino (graduação, pós-graduação lato/stricto sensu e residência em saúde) careciam de verificação digital padronizada acessível pelo portal público e de cadastro estruturado de reconhecimento de curso (portaria/decreto) refletido na impressão. Além disso, docentes precisavam emitir declarações de orientações ministradas abrangendo pós-graduação, e operadores precisavam pré-visualizar históricos antes da emissão definitiva e exportar dossiês completos de documentos administrativos em PDF.",
    constraints:
      "Documentos com validade legal e regras distintas por nível de ensino e instituição, layouts rígidos de impressão em JasperReports/PDF e necessidade de manter o mesmo mecanismo confiável de autenticação pública já consolidado na graduação.",
    solution:
      "Reaproveitamento e adaptação do fluxo de validação digital para incluir código verificador e QR Code nos diplomas e certificados com rota de conferência no portal público; disponibilização do cadastro de reconhecimento de cursos e atualização da impressão de diplomas de Lato e Stricto Sensu com dados de portaria/decreto; ampliação do registro e das assinaturas de diploma para Residência em Saúde; criação da emissão de “Declaração de Orientações Ministradas” no portal docente (incluindo orientações Stricto Sensu); exibição condicional de observações legais, pré-visualização HTML de históricos e exportação completa de documentos administrativos em PDF.",
    result:
      "Emissão padronizada e conferência pública self-service de diplomas, declarações e documentos oficiais em múltiplas instituições, reduzindo conferências manuais e retrabalho documental.",
  },
  {
    slug: "acervo-marc21-biblioteca-catalogacao",
    domain: "Biblioteca & Dados",
    shortTitle: "Saneamento MARC21 e biblioteca",
    title: "Saneamento de acervo MARC21, catalogação e ficha catalográfica",
    summary:
      "Higienização em lote de registros MARC21 no PostgreSQL, correção de cache JDBC e rotina de reservas, multas e fluxo de ficha catalográfica.",
    context:
      "Módulo de biblioteca e rotinas agendadas de administração em sistema corporativo de gestão universitária (ESIG Software).",
    period: "2023–2024",
    role: "Desenvolvedor Full Stack (Java EE / JSF / PostgreSQL)",
    stack: ["Java", "JSF", "PostgreSQL", "SQL", "Hibernate/JPA", "MARC21", "JasperReports"],
    diagramTitle: "Pipeline de saneamento MARC21, catalogação e serviços de biblioteca",
    diagramSummary:
      "Acervo migrado MARC21, saneamento SQL em lote (subcampos, tags locais e CDU/CNPq), cache MARC e timer administrativo de reservas, regras de catalogação/multas e emissão de ficha catalográfica e etiquetas.",
    diagramNodes: [
      {
        label: "Acervo migrado (MARC21)",
        detail: "Registros bibliográficos, tags locais e campos 040/260/700",
      },
      {
        label: "Saneamento SQL em lote",
        detail: "Normalização de subcampos, limpeza de tags e CDU/CNPq",
      },
      {
        label: "Cache MARC e rotinas",
        detail: "Sequence JDBC/Hibernate e timer de reservas vencidas",
      },
      {
        label: "Catalogação e multas",
        detail: "Devolução parametrizada, reservas e campos estruturados",
      },
      {
        label: "Ficha e etiquetas",
        detail: "Solicitação, atendimento, margens, lombada e cód. barras",
      },
    ],
    problem:
      "Migrações de acervos bibliográficos legados geraram inconsistências estruturais nos registros MARC21 — incluindo subcampos invertidos em campos de publicação, caracteres residuais, ausência do nome da biblioteca no campo 040, mais de vinte tags locais obsoletas e desalinhamento entre classificação CDU e áreas do CNPq nos relatórios. Em produção, a catalogação ainda enfrentava colisão de chave na sequence do cache de entidades MARC em batch JDBC, o timer de reservas vencidas não aparecia no painel administrativo, devoluções com atraso aplicavam suspensão mesmo com parâmetro zerado e o fluxo de ficha catalográfica e etiquetas precisava de padronização.",
    constraints:
      "Acervo em operação diária atendendo catalogadores e comunidade acadêmica em múltiplas instituições, exigindo scripts SQL seguros e idempotentes sem corromper exemplares tombados, aderência ao padrão bibliográfico MARC21 e isolamento de customizações por instituição.",
    solution:
      "Execução de scripts de saneamento e padronização em massa no PostgreSQL (correção de subcampos invertidos, limpeza de caracteres residuais e campos temporais, preenchimento do campo 040, exclusão de tags locais obsoletas e sincronização de CDU, classe principal e áreas CNPq); diagnóstico e correção de conflito de sequence no cache MARC durante operações em lote JDBC/Hibernate; restauração da exibição e execução do timer de reservas vencidas no módulo administrativo; ajuste da regra parametrizada de multa e suspensão por atraso; e evolução ponta a ponta da ficha catalográfica (biblioteca vinculada pré-selecionada, novos tipos de obra, atendimento e margens padronizadas) somada a novos formatos de etiquetas com código de barras e lombada para livros e fascículos.",
    result:
      "Acervo bibliográfico saneado e aderente ao padrão MARC21, catalogação e rotinas de reserva estabilizadas em produção e fluxo completo de ficha catalográfica e etiquetas operando em múltiplas bibliotecas.",
  },
  {
    slug: "fluxos-pesquisa-extensao-bolsas",
    domain: "Pesquisa & Extensão",
    shortTitle: "Pesquisa, Extensão e bolsas",
    title: "Fluxos de Pesquisa, Extensão, bolsas e curricularização",
    summary:
      "Cadastro e validação de projetos externos, ciclo de avaliação e prorrogação com notificações, creditação de extensão e controle de bolsas.",
    context:
      "Módulos de pesquisa, extensão, creditação curricular e homologação de bolsistas em sistema corporativo de gestão universitária (ESIG Software).",
    period: "2023–2024",
    role: "Desenvolvedor Full Stack (Java EE / JSF / PostgreSQL)",
    stack: ["Java", "JSF/JSP", "Hibernate/JPA", "PostgreSQL", "SQL", "JasperReports"],
    diagramTitle: "Fluxo integrado de projetos de pesquisa, extensão e bolsas",
    diagramSummary:
      "Submissão de projetos externos e ações de extensão, autorização pela pró-reitoria e avaliação/prorrogação, notificações e pareceres, cotas de bolsas com homologação integrada e curricularização/certificados.",
    diagramNodes: [
      {
        label: "Submissão e projetos externos",
        detail: "Anexos PDF, currículo docente e unidade proponente",
      },
      {
        label: "Autorização e avaliação",
        detail: "Validação pela pró-reitoria, prorrogação e distribuição",
      },
      {
        label: "Notificações e parecer",
        detail: "Novos status de fluxo, pareceres e alertas entre perfis",
      },
      {
        label: "Bolsas e homologação",
        detail: "Cotas, planos de trabalho, anti-acúmulo e integração",
      },
      {
        label: "Curricularização e certificados",
        detail: "Cálculo de frequência em extensão e certificação",
      },
    ],
    problem:
      "O cadastro de projetos externos de pesquisa impunha obrigatoriedades incompatíveis com projetos sem edital interno e não contava com etapa formal de validação pela pró-reitoria, além de falhas em produção no reconhecimento de anexos, erros de batch update JDBC no Hibernate em ações de extensão e travas indevidas na distribuição de projetos para avaliação. Na gestão de bolsas e extensão, faltavam bloqueio contra solicitação simultânea de múltiplas bolsas, cálculo automático do percentual de frequência na creditação curricular e visibilidade do status discente na homologação integrada de bolsistas.",
    constraints:
      "Fluxos multiperfil envolvendo docentes, coordenadores, diretores de unidade, consultores e pró-reitorias, integrando os módulos acadêmico e administrativo/financeiro com impacto direto em bolsas, certificação e integralização de carga horária de extensão.",
    solution:
      "Reestruturação do fluxo de cadastro externo de projetos de pesquisa (opção customizada de entidade financiadora, flexibilização condicional de edital, validação estrita de anexos em PDF, anexo de currículo docente e nova tela dedicada de validação pela pró-reitoria); evolução do ciclo de avaliação e prorrogação (novos status de acompanhamento, seção de dados da prorrogação, distribuição manual de projetos e relatórios finais e envio de notificações entre perfis); autocomplete de unidade proponente e cálculo automático de frequência na creditação de ações de extensão; bloqueio de acúmulo de bolsas e enriquecimento da listagem de homologação de bolsistas integrada ao módulo administrativo; além de correções em produção de batch JDBC/Hibernate e certificados.",
    result:
      "Ciclo completo de submissão, avaliação, prorrogação, concessão de bolsas e curricularização operando de ponta a ponta com menor intervenção manual e maior rastreabilidade entre pró-reitorias e unidades.",
  },
  {
    slug: "sustentacao-multi-institucional-regras-criticas",
    domain: "Sustentação crítica",
    shortTitle: "Sustentação para 12 instituições",
    title: "Customizações, regras críticas e sustentação para 12 instituições",
    summary:
      "Mais de 250 demandas entregues atravessando 4 sistemas corporativos para 12 instituições públicas, com auditorias SQL e isolamento por branch.",
    context:
      "Atuação transversal em 4 sistemas corporativos do ecossistema SIG — gestão acadêmica, administrativo/protocolo, RH e administração/rotinas agendadas (ESIG Software).",
    period: "2023–2026",
    role: "Desenvolvedor Java EE / Full Stack",
    stack: ["Java", "PostgreSQL/SQL", "Hibernate/JPA", "JSF/JSP", "Apache Ant", "Git/GitLab", "JBoss/Tomcat"],
    diagramTitle: "Ciclo de evolução, auditoria SQL e sustentação multi-institucional",
    diagramSummary:
      "Demanda institucional ou auditoria, análise de regras e SQL no PostgreSQL, implementação isolada em branch, validação/ateste e entrega em produção atravessando 4 sistemas e 12 instituições.",
    diagramNodes: [
      {
        label: "Demanda ou auditoria",
        detail: "Regras acadêmicas, ordens judiciais e importação em lote",
      },
      {
        label: "Análise de regras e SQL",
        detail: "12 auditorias forenses e integridade no PostgreSQL",
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
        detail: "250+ entregas em 4 sistemas e 12 instituições públicas",
      },
    ],
    problem:
      "Manter e evoluir módulos críticos para 12 instituições públicas com regras regulatórias próprias — abrangendo processamento de matrículas e calendário de ingressantes, determinações judiciais de aproveitamento e conclusão de curso, fluxo de Guarda Religiosa, desmembramento de avaliações por componente curricular, importação em lote de alunos, avaliação institucional para pós-graduação, auditorias de divergências em históricos/matrículas/auxílios e bugs intermitentes de sessão em produção.",
    constraints:
      "Bases de código extensas e compartilhadas com customizações isoladas por branch e instituição, validação rigorosa em ambiente de homologação e ateste do cliente e tolerância mínima a regressões em outros casos de uso.",
    solution:
      "Implementação de novo tipo de aproveitamento por ordem judicial integrado à integralização curricular; fluxo completo de solicitação e registro de frequência para Guarda Religiosa; desmembramento de avaliações por unidade aplicado a todas as turmas de um mesmo componente curricular; evolução do calendário universitário, matrícula de ingressantes e lista de equivalências com grau acadêmico; importação em lote de discentes com gerenciamento de layouts e expansão da avaliação institucional para Lato e Stricto Sensu; somados a 12 auditorias forenses e scripts operacionais em PostgreSQL (processamento de matrículas, recálculo de currículos e períodos excepcionais) e eliminação de vazamento de variável de sessão entre casos de uso.",
    result:
      "Mais de 250 demandas entregues e rastreadas no ciclo 2023–2026 atravessando 4 sistemas corporativos e 12 instituições públicas, com estabilidade preservada entre módulos compartilhados.",
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((item) => item.slug === slug);
}
