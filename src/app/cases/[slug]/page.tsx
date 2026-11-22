import { ArrowLeft, FileDown, FileText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseDiagram } from "@/components/CaseDiagram";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

  const detailSections = [
    { id: "problema", heading: "Problema", body: study.problem },
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
  ] as const;

  return (
    <div className="site-container space-y-6 py-10 sm:space-y-8 sm:py-14">
      <nav aria-label="Navegação do estudo de caso">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ms-2.5 text-muted-foreground hover:text-foreground [@media(pointer:coarse)]:min-h-11"
        >
          <Link href="/#cases">
            <ArrowLeft
              aria-hidden="true"
              className="size-4"
              strokeWidth={1.75}
            />
            <span>Voltar aos estudos de caso</span>
          </Link>
        </Button>
      </nav>

      <article className="space-y-6">
        <Card>
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge
                variant="outline"
                className="border-signal-border bg-signal-soft text-signal"
              >
                {study.domain}
              </Badge>
            </div>

            <h1 className="text-[clamp(1.75rem,1.3rem+1.8vw,2.375rem)] font-bold leading-[1.15] tracking-tight text-foreground">
              {study.title}
            </h1>

            <p className="prose-measure text-base leading-relaxed text-muted-foreground sm:text-[1.0625rem]">
              {study.summary}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <Separator />

            <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              <div className="min-w-0 space-y-1">
                <dt className="text-xs font-medium text-muted-foreground">
                  Contexto
                </dt>
                <dd className="prose-measure text-sm leading-relaxed text-foreground">
                  {study.context}
                </dd>
              </div>

              <div className="min-w-0 space-y-1">
                <dt className="text-xs font-medium text-muted-foreground">
                  Período
                </dt>
                <dd className="tabular-data font-mono text-sm text-foreground">
                  {study.period}
                </dd>
              </div>

              <div className="min-w-0 space-y-1">
                <dt className="text-xs font-medium text-muted-foreground">
                  Papel
                </dt>
                <dd className="text-sm leading-relaxed text-foreground">
                  {study.role}
                </dd>
              </div>

              <div className="min-w-0 space-y-1.5">
                <dt className="text-xs font-medium text-muted-foreground">
                  Stack
                </dt>
                <dd translate="no">
                  <ul
                    aria-label={`Tecnologias de ${study.title}`}
                    role="list"
                    className="flex flex-wrap gap-1.5"
                  >
                    {study.stack.map((tech) => (
                      <li key={tech}>
                        <Badge
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {tech}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <section aria-labelledby="case-diagram-heading">
          <Card className="min-w-0">
            <CardHeader className="space-y-1.5">
              <h2
                id="case-diagram-heading"
                className="text-lg font-semibold tracking-tight text-foreground sm:text-xl"
              >
                {study.diagramTitle}
              </h2>
              <CardDescription className="prose-measure leading-relaxed">
                {study.diagramSummary}
              </CardDescription>
            </CardHeader>

            <CardContent className="min-w-0">
              <CaseDiagram
                title={study.title}
                nodes={study.diagramNodes}
                variant="expanded"
              />
            </CardContent>
          </Card>
        </section>

        <Card className="gap-0 py-0">
          <CardContent className="divide-y divide-border">
            {detailSections.map((section) => (
              <section
                key={section.id}
                aria-labelledby={`section-${section.id}`}
                className="grid grid-cols-1 gap-3 py-6 sm:py-7 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-10"
              >
                <h2
                  id={`section-${section.id}`}
                  className="text-lg font-semibold leading-snug text-foreground"
                >
                  {section.heading}
                </h2>
                <p className="prose-measure text-base leading-relaxed text-muted-foreground">
                  {section.body}
                </p>
              </section>
            ))}
          </CardContent>
        </Card>

        <section aria-labelledby="section-resultado">
          <Card className="border-signal-border bg-signal-soft py-6">
            <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-10">
              <h2
                id="section-resultado"
                className="text-lg font-semibold leading-snug text-signal"
              >
                Resultado
              </h2>
              <p className="prose-measure text-base leading-relaxed text-foreground">
                {study.result}
              </p>
            </CardContent>
          </Card>
        </section>

        <footer className="pt-2">
          <Card className="bg-muted/30">
            <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0 space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Próximo estudo de caso
                </p>
                <Link
                  href={`/cases/${nextStudy.slug}`}
                  className="inline-flex min-h-10 items-center text-base font-semibold text-foreground underline decoration-border underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-signal hover:decoration-signal [@media(pointer:coarse)]:min-h-11"
                >
                  {nextStudy.title}
                </Link>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                <Button asChild className="[@media(pointer:coarse)]:min-h-11">
                  <Link href="/curriculo">
                    <FileText
                      aria-hidden="true"
                      className="size-4"
                      strokeWidth={1.75}
                    />
                    <span>Ver currículo</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="[@media(pointer:coarse)]:min-h-11"
                >
                  <a href="/curriculo.pdf">
                    <FileDown
                      aria-hidden="true"
                      className="size-4"
                      strokeWidth={1.75}
                    />
                    <span>Baixar currículo (PDF)</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </footer>
      </article>
    </div>
  );
}
