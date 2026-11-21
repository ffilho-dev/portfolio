"use client";

import { MessageCircle, Search } from "lucide-react";
import Link from "next/link";
import { usePortfolioOverlays } from "@/components/PortfolioOverlayProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { profile } from "@/data/profile";

const NAV_ITEMS = [
  { href: "/#cases", label: "Cases" },
  { href: "/#ia", label: "IA no fluxo" },
  { href: "/#projetos", label: "Projetos" },
  { href: "/#trajetoria", label: "Trajetória" },
  { href: "/curriculo", label: "Currículo" },
] as const;

/**
 * Architectural header (sticky from md) shared across all routes and hidden on print.
 */
export function SiteHeader() {
  const { openCommand } = usePortfolioOverlays();

  return (
    <header className="no-print z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:sticky md:top-0">
      <div className="site-container flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2.5 md:flex-nowrap md:gap-x-4 md:py-3 lg:gap-x-6">
        <Link
          href="/"
          translate="no"
          className="inline-flex min-h-9 shrink-0 items-center font-mono text-sm font-medium tracking-tight text-foreground transition-[color] duration-150 hover:text-signal [@media(pointer:coarse)]:min-h-11"
        >
          {profile.handle}
        </Link>

        <div className="flex w-full flex-wrap items-center justify-between gap-2 md:w-auto md:flex-nowrap md:gap-4 lg:gap-6">
          <nav aria-label="Principal" className="min-w-0">
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 md:flex-nowrap md:gap-x-4 lg:gap-x-5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-9 items-center whitespace-nowrap text-sm font-medium text-muted-foreground transition-[color] duration-150 hover:text-foreground [@media(pointer:coarse)]:min-h-11"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openCommand}
              aria-keyshortcuts="Control+K Meta+K"
              className="cursor-pointer text-muted-foreground hover:text-foreground [@media(pointer:coarse)]:min-h-11"
            >
              <Search aria-hidden="true" className="size-4" strokeWidth={1.75} />
              <span>Buscar</span>
              <kbd
                aria-hidden="true"
                className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] leading-none text-muted-foreground sm:inline-block"
              >
                ⌘K
              </kbd>
            </Button>

            <ThemeToggle />

            <Button asChild size="sm" className="hidden lg:inline-flex">
              <a
                href={profile.contact.whatsappUrl}
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
          </div>
        </div>
      </div>
    </header>
  );
}
