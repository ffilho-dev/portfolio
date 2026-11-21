import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseDiagram } from "@/components/CaseDiagram";
import { caseStudies, getCaseStudyBySlug } from "@/data/cases";
import { buildPageMetadata } from "@/lib/site";

interface CasePageProps {
  readonly params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string }> {
  return caseStudies.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: CasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    return {
      title: "Estudo de caso não encontrado",
    };
  }

  return buildPageMetadata({
    title: study.title,
    description: study.summary,
    path: `/cases/${study.slug}`,
    openGraphType: "article",
  });
}

export default async function CaseStudyPage({ params }: CasePageProps) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

  const currentIndex = caseStudies.findIndex((item) => item.slug === study.slug);
  const nextStudy = caseStudies[(currentIndex + 1) % caseStudies.length];

  const sections = [
    { id: "problema", heading: "Problema real", body: study.problem },
    {
      id: "restricoes",
      heading: "Restrições e contexto operacional",
      body: study.constraints,
    },
    {
      id: "solucao",
      heading: "Solução e decisões técnicas",
      body: study.solution,
    },
    { id: "resultado", heading: "Resultado prático", body: study.result },
  ] as const;

  return (
    <div className="site-container py-10 sm:py-16">
      <nav aria-label="Navegação do estudo de caso">
        <Link
          href="/#cases"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-[var(--muted)] underline decoration-[var(--rule)] underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-[var(--accent)] hover:decoration-[var(--accent)] [@media(pointer:coarse)]:min-h-11"
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
          <span>Voltar para cases</span>
        </Link>
      </nav>

      <article className="mt-6">
        <header className="space-y-4 border-b border-[var(--rule)] pb-8">
          <h1 className="text-[clamp(1.75rem,1.3rem+1.8vw,2.375rem)] font-bold leading-[1.15] tracking-tight text-[var(--ink)]">
            {study.title}
          </h1>

          <p className="prose-measure text-base leading-relaxed text-[var(--muted)] sm:text-[1.0625rem]">
            {study.summary}
          </p>

          <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-[var(--rule)] pt-6 sm:grid-cols-2">
            <div className="min-w-0 space-y-1">
              <dt className="text-xs font-medium text-[var(--muted)]">Contexto</dt>
              <dd className="text-sm text-[var(--ink)]">{study.context}</dd>
            </div>

            <div className="min-w-0 space-y-1">
              <dt className="text-xs font-medium text-[var(--muted)]">Período</dt>
              <dd className="tabular-data font-mono text-sm text-[var(--ink)]">
                {study.period}
              </dd>
            </div>

            <div className="min-w-0 space-y-1">
              <dt className="text-xs font-medium text-[var(--muted)]">Papel</dt>
              <dd className="text-sm text-[var(--ink)]">{study.role}</dd>
            </div>

            <div className="min-w-0 space-y-1">
              <dt className="text-xs font-medium text-[var(--muted)]">Stack</dt>
              <dd translate="no" className="text-xs leading-relaxed text-[var(--ink)] sm:text-sm">
                {study.stack.join(", ")}
              </dd>
            </div>
          </dl>
        </header>

        <section
          aria-labelledby="case-diagram-heading"
          className="border-b border-[var(--rule)] py-8 sm:py-10"
        >
          <div className="space-y-2">
            <h2
              id="case-diagram-heading"
              className="text-lg font-semibold tracking-tight text-[var(--ink)] sm:text-xl"
            >
              {study.diagramTitle}
            </h2>
            <p className="prose-measure text-sm leading-relaxed text-[var(--muted)]">
              {study.diagramSummary}
            </p>
          </div>

          <div className="mt-6">
            <CaseDiagram
              title={study.title}
              nodes={study.diagramNodes}
              variant="expanded"
            />
          </div>
        </section>

        <div className="divide-y divide-[var(--rule)] border-b border-[var(--rule)]">
          {sections.map((section) => (
            <section
              key={section.id}
              aria-labelledby={`section-${section.id}`}
              className="grid grid-cols-1 gap-3 py-8 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-10"
            >
              <h2
                id={`section-${section.id}`}
                className="text-lg font-semibold leading-snug text-[var(--ink)]"
              >
                {section.heading}
              </h2>
              <p className="prose-measure text-base leading-relaxed text-[var(--muted)]">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <footer className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 space-y-1.5">
            <p className="text-xs font-medium text-[var(--muted)]">
              Próximo estudo de caso
            </p>
            <Link
              href={`/cases/${nextStudy.slug}`}
              className="inline-flex min-h-10 items-center text-base font-semibold text-[var(--ink)] underline decoration-[var(--rule)] underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-[var(--accent)] hover:decoration-[var(--accent)] [@media(pointer:coarse)]:min-h-11"
            >
              {nextStudy.title}
            </Link>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Link
              href="/curriculo"
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-ink)] transition-[opacity,background-color] duration-150 hover:opacity-90 [@media(pointer:coarse)]:min-h-11"
            >
              Ver currículo
            </Link>
            <a
              href="/curriculo.pdf"
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--ink)] transition-[color,background-color,border-color] duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)] [@media(pointer:coarse)]:min-h-11"
            >
              Baixar currículo (PDF)
            </a>
          </div>
        </footer>
      </article>
    </div>
  );
}
