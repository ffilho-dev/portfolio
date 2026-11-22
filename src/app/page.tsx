import {
  ExternalLink,
  FileDown,
  FileText,
  FolderGit2,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { AiTabsCard } from "@/components/home/AiTabsCard";
import { CasesBentoSection } from "@/components/home/CasesBentoSection";
import { InteractiveStackCard } from "@/components/home/InteractiveStackCard";
import { TrajectorySection } from "@/components/home/TrajectorySection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { caseStudies } from "@/data/cases";
import { profile } from "@/data/profile";
import { publicProjects } from "@/data/projects";
import { aiPillars, skillGroups } from "@/data/skills";
import { formatDisplayUrl, slugifyId } from "@/lib/site";

export default function HomePage() {
  const { contact, education, featuredCertification } = profile;

  return (
    <div className="site-container space-y-12 py-10 sm:space-y-16 sm:py-14">
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="justify-between lg:col-span-8">
          <CardHeader className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge
                variant="outline"
                className="border-signal-border bg-signal-soft text-signal"
              >
                {profile.title}
              </Badge>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin
                  aria-hidden="true"
                  className="size-3.5 text-signal"
                  strokeWidth={1.75}
                />
                <span>{profile.location}</span>
              </span>
            </div>

            <h1 className="text-[clamp(2rem,1.45rem+2.2vw,2.875rem)] font-bold leading-[1.12] tracking-tight text-foreground">
              {profile.name}
            </h1>

            <p className="prose-measure text-base leading-relaxed text-foreground sm:text-[1.0625rem]">
              {profile.bio}
            </p>

            <p className="prose-measure text-sm text-muted-foreground">
              {profile.availability}
            </p>
          </CardHeader>

          <CardContent className="flex flex-wrap items-center gap-2.5">
            <Button
              asChild
              className="[@media(pointer:coarse)]:min-h-11"
            >
              <a
                href={contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle
                  aria-hidden="true"
                  className="size-4"
                  strokeWidth={1.75}
                />
                <span>WhatsApp</span>
              </a>
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

            <Button
              asChild
              variant="ghost"
              className="[@media(pointer:coarse)]:min-h-11"
            >
              <Link href="/curriculo">
                <FileText
                  aria-hidden="true"
                  className="size-4"
                  strokeWidth={1.75}
                />
                <span>Ver currículo</span>
              </Link>
            </Button>

            <CopyEmailButton email={contact.email} />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 lg:col-span-4">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-foreground">
                Números em produção
              </h2>
            </CardHeader>

            <CardContent>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {profile.metrics.map((metric) => (
                  <div
                    key={metric.value}
                    className="min-w-0 border-b border-border pb-3 last:border-b-0 last:pb-0 sm:border-b-0 sm:pb-0 lg:border-b lg:pb-3 lg:last:border-b-0 lg:last:pb-0"
                  >
                    <dt className="tabular-data font-mono text-xl font-semibold tracking-tight text-foreground">
                      {metric.value}
                    </dt>
                    <dd className="mt-0.5 text-xs leading-snug text-muted-foreground">
                      {metric.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <h2 className="text-sm font-semibold text-foreground">
                Canais diretos
              </h2>
            </CardHeader>

            <CardContent>
              <ul role="list" className="space-y-2.5 text-sm">
                <li>
                  <a
                    href={contact.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    translate="no"
                    className="inline-flex min-h-8 items-center gap-2 text-muted-foreground underline-offset-4 transition-[color] duration-150 hover:text-foreground hover:underline [@media(pointer:coarse)]:min-h-11"
                  >
                    <FolderGit2
                      aria-hidden="true"
                      className="size-4 shrink-0 text-signal"
                      strokeWidth={1.75}
                    />
                    <span className="truncate">
                      github.com/{contact.githubHandle}
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    href={contact.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    translate="no"
                    className="inline-flex min-h-8 items-center gap-2 text-muted-foreground [overflow-wrap:anywhere] underline-offset-4 transition-[color] duration-150 hover:text-foreground hover:underline [@media(pointer:coarse)]:min-h-11"
                  >
                    <Globe
                      aria-hidden="true"
                      className="size-4 shrink-0 text-signal"
                      strokeWidth={1.75}
                    />
                    <span>{formatDisplayUrl(contact.linkedinUrl)}</span>
                  </a>
                </li>

                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    translate="no"
                    className="inline-flex min-h-8 items-center gap-2 text-muted-foreground [overflow-wrap:anywhere] underline-offset-4 transition-[color] duration-150 hover:text-foreground hover:underline [@media(pointer:coarse)]:min-h-11"
                  >
                    <Mail
                      aria-hidden="true"
                      className="size-4 shrink-0 text-signal"
                      strokeWidth={1.75}
                    />
                    <span>{contact.email}</span>
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <CasesBentoSection studies={caseStudies} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <AiTabsCard pillars={aiPillars} className="lg:col-span-6" />

        <section id="projetos" className="scroll-mt-20 min-w-0 lg:col-span-6">
          <Card className="h-full">
            <CardHeader>
              <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-[1.375rem]">
                Projetos públicos selecionados
              </h2>
              <CardDescription className="prose-measure">
                Repositórios públicos de aplicações Full Stack, automação e
                engenharia de software.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ul role="list" className="divide-y divide-border">
                {publicProjects.map((project) => {
                  const key = slugifyId(project.name);
                  const titleId = `project-title-${key}`;
                  const liveId = `project-live-${key}`;
                  const repoId = `project-repo-${key}`;

                  return (
                    <li
                      key={project.name}
                      className="py-4 first:pt-0 last:pb-0"
                    >
                      <article className="space-y-2.5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex min-w-0 flex-wrap items-center gap-2">
                            <h3
                              id={titleId}
                              translate="no"
                              className="font-mono text-sm font-semibold text-foreground sm:text-base"
                            >
                              {project.name}
                            </h3>
                            {project.isLegacyAccount ? (
                              <Badge
                                variant="outline"
                                className="text-[11px] font-normal text-muted-foreground"
                              >
                                {project.legacyNote ?? "conta anterior no GitHub"}
                              </Badge>
                            ) : null}
                          </div>

                          <div className="flex shrink-0 flex-wrap items-center gap-2">
                            {project.liveUrl ? (
                              <Button
                                asChild
                                size="xs"
                                variant="outline"
                                className="border-signal-border bg-signal-soft text-signal hover:bg-signal-soft/80 [@media(pointer:coarse)]:min-h-11"
                              >
                                <a
                                  id={liveId}
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-labelledby={`${liveId} ${titleId}`}
                                >
                                  <span>Em produção</span>
                                  <ExternalLink
                                    aria-hidden="true"
                                    className="size-3"
                                    strokeWidth={1.75}
                                  />
                                </a>
                              </Button>
                            ) : null}

                            <Button
                              asChild
                              size="xs"
                              variant="outline"
                              className="[@media(pointer:coarse)]:min-h-11"
                            >
                              <a
                                id={repoId}
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-labelledby={`${repoId} ${titleId}`}
                              >
                                <span>Código</span>
                                <ExternalLink
                                  aria-hidden="true"
                                  className="size-3"
                                  strokeWidth={1.75}
                                />
                              </a>
                            </Button>
                          </div>
                        </div>

                        <p className="prose-measure text-sm leading-relaxed text-muted-foreground">
                          {project.description}
                        </p>

                        <ul
                          aria-label={`Tecnologias de ${project.name}`}
                          role="list"
                          className="flex flex-wrap gap-1.5"
                        >
                          {project.stack.map((tech) => (
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
                      </article>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>

      <InteractiveStackCard
        skillGroups={skillGroups}
        cases={caseStudies}
        projects={publicProjects}
      />

      <TrajectorySection
        experiences={profile.experiences}
        education={education}
        featuredCertification={featuredCertification}
        otherCertifications={profile.otherCertifications}
      />

      <section id="contato" className="scroll-mt-20">
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
              Contato
            </h2>
            <CardDescription className="prose-measure">
              Disponível para vagas Full Stack e processos seletivos pelos
              canais abaixo.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="min-w-0 space-y-2 rounded-lg border border-border bg-muted/30 p-4">
                <dt className="text-xs font-medium text-muted-foreground">
                  WhatsApp
                </dt>
                <dd>
                  <a
                    href={contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tabular-data inline-flex min-h-9 items-center font-mono text-sm text-foreground underline decoration-border underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-signal hover:decoration-signal [@media(pointer:coarse)]:min-h-11"
                  >
                    {contact.whatsappDisplay}
                  </a>
                </dd>
              </div>

              <div className="min-w-0 space-y-2 rounded-lg border border-border bg-muted/30 p-4">
                <dt className="text-xs font-medium text-muted-foreground">
                  E-mail
                </dt>
                <dd className="space-y-2">
                  <div>
                    <a
                      href={`mailto:${contact.email}`}
                      translate="no"
                      className="inline-flex min-h-9 items-center text-sm text-foreground [overflow-wrap:anywhere] underline decoration-border underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-signal hover:decoration-signal [@media(pointer:coarse)]:min-h-11"
                    >
                      {contact.email}
                    </a>
                  </div>
                  <CopyEmailButton email={contact.email} />
                </dd>
              </div>

              <div className="min-w-0 space-y-2 rounded-lg border border-border bg-muted/30 p-4">
                <dt className="text-xs font-medium text-muted-foreground">
                  LinkedIn
                </dt>
                <dd>
                  <a
                    href={contact.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    translate="no"
                    className="inline-flex min-h-9 items-center text-sm text-foreground [overflow-wrap:anywhere] underline decoration-border underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-signal hover:decoration-signal [@media(pointer:coarse)]:min-h-11"
                  >
                    {formatDisplayUrl(contact.linkedinUrl)}
                  </a>
                </dd>
              </div>

              <div className="min-w-0 space-y-2 rounded-lg border border-border bg-muted/30 p-4">
                <dt className="text-xs font-medium text-muted-foreground">
                  GitHub
                </dt>
                <dd>
                  <a
                    href={contact.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    translate="no"
                    className="inline-flex min-h-9 items-center text-sm text-foreground underline decoration-border underline-offset-4 transition-[color,text-decoration-color] duration-150 hover:text-signal hover:decoration-signal [@media(pointer:coarse)]:min-h-11"
                  >
                    github.com/{contact.githubHandle}
                  </a>
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
