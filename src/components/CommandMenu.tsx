"use client";

import {
  Award,
  Briefcase,
  Copy,
  FileDown,
  FileText,
  FolderGit2,
  Home,
  Moon,
  Sun,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { copyEmailWithToast } from "@/components/CopyEmailButton";
import { usePortfolioOverlays } from "@/components/PortfolioOverlayProvider";
import {
  toggleDocumentTheme,
  useResolvedTheme,
} from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { caseStudies } from "@/data/cases";
import { profile } from "@/data/profile";
import { publicProjects } from "@/data/projects";

function triggerPdfDownload() {
  const link = document.createElement("a");
  link.href = "/curriculo.pdf";
  link.download = "curriculo-francisco-filho.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/**
 * Global Command Palette (Ctrl+K / ⌘K) exposing case studies, public projects,
 * routes, and quick actions across every route in the portfolio.
 */
export function CommandMenu() {
  const router = useRouter();
  const { commandOpen, setCommandOpen, openCase, openCertDialog } =
    usePortfolioOverlays();
  const resolvedTheme = useResolvedTheme();

  const runAndClose = (action: () => void | Promise<void>) => {
    setCommandOpen(false);
    void action();
  };

  const handleCopyEmail = async () => {
    await copyEmailWithToast(profile.contact.email);
  };

  const handleToggleTheme = () => {
    const next = toggleDocumentTheme();
    toast.success(next === "dark" ? "Tema escuro ativado" : "Tema claro ativado");
  };

  const themeActionLabel =
    resolvedTheme === "dark"
      ? "Alternar para tema claro"
      : "Alternar para tema escuro";

  return (
    <CommandDialog
      open={commandOpen}
      onOpenChange={setCommandOpen}
      className="no-print"
    >
      <CommandInput placeholder="Buscar estudos de caso, projetos, rotas ou ações…" />
      <CommandList className="max-h-[min(65dvh,24rem)]">
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        <CommandGroup heading="Estudos de caso em produção">
          {caseStudies.map((study) => (
            <CommandItem
              key={study.slug}
              value={`${study.shortTitle} ${study.title} ${study.domain}`}
              keywords={[...study.stack, study.slug]}
              onSelect={() => runAndClose(() => openCase(study.slug))}
              className="cursor-pointer"
            >
              <Briefcase
                aria-hidden="true"
                className="size-4 shrink-0"
                strokeWidth={1.75}
              />
              <span className="min-w-0 flex-1 truncate">{study.shortTitle}</span>
              <Badge variant="secondary" className="shrink-0 text-[11px]">
                {study.domain}
              </Badge>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Projetos públicos">
          {publicProjects.map((project) => (
            <CommandItem
              key={project.name}
              value={`${project.name} ${project.owner}`}
              keywords={[...project.stack, project.description]}
              onSelect={() =>
                runAndClose(() => {
                  window.open(
                    project.repoUrl,
                    "_blank",
                    "noopener,noreferrer",
                  );
                })
              }
              className="cursor-pointer"
            >
              <FolderGit2
                aria-hidden="true"
                className="size-4 shrink-0"
                strokeWidth={1.75}
              />
              <span translate="no" className="min-w-0 flex-1 truncate">
                {project.name}
              </span>
              {project.isLegacyAccount ? (
                <Badge variant="outline" className="shrink-0 text-[11px]">
                  {project.legacyNote ?? "conta anterior no GitHub"}
                </Badge>
              ) : null}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navegação">
          <CommandItem
            value="Início portfólio home"
            keywords={["inicio", "home", "/"]}
            onSelect={() => runAndClose(() => router.push("/"))}
            className="cursor-pointer"
          >
            <Home
              aria-hidden="true"
              className="size-4 shrink-0"
              strokeWidth={1.75}
            />
            <span>Início</span>
            <CommandShortcut className="font-mono tracking-normal">/</CommandShortcut>
          </CommandItem>

          <CommandItem
            value="Currículo web"
            keywords={["curriculo", "cv", "resume"]}
            onSelect={() => runAndClose(() => router.push("/curriculo"))}
            className="cursor-pointer"
          >
            <FileText
              aria-hidden="true"
              className="size-4 shrink-0"
              strokeWidth={1.75}
            />
            <span>Currículo</span>
            <CommandShortcut className="font-mono tracking-normal">
              /curriculo
            </CommandShortcut>
          </CommandItem>

          <CommandItem
            value="Baixar currículo em PDF"
            keywords={["pdf", "download", "curriculo.pdf"]}
            onSelect={() => runAndClose(triggerPdfDownload)}
            className="cursor-pointer"
          >
            <FileDown
              aria-hidden="true"
              className="size-4 shrink-0"
              strokeWidth={1.75}
            />
            <span>Baixar currículo (PDF)</span>
            <CommandShortcut className="font-mono tracking-normal">
              /curriculo.pdf
            </CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Ações rápidas">
          <CommandItem
            value={`Copiar e-mail ${profile.contact.email}`}
            keywords={["email", "contato", profile.contact.email]}
            onSelect={() => runAndClose(handleCopyEmail)}
            className="cursor-pointer"
          >
            <Copy
              aria-hidden="true"
              className="size-4 shrink-0"
              strokeWidth={1.75}
            />
            <span>Copiar e-mail</span>
            <CommandShortcut className="tracking-normal">
              {profile.contact.email}
            </CommandShortcut>
          </CommandItem>

          <CommandItem
            value="Ver os 16 módulos da certificação curso.dev"
            keywords={[
              "certificado",
              "certificação",
              "modulos",
              "curso.dev",
              "16",
            ]}
            onSelect={() => runAndClose(openCertDialog)}
            className="cursor-pointer"
          >
            <Award
              aria-hidden="true"
              className="size-4 shrink-0"
              strokeWidth={1.75}
            />
            <span>Ver os 16 módulos da certificação curso.dev</span>
          </CommandItem>

          <CommandItem
            value={`${themeActionLabel} alternar tema claro escuro`}
            keywords={["tema", "theme", "claro", "escuro", "dark", "light"]}
            onSelect={() => runAndClose(handleToggleTheme)}
            className="cursor-pointer"
          >
            {resolvedTheme === "dark" ? (
              <Sun
                aria-hidden="true"
                className="size-4 shrink-0"
                strokeWidth={1.75}
              />
            ) : (
              <Moon
                aria-hidden="true"
                className="size-4 shrink-0"
                strokeWidth={1.75}
              />
            )}
            <span>{themeActionLabel}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
