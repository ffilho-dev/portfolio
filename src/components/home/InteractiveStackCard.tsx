"use client";

import { ExternalLink, X } from "lucide-react";
import { useState } from "react";
import { usePortfolioOverlays } from "@/components/PortfolioOverlayProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import type { CaseStudy, PublicProject, SkillGroup } from "@/data/types";
import { findPortfolioMatchesForSkill } from "@/lib/stack-match";

export interface InteractiveStackCardProps {
  readonly skillGroups: readonly SkillGroup[];
  readonly cases: readonly CaseStudy[];
  readonly projects: readonly PublicProject[];
}

/**
 * Interactive technical stack grid with cross-highlighting that shows which production
 * case studies and public repositories use any selected technology.
 */
export function InteractiveStackCard({
  skillGroups,
  cases,
  projects,
}: InteractiveStackCardProps) {
  const { openCase } = usePortfolioOverlays();
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const matches = selectedSkill
    ? findPortfolioMatchesForSkill(selectedSkill, cases, projects)
    : null;

  return (
    <section id="stack" className="scroll-mt-20">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
            Stack técnica
          </h2>
          <CardDescription className="prose-measure">
            Selecione uma tecnologia para rastrear em quais cases em produção e
            projetos públicos ela aparece.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {skillGroups.map((group) => (
              <div key={group.category} className="min-w-0 space-y-3">
                <h3 className="border-b border-border pb-2 text-base font-semibold text-foreground">
                  {group.category}
                </h3>

                <ul role="list" className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <li key={skill}>
                      <Toggle
                        variant="outline"
                        size="sm"
                        pressed={selectedSkill === skill}
                        onPressedChange={(pressed) =>
                          setSelectedSkill(pressed ? skill : null)
                        }
                        className="h-auto min-h-8 cursor-pointer px-2.5 py-1.5 text-start text-xs font-medium whitespace-normal data-[state=on]:border-signal data-[state=on]:bg-signal-soft data-[state=on]:font-semibold data-[state=on]:text-signal [@media(pointer:coarse)]:min-h-11"
                      >
                        {skill}
                      </Toggle>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {selectedSkill && matches ? (
            <div className="space-y-4 rounded-xl border border-signal-border bg-signal-soft/50 p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-foreground">
                  {`Onde “${selectedSkill}” aparece no portfólio`}
                </h3>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSkill(null)}
                  className="cursor-pointer [@media(pointer:coarse)]:min-h-11"
                >
                  <X
                    aria-hidden="true"
                    className="size-3.5"
                    strokeWidth={1.75}
                  />
                  <span>Limpar seleção</span>
                </Button>
              </div>

              {matches.cases.length === 0 && matches.projects.length === 0 ? (
                <p className="prose-measure text-sm text-muted-foreground">
                  Competência transversal aplicada no ambiente de trabalho,
                  infraestrutura ou formação contínua, sem tag literal
                  correspondente nos estudos de caso ou projetos públicos
                  listados.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {matches.cases.length > 0 ? (
                    <div className="min-w-0 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Cases em produção (
                        <span className="tabular-data font-mono">
                          {matches.cases.length}
                        </span>
                        )
                      </p>
                      <ul role="list" className="flex flex-wrap gap-2">
                        {matches.cases.map((study) => (
                          <li key={study.slug}>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => openCase(study.slug)}
                              className="h-auto min-h-8 cursor-pointer bg-background py-1.5 text-start whitespace-normal [@media(pointer:coarse)]:min-h-11"
                            >
                              {study.shortTitle}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {matches.projects.length > 0 ? (
                    <div className="min-w-0 space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Projetos públicos (
                        <span className="tabular-data font-mono">
                          {matches.projects.length}
                        </span>
                        )
                      </p>
                      <ul role="list" className="flex flex-wrap gap-2">
                        {matches.projects.map((project) => (
                          <li key={project.name}>
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="h-auto min-h-8 bg-background py-1.5 [@media(pointer:coarse)]:min-h-11"
                            >
                              <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <span translate="no" className="font-mono text-xs">
                                  {project.name}
                                </span>
                                <ExternalLink
                                  aria-hidden="true"
                                  className="size-3.5"
                                  strokeWidth={1.75}
                                />
                              </a>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}
