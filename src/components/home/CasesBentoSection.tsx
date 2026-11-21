"use client";

import { PanelRightOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CaseDiagram } from "@/components/CaseDiagram";
import { usePortfolioOverlays } from "@/components/PortfolioOverlayProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { CaseStudy } from "@/data/types";
import {
  CASE_STACK_FILTERS,
  caseMatchesStackFilter,
  type CaseStackFilter,
} from "@/lib/stack-match";
import { CaseSheet } from "./CaseSheet";

export interface CasesBentoSectionProps {
  readonly studies: readonly CaseStudy[];
}

/**
 * Interactive Bento showcase of anonymized production case studies with stack filter pills,
 * direct static links for SEO/new-tab navigation, and a right-hand CaseSheet inspector.
 */
export function CasesBentoSection({ studies }: CasesBentoSectionProps) {
  const { registerCaseHandler, openCase, commandOpen, certDialogOpen } =
    usePortfolioOverlays();
  const [filter, setFilter] = useState<CaseStackFilter>("Todos");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    registerCaseHandler((slug) => {
      setActiveSlug(slug);
    });
    return () => registerCaseHandler(null);
  }, [registerCaseHandler]);

  const overlayActive = commandOpen || certDialogOpen;
  if (overlayActive && activeSlug !== null) {
    setActiveSlug(null);
  }

  const filteredStudies = studies.filter((study) =>
    caseMatchesStackFilter(study, filter),
  );
  const activeStudy =
    !overlayActive && activeSlug
      ? (studies.find((item) => item.slug === activeSlug) ?? null)
      : null;

  return (
    <section id="cases" className="scroll-mt-20 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
            Cases em produção
          </h2>
          <p className="prose-measure text-sm text-muted-foreground">
            Entregas reais na ESIG Software, apresentadas de forma anonimizada
            por confidencialidade.
          </p>
        </div>

        <div className="space-y-1">
          <ToggleGroup
            type="single"
            value={filter}
            onValueChange={(nextValue) => {
              if (nextValue) {
                setFilter(nextValue as CaseStackFilter);
              }
            }}
            variant="outline"
            size="sm"
            spacing={2}
            aria-label="Filtrar cases por tecnologia"
            className="flex flex-wrap justify-start gap-2"
          >
            {CASE_STACK_FILTERS.map((stackFilter) => (
              <ToggleGroupItem
                key={stackFilter}
                value={stackFilter}
                className="cursor-pointer data-[state=on]:border-signal data-[state=on]:bg-signal-soft data-[state=on]:font-semibold data-[state=on]:text-signal [@media(pointer:coarse)]:min-h-11"
              >
                {stackFilter}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <p className="sr-only" aria-live="polite">
            {filteredStudies.length}{" "}
            {filteredStudies.length === 1
              ? "estudo de caso exibido"
              : "estudos de caso exibidos"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudies.map((item) => {
          const titleId = `case-title-${item.slug}`;
          const inspectId = `case-inspect-${item.slug}`;
          const linkId = `case-link-${item.slug}`;

          return (
            <article key={item.slug} className="flex min-w-0">
              <Card className="flex h-full w-full flex-col gap-4 py-5">
                <CardHeader className="gap-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge
                      variant="outline"
                      className="border-signal-border bg-signal-soft text-signal"
                    >
                      {item.domain}
                    </Badge>
                    <span className="tabular-data font-mono text-xs text-muted-foreground">
                      {item.period}
                    </span>
                  </div>

                  <h3
                    id={titleId}
                    className="text-base font-semibold leading-snug text-foreground"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs font-medium text-muted-foreground">
                    {item.role}
                  </p>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <p className="prose-measure text-sm leading-relaxed text-muted-foreground">
                      {item.summary}
                    </p>

                    <ul
                      aria-label={`Tecnologias de ${item.title}`}
                      role="list"
                      className="flex flex-wrap gap-1.5"
                    >
                      {item.stack.map((tech) => (
                        <li key={tech} translate="no">
                          <Badge
                            variant="secondary"
                            className="text-[11px] font-normal"
                          >
                            {tech}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <CaseDiagram
                    title={item.title}
                    nodes={item.diagramNodes}
                    variant="compact"
                  />
                </CardContent>

                <CardFooter className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
                  <Button
                    id={inspectId}
                    type="button"
                    variant="outline"
                    size="sm"
                    aria-labelledby={`${inspectId} ${titleId}`}
                    onClick={() => openCase(item.slug)}
                    className="cursor-pointer [@media(pointer:coarse)]:min-h-11"
                  >
                    <PanelRightOpen
                      aria-hidden="true"
                      className="size-3.5"
                      strokeWidth={1.75}
                    />
                    <span>Inspecionar case</span>
                  </Button>

                  <Link
                    id={linkId}
                    href={`/cases/${item.slug}`}
                    aria-labelledby={`${linkId} ${titleId}`}
                    className="inline-flex min-h-9 items-center text-sm font-semibold text-signal underline decoration-border underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:decoration-signal [@media(pointer:coarse)]:min-h-11"
                  >
                    Ler estudo de caso
                  </Link>
                </CardFooter>
              </Card>
            </article>
          );
        })}
      </div>

      <CaseSheet
        study={activeStudy}
        onSelectSlug={(slug) => setActiveSlug(slug)}
        onOpenChange={(open) => {
          if (!open) {
            setActiveSlug(null);
          }
        }}
      />
    </section>
  );
}
