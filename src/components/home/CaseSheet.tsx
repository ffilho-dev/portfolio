"use client";

import { FileDown, FileText } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { caseStudies } from "@/data/cases";
import type { CaseStudy } from "@/data/types";
import { cn } from "@/lib/utils";

export interface CaseSheetProps {
  readonly study: CaseStudy | null;
  readonly onSelectSlug: (slug: string) => void;
  readonly onOpenChange: (open: boolean) => void;
}

/**
 * Right-side detail drawer for inspecting a production case study, navigating its
 * architectural diagram step by step, and jumping to the full page or next case.
 */
export function CaseSheet({
  study,
  onSelectSlug,
  onOpenChange,
}: CaseSheetProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedStep, setSelectedStep] = useState<{
    slug: string;
    index: number;
  }>({ slug: "", index: 0 });

  const currentIndex = study
    ? caseStudies.findIndex((item) => item.slug === study.slug)
    : -1;
  const nextStudy =
    currentIndex >= 0
      ? caseStudies[(currentIndex + 1) % caseStudies.length]
      : caseStudies[0];

  const rawStepIndex =
    study && selectedStep.slug === study.slug ? selectedStep.index : 0;
  const activeStepIndex =
    study && rawStepIndex >= 0 && rawStepIndex < study.diagramNodes.length
      ? rawStepIndex
      : 0;
  const activeNode = study ? study.diagramNodes[activeStepIndex] : undefined;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedStep({ slug: "", index: 0 });
    }
    onOpenChange(open);
  };

  const handleSelectNext = () => {
    if (!nextStudy) return;
    setSelectedStep({ slug: nextStudy.slug, index: 0 });
    onSelectSlug(nextStudy.slug);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  };

  return (
    <Sheet open={Boolean(study)} onOpenChange={handleOpenChange}>
      <SheetContent
        ref={contentRef}
        side="right"
        className="no-print w-full gap-0 overflow-y-auto p-0 sm:max-w-xl"
      >
        {study ? (
          <>
            <SheetHeader className="border-b border-border ps-5 pe-14 pt-6 pb-5 sm:ps-6 sm:pe-14">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge
                  variant="outline"
                  className="border-signal-border bg-signal-soft text-signal"
                >
                  {study.domain}
                </Badge>
                <span className="tabular-data font-mono text-xs text-muted-foreground">
                  {study.period}
                </span>
              </div>

              <SheetTitle className="pt-1 text-lg leading-snug text-foreground sm:text-xl">
                {study.title}
              </SheetTitle>

              <SheetDescription className="text-sm font-medium text-signal">
                {study.role}
              </SheetDescription>

              <p className="prose-measure pt-1 text-sm leading-relaxed text-muted-foreground">
                {study.summary}
              </p>

              <p className="prose-measure text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">Contexto: </span>
                {study.context}
              </p>

              <ul
                aria-label={`Tecnologias de ${study.title}`}
                role="list"
                className="flex flex-wrap gap-1.5 pt-2"
              >
                {study.stack.map((tech) => (
                  <li key={tech} translate="no">
                    <Badge variant="secondary" className="text-[11px] font-normal">
                      {tech}
                    </Badge>
                  </li>
                ))}
              </ul>
            </SheetHeader>

            <div className="space-y-6 px-5 py-5 sm:px-6">
              <div className="space-y-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {study.diagramTitle}
                  </h3>
                  <p className="prose-measure text-xs leading-relaxed text-muted-foreground">
                    {study.diagramSummary}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Selecione uma etapa do fluxo para ver os detalhes técnicos.
                  </p>
                </div>

                <ol role="list" className="space-y-2">
                  {study.diagramNodes.map((node, index) => {
                    const isSelected = index === activeStepIndex;
                    return (
                      <li key={`${study.slug}-${index}-${node.label}`}>
                        <button
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() =>
                            setSelectedStep({ slug: study.slug, index })
                          }
                          className={cn(
                            "flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-start text-sm transition-[color,background-color,border-color] duration-150 [@media(pointer:coarse)]:min-h-11",
                            isSelected
                              ? "border-signal border-s-4 bg-signal-soft font-medium text-foreground"
                              : "border-border bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                          )}
                        >
                          <span
                            className={cn(
                              "tabular-data font-mono text-xs font-semibold",
                              isSelected
                                ? "text-signal"
                                : "text-muted-foreground",
                            )}
                          >
                            {index + 1}.
                          </span>
                          <span className="min-w-0 flex-1 font-mono text-xs sm:text-[13px]">
                            {node.label}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>

                {activeNode ? (
                  <div className="rounded-lg border border-signal-border bg-signal-soft/70 p-3.5">
                    <p className="font-mono text-xs font-semibold text-signal">
                      Etapa <span className="tabular-data">{activeStepIndex + 1}</span>:{" "}
                      {activeNode.label}
                    </p>
                    <p className="prose-measure mt-1 text-sm leading-relaxed text-foreground">
                      {activeNode.detail}
                    </p>
                  </div>
                ) : null}
              </div>

              <Separator />

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-semibold text-foreground">
                    Problema
                  </h3>
                  <p className="prose-measure text-sm leading-relaxed text-muted-foreground">
                    {study.problem}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-semibold text-foreground">
                    Restrições e contexto operacional
                  </h3>
                  <p className="prose-measure text-sm leading-relaxed text-muted-foreground">
                    {study.constraints}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-semibold text-foreground">
                    Solução e decisões técnicas
                  </h3>
                  <p className="prose-measure text-sm leading-relaxed text-muted-foreground">
                    {study.solution}
                  </p>
                </div>

                <div className="space-y-1.5 rounded-lg border border-signal-border bg-signal-soft p-4">
                  <h3 className="text-sm font-semibold text-signal">
                    Resultado
                  </h3>
                  <p className="prose-measure text-sm leading-relaxed text-foreground">
                    {study.result}
                  </p>
                </div>
              </div>
            </div>

            <SheetFooter className="border-t border-border bg-muted/20 px-5 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  asChild
                  size="sm"
                  className="[@media(pointer:coarse)]:min-h-11"
                >
                  <Link
                    href={`/cases/${study.slug}`}
                    onClick={() => handleOpenChange(false)}
                  >
                    <FileText
                      aria-hidden="true"
                      className="size-4"
                      strokeWidth={1.75}
                    />
                    <span>Abrir página completa</span>
                  </Link>
                </Button>

                {nextStudy ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectNext}
                    className="h-auto min-h-8 max-w-full cursor-pointer py-1.5 text-start whitespace-normal [@media(pointer:coarse)]:min-h-11"
                  >
                    <span>Próximo: {nextStudy.shortTitle}</span>
                  </Button>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="[@media(pointer:coarse)]:min-h-11"
                >
                  <Link
                    href="/curriculo"
                    onClick={() => handleOpenChange(false)}
                  >
                    <span>Ver currículo</span>
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="ghost"
                  size="sm"
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
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
