"use client";

import { Award, ExternalLink } from "lucide-react";
import { usePortfolioOverlays } from "@/components/PortfolioOverlayProvider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  OtherCertificationItem,
} from "@/data/types";
import { slugifyId } from "@/lib/site";

export interface TrajectorySectionProps {
  readonly experiences: readonly ExperienceItem[];
  readonly education: EducationItem;
  readonly featuredCertification: CertificationItem;
  readonly otherCertifications: readonly OtherCertificationItem[];
}

/**
 * Trajectory Bento block combining a multi-open experience Accordion (with ESIG expanded by
 * default) alongside academic education and certification cards that trigger CertificationDialog.
 */
export function TrajectorySection({
  experiences,
  education,
  featuredCertification,
  otherCertifications,
}: TrajectorySectionProps) {
  const { openCertDialog } = usePortfolioOverlays();
  const firstKey = experiences[0]
    ? `${experiences[0].company}-${experiences[0].period}`
    : undefined;

  return (
    <section id="trajetoria" className="scroll-mt-20 space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
        Trajetória e formação
      </h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">
        <Card className="lg:col-span-7">
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">
              Experiência profissional
            </h3>
          </CardHeader>

          <CardContent>
            <Accordion
              type="multiple"
              defaultValue={firstKey ? [firstKey] : []}
            >
              {experiences.map((exp) => {
                const key = `${exp.company}-${exp.period}`;
                return (
                  <AccordionItem key={key} value={key}>
                    <AccordionTrigger
                      headingLevel="h4"
                      className="cursor-pointer hover:no-underline [@media(pointer:coarse)]:min-h-11"
                    >
                      <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pe-2">
                        <span className="text-base font-semibold text-foreground">
                          {exp.company}
                        </span>
                        <span className="tabular-data font-mono text-xs text-muted-foreground">
                          {exp.period}
                        </span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="space-y-2">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <p className="text-sm font-semibold text-signal">
                          {exp.role}
                        </p>
                        {exp.location ? (
                          <span className="text-xs text-muted-foreground">
                            {exp.location}
                          </span>
                        ) : null}
                      </div>

                      <p className="prose-measure text-sm leading-relaxed text-muted-foreground">
                        {exp.summary}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 lg:col-span-5">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-foreground">
                Formação acadêmica
              </h3>
            </CardHeader>

            <CardContent className="space-y-2">
              <p className="text-base font-semibold text-foreground">
                {education.institution}
              </p>
              <p className="text-sm text-muted-foreground">{education.degree}</p>
              <p className="tabular-data font-mono text-xs text-muted-foreground">
                {education.period}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-foreground">
                Certificações
              </h3>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2.5">
                <p className="text-base font-semibold text-foreground">
                  {featuredCertification.title}
                </p>
                <p translate="no" className="text-sm text-muted-foreground">
                  {featuredCertification.issuer}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge
                    variant="secondary"
                    className="tabular-data font-mono font-normal"
                  >
                    {featuredCertification.hours}h
                  </Badge>
                  <Badge variant="secondary" className="font-normal">
                    <span className="tabular-data font-mono">
                      {featuredCertification.modules.length}
                    </span>{" "}
                    módulos
                  </Badge>
                  <span>
                    Emitido em{" "}
                    <span className="tabular-data font-mono">
                      {featuredCertification.issuedAt}
                    </span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={openCertDialog}
                    className="cursor-pointer [@media(pointer:coarse)]:min-h-11"
                  >
                    <Award
                      aria-hidden="true"
                      className="size-4 text-signal"
                      strokeWidth={1.75}
                    />
                    <span>
                      Abrir os {featuredCertification.modules.length} módulos
                    </span>
                  </Button>

                  <Button
                    asChild
                    variant="link"
                    size="sm"
                    className="px-2 text-signal [@media(pointer:coarse)]:min-h-11"
                  >
                    <a
                      href={featuredCertification.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>Verificar certificado</span>
                      <ExternalLink
                        aria-hidden="true"
                        className="size-3.5"
                        strokeWidth={1.75}
                      />
                    </a>
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Outras certificações
                </p>
                <ul className="list-disc space-y-1.5 ps-4 text-sm text-muted-foreground">
                  {otherCertifications.map((cert) => {
                    const key = slugifyId(cert.title);
                    const titleId = `home-cert-title-${key}`;
                    const verifyId = `home-cert-verify-${key}`;

                    return (
                      <li key={cert.title}>
                        <span id={titleId} className="font-medium text-foreground">
                          {cert.title}
                        </span>{" "}
                        — <span translate="no">{cert.issuer}</span> (
                        <span className="tabular-data font-mono text-xs">
                          {cert.issuedAt}
                        </span>
                        )
                        {cert.verifyUrl ? (
                          <>
                            {" "}
                            <a
                              id={verifyId}
                              href={cert.verifyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-labelledby={`${verifyId} ${titleId}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-signal underline decoration-border underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:decoration-signal"
                            >
                              <span>Verificar</span>
                              <ExternalLink
                                aria-hidden="true"
                                className="size-3"
                                strokeWidth={1.75}
                              />
                            </a>
                          </>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
