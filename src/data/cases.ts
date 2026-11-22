import type { CaseStudy } from "./types";

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "motor-socioeconomico-auxilios",
    domain: "Assistência estudantil",
    shortTitle: "Motor socioeconômico e folha de auxílios",
    title: "Motor de seleção socioeconômica, pontuação auditável e folha de auxílios",
    summary:
      "Motor parametrizável por unidade para questionários, critérios eliminatórios, registro histórico imutável de pontuação, recursos e folha de pagamento.",
    context: "Módulo de assistência estudantil em sistema corporativo de gestão universitária (ESIG Software).",
    period: "2026",
    role: "Desenvolvedor Full Stack (Java EE, JSF e PostgreSQL)",
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
        detail: "Cadastro socioeconômico unificado parametrizado por edital",
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
        detail: "Análise de recursos, bloqueio de acúmulo, folha e relatórios",
      },
    ],
    problem:
      "Os processos seletivos de bolsas e auxílios variavam por unidade e edital, exigindo questionários com pesos ou percentuais, regras eliminatórias por tipo de auxílio, critérios próprios de desempate e janelas de recurso. Quando o período de respostas era reaberto e o estudante editava uma resposta, perdia-se a pontuação original usada na análise anterior. Além disso, alternar períodos com e sem cálculo percentual deixava estados residuais na listagem de resultados.",
    constraints:
      "O fluxo tem impacto financeiro direto (folha de pagamento e regras de bloqueio de acúmulo de bolsas), exige parametrização por unidade sem afetar outras unidades e demanda rastreabilidade completa para auditoria e análise de recursos.",
    solution:
      "Implementei a configuração do cadastro socioeconômico unificado por unidade, com cálculo percentual opcional por peso e critérios parametrizáveis de eliminação e desempate. Criei um espelho imutável da pontuação inicial para preservar o histórico em reaberturas, integrado ao fluxo de recursos, ao bloqueio de acúmulo de bolsas, à folha de pagamento e aos relatórios. Também limpei os estados residuais da listagem ao alternar períodos com diferentes modos de cálculo.",
    result:
      "Seleção socioeconômica, auditoria de pontuação e geração de folha operando em produção com regras configuráveis por unidade e histórico preservado.",
  },
  {
    slug: "apis-rest-sistema-academico",
    domain: "Integrações e APIs",
    shortTitle: "APIs REST de matrícula e frequência",
    title: "APIs REST para matrícula, frequência e integração em sistema acadêmico",
    summary:
      "Evolução de contratos REST/JSON para matrícula, turmas, frequência e notícias, com tratamento de nulos e bloqueio de registros sem vínculo.",
    context:
      "Camada de APIs REST em sistema corporativo de gestão universitária (ESIG Software).",
    period: "2026",
    role: "Desenvolvedor Full Stack (Java, APIs REST e PostgreSQL)",
    stack: ["Java", "APIs REST/JSON", "Hibernate/JPA", "PostgreSQL", "GitLab CI"],
    diagramTitle: "Arquitetura da camada de APIs REST do sistema acadêmico",
    diagramSummary:
      "Cliente ou app integrado, endpoints REST/JSON, validação de contrato e regras acadêmicas, camada Hibernate/PostgreSQL e resposta consistente sem registros inválidos.",
    diagramNodes: [
      {
        label: "Cliente / App integrado",
        detail: "Aplicações consumidoras dos fluxos acadêmicos",
      },
      {
        label: "Endpoints REST/JSON",
        detail: "Rotas de matrícula, turmas abertas, frequência e publicação de notícias",
      },
      {
        label: "Validação e regras",
        detail: "Contratos JSON obrigatórios e flags de nível e matrícula",
      },
      {
        label: "Hibernate/PostgreSQL",
        detail: "Consultas com filtragem estrita de vínculo ativo",
      },
      {
        label: "Resposta consistente",
        detail: "Tratamento de nulos e bloqueio de registros sem vínculo",
      },
    ],
    problem:
      "Aplicações integradas e fluxos do calendário acadêmico (rematrícula, validação de matrícula em turmas, consulta de turmas abertas, listagem de frequência e publicação de notícias) exigiam endpoints REST/JSON consistentes sobre regras legadas complexas. Em produção, falhas como NullPointerException em datas de aula e o retorno indevido de frequências de alunos não matriculados quebravam integrações ativas.",
    constraints:
      "Picos de acesso concorrente em janelas de matrícula, contratos JSON consumidos por sistemas externos e compatibilidade obrigatória com as validações já existentes no núcleo Java/Hibernate.",
    solution:
      "Construí e evoluí endpoints REST/JSON para validação de matrícula em turma, rematrícula, listagem de turmas abertas com indicadores de nível e situação de matrícula e publicação de notícias com validação obrigatória de payload JSON. Na sustentação em produção, implementei tratamento contra NullPointerException em consultas de frequência e filtragem rigorosa no backend para excluir registros sem vínculo válido de matrícula.",
    result:
      "Contratos REST/JSON estáveis e previsíveis em produção durante janelas de matrícula e acompanhamento de frequência.",
  },
  {
    slug: "verificacao-digital-diplomas-documentos",
    domain: "Documentos oficiais",
    shortTitle: "Verificação digital de diplomas (QR Code)",
    title: "Verificação digital de diplomas via QR Code e geração de documentos oficiais",
    summary:
      "Autenticidade digital via código verificador e QR Code, diplomas de pós-graduação e residência em saúde, declarações docentes e dossiês em PDF.",
    context:
      "Módulos de diplomas, históricos, declarações docentes e documentação administrativa em sistemas corporativos de gestão universitária (ESIG Software).",
    period: "2023–2026",
    role: "Desenvolvedor Full Stack (Java, JasperReports e PostgreSQL)",
    stack: ["Java", "JasperReports", "PDF/HTML", "QR Code", "JSF/JSP", "PostgreSQL"],
    diagramTitle: "Fluxo de emissão e autenticação digital de diplomas e documentos",
    diagramSummary:
      "Registro e reconhecimento (graduação, pós-graduação e residência em saúde), motor JasperReports/PDF, declarações e dossiês, código verificador com QR Code e consulta pública autônoma.",
    diagramNodes: [
      {
        label: "Registro e reconhecimento",
        detail: "Graduação, pós-graduação lato/stricto sensu e residência em saúde",
      },
      {
        label: "Motor JasperReports/PDF",
        detail: "Diplomas com portaria/decreto e observações legais condicionais",
      },
      {
        label: "Declarações e dossiês",
        detail: "Orientações docentes, prévia HTML de históricos e dossiês em PDF",
      },
      {
        label: "Código verificador e QR Code",
        detail: "Estampa digital de autenticidade vinculada ao documento",
      },
      {
        label: "Portal público de autenticidade",
        detail: "Consulta pública autônoma de documentos emitidos",
      },
    ],
    problem:
      "Certificados e diplomas de diferentes níveis de ensino (graduação, pós-graduação lato/stricto sensu e residência em saúde) não contavam com verificação digital padronizada no portal público nem com cadastro estruturado de reconhecimento de curso (portaria/decreto) refletido na impressão. Docentes também precisavam emitir declarações de orientações ministradas abrangendo a pós-graduação, enquanto operadores precisavam pré-visualizar históricos antes da emissão definitiva e exportar dossiês administrativos completos em PDF.",
    constraints:
      "Documentos com validade legal e regras distintas por nível de ensino e instituição, layouts rígidos de impressão em JasperReports/PDF e necessidade de manter o mecanismo de autenticação pública já adotado na graduação.",
    solution:
      "Adaptei o fluxo de validação digital para incluir código verificador e QR Code nos diplomas e certificados, com rota de conferência no portal público. Disponibilizei o cadastro de reconhecimento de cursos e atualizei a impressão de diplomas lato e stricto sensu com dados de portaria e decreto, além de estender o registro e as assinaturas de diploma para a residência em saúde. No portal docente e administrativo, implementei a emissão da “Declaração de Orientações Ministradas” (incluindo stricto sensu), a exibição condicional de observações legais, a pré-visualização HTML de históricos e a exportação completa de dossiês em PDF.",
    result:
      "Emissão padronizada e consulta pública autônoma de diplomas, declarações e documentos oficiais em múltiplas instituições, com validação direta pelo código verificador.",
  },
  {
    slug: "acervo-marc21-biblioteca-catalogacao",
    domain: "Biblioteca e dados",
    shortTitle: "Saneamento MARC21 e biblioteca",
    title: "Saneamento de acervo MARC21, catalogação e ficha catalográfica",
    summary:
      "Higienização em lote de registros bibliográficos MARC21 no PostgreSQL, correção de cache JDBC, rotina agendada de reservas, multas e ficha catalográfica.",
    context:
      "Módulo de biblioteca e rotinas agendadas de administração em sistema corporativo de gestão universitária (ESIG Software).",
    period: "2023–2024",
    role: "Desenvolvedor Full Stack (Java EE, SQL e PostgreSQL)",
    stack: ["Java", "JSF", "PostgreSQL", "SQL", "Hibernate/JPA", "MARC21", "JasperReports"],
    diagramTitle: "Fluxo de saneamento MARC21, catalogação e serviços de biblioteca",
    diagramSummary:
      "Acervo migrado MARC21, saneamento SQL em lote (subcampos, campos locais e CDU/CNPq), cache MARC e rotina agendada de reservas, regras de catalogação/multas e emissão de ficha catalográfica e etiquetas.",
    diagramNodes: [
      {
        label: "Acervo migrado (MARC21)",
        detail: "Registros bibliográficos com campos de catalogação, publicação e autoria",
      },
      {
        label: "Saneamento SQL em lote",
        detail: "Normalização de subcampos, limpeza de campos locais e CDU/CNPq",
      },
      {
        label: "Cache MARC e rotinas",
        detail: "Sequence JDBC/Hibernate e rotina agendada de reservas vencidas",
      },
      {
        label: "Catalogação e multas",
        detail: "Devolução parametrizada, reservas e campos estruturados",
      },
      {
        label: "Ficha e etiquetas",
        detail: "Solicitação, atendimento, margens, lombada e código de barras",
      },
    ],
    problem:
      "Migrações de acervos legados geraram inconsistências nos registros MARC21 (padrão internacional de catalogação bibliográfica estruturado em campos numéricos e subcampos). Entre os problemas estavam subcampos invertidos em dados de publicação, caracteres residuais, ausência do nome da biblioteca no campo de agência catalogadora (040), mais de 20 campos locais obsoletos e desalinhamento entre a classificação temática CDU (Classificação Decimal Universal) e as áreas do conhecimento do CNPq nos relatórios. Em produção, a catalogação ainda sofria colisão de chave na sequence do cache MARC em operações em lote JDBC, a rotina agendada de reservas vencidas não aparecia no painel administrativo, devoluções com atraso aplicavam suspensão mesmo com parâmetro zerado e o fluxo de ficha catalográfica e etiquetas precisava de padronização.",
    constraints:
      "Acervo em operação diária atendendo catalogadores e comunidade acadêmica em múltiplas instituições, exigindo scripts SQL idempotentes sem corromper exemplares registrados no patrimônio, aderência ao padrão MARC21 e isolamento de customizações por instituição.",
    solution:
      "Executei scripts SQL em lote no PostgreSQL para corrigir subcampos invertidos, limpar caracteres residuais e campos de cabeçalho e publicação, preencher o campo de agência catalogadora (040), remover campos locais obsoletos e sincronizar CDU, classe principal e áreas do CNPq. Em paralelo, corrigi o conflito de sequence no cache MARC em operações em lote JDBC/Hibernate, restaurei a exibição e a execução da rotina agendada de reservas vencidas e ajustei a regra parametrizada de multa e suspensão por atraso. Por fim, evoluí o fluxo de solicitação e atendimento da ficha catalográfica (biblioteca vinculada pré-selecionada, novos tipos de obra e margens padronizadas) e implementei novos formatos de etiquetas com código de barras e lombada para livros e fascículos de periódicos.",
    result:
      "Acervo bibliográfico saneado e aderente ao padrão MARC21, catalogação e rotinas de reserva estabilizadas em produção e fluxo completo de ficha catalográfica e etiquetas operando em múltiplas bibliotecas.",
  },
  {
    slug: "fluxos-pesquisa-extensao-bolsas",
    domain: "Pesquisa e extensão",
    shortTitle: "Pesquisa, extensão e bolsas",
    title: "Fluxos de pesquisa, extensão, bolsas e curricularização",
    summary:
      "Cadastro e validação de projetos externos, ciclo de avaliação e prorrogação com notificações, creditação de extensão e controle de bolsas.",
    context:
      "Módulos de pesquisa, extensão, creditação curricular e homologação de bolsistas em sistema corporativo de gestão universitária (ESIG Software).",
    period: "2023–2024",
    role: "Desenvolvedor Full Stack (Java EE, Hibernate e PostgreSQL)",
    stack: ["Java", "JSF/JSP", "Hibernate/JPA", "PostgreSQL", "SQL", "JasperReports"],
    diagramTitle: "Fluxo integrado de projetos de pesquisa, extensão e bolsas",
    diagramSummary:
      "Submissão de projetos externos e ações de extensão, autorização pela pró-reitoria e avaliação/prorrogação, notificações e pareceres, controle de bolsas com homologação integrada e curricularização/certificados.",
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
        detail: "Bloqueio de acúmulo de bolsas e homologação integrada",
      },
      {
        label: "Curricularização e certificados",
        detail: "Cálculo de frequência em extensão e emissão de certificados",
      },
    ],
    problem:
      "O cadastro de projetos externos de pesquisa impunha campos obrigatórios incompatíveis com projetos sem edital interno e não tinha etapa formal de validação pela pró-reitoria. Em produção, havia ainda falhas no reconhecimento de anexos, erros de atualização em lote JDBC/Hibernate em ações de extensão, inconsistências na emissão de certificados e travas na distribuição de projetos para avaliação. Na gestão de bolsas e na curricularização (contabilização de ações de extensão como créditos na matriz curricular), faltavam bloqueio contra solicitação simultânea de múltiplas bolsas, cálculo automático do percentual de frequência e visibilidade da situação discente na homologação integrada de bolsistas.",
    constraints:
      "Fluxos multiperfil envolvendo docentes, coordenadores, diretores de unidade, consultores e pró-reitorias, integrando os módulos acadêmico e administrativo/financeiro com impacto direto em bolsas, certificação e integralização de carga horária de extensão.",
    solution:
      "Reestruturei o cadastro externo de projetos de pesquisa com opção customizada de entidade financiadora, flexibilização condicional de edital, validação estrita de anexos em PDF, envio de currículo docente e tela dedicada de validação pela pró-reitoria. Evoluí o ciclo de avaliação e prorrogação com novos status de acompanhamento, seção de prorrogação, distribuição manual de projetos e relatórios finais e notificações entre perfis. Na extensão e gestão de bolsas, implementei autocompletar de unidade proponente, cálculo automático de frequência na creditação curricular, bloqueio de acúmulo de bolsas e enriquecimento da listagem de homologação integrada ao módulo administrativo, além de corrigir as falhas de atualização em lote JDBC/Hibernate e de certificados.",
    result:
      "Fluxos de submissão, avaliação, prorrogação, bolsas e curricularização em produção, com validação formal pela pró-reitoria, cálculo automático de frequência e notificações entre perfis.",
  },
  {
    slug: "sustentacao-multi-institucional-regras-criticas",
    domain: "Sustentação crítica",
    shortTitle: "Sustentação para 12 instituições",
    title: "Customizações, regras críticas e sustentação para 12 instituições",
    summary:
      "Mais de 250 demandas entregues abrangendo 4 sistemas corporativos para 12 instituições públicas, com auditorias SQL e isolamento por branch.",
    context:
      "Atuação transversal em 4 sistemas corporativos de gestão universitária — gestão acadêmica, protocolo administrativo, recursos humanos e rotinas agendadas (ESIG Software).",
    period: "2023–2026",
    role: "Desenvolvedor Full Stack (Java EE, SQL e PostgreSQL)",
    stack: ["Java", "PostgreSQL", "SQL", "Hibernate/JPA", "JSF/JSP", "Apache Ant", "Git/GitLab", "JBoss/Tomcat"],
    diagramTitle: "Ciclo de evolução, auditoria SQL e sustentação multi-institucional",
    diagramSummary:
      "Demanda institucional ou auditoria, análise de regras e SQL no PostgreSQL, implementação isolada em branch, homologação/aceite e entrega em produção abrangendo 4 sistemas e 12 instituições.",
    diagramNodes: [
      {
        label: "Demanda ou auditoria",
        detail: "Regras acadêmicas, ordens judiciais e importação em lote",
      },
      {
        label: "Análise de regras e SQL",
        detail: "12 auditorias de integridade e dados no PostgreSQL",
      },
      {
        label: "Implementação isolada",
        detail: "Customizações isoladas por branch para preservar o núcleo",
      },
      {
        label: "Validação e aceite",
        detail: "Homologação em ambiente de testes e aceite do cliente",
      },
      {
        label: "Entrega em produção",
        detail: "250+ entregas em 4 sistemas e 12 instituições públicas",
      },
    ],
    problem:
      "As 12 instituições públicas operam sobre uma base compartilhada, mas possuem regras regulatórias próprias. A sustentação abrangia processamento de matrículas, calendário de ingressantes, determinações judiciais de aproveitamento de disciplinas e conclusão de curso, guarda religiosa (justificativa e reposição de aulas e avaliações), subdivisão de notas por unidade avaliativa, importação em lote de discentes e avaliação institucional para pós-graduação. Em produção, também surgiam divergências de dados em históricos, matrículas e auxílios, além de bugs intermitentes de sessão.",
    constraints:
      "Bases de código extensas e compartilhadas com customizações isoladas por branch e instituição, validação rigorosa em ambiente de homologação com aceite do cliente e tolerância mínima a regressões em outros casos de uso.",
    solution:
      "Implementei um novo tipo de aproveitamento de disciplinas por ordem judicial vinculado à integralização curricular, o fluxo completo de solicitação e registro de frequência para guarda religiosa e a subdivisão de notas por unidade avaliativa aplicada a todas as turmas de um mesmo componente curricular. Evoluí o calendário universitário, a matrícula de ingressantes, a lista de equivalências com grau acadêmico, a importação em lote de discentes com modelos configuráveis de arquivo e a expansão da avaliação institucional (formulários e moderação) para pós-graduação lato e stricto sensu. Em sustentação, conduzi 12 auditorias de integridade e scripts operacionais em PostgreSQL (matrículas, recálculo de currículos e períodos letivos excepcionais) e eliminei um vazamento de variável de sessão entre casos de uso.",
    result:
      "Mais de 250 entregas rastreadas no ciclo 2023–2026 abrangendo 4 sistemas corporativos e 12 instituições públicas, com estabilidade preservada entre módulos compartilhados.",
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((item) => item.slug === slug);
}
