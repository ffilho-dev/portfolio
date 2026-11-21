import type { Metadata } from "next";
import Link from "next/link";
import { PrintButton } from "@/components/PrintButton";
import { caseStudies } from "@/data/cases";
import { profile } from "@/data/profile";
import { publicProjects } from "@/data/projects";
import { aiPillars, skillGroups } from "@/data/skills";
import { buildPageMetadata, formatDisplayUrl, slugifyId } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Currículo",
  description: `Currículo profissional de ${profile.name} — ${profile.title}. Experiência em Java EE, Spring Boot, PostgreSQL, React, Next.js, TypeScript e fluxo com IA.`,
  path: "/curriculo",
  openGraphType: "profile",
  openGraphDescription: `Currículo profissional de ${profile.name} — ${profile.title}.`,
});

export default function CurriculoPage() {
  const { contact, education, featuredCertification } = profile;

  return (
    <div className="site-container py-8 sm:py-12 print:py-0">
      <div className="mx-auto max-w-[52rem]">
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--rule)] pb-5">
          <Link
            href="/"
            className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2 text-sm font-medium text-[var(--ink)] transition-[color,background-color,border-color] duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)] [@media(pointer:coarse)]:min-h-11"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="none"
              className="size-4 shrink-0"
            >
              <path
                d="M10 3.5L5.5 8L10 12.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Voltar ao portfólio</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/curriculo.pdf"
              className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-ink)] transition-[opacity,background-color] duration-150 hover:opacity-90 [@media(pointer:coarse)]:min-h-11"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 shrink-0"
              >
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
              <span>Baixar PDF</span>
            </a>
            <PrintButton />
          </div>
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-10 print:rounded-none print:border-0 print:bg-transparent print:p-0">
          <header className="border-b border-[var(--rule)] pb-6 print:pb-3">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)] sm:text-3xl print:text-[17pt] print:leading-tight">
              {profile.name}
            </h1>
            <p className="mt-1 text-base font-semibold text-[var(--accent)] sm:text-lg print:mt-0.5 print:text-[10.5pt]">
              {profile.title}
            </p>

            <div className="prose-measure mt-3 space-y-1 text-sm text-[var(--muted)] print:mt-1.5 print:max-w-none print:space-y-0.5 print:text-[9pt]">
              <p>{profile.location}</p>
              <p>{profile.availability}</p>
            </div>

            <ul
              aria-label="Canais de contato"
              className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--ink)] print:mt-2 print:gap-x-4 print:gap-y-0.5 print:text-[8.5pt]"
            >
              <li>
                <span className="font-medium text-[var(--muted)]">WhatsApp: </span>
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tabular-data inline-flex min-h-10 items-center font-mono underline decoration-[var(--rule)] underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-[var(--accent)] hover:decoration-[var(--accent)] [@media(pointer:coarse)]:min-h-11 print:min-h-0 print:no-underline"
                >
                  {contact.whatsappDisplay}
                </a>
              </li>
              <li>
                <span className="font-medium text-[var(--muted)]">E-mail: </span>
                <a
                  href={`mailto:${contact.email}`}
                  translate="no"
                  className="inline-flex min-h-10 items-center [overflow-wrap:anywhere] underline decoration-[var(--rule)] underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-[var(--accent)] hover:decoration-[var(--accent)] [@media(pointer:coarse)]:min-h-11 print:min-h-0 print:no-underline"
                >
                  {contact.email}
                </a>
              </li>
              <li>
                <span className="font-medium text-[var(--muted)]">LinkedIn: </span>
                <a
                  href={contact.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  translate="no"
                  className="inline-flex min-h-10 items-center [overflow-wrap:anywhere] underline decoration-[var(--rule)] underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-[var(--accent)] hover:decoration-[var(--accent)] [@media(pointer:coarse)]:min-h-11 print:min-h-0 print:no-underline"
                >
                  {formatDisplayUrl(contact.linkedinUrl)}
                </a>
              </li>
              <li>
                <span className="font-medium text-[var(--muted)]">GitHub: </span>
                <a
                  href={contact.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  translate="no"
                  className="inline-flex min-h-10 items-center underline decoration-[var(--rule)] underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-[var(--accent)] hover:decoration-[var(--accent)] [@media(pointer:coarse)]:min-h-11 print:min-h-0 print:no-underline"
                >
                  github.com/{contact.githubHandle}
                </a>
              </li>
            </ul>
          </header>

          <section className="print-avoid-break break-inside-avoid border-b border-[var(--rule)] py-6 print:py-2.5">
            <h2 className="text-base font-bold tracking-tight text-[var(--accent)] sm:text-lg print:text-[10pt]">
              Resumo profissional
            </h2>
            <p className="prose-measure mt-2.5 text-sm leading-relaxed text-[var(--ink)] print:mt-1 print:max-w-none print:text-[9pt] print:leading-snug">
              {profile.resumeSummary}
            </p>
          </section>

          <section className="print-allow-break border-b border-[var(--rule)] py-6 print:py-2.5">
            <h2 className="text-base font-bold tracking-tight text-[var(--accent)] sm:text-lg print:text-[10pt]">
              Experiência profissional
            </h2>
            <ol className="mt-4 space-y-5 print:mt-1.5 print:space-y-2">
              {profile.experiences.map((exp) => (
                <li
                  key={`${exp.company}-${exp.period}`}
                  className="print-entry print-avoid-break break-inside-avoid"
                >
                  <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                    <h3 className="text-sm font-semibold text-[var(--ink)] sm:text-base print:text-[9.5pt]">
                      {exp.company}
                    </h3>
                    <span className="tabular-data font-mono text-xs text-[var(--muted)] print:text-[8pt]">
                      {exp.period}
                    </span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-sm print:mt-0 print:text-[8.5pt]">
                    <p className="font-medium text-[var(--ink)]">{exp.role}</p>
                    {exp.location ? (
                      <p className="text-xs text-[var(--muted)] print:text-[8pt]">
                        {exp.location}
                      </p>
                    ) : null}
                  </div>
                  <p className="prose-measure mt-1.5 text-sm leading-relaxed text-[var(--muted)] print:mt-0.5 print:max-w-none print:text-[8.5pt] print:leading-snug">
                    {exp.summary}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section className="print-allow-break border-b border-[var(--rule)] py-6 print:py-2.5">
            <h2 className="text-base font-bold tracking-tight text-[var(--accent)] sm:text-lg print:text-[10pt]">
              Destaques técnicos em produção
            </h2>
            <p className="prose-measure mt-1 text-xs text-[var(--muted)] print:mt-0.5 print:max-w-none print:text-[8pt]">
              Entregas anonimizadas em sistemas corporativos de gestão universitária (2023–2026).
            </p>
            <div className="mt-4 space-y-4 print:mt-1.5 print:space-y-2">
              {caseStudies.map((study) => (
                <article
                  key={study.slug}
                  className="print-entry print-avoid-break break-inside-avoid space-y-1 print:space-y-0.5"
                >
                  <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                    <h3 className="text-sm font-semibold text-[var(--ink)] print:text-[9pt]">
                      <Link
                        href={`/cases/${study.slug}`}
                        className="underline decoration-[var(--rule)] underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-[var(--accent)] hover:decoration-[var(--accent)] print:no-underline"
                      >
                        {study.title}
                      </Link>
                    </h3>
                    <span className="tabular-data shrink-0 font-mono text-xs text-[var(--muted)] print:text-[8pt]">
                      {study.period}
                    </span>
                  </div>
                  <p
                    translate="no"
                    className="text-xs text-[var(--muted)] print:text-[7.5pt]"
                  >
                    {study.stack.join(", ")}
                  </p>
                  <p className="prose-measure text-sm leading-relaxed text-[var(--muted)] print:max-w-none print:text-[8.5pt] print:leading-snug">
                    {study.summary}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="print-avoid-break break-inside-avoid border-b border-[var(--rule)] py-6 print:py-2.5">
            <h2 className="text-base font-bold tracking-tight text-[var(--accent)] sm:text-lg print:text-[10pt]">
              Competências técnicas e IA no fluxo
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3 print:mt-1.5 print:grid-cols-1 print:gap-1">
              {skillGroups.map((group) => (
                <div key={group.category} className="min-w-0">
                  <h3 className="text-sm font-semibold text-[var(--ink)] print:inline print:text-[8.5pt]">
                    {group.category}
                    <span className="hidden print:inline">: </span>
                  </h3>
                  <ul className="mt-1.5 space-y-1 text-sm text-[var(--muted)] print:mt-0 print:inline print:space-y-0 print:text-[8.5pt]">
                    {group.items.map((item, idx) => (
                      <li key={item} className="print:inline">
                        {item}
                        {idx < group.items.length - 1 ? (
                          <span className="hidden print:inline">, </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-[var(--rule)] pt-3 print:mt-2 print:pt-1.5">
              <h3 className="text-sm font-semibold text-[var(--ink)] print:text-[8.5pt]">
                Fluxo de engenharia com IA
              </h3>
              <ul className="mt-1.5 space-y-1 text-sm text-[var(--muted)] print:mt-0.5 print:space-y-0.5 print:text-[8.5pt]">
                {aiPillars.map((pillar) => (
                  <li key={pillar.title}>{pillar.title}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="print-allow-break border-b border-[var(--rule)] py-6 print:py-2.5">
            <h2 className="text-base font-bold tracking-tight text-[var(--accent)] sm:text-lg print:text-[10pt]">
              Projetos públicos selecionados
            </h2>
            <ul className="mt-3 space-y-3 print:mt-1.5 print:space-y-1.5">
              {publicProjects.map((project) => {
                const key = slugifyId(project.name);
                const titleId = `curriculo-project-title-${key}`;
                const liveId = `curriculo-project-live-${key}`;
                const repoId = `curriculo-project-repo-${key}`;

                return (
                  <li
                    key={project.name}
                    className="print-entry print-avoid-break break-inside-avoid space-y-1 print:space-y-0.5"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <h3
                          id={titleId}
                          translate="no"
                          className="text-sm font-semibold text-[var(--ink)] print:text-[9pt]"
                        >
                          {project.name}
                        </h3>
                        {project.isLegacyAccount ? (
                          <span className="text-xs italic text-[var(--muted)] print:text-[7.5pt]">
                            ({project.legacyNote ?? "conta anterior"})
                          </span>
                        ) : null}
                      </div>
                      <span
                        translate="no"
                        className="text-xs text-[var(--muted)] print:text-[7.5pt]"
                      >
                        {project.stack.join(", ")}
                      </span>
                    </div>
                    <p className="prose-measure text-sm leading-relaxed text-[var(--muted)] print:max-w-none print:text-[8.5pt] print:leading-snug">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm print:hidden">
                      {project.liveUrl ? (
                        <a
                          id={liveId}
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-labelledby={`${liveId} ${titleId}`}
                          className="inline-flex min-h-10 items-center font-semibold text-[var(--accent)] underline decoration-[var(--rule)] underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:decoration-[var(--accent)] [@media(pointer:coarse)]:min-h-11"
                        >
                          Em produção
                        </a>
                      ) : null}
                      <a
                        id={repoId}
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-labelledby={`${repoId} ${titleId}`}
                        className="inline-flex min-h-10 items-center font-medium text-[var(--ink)] underline decoration-[var(--rule)] underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-[var(--accent)] hover:decoration-[var(--accent)] [@media(pointer:coarse)]:min-h-11"
                      >
                        Código
                      </a>
                    </div>
                    <p className="hidden text-[7.5pt] leading-tight text-[var(--muted)] print:block">
                      {project.liveUrl ? (
                        <>
                          Em produção: <span translate="no">{project.liveUrl}</span>
                          {" | "}
                        </>
                      ) : null}
                      Código: <span translate="no">{project.repoUrl}</span>
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="print-avoid-break break-inside-avoid border-b border-[var(--rule)] py-6 print:py-2.5">
            <h2 className="text-base font-bold tracking-tight text-[var(--accent)] sm:text-lg print:text-[10pt]">
              Formação acadêmica e idiomas
            </h2>
            <div className="mt-3 flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline print:mt-1.5">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-[var(--ink)] sm:text-base print:text-[9pt]">
                  {education.institution}
                </h3>
                <p className="text-sm text-[var(--muted)] print:text-[8.5pt]">
                  {education.degree}
                </p>
              </div>
              <span className="tabular-data shrink-0 font-mono text-xs text-[var(--muted)] print:text-[8pt]">
                {education.period}
              </span>
            </div>
            <p className="mt-2.5 text-sm text-[var(--muted)] print:mt-1 print:text-[8.5pt]">
              <span className="font-semibold text-[var(--ink)]">Idiomas: </span>
              {profile.languages.join(", ")}
            </p>
          </section>

          <section className="print-allow-break pt-6 print:pt-2.5">
            <h2 className="text-base font-bold tracking-tight text-[var(--accent)] sm:text-lg print:text-[10pt]">
              Certificações
            </h2>
            <div className="print-entry print-avoid-break break-inside-avoid mt-3 space-y-2 print:mt-1.5 print:space-y-1">
              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                <h3 className="text-sm font-semibold text-[var(--ink)] sm:text-base print:text-[9pt]">
                  {featuredCertification.title}
                </h3>
                <div className="flex flex-wrap gap-x-3 text-xs text-[var(--muted)] print:text-[8pt]">
                  <span className="tabular-data font-mono">{featuredCertification.hours}h</span>
                  <span>
                    Emitido em{" "}
                    <span className="tabular-data font-mono">
                      {featuredCertification.issuedAt}
                    </span>
                  </span>
                </div>
              </div>
              <p translate="no" className="text-sm text-[var(--muted)] print:text-[8.5pt]">
                {featuredCertification.issuer}
              </p>
              <div className="text-sm print:text-[8pt]">
                <a
                  href={featuredCertification.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center font-semibold text-[var(--accent)] underline decoration-[var(--rule)] underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:decoration-[var(--accent)] [@media(pointer:coarse)]:min-h-11 print:hidden"
                >
                  Verificar certificado
                </a>
                <p className="hidden text-[8pt] text-[var(--muted)] print:block">
                  Verificação: <span translate="no">{featuredCertification.verifyUrl}</span>
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--ink)] print:text-[8pt]">
                  Módulos concluídos ({featuredCertification.modules.length}):
                </p>
                <ul className="mt-1.5 grid grid-cols-1 gap-x-6 gap-y-1 ps-4 text-xs text-[var(--muted)] sm:grid-cols-2 print:mt-1 print:grid-cols-3 print:gap-x-4 print:gap-y-0.5 print:ps-4 print:text-[7.5pt]">
                  {featuredCertification.modules.map((moduleName) => (
                    <li key={moduleName} className="list-disc">
                      {moduleName}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="print-entry print-avoid-break break-inside-avoid mt-4 border-t border-[var(--rule)] pt-3 print:mt-2 print:pt-1.5">
              <h3 className="text-xs font-semibold text-[var(--ink)] print:text-[8pt]">
                Outras certificações
              </h3>
              <ul className="mt-1.5 space-y-1 ps-4 text-sm text-[var(--muted)] print:mt-0.5 print:space-y-0.5 print:ps-4 print:text-[8pt]">
                {profile.otherCertifications.map((cert) => (
                  <li key={cert} className="list-disc">
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
