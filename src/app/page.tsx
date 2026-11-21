import Link from "next/link";
import { CaseDiagram } from "@/components/CaseDiagram";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { caseStudies } from "@/data/cases";
import { profile } from "@/data/profile";
import { publicProjects } from "@/data/projects";
import { aiPillars, skillGroups } from "@/data/skills";
import { formatDisplayUrl, slugifyId } from "@/lib/site";

export default function HomePage() {
  const { contact, education, featuredCertification } = profile;

  return (
    <div className="site-container py-12 sm:py-16">
      <section className="pb-10 sm:pb-12">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <h1 className="text-[clamp(2rem,1.45rem+2.2vw,2.875rem)] font-bold leading-[1.12] tracking-tight text-[var(--ink)]">
              {profile.name}
            </h1>
            <p className="text-lg font-medium text-[var(--accent)] sm:text-xl">
              {profile.title}
            </p>
          </div>

          <div className="prose-measure space-y-1 text-sm text-[var(--muted)]">
            <p>{profile.location}</p>
            <p>{profile.availability}</p>
          </div>

          <p className="prose-measure text-base leading-relaxed text-[var(--ink)] sm:text-[1.0625rem]">
            {profile.bio}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-ink)] transition-[opacity,background-color] duration-150 hover:opacity-90 [@media(pointer:coarse)]:min-h-11"
            >
              WhatsApp
            </a>
            <a
              href="/curriculo.pdf"
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition-[color,background-color,border-color] duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)] [@media(pointer:coarse)]:min-h-11"
            >
              Baixar currículo (PDF)
            </a>
            <Link
              href="/curriculo"
              className="inline-flex min-h-10 items-center px-2 py-2 text-sm font-medium text-[var(--ink)] underline decoration-[var(--border)] underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-[var(--accent)] hover:decoration-[var(--accent)] [@media(pointer:coarse)]:min-h-11"
            >
              Ver currículo
            </Link>
          </div>
        </div>

        <dl className="mt-10 grid grid-cols-1 gap-6 border-y border-[var(--rule)] py-6 sm:grid-cols-3 sm:gap-8">
          {profile.metrics.map((metric) => (
            <div key={metric.value} className="min-w-0 space-y-1">
              <dt className="tabular-data font-mono text-xl font-medium tracking-tight text-[var(--ink)] sm:text-2xl">
                {metric.value}
              </dt>
              <dd className="text-sm text-[var(--muted)]">{metric.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="cases" className="py-10 sm:py-12">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-[1.75rem]">
            Cases em produção
          </h2>
          <p className="prose-measure text-sm text-[var(--muted)]">
            Entregas reais na ESIG Software, apresentadas de forma anonimizada por confidencialidade.
          </p>
        </div>

        <div className="mt-8 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
          {caseStudies.map((item) => {
            const titleId = `case-title-${item.slug}`;
            const linkId = `case-link-${item.slug}`;

            return (
              <article
                key={item.slug}
                className="grid grid-cols-1 gap-8 py-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,26.25rem)] lg:items-start"
              >
                <div className="min-w-0 space-y-4">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
                    <span className="tabular-data font-mono">{item.period}</span>
                    <span>{item.role}</span>
                  </div>

                  <h3
                    id={titleId}
                    className="text-lg font-semibold leading-snug text-[var(--ink)] sm:text-xl"
                  >
                    {item.title}
                  </h3>

                  <p className="prose-measure text-sm leading-relaxed text-[var(--muted)] sm:text-[0.9375rem]">
                    {item.summary}
                  </p>

                  <ul
                    aria-label={`Tecnologias de ${item.title}`}
                    className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted)]"
                  >
                    {item.stack.map((tech) => (
                      <li key={tech} translate="no">
                        {tech}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-1">
                    <Link
                      id={linkId}
                      href={`/cases/${item.slug}`}
                      aria-labelledby={`${linkId} ${titleId}`}
                      className="inline-flex min-h-10 items-center text-sm font-semibold text-[var(--accent)] underline decoration-[var(--rule)] underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:decoration-[var(--accent)] [@media(pointer:coarse)]:min-h-11"
                    >
                      Ler estudo de caso
                    </Link>
                  </div>
                </div>

                <CaseDiagram
                  title={item.title}
                  nodes={item.diagramNodes}
                  variant="compact"
                />
              </article>
            );
          })}
        </div>
      </section>

      <section id="ia" className="py-10 sm:py-12">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-[1.75rem]">
            Como trabalho com IA no dia a dia
          </h2>
          <p className="prose-measure text-sm text-[var(--muted)]">
            Uso disciplinado de agentes de codificação com especificação prévia, contexto isolado e verificação humana.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 border-t border-[var(--rule)] pt-8 md:grid-cols-3">
          {aiPillars.map((pillar) => (
            <article key={pillar.title} className="min-w-0 space-y-2.5">
              <h3 className="text-base font-semibold leading-snug text-[var(--ink)]">
                {pillar.title}
              </h3>
              <p className="prose-measure text-sm leading-relaxed text-[var(--muted)]">
                {pillar.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="projetos" className="border-t border-[var(--rule)] py-10 sm:py-12">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-[1.75rem]">
            Projetos públicos selecionados
          </h2>
          <p className="prose-measure text-sm text-[var(--muted)]">
            Repositórios curados com foco em engenharia fullstack, automação e qualidade de código.
          </p>
        </div>

        <div className="mt-8 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
          {publicProjects.map((project) => {
            const key = slugifyId(project.name);
            const titleId = `project-title-${key}`;
            const liveId = `project-live-${key}`;
            const repoId = `project-repo-${key}`;

            return (
              <article
                key={project.name}
                className="flex flex-col gap-4 py-7 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
              >
                <div className="min-w-0 space-y-2.5">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3
                      id={titleId}
                      translate="no"
                      className="font-mono text-base font-medium text-[var(--ink)]"
                    >
                      {project.name}
                    </h3>
                    {project.isLegacyAccount ? (
                      <span className="text-xs italic text-[var(--muted)]">
                        {project.legacyNote ?? "conta anterior"}
                      </span>
                    ) : null}
                  </div>

                  <p className="prose-measure text-sm leading-relaxed text-[var(--muted)]">
                    {project.description}
                  </p>

                  <ul
                    aria-label={`Tecnologias de ${project.name}`}
                    className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted)]"
                  >
                    {project.stack.map((tech) => (
                      <li key={tech} translate="no">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-4 sm:pt-0.5">
                  {project.liveUrl ? (
                    <a
                      id={liveId}
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-labelledby={`${liveId} ${titleId}`}
                      className="inline-flex min-h-10 items-center text-sm font-semibold text-[var(--accent)] underline decoration-[var(--rule)] underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:decoration-[var(--accent)] [@media(pointer:coarse)]:min-h-11"
                    >
                      Live
                    </a>
                  ) : null}
                  <a
                    id={repoId}
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-labelledby={`${repoId} ${titleId}`}
                    className="inline-flex min-h-10 items-center text-sm font-medium text-[var(--ink)] underline decoration-[var(--rule)] underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-[var(--accent)] hover:decoration-[var(--accent)] [@media(pointer:coarse)]:min-h-11"
                  >
                    Código
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="stack" className="py-10 sm:py-12">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-[1.75rem]">
          Stack técnica
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.category} className="min-w-0">
              <h3 className="border-b border-[var(--rule)] pb-2 text-base font-semibold text-[var(--ink)]">
                {group.category}
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm text-[var(--muted)]">
                {group.items.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="trajetoria" className="border-t border-[var(--rule)] py-10 sm:py-12">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-[1.75rem]">
          Trajetória e formação
        </h2>

        <div className="mt-8 space-y-10">
          <div>
            <h3 className="text-base font-semibold text-[var(--ink)]">
              Experiência profissional
            </h3>
            <ol className="mt-4 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
              {profile.experiences.map((exp) => (
                <li
                  key={`${exp.company}-${exp.period}`}
                  className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-[minmax(0,13.5rem)_minmax(0,1fr)] sm:gap-8"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="tabular-data font-mono text-xs text-[var(--muted)]">
                      {exp.period}
                    </p>
                    {exp.location ? (
                      <p className="text-xs text-[var(--muted)]">{exp.location}</p>
                    ) : null}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="text-base font-semibold text-[var(--ink)]">
                      {exp.company}
                    </p>
                    <p className="text-sm font-medium text-[var(--ink)]">
                      {exp.role}
                    </p>
                    <p className="prose-measure text-sm leading-relaxed text-[var(--muted)]">
                      {exp.summary}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="min-w-0 space-y-2">
              <h3 className="text-base font-semibold text-[var(--ink)]">
                Formação acadêmica
              </h3>
              <p className="pt-1 text-base font-semibold text-[var(--ink)]">
                {education.institution}
              </p>
              <p className="text-sm text-[var(--muted)]">{education.degree}</p>
              <p className="tabular-data font-mono text-xs text-[var(--muted)]">
                {education.period}
              </p>
              <p className="pt-3 text-sm text-[var(--muted)]">
                <span className="font-medium text-[var(--ink)]">Idioma:</span>{" "}
                {profile.languages.join(", ")}
              </p>
            </div>

            <div className="min-w-0 space-y-2">
              <h3 className="text-base font-semibold text-[var(--ink)]">
                Certificações
              </h3>
              <p className="pt-1 text-base font-semibold text-[var(--ink)]">
                {featuredCertification.title}
              </p>
              <p translate="no" className="text-sm text-[var(--muted)]">
                {featuredCertification.issuer}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
                <span className="tabular-data font-mono">{featuredCertification.hours}h</span>
                <span>
                  <span className="tabular-data font-mono">
                    {featuredCertification.modules.length}
                  </span>{" "}
                  módulos
                </span>
                <span>
                  Emitido em{" "}
                  <span className="tabular-data font-mono">
                    {featuredCertification.issuedAt}
                  </span>
                </span>
              </div>
              <div className="pt-1">
                <a
                  href={featuredCertification.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-9 items-center text-sm font-semibold text-[var(--accent)] underline decoration-[var(--rule)] underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:decoration-[var(--accent)] [@media(pointer:coarse)]:min-h-11"
                >
                  Verificar certificado
                </a>
              </div>
              <details className="pt-2 text-sm text-[var(--muted)]">
                <summary className="cursor-pointer py-2 font-medium text-[var(--ink)] hover:text-[var(--accent)] [@media(pointer:coarse)]:min-h-11 [@media(pointer:coarse)]:py-2.5">
                  Ver os {featuredCertification.modules.length} módulos concluídos
                </summary>
                <ul className="mt-2 grid grid-cols-1 gap-1 ps-4 sm:grid-cols-2">
                  {featuredCertification.modules.map((moduleName) => (
                    <li key={moduleName} className="list-disc text-xs leading-relaxed">
                      {moduleName}
                    </li>
                  ))}
                </ul>
              </details>

              <div className="pt-3">
                <p className="text-xs font-medium text-[var(--muted)]">
                  Outras certificações
                </p>
                <ul className="mt-1.5 list-disc space-y-1 ps-4 text-sm text-[var(--muted)]">
                  {profile.otherCertifications.map((cert) => (
                    <li key={cert}>{cert}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contato" className="border-t border-[var(--rule)] pt-10 sm:pt-12">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-[1.75rem]">
            Contato
          </h2>
          <p className="prose-measure text-sm text-[var(--muted)]">
            Aberto a conversas sobre oportunidades FullStack e processos seletivos pelos canais diretos abaixo.
          </p>
        </div>

        <dl className="mt-8 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
          <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center sm:gap-6">
            <dt className="text-sm font-medium text-[var(--muted)]">WhatsApp</dt>
            <dd className="min-w-0">
              <a
                href={contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tabular-data inline-flex min-h-9 items-center font-mono text-sm text-[var(--ink)] underline decoration-[var(--rule)] underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-[var(--accent)] hover:decoration-[var(--accent)] [@media(pointer:coarse)]:min-h-11"
              >
                {contact.whatsappDisplay}
              </a>
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center sm:gap-6">
            <dt className="text-sm font-medium text-[var(--muted)]">E-mail</dt>
            <dd className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <a
                  href={`mailto:${contact.email}`}
                  translate="no"
                  className="inline-flex min-h-9 items-center text-sm text-[var(--ink)] [overflow-wrap:anywhere] underline decoration-[var(--rule)] underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-[var(--accent)] hover:decoration-[var(--accent)] [@media(pointer:coarse)]:min-h-11"
                >
                  {contact.email}
                </a>
                <CopyEmailButton email={contact.email} />
              </div>
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center sm:gap-6">
            <dt className="text-sm font-medium text-[var(--muted)]">LinkedIn</dt>
            <dd className="min-w-0">
              <a
                href={contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                translate="no"
                className="inline-flex min-h-9 items-center text-sm text-[var(--ink)] [overflow-wrap:anywhere] underline decoration-[var(--rule)] underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-[var(--accent)] hover:decoration-[var(--accent)] [@media(pointer:coarse)]:min-h-11"
              >
                {formatDisplayUrl(contact.linkedinUrl)}
              </a>
            </dd>
          </div>

          <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center sm:gap-6">
            <dt className="text-sm font-medium text-[var(--muted)]">GitHub</dt>
            <dd className="min-w-0">
              <a
                href={contact.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                translate="no"
                className="inline-flex min-h-9 items-center text-sm text-[var(--ink)] underline decoration-[var(--rule)] underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-[var(--accent)] hover:decoration-[var(--accent)] [@media(pointer:coarse)]:min-h-11"
              >
                github.com/{contact.githubHandle}
              </a>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
