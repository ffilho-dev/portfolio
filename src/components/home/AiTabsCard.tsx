"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AiPillar } from "@/data/types";
import { cn } from "@/lib/utils";

export interface AiTabsCardProps {
  readonly pillars: readonly AiPillar[];
  readonly className?: string;
}

/**
 * Interactive tabbed card presenting the three disciplined AI engineering workflow pillars
 * with a border-bottom active indicator that remains legible in forced-colors mode.
 */
export function AiTabsCard({ pillars, className }: AiTabsCardProps) {
  const defaultTab = pillars[0]?.id;

  return (
    <section id="ia" className={cn("scroll-mt-20 min-w-0", className)}>
      <Card className="h-full">
        <CardHeader>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-[1.375rem]">
            Como trabalho com IA no dia a dia
          </h2>
          <CardDescription className="prose-measure">
            Uso estruturado de agentes de codificação com especificação prévia,
            contexto isolado e verificação humana.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1">
          <Tabs defaultValue={defaultTab} className="gap-5">
            <TabsList
              variant="line"
              aria-label="Pilares de trabalho com IA"
              className="w-full flex-wrap justify-start gap-x-1 gap-y-1 overflow-visible rounded-none border-b border-border bg-transparent p-0"
            >
              {pillars.map((pillar) => (
                <TabsTrigger
                  key={pillar.id}
                  value={pillar.id}
                  className="h-auto flex-none cursor-pointer rounded-none border-0 border-b-2 border-b-transparent px-2.5 py-2 text-[13px] leading-snug text-muted-foreground after:hidden hover:text-foreground group-data-[variant=line]/tabs-list:data-[state=active]:border-b-signal group-data-[variant=line]/tabs-list:data-[state=active]:font-semibold group-data-[variant=line]/tabs-list:data-[state=active]:text-foreground dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-b-signal dark:group-data-[variant=line]/tabs-list:data-[state=active]:text-foreground [@media(pointer:coarse)]:min-h-11"
                >
                  {pillar.shortTitle}
                </TabsTrigger>
              ))}
            </TabsList>

            {pillars.map((pillar) => (
              <TabsContent
                key={pillar.id}
                value={pillar.id}
                className="space-y-4 pt-1"
              >
                <h3 className="text-base font-semibold leading-snug text-foreground">
                  {pillar.title}
                </h3>

                <p className="prose-measure text-sm leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>

                <ul
                  aria-label={`Artefatos de ${pillar.shortTitle}`}
                  role="list"
                  className="flex flex-wrap gap-2"
                >
                  {pillar.artifacts.map((artifact) => (
                    <li key={artifact}>
                      <Badge
                        variant="secondary"
                        className="border border-border bg-muted/60 font-normal text-foreground"
                      >
                        {artifact}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
}
